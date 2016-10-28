angular.module('TwubricModule', [])
    .controller('TwubricController', ['$scope', 'jsonLoader', function($scope, jsonLoader) {
        jsonLoader.loadData('apiData.json')
            .success(function(data) {
                $scope.values = data;
            });
    }])
    .directive('twubricDirective', function() {
        return {
            scope: {
                twitterInfo: '=info'
            },
            templateUrl: 'card.html',
            link: function(scope, element, attrs) {

                var twubric = $('.isotope').isotope({
                    layoutMode: 'fitRows',
                    itemSelector: '.card-item',
                    resizesContainer: true,
                    getSortData: {
                        total: '.total',
                        friends: '.friends',
                        influence: '.influence',
                        chirpiness: '.chirpiness parseInt'
                    }
                });

                //console.log(twitterAccountsInfo);
                scope.$watch('twitterInfo', function(newVal, oldVal) {
                    twubric.isotope('reloadItems').isotope({ sortBy: 'original-order' }); 
                    // init datepicker
                    $('#startDate').datepicker("setDate", "Jan 1, 2008");
                    $('#endDate').datepicker("setDate", "Dec 31, 2013");
                    $('#endDate').datepicker({ 
                        dateFormat: 'M d, yy', 
                        changeMonth: true, 
                        changeYear: true, 
                        onSelect: function() {
                            twubric.isotope({ filter: filterByDate });
                        } 
                    });
                    $('#startDate').datepicker({ 
                        dateFormat: 'M d, yy', 
                        changeMonth: true, 
                        changeYear: true, 
                        onSelect: function(dateText, inst) {
                            twubric.isotope({ filter: filterByDate });
                            // var date = $.datepicker.parseDate($.datepicker._defaults.dateFormat, dateText);
                            // $("#endDateField").datepicker("option", "minDate", date);
                        } 
                    });
                });

                $('#sorts').on('click', 'button', function() {
                    var sortByValue = $(this).attr('data-sort-by');
                    console.log(sortByValue);
                    $(this).toggleClass('selected');
                    if ($(this).hasClass('selected')) {
                        sortValue = true;    
                    } else {
                        sortValue = false;
                    }
                    twubric.isotope('reloadItems').isotope({ sortBy: sortByValue, sortAscending: sortValue });
                });

                element.on('click', '#removeCard', function() {
                    twubric.isotope('remove', $(this).parents('.card-item'));
                    twubric.isotope('layout');
                });

                var filterByDate = function() {        
                    var startDate = $('#startDate').val();
                    var endDate = $('#endDate').val();
                    var date = $(this).find('.joinDate').text();

                    if (startDate !== undefined && endDate !== undefined && date !== undefined) {
                        date = new Date(date);
                        startDate = new Date(startDate);
                        endDate = new Date(endDate);
                    }
                    
                    return date >= startDate && date <= endDate;
                };

                Mousetrap.bind('t', function() {
                    $('#totalSortButton').click();
                });
                Mousetrap.bind('f', function() {
                    $('#friendsSortButton').click();
                });
                Mousetrap.bind('i', function() {
                    $('#influenceSortButton').click();
                });
                Mousetrap.bind('c', function() {
                    $('#chirpinessSortButton').click();
                });
            }
        }
    })
    .factory('jsonLoader', function($http) {
        var jsonLoader = {};
        jsonLoader.loadData = function(url) {
            return $http.get(url);
        };
        return jsonLoader;
    });
