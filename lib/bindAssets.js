"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const serveStatic = require("serve-static");
const path = require("path");
async function default_1(sails) {
    sails.hooks.http.app.use('/admin/assets', serveStatic(path.join(__dirname, '../assets')));
    //let layer = sails.hooks.http.app._router.stack.slice(-1)[0] 
    //sails.hooks.http.app._router.stack.splice(1, 0, layer)
}
exports.default = default_1;
;
