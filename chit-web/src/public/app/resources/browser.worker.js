(function () {
    'use strict';

    log("Shared worker started");
    var connections = 0;
    const listeners = {};
    const onceListeners = {};
    self.addEventListener("connect", function (ev) {
        let port = ev.ports[connections];
        connections++;
        log("Connections:" + connections);
        port.addEventListener("message", function (e) {
            if (e.data.channel) {
                if (listeners[e.data.channel])
                    listeners[e.data.channel].forEach((listener) => {
                        var _a;
                        return listener({
                            reply() {
                            },
                            sender: getSender(), returnValue: null
                        }, ...(_a = e.data) === null || _a === void 0 ? void 0 : _a.args);
                    });
                if (onceListeners[e.data.channel]) {
                    onceListeners[e.data.channel].forEach((listener) => { var _a; return listener(getEvent(), ...(_a = e.data) === null || _a === void 0 ? void 0 : _a.args); });
                    onceListeners[e.data.channel] = null;
                }
            }
        }, false);
        function getEvent(e) {
            return {
                reply() {
                },
                sender: getSender(),
                returnValue: null
            };
        }
        function getSender(e) {
            return {
                id: 1,
                send(channel, ...args) {
                    port.postMessage({ channel, args });
                }
            };
        }
        port.start();
    }, false);
    function log(...args) {
        console.log("ConsoleFromWorker:", ...args);
    }

}());
