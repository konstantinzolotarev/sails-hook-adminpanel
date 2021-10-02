import * as serveStatic from 'serve-static'
import * as path from "path"
export default async function(sails: any) {
    sails.hooks.http.app.use('/admin/assets', serveStatic(path.join(__dirname, '../assets')));
    //let layer = sails.hooks.http.app._router.stack.slice(-1)[0] 
    //sails.hooks.http.app._router.stack.splice(1, 0, layer)
};