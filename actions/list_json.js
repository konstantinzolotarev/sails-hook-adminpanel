"use strict";
var util = require("../lib/adminUtil");
var fieldsHelper = require("../helper/fieldsHelper");

module.exports = async function (req, res) {
    var instance = util.findInstanceObject(req);
    if (!instance.model) {
        return res.notFound();
    }

    if (!sails.adminpanel.havePermission(req, instance.config, __filename))
        return res.redirect("/admin/userap/login");

    let records = [];

    records = await instance.model.find();

    let fields = fieldsHelper.getFields(req, instance, "list");
    fields = Object.keys(fields);
    let result= [];
    records.forEach((item) => {
        let a = [];
        fields.forEach((key) => {
            a.push(item[key]);
        });
        result.push(a);
    });
    res.json({
        data: result,
        //fileds: fields,
    });
};
