// From https://www.bignerdranch.com/blog/web-accessibility-skip-navigation-links/
(function () {
    'use strict';

    var BaseView = require('../BaseView.js');

    function SkipNav($element) {
        BaseView.call(this, $element);
    }

    SkipNav.prototype = Object.create(BaseView.prototype);

    SkipNav.prototype.onSetupHandlers = function() {
        this.elementClick = this.handleElementClick.bind(this);
        return this;
    };

    SkipNav.prototype.handleElementClick = function(e) {
        var $trigger = $(e.currentTarget);
        // strip the leading hash and declare
        // the content we're skipping to
        var $skipToContent = $($trigger.attr('href'));

        // Setting 'tabindex' to -1 takes an element out of normal
        // tab flow but allows it to be focused via javascript
        $skipToContent.attr('tabindex', -1).on('blur focusout', function () {

            // when focus leaves this element,
            // remove the tabindex attribute
            $skipToContent.removeAttr('tabindex');

        }).focus(); // focus on the content container
    };

    SkipNav.prototype.onEnable = function() {
        this.$element.on('click', this.elementClick);
    };

    module.exports = SkipNav;
}());