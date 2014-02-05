define(['exports', 'angular'], function (exports, angular) {
    "use strict";
    
    exports.ctrl = function ($rootScope, $window, $compile) {
        
        Array.prototype.sort_by = function (prop) {
            if (!prop) {
                return null;
            }

            function variant_sort(prop) {
                var pos = 1;

                if (prop[0] === "-") {
                    pos = -1;
                    prop = prop.substr(1, prop.length - 1);
                }

                return function (a, b) {
                    if (!a.hasOwnProperty(prop)) {
                        return 1;
                    }

                    if (!b.hasOwnProperty(prop)) {
                        return 0;
                    }

                    var res = (a[prop] < b[prop]) ? -1 : (a[prop] > b[prop]) ? 1 : 0;
                    return res * pos;
                };
            }

            return this.sort(variant_sort(prop));
        };

        Array.prototype._index_of_by_prop = function(prop, val) {
            if (!prop || val === null) { return -1; }

            for (var i = 0; i < this.length; i++) {

                if (this[i].hasOwnProperty(prop) && this[i][prop] === val) {
                    return i;
                }
            }

            return -1;
        };

        function construct_raw_element(params) {
            if (!params || !params.el) { return null; }

            var el = document.createElement(params.el);

            if (params.data && params.data.length) {

                params.data.map(function (data) {
                    if (data.hasOwnProperty("attr")) {

                        if (data.hasOwnProperty("val")) {
                            el.setAttribute(data.attr, data.val);
                        } else {
                            el.setAttribute(data.attr, "");
                        }
                    }

                    if (data.hasOwnProperty("element")) {
                        el.appendChild($rootScope.construct_raw_element(data));
                    }
                });
            }

            if (params.hasOwnProperty("text")) {
                el.innerHTML = params.text;
            }

            if (params.elements && params.elements.length) {

                params.elements.map(function (data) {
                    el.appendChild($rootScope.construct_raw_element(data));
                });
            }

            return el;
        }

        $rootScope.safe_compile = function (elem, _scope) {
            if (!elem) { return null; }
            
            if (!$rootScope.$$phase) {
                _scope.$apply(($compile(elem)(_scope)));
            } else {
                $compile(elem)(_scope);
            }
        };

        $rootScope.safe_replace = function (parent, child, replacer, _scope) {
            if (!parent || !parent.attr("id") || !child || !replacer || !replacer.el || !replacer.data || !replacer.data.length || !_scope) {
                return null;
            }

            var node_parent = document.getElementById(parent.attr("id")),
                children = node_parent.childNodes,
                node_replacer = $rootScope.construct_raw_element(replacer),
                node_child = null;

            if (!node_replacer) { return null; }

            for (var i = 0; i < children.length; i++) {
                if (children[i].hasOwnProperty("id") && children[i].getAttribute("id") == child.attr("id")) {
                    node_child = children[i];
                    break;
                }
            }

            if (!node_child) return null;

            node_parent.replaceChild(node_replacer, node_child);
            $rootScope.safe_compile(node_replacer, _scope);
        };

        $rootScope.safe_insert_at = function (parent, child, pos, _scope) {
            if (!parent || !child || pos === null || !_scope) { return null; }

            var node_parent = document.getElementById(parent.attr("id")),
                node_child = $rootScope.construct_raw_element(child);

            if (!node_child) { return null; }

            node_parent.insertBefore(node_child, node_parent.children[(pos)]);
            $rootScope.safe_compile(node_child, _scope);
        };

        $rootScope.find_node_id = function(el) {
            if (!el || !el.parentElement) { return null; }
            if (el.id) { return el.id; }

            if (el.parentElement.id) {
                return el.parentElement.id;
            } else {
                return $rootScope.find_node_id(el.parentElement);
            }
        };

        $rootScope.find_file = function(file_name, _callback) {
            if (!file_name || !_callback) { return null; }
            srvcRequester.find_file("/admin/"+file_name, _callback);
        };

        $rootScope.object_data = function(obj, path, value, delimiter) {
            if (!obj || !path) { return null; }
            
            var dmr = delimiter ? delimiter : ".";

            function transverse(source, fields) {
                if (!source || !fields || !fields.length) { return null; }

                var data = null;

                if (fields.length > 1) {
                    var datapoint = fields.splice(0, 1);
                    if (source.hasOwnProperty(datapoint)) { data = find_data(source[datapoint], fields); }
                } else {
                    if (source.hasOwnProperty(fields[0])) {
                        if (value) { source[fields[0]] = value; }
                        data = source[fields[0]];
                    }
                }

                return data;
            }

            return find_data(obj, path.split(dmr));
        };

        $rootScope.make_angular_element = function(config) {
            if (!config || !config.dirc) { return null; }

            var new_el = angular.element('<'+config.dirc+'></'+config.dirc+'>');

            if (config.id) { new_el[0].id = config.id; }
            if (config.classes && config.classes.length) { new_el[0].className = config.classes.join(" "); }
            if (config.attrs && config.attrs.length) {
                config.attrs.forEach(function (attr, index) {
                    if (attr.name) {
                        if (attr.val) {
                            new_el[0].setAttribute(attr.name, attr.val);
                        } else {
                            new_el[0].setAttribute(attr.name, "");
                        }
                    }
                });
            }

            return new_el;
        }

        $rootScope.$on("app-action-basic", function (event, args) {
            if (!args || !args.action_type) { return null; }

            switch (args.action_type) {
                default:
                    console.log("app-action-basic event", args);
                break;
            }
        });

        $rootScope.$on("app-action-update", function (event, args) {
            if (!args || !args.update_type || !args.action_type) { return null; }

            switch (args.action_type) {
                default:
                    console.log("app-action-update event", args);
                break;
            }
        });
    };
    
});