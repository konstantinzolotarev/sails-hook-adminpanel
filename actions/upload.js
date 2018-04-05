'use strict';

var util = require('../lib/adminUtil');
var request = require('../lib/requestProcessor');
var views = require('../helper/viewsHelper');
var fieldsHelper = require('../helper/fieldsHelper');

var async = require('async');
const Jimp = require('jimp');

module.exports = function (req, res) {
    var instance = util.findInstanceObject(req);
    // if (!instance.model) {
    //     return res.notFound();
    // }

    if (req.method.toUpperCase() === 'POST') {
        // if this file must not be loaded
        if (req.body.stop === true)
            return res.badRequest();

        // read field
        if (!req.body.field)
            return res.serverError('No field name in request');

        // set upload directory
        const dirDownload = '/uploads/' + instance.name + '/' + req.body.field + '/';
        const dir = '/.tmp/public' + dirDownload;
        const fullDir = process.cwd() + dir;

        // small and large sizes
        let small, large;
        try {
            small = parseInt(req.body.small) || 150;
            large = parseInt(req.body.large) || 900;
        } catch (e) {
            return res.badRequest('Invalid request');
        }

        // resizes
        if (!req.body.resize)
            return res.serverError('No resizes in request');
        let resize
        try {
            resize = JSON.parse(req.body.resize);
        } catch (e) {
            resize = [];
        }

        // if has no file name send error
        if (!req.body.filename)
            return res.serverError('No file name in request');

        // if request has noo file type send error
        if (!req.body.type)
            return res.serverError('No type of file');
        const type = req.body.type;

        let aspect;
        try {
            aspect = JSON.parse(req.body.aspect);
        } catch (e) {
            aspect = '';
        }

        let size1;
        try {
            size1 = JSON.parse(req.body.size);
            if (size1) {
                if (!size1.width)
                    size1.width = '>=0';
                if (!size1.height)
                    size1.height = '>=0';
            }
        } catch (e) {
            size1 = '';
        }

        // make random string in end of file
        let rand = '';
        const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (let i = 0; i < 10; i++)
            rand += possible.charAt(Math.floor(Math.random() * possible.length));

        //save file
        const filenameOrig = req.body.filename.replace(' ', '_');
        const filename = filenameOrig.substr(0, filenameOrig.lastIndexOf('.')) + rand + '.' + filenameOrig.split('.').reverse()[0];
        const nameSmall = filename.substr(0, filename.lastIndexOf('.')) + '_tumblrDEFAULT.' + filename.split('.').reverse()[0];
        const nameLarge = filename.substr(0, filename.lastIndexOf('.')) + '_largeDEFAULT.' + filename.split('.').reverse()[0];
        req.file('file').upload({
            dirname: fullDir,
            saveAs: filename
        }, function (err, file) {
            if (err) return res.serverError(err);

            // images
            if (type === 'images' || type === 'image') {
                Jimp.read('.' + dir + filename, function (err, image) {
                    if (err) return res.serverError(err);

                    const width = image.bitmap.width;
                    const height = image.bitmap.height;
                    const size = image.bitmap.data.length;

                    // check image parametrs
                    const valid = checkValid(width, height, aspect, size1);
                    if (valid === 'size') {
                        return res.badRequest(rangeToString(size1));
                    }
                    else if (valid === 'aspect') {
                        return res.badRequest('Неправильное соотношение сторон');
                    }

                    let resizes = [];
                    resize.forEach(i => {
                        i.w = parseInt(i.w);
                        i.h = parseInt(i.h);
                        resizes.push(
                            function (callback) {
                                const name = fullDir + filename.substr(0, filename.lastIndexOf('.')) + '_' + i.name + '.' + filename.split('.').reverse()[0];
                                Jimp.read('.' + dir + filename, function (err, imageTemp) {
                                    imageTemp.resize(i.w === -1 ? Jimp.AUTO : i.w, i.h === -1 ? Jimp.AUTO : i.h).write(name, function (err, image) {
                                        if (err) return callback(err);
                                        return callback(null, name);
                                    });
                                });
                            }
                        );
                    });
                    async.parallel(resizes,
                        function (err, results) {
                            if (err) return res.serverError(err);

                            Jimp.read('.' + dir + filename, function (err, image1) {
                                if (err) return res.serverError(err);
                                image1.scaleToFit(large, large)
                                    .write(fullDir + nameLarge, function () {
                                        image1.scaleToFit(small, small)
                                            .write(fullDir + nameSmall, function () {
                                                // return urls
                                                const url = dirDownload + filename;
                                                const urlSmall = dirDownload + nameSmall;
                                                const urlLarge = dirDownload + nameLarge;
                                                res.created({
                                                    name: filenameOrig,
                                                    url: url,
                                                    urlSmall: urlSmall,
                                                    urlLarge: urlLarge,
                                                    urls: results,
                                                    width: width,
                                                    height: height,
                                                    size: size
                                                });
                                            });
                                    });
                            });
                        });
                });
            } else if (type === 'files' || type === 'file') {
                const ext = filename.substr(filename.lastIndexOf('.') + 1, filename.length);
                const url = '/admin/icons/' + ext + '/' + ext + '-128_32.png';
                res.created({
                    name: filenameOrig,
                    url: url,
                    urlSmall: url,
                    urlLarge: url,
                    size: file[0].size
                });
            }
        });
    }
};

function checkValid(w, h, aspect, size) {
    // aspect
    if (aspect)
        if (Math.abs(w * aspect.width - h * aspect.height) !== 0)
            return 'aspect';

    // image size
    let res = 'ok';
    if (size) {
        const a = [size.width, size.height];
        const b = [w, h];

        for (let i = 0; i < a.length; i++) {
            a[i] = JSON.parse(a[i]);
            if (!Array.isArray(a[i])) {
                if (/[><=]/.test(a[i]))
                    a[i] = [a[i]];
                else if (a[i] !== b[i])
                    res = 'size';
            }

            if (res) {
                for (let j = 0; j < a[i].length; j++) {
                    let item = a[i][j];
                    let equal = false;
                    if (item.indexOf('=') >= 0)
                        equal = true;
                    if (item.indexOf('>') >= 0) {
                        if (equal) {
                            if (b[i] < parseInt(item.replace(/\D+/, '')))
                                res = 'size';
                        } else {
                            if (b[i] <= parseInt(item.replace(/\D+/, '')))
                                res = 'size';
                        }
                    }
                    if (item.indexOf('<') >= 0) {
                        if (equal) {
                            if (b[i] > parseInt(item.replace(/\D+/, '')))
                                res = 'size';
                        } else {
                            if (b[i] >= parseInt(item.replace(/\D+/, '')))
                                res = 'size';
                        }
                    }
                }
            }
        }
    }

    return res;
}

function rangeToString(size) {
    let res = {width: '', height: '', width1: '', height1: ''};
    const a = ['width', 'height'];
    for (let i in a) {
        i = a[i];
        if (!Array.isArray(size[i]))
            size[i] = [size[i]];
        for (let j = 0; j < size[i].length; j++) {
            sails.log.info(size[i]);
            sails.log.info(size[i][j]);
            size[i][0][j] = size[i][j].replace('>=', "больше или равно ");
            size[i][0][j] = size[i][j].replace('>', "больше ");
            size[i][0][j] = size[i][j].replace('<=', "меньше или равно ");
            size[i][0][j] = size[i][j].replace('<', "меньше ");
            res[i] += size[i][j] + ', ';
            sails.log.info(res[i]);
        }
    }

    res.width = 'Ширина должна быть ' + res.width;
    res.height = 'и высота ' + res.height;
    return res.width + res.height;
}