(function() {
    'use strict';

    angular.module('Admin.Users', [
        'ngRoute',
        'com.tengri.sails.Admin'
    ]).config(['$adminRouteProvider', function($adminRouteProvider) {
        $adminRouteProvider.add({
            route: '/users',
            title: 'Users',
            menuGroup: 'Users'
        });
    }]);
})();