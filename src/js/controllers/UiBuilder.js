(function () {
    'use strict';
    // Use webpack context loader to
    // load all components from
    // views/ui-components directory
    var req = require.context('../views/ui-components', true, /^(.*\.(js$))[^.]*$/igm);


    function UiBuiler() {
        this.$elements = [];
        this.Views = [];
        this.components = [];
        this.init();
    }

    UiBuiler.prototype.init = function() {
        var Views = this.Views;
        // loop over files in req context
        req.keys().forEach(function(key){
            // Get the filename (without extension)
            // and use it as the View key/indentifier.
            var identifier = key.replace(/^.*[\\\/]/, '').replace(/.js$/,'');
            // store the required component to its key in the array
            Views[identifier] = req(key);
        });
    };

    UiBuiler.prototype.createComponents = function($elements) {
        this.$elements = $elements;
        for (var i = this.$elements.length - 1; i >= 0; i--) {
            var $element = this.$elements.eq(i);
            var viewName = $element.attr('data-ui-component');
            // if view name is in views, instantiate it passing
            // in the DOM/jQuery element
            if (viewName in this.Views) {
                var View = this.Views[viewName];
                var component = new View($element);
                this.components.push(component);
            }
        }
    };

    module.exports = UiBuiler;
}());