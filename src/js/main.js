(function () {
    'use strict';
    require('script!jquery/dist/jquery.js');
    require('script!./utils/polyfils/forEach.js');
    require('script!./utils/polyfils/bind.js');
    require('script!./utils/polyfils/keys.js');
    require('script!./utils/polyfils/objectCreate.js');
    var UiBuilder = require('./controllers/UiBuilder.js');

    var uiBuilder = new UiBuilder();
    uiBuilder.createComponents($('[data-ui-component]'));
}());

