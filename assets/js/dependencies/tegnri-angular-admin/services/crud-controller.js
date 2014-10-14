(function() {
    'use strict';

    angular.module('com.tengri.sails.Admin')
        .factory('TengriCRUDController', TengriCRUDController);

    function TengriCRUDController() {
        /**
         * Base CRUD controller
         *
         * We shouldn't have any injections here because later controllers will extend this one.
         *
         * @param {object} $scope
         * @param {object} $routeParams
         * @constructor
         */
        function CRUDController($scope, $routeParams) {

            /***************************************************************************************
             *****                           VARIABLES INITIALIZATION SECTION
             **************************************************************************************/

            /**
             * List of routing params
             */
            $scope.params = $routeParams;

            /**
             * Base resource
             *
             * @type {null}
             */
            $scope.resource = null;

            /**
             * Page settings
             * @type {*}
             */
            $scope.page = {
                hasPrevPage: false,
                hasNextPage: true
            };

            /**
             * List of filtersOptions
             * @type {*}
             * @private
             */
            $scope._filtersOptions = {};

            /**
             * List of filters for user
             * @type {{limit: number, skip: number, where: {}}}
             */
            $scope.filter = {
                limit: 25,
                skip: 0,
                where: {}
            };

            /**
             * Flag to show/hide list of filters in template.
             *
             * @type {boolean}
             */
            $scope.showFilters = false;

            /**
             * List of loaded records
             *
             * @type {Array}
             */
            $scope.records = [];

            /**
             * Selected model
             * @type {{}}
             */
            $scope.model = {};

            /***************************************************************************************
             *****                       END VARIABLES INITIALIZATION SECTION
             **************************************************************************************/

            /**
             * Clears model record.
             */
            $scope.clearModel = function() {
                $scope.model = {};
            };

            /**
             * Will remove all elements from array of records.
             */
            $scope.clearList = function() {
                $scope.records.splice(0, $scope.records.length);
            };

            /**
             * Set resource for future using
             *
             * @param {object} resource
             */
            $scope.setResource = function(resource) {
                $scope.resource = resource;
            };


            /***************************************************************************************
             *****                             PAGINATION SECTION
             **************************************************************************************/

            /**
             * This method will check if next page is available and prev one.
             *
             * @private
             */
            $scope._checkPagination = function() {
                if ($scope.records.length < $scope.filter.limit) {
                    $scope.page.hasNextPage = false;
                } else {
                    $scope.page.hasNextPage = true;
                }
                if ($scope.filter.skip > 0) {
                    $scope.page.hasPrevPage = true;
                } else {
                    $scope.page.hasPrevPage = false;
                }
            };

            /**
             * Load next 50 items from DB
             */
            $scope.nextPage = function() {
                if (!$scope.page.hasNextPage) {
                    return;
                }
                //load next page
                $scope.filter.skip += $scope.filter.limit;
                $scope.list();
            };

            /**
             * Load prev 50 items from DB
             */
            $scope.prevPage = function() {
                if (!$scope.page.hasPrevPage) {
                    return;
                }
                //load prev page
                if ($scope.filter.skip < $scope.filter.limit) {
                    $scope.filter.skip = 0;
                } else {
                    $scope.filter.skip -= $scope.filter.limit;
                }
                $scope.list();
            };

            /***************************************************************************************
             *****                                  END PAGINATION SECTION
             **************************************************************************************/




            /***************************************************************************************
             *****                                  FILTERING SECTION
             **************************************************************************************/


            /**
             * Toggle filters visibility in list.
             */
            $scope.toggleFilters = function() {
                $scope.showFilters = !$scope.showFilters;
            };

            /**
             * Clear all filters
             */
            $scope.clearFilter = function() {
                $scope.filter.where = {};
            };

            /**
             * Will set list of options to build filters list
             *
             * @param {object} options
             */
            $scope.setFiltersOptions = function(options) {
                $scope._filtersOptions = options;
            };


            /***************************************************************************************
             *****                                  END FILTERING SECTION
             **************************************************************************************/



            /***************************************************************************************
             *****                                  BASE ACTIONS SECTION
             **************************************************************************************/


            /**
             * Loads list of models
             *
             * @see $scope#_checkPagination()
             * @fires CRUD.listSuccess On success. Wouldn't have any attrs because all records will be stored into {@link $scope.records}
             * @fires CRUD.listError will be fired after server error. Attrs: {error: err}
             */
            $scope.list = function() {
                if (!$scope.resource) {
                    console.log('No resource provided.');
                    return;
                }
                //fetching data
                $scope.resource.query($scope.filter, function (data) {
                    $scope.records = data;
                    $scope._checkPagination();
                    $scope.$emit('CRUD.listSuccess');
                }, function(err) {
                    $scope.$emit('CRUD.listError', {error: err});
                });
            };


            /**
             * Will load details of record based on $routeParams.id or will create empty record
             *
             * @fires CRUD.getSuccess Will be fired after successful loading or creation of {@link $scope.model}. No attrs. All data will be into {@link $scope.model}
             * @fires CRUD.getError Will be fired if loading model from server failed. Attrs: {error: 'server error'}
             */
            $scope.get = function() {
                if ($scope.params.id == 'add') {
                    $scope.model = new $scope.resource;
                    $scope.$emit('CRUD.getSuccess');
                } else {
                    $scope.resource.get({id: $scope.params.id}, function (data) {
                        for(var i in data) {
                            if (data[i] !== null && typeof data[i] == 'object' && data[i].id) {
                                data[i] = data[i].id;
                            }
                            if (data[i] instanceof Array) {
                                for(var j in data[i]) {
                                    if (typeof data[i][j] == 'object' && typeof data[i][j].id != 'undefined') {
                                        data[i][j] = data[i][j].id;
                                    }
                                }
                            }
                        }
                        $scope.model = data;
                        $scope.$emit('CRUD.getSuccess');
                    }, function(err) {
                        $scope.$emit('CRUD.getError', {error: err});
                    });
                }
            };

            /**
             * Will check if record.id exist and will update record. <br/>
             * If no ID exist will create new record.
             *
             * @param {object} record
             * @see $scope#add
             * @see $scope#edit
             */
            $scope.save = function(record) {
                if (!$scope.resource) {
                    console.log('No resource provided.');
                    return;
                }
                if (!record) {
                    console.log('No record passed');
                    return;
                }
                if (!record.id) {
                    $scope.add(record);
                } else {
                    $scope.edit(record);
                }
            };

            /**
             * Will send data to server to create new record on server
             *
             * @param {object} record
             * @fires CRUD.addSuccess Will be fired after successful save method. Attrs: {record: 'stored record'}
             * @fires CRUD.addError Will be fired after save error. Attrs: {error: 'server error'}
             */
            $scope.add = function(record) {
                if (!$scope.resource) {
                    console.log('No resource provided.');
                    return;
                }
                record.$save(function(data) {
                    $scope.$emit('CRUD.addSuccess', {record: data});
                }, function(error) {
                    $scope.$emit('CRUD.addError', {error: error});
                });
            };

            /**
             * Will send request to server to update record
             *
             * @param {object} record
             * @fires CRUD.editSuccess Will be fired after successful update method. Attrs: {record: 'stored record'}
             * @fires CRUD.editError Will be fired after update error. Attrs: {error: 'server error'}
             */
            $scope.edit = function(record) {
                if (!$scope.resource) {
                    console.log('No resource provided.');
                    return;
                }
                if (!record.id) {
                    console.log('No id provided');
                    return;
                }
                record.$update(function(data) {
                    $scope.$emit('CRUD.editSuccess', {record: data});
                }, function(error) {
                    $scope.$emit('CRUD.editError', {error: error});
                });
            };

            /**
             * Will check record.id exist or not. and if exist it will send request to server to remove record.
             *
             * @param {object} record
             * @param {number} index Index of record into {@link $scope.records} array.
             * @fires CRUD.deleteSuccess will have args: {record: 'Removed record object'}
             * @fires CRUD.deleteError will be fired if server will return error. Args: {error: 'error from server'}
             */
            $scope.delete = function(record, index) {
                if (!$scope.resource) {
                    console.log('No resource provided.');
                    return;
                }
                if (!confirm('Вы уверены ?')) return;
                record.$delete({id: record.id}, function(data) {
                    if (~index && $scope.records[index]) {
                        $scope.records.splice(index, 1);
                    }
                    $scope.$emit('CRUD.deleteSuccess', {record: record});
                }, function(error) {
                    $scope.$emit('CRUD.deleteError', {error: error});
                });
            };

            /**
             * Update boolean value into given model
             *
             * @param {object} model
             * @param {string} field
             */
            $scope.toggleBoolean = function(model, field) {
                if (!$scope.resource) {
                    console.log('No resource provided.');
                    return;
                }
                if (!model.id || typeof model[field] != 'boolean') {
                    console.log('No id in the model.');
                    return;
                }
                var data = {};
                data[field] = !model[field];
                $scope.resource.update({id: model.id}, data, function(data) {
                    model[field] = !model[field];
                    $scope.$emit('toggleBooleanSuccess');
                }, function(err) {
                    $scope.$emit('toggleBooleanError', {error: err});
                });
            };

            /***************************************************************************************
             *****                             END BASE ACTIONS SECTION
             **************************************************************************************/
        };

        return CRUDController;
    };
})();