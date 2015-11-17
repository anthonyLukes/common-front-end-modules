(function () {
    'use strict';
    var WindowService = require('../services/WindowService.js');
    var events = require('../utils/events.js');

    function BaseView($element) {
        this.$element = $element;
        this.eventSubscriptions = {
            windowResize: null,
            breakpointChange: null
        };
        this.windowService = {};
        this.init();
    }

    BaseView.prototype.init = function() {
        this.createChildren()
            .setupHandlers()
            .render()
            .enable();
    };

    BaseView.prototype.createChildren = function() {
        if (this.onCreateChildren) {
            this.onCreateChildren();
        }
        return this;

    };

    BaseView.prototype.setupHandlers = function() {
        if (this.onSetupHandlers) {
            this.onSetupHandlers();
        }
        return this;
    };

    BaseView.prototype.render = function() {
        this.windowService = WindowService;
        this.windowService.init();
        if (this.onRender) {
            this.onRender();
        }
        return this;
    };

    BaseView.prototype.enable = function() {
        this.eventSubscriptions.windowResize = events.subscribe(
            this.windowService.EVENTS.WINDOW_RESIZE,
            this.windowResize.bind(this)
        );
        this.eventSubscriptions.breakpointChange = events.subscribe(
            this.windowService.EVENTS.BREAKPOINT_CHANGE,
            this.breakpointChange.bind(this)
        );
        if (this.onEnable) {
            this.onEnable();
        }
        return this;
    };

    BaseView.prototype.windowResize = function() {
        if (this.onWindowResize) {
            this.onWindowResize();
        }
    };

    BaseView.prototype.breakpointChange = function(params) {
        if (this.onBreakpointChange) {
            this.onBreakpointChange(params);
        }
    };

    BaseView.prototype.disable = function() {
        this.eventSubscriptions.windowResize.remove();
        this.eventSubscriptions.breakpointChange.remove();
        if (this.onDisable) {
            this.onDisable();
        }
    };

    BaseView.prototype.destroy = function() {
        if (this.onDestroy) {
            this.onDestroy();
        }
    };

    module.exports = BaseView;
}());
