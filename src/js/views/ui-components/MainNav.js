(function () {
    'use strict';

    var BaseView = require('../BaseView.js');

    function MainNav($element) {
        this.CSS_CLASSES = {
            HAMBURGER_OPEN: 'is-open',
            VISUALLY_HIDDEN: 'u-visuallyHidden'
        };
        this.isAnimating = false;
        this.hasNavBeenClone = false;
        this.NAV_SLIDE_DURATION = 300;
        BaseView.call(this, $element);
    }

    MainNav.prototype = Object.create(BaseView.prototype);

    MainNav.prototype.onCreateChildren = function() {
        this.$trigger = this.$element.find('[data-ui="trigger"]');
        this.$target = this.$element.find('[data-ui="target"]');
        var $menuItems = this.$target.find('a');
        this.$firstMenuItem = $menuItems.first();
        this.$lastMenuItem = $menuItems.last();
        return this;
    };

    MainNav.prototype.onSetupHandlers = function() {
        this.triggerClick = this.handleTriggerClick.bind(this);
        this.lastItemKeydown = this.handleLastItemKeydown.bind(this);
        this.firstItemKeydown = this.handleFirstItemKeydown.bind(this);
        return this;
    };

    MainNav.prototype.onRender = function() {
        if (this.windowService.getScreenSize('large') === 'small') {
            this.enableMobileNav();
        }
        this.cloneNavToFooter();
    };

    MainNav.prototype.handleTriggerClick = function() {
        var self = this;
        if (!this.isAnimating) {
            var OPEN_CSS_CLASS = this.CSS_CLASSES.HAMBURGER_OPEN;

            this.isAnimating = true;
            this.$target.slideToggle(self.NAV_SLIDE_DURATION, function() {
                self.isAnimating = false;
                var expanded = 'false';
                if (self.$trigger.attr('aria-expanded') === 'false') {
                    expanded = 'true';
                }
                self.$trigger.attr('aria-expanded', expanded);

            });
            this.$trigger.toggleClass(OPEN_CSS_CLASS);
        }
    };

    MainNav.prototype.handleFirstItemKeydown = function(e) {
        // shift-tabbing on first item will bring users focus back to toggler
        if (e.keyCode === 9) {
            if (e.shiftKey) {
                e.preventDefault();
                this.$trigger.focus();
            }
        }
    };

    MainNav.prototype.handleLastItemKeydown = function(e) {
        // tabbing on last item will bring users focus back to toggler
        if (e.keyCode === 9) {
            if (!e.shiftKey) {
                e.preventDefault();
                this.$trigger.focus();
            }
        }
    };

    MainNav.prototype.enableMobileNav = function() {
        var OPEN_CSS_CLASS = this.CSS_CLASSES.HAMBURGER_OPEN;
        this.$trigger.on('click', this.triggerClick)
                     .removeClass(OPEN_CSS_CLASS)
                     .attr({
                        'role': 'button',
                        'aria-controls': 'navigation',
                        'aria-expanded': 'false'
                     });
        this.$target.hide();
        this.$firstMenuItem.on('keydown', this.firstItemKeydown);
        this.$lastMenuItem.on('keydown', this.lastItemKeydown);
    };

    MainNav.prototype.disableMobileNav = function() {
        var OPEN_CSS_CLASS = this.CSS_CLASSES.HAMBURGER_OPEN;
        this.$trigger.off('click', this.triggerClick)
                     .removeClass(OPEN_CSS_CLASS)
                     .attr({
                        'aria-expanded': 'false'
                     });
        this.$target.show();
        this.$firstMenuItem.off('keydown', this.firstItemKeydown);
        this.$lastMenuItem.off('keydown', this.lastItemKeydown);
    };

    MainNav.prototype.onBreakpointChange = function(params) {
        if (params.currentSize === 'small') {
            this.enableMobileNav();
        } else if (params.previousSize === 'small') {
            this.disableMobileNav();
        }
    };

    MainNav.prototype.cloneNavToFooter = function() {
        // prevent nav cloning from happening more than once
        if (!this.hasNavBeenClone) {
            var VISUALLY_HIDDEN_CSS_CLASS = this.CSS_CLASSES.VISUALLY_HIDDEN;
            var $clone = this.$element.clone().removeClass().addClass(VISUALLY_HIDDEN_CSS_CLASS);
            $('body').append($clone);
            this.hasNavBeenClone = true;
        }
    };

    module.exports = MainNav;
})();