var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },

    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('load', this.onLoad, false);
        document.addEventListener('deviceready', this.onDeviceReady, false);
        window.addEventListener("orientationchange", orientationChange, true);
    },
    onLoad: function() {

    },

    // deviceready Event Handler
    onDeviceReady: function() {
        /*angular.element(document).ready(function() {
            angular.bootstrap(document);
        });*/
    }
};
