# Custom pages for Admin Panel

You can create custom pages for admin panel using default sails controllers/actions.

Here is a simple example of action:

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

**Note!**
+ You just extending your jade view form `../../node_modules/sails-hook-adminpanel/views/jade/layout`
+ Use `block body` to show main content

You could use default Sails.js routing system or assign custom route for your action.

Next step you will just add link to this page into admin panel using [Actions](./Actions.md/).

## Available blocks

**TBD**
