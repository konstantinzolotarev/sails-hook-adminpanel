# Menu configuration

Menu in admin panel could be configured using `menu` key in main `adminpanel` configuration object.

```javascript
module.exports.adminpanel = {
    // Here all menu configuration could be set
    menu: {
        // ...
    }
};
```

## Brand configuration

To configure brand in admin panel you could use `brand` key.

It could be set in several ways:

+ `boolean` - will turn on/off brand showing
+ `string` - will turn on showing brand and will set title you set.
+ `object` - will turn on brand showing with `title` and `link` keys. That could set text and link for brand.

Several examples:

```javascript
module.exports.adminpanel = {
    // Here all menu configuration could be set
    menu: {
        brand: false // turn off brand block
    }
};
```

```javascript
module.exports.adminpanel = {
    // Here all menu configuration could be set
    menu: {
        brand: 'Super Admin' // Will set text to `Super Admin` into brand
    }
};
```

```javascript
module.exports.adminpanel = {
    // Here all menu configuration could be set
    menu: {
        brand: {
            title: 'Admin', // Set text to `Admin`
            link: '/admin/users' // Will set link to `/admin/users`
        }
    }
};
```
