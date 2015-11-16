# Common Front-end Modules

This is a repo of common Sass and JavaScript modules that would serve as a base for any front-end project.

## Sass Modules ##
The sass source code lives in /src/styles and follows mostly standard [BEM naming](https://css-tricks.com/bem-101/). In addition some naming conventions have been pulled from the CSS Wizardry article, [More Transparent UI Code with Namespaces](http://csswizardry.com/2015/03/more-transparent-ui-code-with-namespaces/). The following rules are what have been implemented specifically.

* Generic page-level objects are prefixed with `o-`
* Utility Classes are prefixed with `u-`
* Landmark global elements have no class prefixes

### Sass Folder Structure ###
#### Base styles: ####
Files in `/base` serve as the style foundation. It includes reset styles, element styling, and includes custom fonts that your project might need.

#### Helpers ####
Files in `/helpers` are Sass helpers that other modules and classes use. Anything in this folder is not intended to be output directly - i.e. should be referenced from another file. Helpers can contain global mixins, functions, and variables as well as mixins for vendor prefixes.  

#### Landmarks ####
File in `/landmarks` are styles for global elements that appear on every page - header, footer, main navigation, etc.

#### Objects ####
Files in `/objects` are common page-level styles. These are generic implementations of common style patterns. These objects can be used as is or combined with or extended with **Component Styles**.

#### Components ####
If specif UI components are needed that might not be considered global or reusable, these files would live in `/components`. _Currently this folder doesn't exist._

#### Trumps ####
Files in `/trumps` are very specific styles that are layered on at the bottom of the global CSS file. These are styles like utility styles or could be library override styles - any specific styles that are intended to override more generic styling.

### Responsive Implementation ###
The common Sass modules are implemented in a mobile-first approach that is dependent on two build utilities that are included.

* Shared configuration for responsive breakpoints
* Breakpoint mixin for min-width media queries

#### Share configuration ####
The gulp build includes a method (`distributeConfig`) that pulls configuration data from `/src/data/sharedConfig.json` and distributes it to `/src/styles/helpers/_shareConfig.scss` so that breakpoint sizes are available for Sass to use. If these sizes need to be updated, they need to be updated from `/src/data/sharedConfig.json` because that file generates and overrides the other.

A helper variable exists for the medium and large breakpoints (`$SCREEN_MED` & `$SCREEN_LARGE`). These sizes can be used in the `bpmin` (or `bpmax`) mixin described below.

#### Min-width Breakpoint Mixin ####
In order to implement Responsive Design and media queries, the `bpmin` mixin should be utilized. The `bpmin` mixin expects a screen-size (with units included) and wraps any styles inside of it with a media query.

```
@include bpmin(650px) {
  ...
}
```

or

```
@include bpmin($SCREEN_MED) {
  ...
}
```

In order to support legacy browsers that do not support media queries we have to do a bit of trickery. There needs to be two `.scss` files (we've called them `modern.scss` & `legacy.scss`). They both need the `$IS_MODERN` boolean variable set at the top, but the `modern.scss` file has `$IS_MODERN` set to true and `legacy.scss` has `$IS_MODERN` set to false. They both need to include the `_root.scss` file which bootstraps in all the rest of our project files (including the `bpmin` mixin). When the `bpmin` mixin is used, it checks the value of `$IS_MODERN` and wraps the contents (the styles inside the mixin) in a min-width media query if `$IS_MODERN` is true, otherwise it just outputs the styles without the media query. The last piece of the puzzle is that the `modern.css` needs to be served up for only modern browsers, and the `legacy.css` file needs to be served to legacy browsers using IE conditional comments.

````
<!--[if ! lte IE 8]>-->
    <link rel="stylesheet" href="styles/modern.css">
<!--<![endif]-->
<!--[if (gte IE 6)&(lte IE 8)]>
    <link rel="stylesheet" href="styles/legacy.css">
<![endif]-->
````

Now legacy browsers will get desktop styles without needing a polyfill for media queries.
