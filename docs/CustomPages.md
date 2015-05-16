# Custom pages for Admin Panel

`api/controllers/AdminCintroller.js`:
```javascript
module.exports = {
    test: function(req, res) {
        return res.view();
    }
};
```

`views/admin/test.jade`:
```jade
extends ../../node_modules/sails-hook-adminpanel/views/jade/layout

block body
  .container
    .row: .col-md-12 This is new test page !

```
