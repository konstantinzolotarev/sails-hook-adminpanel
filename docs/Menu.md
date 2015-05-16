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

## Menu groups

To group your menues you can use `groups` key in `menu` configuration.
Key `groups` - is an array of `objects`. Every object represent one menu group. Is will be a droupdown menu item.

```javascript
module.exports.adminpanel = {
    menu: {
        // List of menu groups
        groups: [
            {
                key: 'users',
                title: 'Users'
            },
            {
                key: 'content',
                title: 'Content items'
            }
        ]
    },

    // ...

    instances: {
        users: {
            menuGroup: 'users',
            title: 'List of users',
            model: 'User'
        },

        moderators: {
            menuGroup: 'users',
            title: 'List of Moderators',
            model: 'Moderator'
        },

        article: {
            menuGroup: 'content',
            title: 'Articles',
            model: 'Article'
        }
    }
};
```

This configuratio will create a 2 dropdown menu items.

## Menu icons
Right now icons for menu are available.

For now only [Glyphicons](http://getbootstrap.com/components/#glyphicons) icons are supported.

You can set icon to menu item/group using `icon` key in config file.
But you should use icon class without `glyphicon-` prefix. **It will be added automatically !**

```javascript
module.exports.adminpanel = {
    menu: {
        groups: [
            {
                key: 'content',
                title: 'Content',
                icon: 'inbox' // glyphicon-ibox will be set to menu item.
            }
        ]
    }
};
```

```javascript
module.exports.adminpanel = {
    instances: {
        user: {
            model: 'User',
            title: 'Users',
            icon: 'user' // glyphicon-user icon will be added to menu
        }
    }
};
```
