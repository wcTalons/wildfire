require.config({
    paths: {
        jQuery: 'libs/jquery-min',
        angular_route: 'libs/angular-route-min',
        angular: 'libs/angular-min',
        app_ctrl: 'controllers/ctrl-app',
        register_srvc: 'services/srvc-register',
        services_list: 'services/list',
        models_list: 'models/list',
        ctrls_list: 'controllers/list',
        dirc_list: 'directives/list'
    },
    shim: {
        jQuery: {
            exports: 'jQuery'
        },
        angular: {
            exports: 'angular',
            deps: ['jQuery']
        },
        angular_route: {
            exports: 'angular_route',
            deps: ['angular']
        }
    }
});

define("main", ['angular', 'angular_route', 'app_ctrl', 'register_srvc', 'services_list', 'models_list', 'ctrls_list', 'dirc_list'],
    function (angular, angular_route, app_ctrl, register_srvc, services, models, controllers, directives) {
        "use strict";
  
        var dnd_app = angular.module('app', ['ngRoute']);
        
        dnd_app.config(function ($provide, $controllerProvider, $compileProvider) {

            register_srvc.set("services", $provide);
            register_srvc.set("controllers", $controllerProvider);
            register_srvc.set("directives", $compileProvider);

            register_srvc.register(services.list);
            register_srvc.register(models.list);
            register_srvc.register(controllers.list);
            register_srvc.register(directives.list);
        });

        dnd_app.controller('ctrl_app', app_ctrl.ctrl);
        angular.element(document).ready(function() { angular.bootstrap(document, ['app']); });
});