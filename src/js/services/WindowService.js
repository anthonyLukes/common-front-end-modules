(function () {
    'use strict';
    var debounce = require('../utils/debounce.js');
    var events = require('../utils/events.js');
    var screenSizes = require('json!../config/sharedConfig.json');

    function WindowService() {
        var instance = null;
        var initialized = null;

        function InitializeWindowService () {
            var currentScreenSize;
            var EVENTS = {
                WINDOW_RESIZE: 'windowResize',
                BREAKPOINT_CHANGE: 'breakpointChange'
            };
            function getScreenSize(defaultSize) {
                // for browsers that don't support media queries, send back a default
                if (!window.matchMedia) {
                    return defaultSize;
                } else {
                    var matchingScreenSize;
                    for (var prop in screenSizes.screenSizes) {
                        if (window.matchMedia('(min-width: ' + screenSizes.screenSizes[prop] +')').matches) {
                            matchingScreenSize = prop;
                        }
                    }
                    return matchingScreenSize;
                }
            }
            function init () {
                if (!initialized) {
                    var $window = $(window);
                    currentScreenSize = getScreenSize();
                    var publishSizeChange = function(previousSize, currentSize) {
                        events.publish(EVENTS.BREAKPOINT_CHANGE, {
                            previousSize: previousSize,
                            currentSize: currentSize
                        });
                    };
                    var checkForScreenSizeChange = function(newCurrentScreenSize) {
                        if (!currentScreenSize) {
                            currentScreenSize = newCurrentScreenSize;
                        } else if (currentScreenSize !== newCurrentScreenSize) {
                            publishSizeChange(currentScreenSize, newCurrentScreenSize);
                        }
                        // set currentScreenSize to the new size
                        currentScreenSize = newCurrentScreenSize;
                    };
                    var onResize = debounce(function(e) {
                        events.publish(EVENTS.WINDOW_RESIZE); // publish resize event
                        checkForScreenSizeChange(getScreenSize('large')); // 'large' is default for legacy browsers
                    }, 200);
                    $window.on('resize', onResize);
                }
                initialized = true;
            }

            return {
                init: init,
                getScreenSize: getScreenSize,
                EVENTS: EVENTS
            };
        }

        function getInstance () {
            if (!instance) {
                instance = new InitializeWindowService();
            }
            return instance;
        }
        return {
            getInstance: getInstance
        };
    }
    module.exports = new WindowService().getInstance();
}());