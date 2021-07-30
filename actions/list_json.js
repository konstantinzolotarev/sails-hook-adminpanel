"use strict";
var util = require("../lib/adminUtil");
var fieldsHelper = require("../helper/fieldsHelper");
var configHelper = require("../helper/configHelper")(sails);

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
    let identifierField = configHelper.getIdentifierField(instance.config.model);
    fields = Object.keys(fields);
    let result= [];
    records.forEach((item) => {
        let a = [];
        a.push(item[identifierField]); // for Actions
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
