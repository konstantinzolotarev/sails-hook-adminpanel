(function() {
    'use strict';

    angular.module('Admin', [
        'ngRoute',
        'com.tengri.sails.Admin',
        'Admin.Users'
    ])
        .run(['$adminRoute', function($adminRoute) {

        }]);

})();