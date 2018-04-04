# Security for AdminPanel

## Policy setup
You can set up policy that will be checked before open any AdminPanel route.
This could be done into `config/adminpanel.js` file. Using `policies` config option.

Option could be setuped into 4 ways:
+ `string` - simple string with policy name.
+ `array` - Array of ordered strings. All policies from Array will be applied in order you define it.
+ `function` - a policy function.
+ `array of functions` - Array of policy functions.

## Examples

**string** notation:

```javascript
module.exports.adminpanel = {

    policies: 'isAdmin',

    //...
};
```

It will load policy from your `api/policy/isAdmin.js` file and apply it to all admin panel routes.

**array** notation

```javascript
module.exports.adminpanel = {

    policies: ['isAuthorized', 'isAdmin'],

    //...
};
```

It will load 2 policies from your `api/policy/` folder and apply it into order you defined.
In this example `isAuthorized.js` policy will be applied first and `isAdmin.js` second.

**function** notation

```javascript
module.exports.adminpanel = {

    policies: function(req, res, next) {
        if (!req.user || !req.user.isAdmin) {
            return res.forbidden('You have no rights !');
        }
        return next();
    },

    //...
};
```

This policy will be applied to all admin panel routes.

**array of functions** notation

```javascript
module.exports.adminpanel = {

    policies: [
        function(req, res, next) {
            if (!req.user) {
                return res.forbidden('You have no rights !');
            }
            return next();
        },

        function(req, res, next) {
            if (!req.user.isAdmin) {
                return res.forbidden('You have no rights !');
            }
            return next();
        }
    ],

    //...
};
```

For now this is only one way to protect AdminPanel.
Later there will be added more flexible options...
