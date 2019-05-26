"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const ws_1 = tslib_1.__importDefault(require("ws"));
console.log("server");
const wss = new ws_1.default.Server({ port: 8080 });
wss.on("connection", ws => {
    ws.on("message", v => {
        console.log(v);
    });
    ws.send("server");
});
//# sourceMappingURL=index.js.map