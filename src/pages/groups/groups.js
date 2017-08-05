/* global angular, WS */

'use strict';

angular.module('geochat.groups', ['ionic'])
    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('main.groups', {
                url: '/groups',
                abstract: true,
                views: {
                    'main-groups': {
                        templateUrl: 'templates/groups/groups.html',
                        controller: 'GroupsCtrl'
                    }
                }
            })
            .state('main.groups.close', {
                url: '/close',
                cache: false,
                views: {
                    'main-groups-close': {
                        templateUrl: 'templates/groups/tab.html',
                        controller: 'GroupsCloseCtrl'
                    }
                }
            })
            .state('main.groups.favourite', {
                url: '/favourite',
                cache: false,
                views: {
                    'main-groups-favourite': {
                        templateUrl: 'templates/groups/tab.html',
                        controller: 'GroupsFavouriteCtrl'
                    }
                }
            })
            .state('main.groups.created', {
                url: '/created',
                cache: false,
                views: {
                    'main-groups-created': {
                        templateUrl: 'templates/groups/tab.html',
                        controller: 'GroupsCreatedCtrl'
                    }
                }
            })
            .state('main.groups.form', {
                url: '/form/{id:(?:/[^/]+)?}',
                params: {
                    lat: null,
                    lon: null
                },
                views: {
                    'main-groups-created': {
                        templateUrl: 'templates/groups/form.html',
                        controller: 'GroupFormCtrl'
                    }
                }
            })
            .state('main.groupschat', {
                url: '/group/{id}',
                views: {
                    'main-groups': {
                        templateUrl: 'templates/groups/chat.html',
                        controller: 'ChatGroupCtrl'
                    }
                }
            })
            ;


    })
    .controller('GroupsCtrl', ['$state', '$state', function ($scope, $state) {

        }])
    .controller('GroupsCloseCtrl', ['$scope', '$http', 'URLS', 'SerializeData', 'DB', 'Cron', '$ionicActionSheet', '$state', 'GroupService',
        function ($scope, $http, URLS, SerializeData, DB, Cron, $ionicActionSheet, $state, GroupService) {
            Cron.stopCrons();
            $scope.groups = [];
            $scope.cronTimer = 30000;
            var chatCronName = 'tab.groups';

            // Define chat cron
            Cron.createCron(chatCronName);
            Cron.setTimer(chatCronName, $scope.cronTimer);
            Cron.defineCron(chatCronName, function () {
                if (DB.getLatitude() && DB.getLongitude()) {
                    $scope.emptyMessage = 'No hay grupos cerca de tu ubicación';
                    $scope.groups = [];

                    $http({
                        method: 'POST',
                        url: URLS.serviceUrl + URLS.restApiGroupPath + 'list',
                        data: SerializeData({
                            latitude: DB.getLatitude(),
                            longitude: DB.getLongitude(),
                            radius: DB.getRadius(),
                            user: DB.getUserId(),
                            token: DB.getToken()
                        }),
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}  // set the headers so angular passing info as form data (not request payload)
                    }).success(function (data) {
                        $scope.groups = data;
                    }).error(function (data) {
                        $scope.result = {
                            success: false,
                            error: 'Error en el servidor, intente nuevamente o espere unos minutos.'
                        };
                    });
                }
            });

            Cron.startCron(chatCronName);

            $scope.join = function (group) {
                $state.go('main.groupschat', {id: group.id});
            };

            $scope.addFavourite = function (group) {
                GroupService.addFavourite({
                    group: group.id
                }).then(
                    function (data) {
                        console.log(data);
                        $scope.result = data;

                    },
                    function (data) {
                        $scope.result = {
                            success: false,
                            error: 'Error en el servidor, intente nuevamente o espere unos minutos.'
                        };
                    });
            };

            $scope.openGroupOptions = function (group) {

                // Show the action sheet
                var hideSheet = $ionicActionSheet.show({
                    buttons: [
                        {text: 'Entrar al grupo'},
                        {text: 'Agregar a favoritos'}
                    ],
                    titleText: group.name,
                    buttonClicked: function (index) {
                        switch (index) {
                            case 0:
                                $scope.join(group);
                                break;
                            case 1:
                                $scope.addFavourite(group);
                                break;
                        }
                        return true;
                    }
                });

            };
            $scope.buttons = [
                {text: 'Entrar al grupo'},
                {text: 'Agregar a favoritos'}
            ];
        }
    ])
    .controller('GroupsFavouriteCtrl', ['$scope', '$http', 'URLS', 'SerializeData', 'DB', 'Cron', '$ionicActionSheet', '$state', 'GroupService',
        function ($scope, $http, URLS, SerializeData, DB, Cron, $ionicActionSheet, $state, GroupService) {
            Cron.stopCrons();
            $scope.groups = [];

            $scope.updateFavouriteGroupsTab = function () {
                $scope.emptyMessage = 'No te has unido a ningun grupo';
                $scope.groups = [];
                $http({
                    method: 'POST',
                    url: URLS.serviceUrl + URLS.restApiGroupPath + 'favourite-groups',
                    data: SerializeData({
                        user: DB.getUserId(),
                        token: DB.getToken()
                    }),
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}  // set the headers so angular passing info as form data (not request payload)
                }).success(function (data) {
                    $scope.groups = data;
                }).error(function (data) {
                    $scope.result = {
                        success: false,
                        error: 'Error en el servidor, intente nuevamente o espere unos minutos.'
                    };
                });
            };

            $scope.updateFavouriteGroupsTab();
            
            $scope.join = function (group) {
                $state.go('main.groupschat', {id: group.id});
            };

            $scope.removeFavourite = function (group) {
                GroupService.removeFavourite({
                    group: group.id
                }).then(
                    function (data) {
                        $scope.result = data;
                    },
                    function (data) {
                        $scope.result = {
                            success: false,
                            error: 'Error en el servidor, intente nuevamente o espere unos minutos.'
                        };
                    });
            };
            $scope.openGroupOptions = function (group) {

                // Show the action sheet
                var hideSheet = $ionicActionSheet.show({
                    buttons: [
                        {text: 'Entrar al grupo'},
                    ],
                    destructiveText: 'Eliminar de los favoritos',
                    titleText: group.name,
                    cancelText: 'Cancelar',
                    destructiveButtonClicked: function () {
                        $scope.removeFavourite(group);
                        $scope.updateFavouriteGroupsTab();
                        hideSheet();
                    },
                    buttonClicked: function (index) {
                        switch (index) {
                            case 0:
                                $scope.join(group);
                                break;
                        }
                        return true;
                    }
                });

//            hideSheet();

            };
        }
    ])
    .controller('GroupsCreatedCtrl', ['$scope', '$http', 'URLS', 'SerializeData', 'DB', 'Cron', '$ionicActionSheet','$state','GroupService',
        function ($scope, $http, URLS, SerializeData, DB, Cron, $ionicActionSheet, $state, GroupService) {
            Cron.stopCrons();
            $scope.groups = [];
            $scope.showCreateButton = true;

            $scope.updateMyGroupsTab = function () {
                $scope.emptyMessage = 'No has creado grupos';
                $scope.groups = [];
                $http({
                    method: 'POST',
                    url: URLS.serviceUrl + URLS.restApiGroupPath + 'my-groups',
                    data: SerializeData({
                        user: DB.getUserId(),
                        token: DB.getToken()
                    }),
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}  // set the headers so angular passing info as form data (not request payload)
                }).success(function (data) {
                    console.log(data);
                    $scope.groups = data;

                }).error(function (data) {
                    $scope.result = {
                        success: false,
                        error: 'Error en el servidor, intente nuevamente o espere unos minutos.'
                    };
                });
            };

            $scope.updateMyGroupsTab();

            $scope.join = function (group) {
                $state.go('main.groupschat', {id: group.id});
            };
            
            $scope.addFavourite = function (group) {
                GroupService.addFavourite({
                    group: group.id
                }).then(
                    function (data) {
                        $scope.result = data;
                    },
                    function (data) {
                        $scope.result = {
                            success: false,
                            error: 'Error en el servidor, intente nuevamente o espere unos minutos.'
                        };
                    });
            };
            
            $scope.edit = function (group) {
                $state.go('main.groups.form', {id: group.id});
            };
            
            $scope.openGroupOptions = function (group) {

                // Show the action sheet
                var hideSheet = $ionicActionSheet.show({
                    buttons: [
                        {text: 'Entrar al grupo'},
                        {text: 'Agregar a favoritos'},
                        {text: 'Editar'},
                    ],
                    destructiveText: 'Eliminar grupo',
                    titleText: group.name,
                    cancelText: 'Cancelar',
                    destructiveButtonClicked: function () {
                        $scope.delete(group);
                    },
                    buttonClicked: function (index) {
                        switch (index) {
                            case 0:
                                $scope.join(group);
                                break;
                            case 1:
                                $scope.addFavourite(group);
                                break;
                            case 2:
                                $scope.edit(group);
                                break;
                        }
                        return true;
                    }
                });

            };
        }
    ])
    .controller('GroupFormCtrl', ['$scope', '$http', 'URLS', 'SerializeData', 'DB', 'Cron',
        function ($scope, $http, URLS, SerializeData, DB, Cron) {
            console.log('group form');
            Cron.stopCrons();
            
        }
    ])
    .controller('ChatGroupCtrl2', ['$scope', 'ChatService', '$interval', '$location', 'SerializeData', 'DB',
        function ($scope, ChatService, $interval, $location, SerializeData, DB) {
            console.log('sadasdasd');
            $interval(function () {
                ChatService.querygroup(SerializeData({
                    latitude: DB.getLatitude(),
                    longitude: DB.getLongitude(),
                    radius: DB.getRadius(),
                    group: 5
                }), function (result) {
                    $scope.messages = result;
                });
            }, 2000);

            $scope.sendMessage = function (message) {
                ChatService.save(SerializeData({
                    latitude: DB.getLatitude(),
                    longitude: DB.getLongitude(),
                    text: message,
                    group: 1,
                    user: DB.getUserId(),
                    token: DB.getToken()
                }), function (result) {
                    if (result.token == false || result.error == true) {
                        $location.path('autologin');
                    }
                });
                $scope.newMessage = null;
            };
        }
    ])
    .controller('ChatGroupCtrl', ['$scope', '$http', '$interval', '$location', 'SerializeData',
        '$ionicScrollDelegate', 'Cron', 'DB', 'ChatService', '$stateParams', 'URLS', '$timeout',
        function ($scope, $http, $interval, $location, SerializeData,
            $ionicScrollDelegate, Cron, DB, ChatService, $stateParams, URLS, $timeout) {
            $scope.newMessage = undefined;
            Cron.stopCrons();
            $scope.canSetTimer = true;
            $scope.cronTimer = 5000;
            $scope.timeLeft = -1;
            $scope.missingLocation = true;
            $scope.messages = [];
            $scope.me = DB.getUserId();
            $scope.group = $stateParams.id;

            ChatService.querygroup(SerializeData({
                latitude: DB.getLatitude(),
                longitude: DB.getLongitude(),
                radius: DB.getRadius(),
                group: $scope.group
            }), function (result) {
                $scope.messages = result;
            });

            var webSocket = WS.connect(URLS.wsUrl);
            webSocket.on("socket/connect", function (session) {
                //session is an Autobahn JS WAMP session.
                console.log(session);
                console.log("Successfully Connected!");

                session.subscribe("chat/group/" + $scope.group, function (uri, payload) {
                    console.log($scope.messages);
                    console.log(payload);
                    if (payload.user && payload.message) {
                        if ($scope.messages && $scope.messages.length && $scope.messages[$scope.messages.length - 1].id === payload.user.id) {
                            //agrego mensaje al ultimo mensaje del usuario
                            $scope.$apply(function () {
                                $scope.messages[$scope.messages.length - 1].messages.push({
                                    text: payload.message.text,
                                    date: payload.message.date,
                                    latitude: payload.message.latitude,
                                    longitude: payload.message.longitude,
                                    id: payload.message.id
                                });
                                console.log($scope.messages);
                            });
                        } else {
                            //agrego nuevo usuario
                            $scope.$apply(function () {
                                $scope.messages.push({
                                    id: payload.user.id,
                                    name: payload.user.name,
                                    messages: [{
                                            text: payload.message.text,
                                            date: payload.message.date,
                                            latitude: payload.message.latitude,
                                            longitude: payload.message.longitude,
                                            id: payload.message.id
                                        }]
                                });
                                console.log($scope.messages);
                            });
                        }
                        $location.hash('theBottom');
                        $ionicScrollDelegate.anchorScroll();
                    }
                });

                $scope.sendMessage = function (message) {
                    var msg = {
                        "user": DB.getUserId(),
                        "token": DB.getToken(),
                        "text": message,
                        "latitude": DB.getLatitude(),
                        "longitude": DB.getLongitude()
                    };

                    session.publish("chat/group/" + $scope.group, msg);
                    $scope.newMessage = undefined;
                };
            });
            webSocket.on("socket/disconnect", function (error) {
                //error provides us with some insight into the disconnection: error.reason and error.code
                console.log("Disconnected for " + error.reason + " with code " + error.code);
            });

            $scope.$watch('timeLeft', function (newValue) {
                if (newValue == 0) {
                    $scope.canSetTimer = false;
                    $location.hash('theBottom');
                    $ionicScrollDelegate.anchorScroll();
                    $interval.cancel($scope.timerInterval);
                    $scope.canSetTimer = true;
                }
            });

            $scope.setAutoScrollTimer = function () {
                if ($scope.canSetTimer) {
                    $scope.timeLeft = 12;
                    if ($scope.timerInterval) {
                        $interval.cancel($scope.timerInterval);
                    }
                    $scope.timerInterval = $interval(function () {
                        $scope.timeLeft--;
                    }, 1000);
                }
            };

            $scope.placeholder = function () {
                if ($scope.timeLeft > 0) {
                    var msg = 'En ' + $scope.timeLeft + 's se desplazara la pantalla hacia abajo.';
                    return msg;
                }

                return '';
            };

        }
    ]);


















    