define(['angular'], function (angular) {
    "use strict";

    var compileProvider = null,
        controllerProvider = null,
        serviceProvider = null,
        filterProvider = null,
        registeredDirectives = {},
        registeredControllers = {},
        registeredServices = {},
        registeredFilters = {},
        implementTypes = {
            dirc: 1,
            ctrl: 2,
            srvc: 3,
            model: 4,
            filter: 5
        };

    //-- set up the provider so that the app can register componets
    function set(type, provider) {
        if (!type || !provider || typeof provider !== 'object') { return null; }

        switch (type) {
            case "directives":
                compileProvider = provider;
                break;
            case "controllers":
                controllerProvider = provider;
                break;
            case "services":
                serviceProvider = provider;
                break;
            case "filters":
                filterProvider = provider;
            default:
                return null;
        }
    }

    function get(type) {
        switch (type) {
            case "dircs":
                return registeredDirectives;
            case "ctrls":
                return registeredControllers;
            case "models":
                return registeredServices;
            case "srvcs":
                return registeredServices;
            case "filters":
                return registeredFilters;
        }
    }

    //-- Services and Models are registered in the same way;
    function implementService(type, params) {
        if (!registeredServices.hasOwnProperty(params.name) && !registeredServices[params.name]) {
            serviceProvider.factory(params.name, params._callback);
            registeredServices[params.name] = true;
        } else if (registeredServices.hasOwnProperty(params.name) && !registeredServices[params.name]) {
            switch (type) {
                case implementTypes.srvc:
                    console.log("Service name is already registered:", params.name);
                break;
                case implementTypes.model:
                    console.log("Model name is already registered:", params.name);
                break;
            }
        }
    }

    //-- register the component
    function implement(type, params) {
        switch (type) {
            case implementTypes.dirc:
                if (compileProvider != null && typeof compileProvider == 'object') {
                    if (!registeredDirectives.hasOwnProperty(params.name) && !registeredDirectives[params.name]) {
                        compileProvider.directive(params.name, params._callback);
                        registeredDirectives[params.name] = true;
                    } else if (registeredDirectives.hasOwnProperty(params.name) && !registeredDirectives[params.name]) {
                        console.log("Directive name is already registered:", params.name);
                    }
                } else {
                    console.log("Unable to register Directive: provider not set");
                }
            break;
            case implementTypes.ctrl:
                if (controllerProvider != null && typeof controllerProvider == 'object') {
                    if (!registeredControllers.hasOwnProperty(params.name) && !registeredControllers[params.name]) {
                        controllerProvider.register(params.name, params._callback);
                        registeredControllers[params.name] = true;
                    } else if (registeredControllers.hasOwnProperty(params.name) && !registeredControllers[params.name]) {
                        console.log("Controller name is already registered:", params.name);
                    }
                } else {
                    console.log("Unable to register Controller: provider not set");
                }
            break;
            case implementTypes.filter:
                if (filterProvider != null && typeof filterProvider == 'object') {
                    if (!registeredFilters.hasOwnProperty(params.name) && !registeredFilters[params.name]) {
                        filterProvider.register(params.name, params._callback);
                        registeredFilters[params.name] = true;
                    } else if (registeredFilters.hasOwnProperty(params.name) && !registeredControllers[params.name]) {
                        console.log("Filter name already registered", params.name);
                    }
                } else {
                    console.log("Unable to register filter: provider not set");
                }
            break;
            case implementTypes.srvc:
                implementService(type, params);
            break;
            case implementTypes.model:
                implementService(type, params);
            break;
            default:
                console.log("Could not register type:", type);
                return null;
            break;
        }
    }

    //-- prep registration
    function preImplement(params) {
        if (params.hasOwnProperty("dirc")) {
            implement(implementTypes.dirc, { name: params.name, _callback: params.dirc });
        } else if (params.hasOwnProperty("ctrl")) {
            implement(implementTypes.ctrl, { name: params.name, _callback: params.ctrl });
        } else if (params.hasOwnProperty("srvc")) {
            implement(implementTypes.srvc, { name: params.name, _callback: params.srvc });
        } else if (params.hasOwnProperty("model")) {
            implement(implementTypes.model, { name: params.name, _callback: params.model });
        } else if (params.hasOwnProperty("filter")) {
            implement(implementTypes.filter, { name: params.name, _callback: params.filter });
        } else {
            console.log("Could not register:", params.name);
        }
    }

    //-- pass in components for registration
    function register(params, _callback) {
        if (!params || (!compileProvider && !controllerProvider && !serviceProvider && !filterProvider) ) return null;

        if ((typeof params == "array" || typeof params == "object") && params.length) {
            for (var i = 0; i < params.length; i++) {

                if (params[i].name && (params[i].dirc || params[i].ctrl || params[i].srvc || params[i].model || params[i].filter) ) {
                    preImplement(params[i]);
                } else {
                    if (_callback) {
                        _callback({ loaded: false, msg: "Invalid Params. Could not register:", params: params[i] });
                    } else {
                        console.error("Invalid Params. Could not register:", params[i]);
                    }
                }

            }
        } else if (typeof params == "object" && params.name && (params.dirc || params.ctrl || params.srvc || params.model || params.filter) ) {
            preImplement(params);
        } else {
            if (_callback) {
                _callback({ loaded: false, msg: "Invalid Params. Could not register:", params: params[i] });
            } else {
                console.error("Invalid Params. Could not register: ", params);
            }
        }

        if (_callback) {
            _callback({ loaded: true });
        }
    }

    return {
        set: set,
        get: get,
        register: register
    };

});