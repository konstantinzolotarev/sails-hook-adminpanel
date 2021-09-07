# Custom actions
You can create and use custom actions into your admin panel pages.

You could use `actions` property into `list/add/edit/view/remove` configurations to define custom actions in admin panel.

## Action buttons

```javascript
module.exports.adminpanel = {
    instances: {
        users: {
            title: 'Users',
            model: 'User',
            actions: [
                {
                    link: "/",
                    title: "First action",
                    icon: ""
                },
            ],

            list: {
                actions: {
                    // Actions in top right corner
                    global: [
                        {
                            link: '/',
                            title: 'Some new action',
                            icon: 'ok'
                        }
                    ],
                    // Inline actions for every
                    inline: [
                        {
                            link: '/',
                            title: 'Something', // Will be added as alt to img
                            icon: 'trash'
                        }
                    ]
                }
            }
        }
    }
};
```
