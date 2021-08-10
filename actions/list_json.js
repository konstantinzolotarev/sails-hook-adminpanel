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
    var fields = fieldsHelper.getFields(req, instance, 'list');

    let query = instance.model.find();

    fieldsHelper.getFieldsToPopulate(fields).forEach(function(val) {
        query.populate(val);
    });

    records = await waterlineExec(query);

    let identifierField = configHelper.getIdentifierField(instance.config.model);
    let keyFields = Object.keys(fields);
    let result= [];
    
    records.forEach((instance) => {
        let a = [];
        a.push(instance[identifierField]); // Push ID for Actions
        keyFields.forEach((key) => {
            if(fields[key].model.model){
                // If not present displayField try get "name" field or identifierField
                let displayField = fields[key].config.displayField;
                if (!instance[key]) return a.push("")
                // Relation
                a.push(instance[key][displayField]);
                
            } else if (fields[key].model.collection) {
                if (!instance[key] || !instance[key].length) return a.push("")
                let displayField = fields[key].config.displayField;
                
                // Collections
                let plainCollection = "";
                instance[key].forEach((item)=>{
                    if (plainCollection !== "") plainCollection += ", "
                    plainCollection += !item[displayField] ? item[fields[key].config.identifierField] : item[displayField];
                })
                a.push(plainCollection);

            } else {
                a.push(instance[key]);
            }
        });
        result.push(a);
    });

    res.json({
        data: result
    });
};


async function waterlineExec(query) {
    return new Promise((resolve, reject) => {
        query.exec(function(err, records) {
            if (err) reject(err);
            resolve(records)
        });
      });
}