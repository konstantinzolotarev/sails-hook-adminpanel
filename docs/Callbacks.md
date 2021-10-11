# Edit callback

instanceModifier - function in adminpanel config edit sections for modification instance data

```
module.exports.adminpanel = {
    instances: {
        users: {
            title: 'Users',
            model: 'User',
            add: {
                fields: {
                },
                // saved object to be modificated before save in database
                instanceModifier: function (instance) {
                    instance.human_edited = true;
                    return instance;
                },
            }
        }
    }
}

```


# List callback

displayModifier - modificate data do show in datatables (only list)

```
module.exports.adminpanel = {
    instances: {
        users: {
            title: 'Users',
            model: 'User',

            list: {
                avatar: {
                    // Data to be modificated before send to frontend 
                    displayModifier: function (data) {
                        return `<img src="${data[0].url}" width="50px">`;
                    },
                }
            }
        }
    }
}