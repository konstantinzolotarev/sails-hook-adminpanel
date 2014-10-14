(function () {
    'use strict';
    var module = angular.module('com.tengri.sails.Admin');
    module.directive('pagination', [function() {
        return {
            restrict: 'AEC',
            template: '<div class="animated fadeInUp">' +
                '<ul class="pager">' +
                '<li class="previous" data-ng-class="page.hasPrevPage || \'disabled\'">' +
                '<a href="" data-ng-click="prevPage()">&laquo; Назад</a>' +
                '</li>' +
                '<li class="next" data-ng-class="page.hasNextPage || \'disabled\'">' +
                '<a href="" data-ng-click="nextPage()">Вперед &raquo;</a>' +
                '</li>' +
                '</ul>' +
                '</div>',
            link: function($scope, element) {

            }
        };
    }]);

    module.directive('filters', [

        function () {
            return {
                replace: true,
                templateUrl: '/views/admin/base/filters.html'
            };
        }
    ]);

    module.directive('widgetBoolean', [function () {
        return {
            replace: true,
            template: '<select class="form-control" data-ng-options="o.val as o.title for o in choices" data-ng-model="model" data-ng-change="change()"/>',
            scope: {
                name: '=',
                filterModel: '='
            },
            link: function ($scope) {
                $scope.model = '';

                $scope.choices = [
                    {
                        val: '',
                        title: ''
                    },
                    {
                        val: true,
                        title: 'Да'
                    },
                    {
                        val: false,
                        title: 'Нет'
                    }
                ];

                /**
                 * handle change
                 */
                $scope.change = function () {
                    if ($scope.model === '') {
                        delete $scope.filterModel.where[$scope.name];
                        return;
                    }
                    $scope.filterModel.where[$scope.name] = $scope.model;
                };
            }
        }
    }]);

    module.directive('widgetText', [function () {
        return {
            replace: true,
            template: '<input type="text" class="form-control" data-ng-model="model" data-ng-change="change()"/>',
            scope: {
                name: '=',
                filterModel: '=',
                isId: '='
            },
            link: function ($scope) {
                $scope.model = '';
                /**
                 * handle change
                 */
                $scope.change = function () {
                    if (!$scope.model) {
                        if ($scope.filterModel.where[$scope.name]) {
                            delete $scope.filterModel.where[$scope.name];
                        }
                    } else {
                        if (typeof isFinite == 'function' && isFinite($scope.model)) {
                            $scope.model = parseInt($scope.model);
                        }
                        if ($scope.isId) {
                            $scope.filterModel.where[$scope.name] = $scope.model;
                        } else {
                            $scope.filterModel.where[$scope.name] = {
                                contains: $scope.model
                            };
                        }
                    }
                };
            }
        }
    }]);


    module.directive('widgetTextOperator', [function () {
        return {
            replace: true,
            template: '<div class="input-group"><input type="text" class="form-control" style="width:50px;" data-ng-model="operator" data-ng-change="change()"/>' +
                '<input type="text" class="form-control" data-ng-model="model" data-ng-change="change()"/></div>',
            scope: {
                name: '=',
                filterModel: '=',
                isId: '='
            },
            link: function ($scope) {
                $scope.model = '';
                $scope.operator = '=';

                /**
                 * handle change
                 */
                $scope.change = function () {
                    if (!$scope.model) {
                        if ($scope.filterModel.where[$scope.name]) {
                            delete $scope.filterModel.where[$scope.name];
                        }
                    } else {
                        if ($scope.isId) {
                            $scope.filterModel.where[$scope.name] = $scope.model;
                        } else {
                            $scope.filterModel.where[$scope.name] = {
                                contains: $scope.model,
                                operator: ' ' + $scope.operator + ' '
                            };
                        }
                    }
                };
            }
        }
    }]);


    /**
     * Base directive for all filters into admin panel
     */
    module.directive('filterField', ['$compile', function ($compile) {
        return {
            template: '<div class="value">Test</div>',
            scope: {
                type: '=',
                name: '=',
                filterModel: '='
            },
            link: function ($scope, element) {
                var elem = angular.element('div.value', element);
                switch ($scope.type) {
                    case 'boolean':
                        elem.html('<div data-widget-boolean="" ' +
                            'data-filter-model="filterModel" ' +
                            'data-name="name"></div>');
                        break;
                    case 'text':
                        elem.html('<div data-widget-text="" ' +
                            'data-filter-model="filterModel" ' +
                            'data-name="name"></div>');
                        break;
                    case 'id':
                        elem.html('<div data-widget-text="" ' +
                            'data-filter-model="filterModel" ' +
                            'data-name="name" data-is-id="true"></div>');
                        break;
                    case 'operator':
                        elem.html('<div data-widget-text-operator="" ' +
                            'data-filter-model="filterModel" ' +
                            'data-name="name"></div>');
                        break;
                }
                $compile(elem.contents())($scope);
            }
        };
    }]);

    /**
     * Directive for create list of string options.
     */
    module.directive('optionsList', [function () {
        return {
            transclude: true,
            template: '<div>' +
                '<div style="margin: 3px 0;" data-ng-repeat="data in model track by $index" class="animated fadeIn fast">' +
                '<input type="text" class="form-control input-sm small-input inline" data-ng-model="model[$index]"/>' +
                '&nbsp;<i class="glyphicon glyphicon-trash pointer" data-ng-click="removeOption($index)"></i>' +
                '</div>' +
                '<div style="margin-top: 5px;">' +
                '<button type="button" class="btn btn-sm btn-default" data-ng-click="addOption()">' +
                '<i class="glyphicon glyphicon-plus pointer"></i>&nbsp;Добавить опцию' +
                '</button>' +
                '</div>' +
                '</div>',
            scope: {
                model: '=ngModel'
            },
            link: function ($scope, element) {
                /**
                 * Will add new option record into array
                 */
                $scope.addOption = function () {
                    if (!$scope.model) {
                        $scope.model = [];
                    }
                    $scope.model.push('');
                };

                /**
                 * Removing option from the list.
                 *
                 * @param {number} $index
                 */
                $scope.removeOption = function ($index) {
                    if ($scope.model[$index] == 'undefined') {
                        return;
                    }
                    $scope.model.splice($index, 1);
                };
            }
        };
    }]);
})();