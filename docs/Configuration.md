# Admin Panel configuration

## Global configs

Admin panel configuration consist of this options:

| Option            | Description
|-------------------|--------------------------
| `routePrefix`     | Route prefix for admin panel. Default: `/admin`
| `linkAssets`      | Will create a symlink to Admin panel assets. Anyway AP will try to load all assets from /admin/**** and you could copy them manually
| `identifierField` | Default identifier field into models. This field will be used as identifier. Default: `id`
| `instances`       | Configuration for instances. Read below...

## Instances

Admin panel devided into `instances` and this is a main part of configuration.

Instance will represent several actions for each model that you need to enable into Admin Panel.
It will consist of actions:

+ `list` - list of records with filters, pagination and sorting.
+ `add` - add a new records
+ `edit` - editing of record
+ `view` - view details of record
+ `remove` - ability to remove record

Every instance configuration shuld be placed into `instances` block into `config/adminpanel.js` file.
And have a required property `model`.

```
module.exports.adminpanel = {
    instances: {

        users: { // key. No matter what you will write here. just follow JS rules for objects
            title: 'Users', // If not defined will be taken from key. Here will be `users`
            model: 'User', // !!! required !!!
        }
    }
};
```

## Actions configuration

Every action into instance could be configured separately.
Actions configuration shuold be placed into `instance` block.

```
module.exports.adminpanel = {
    instances: {

        users: { // key. No matter what you will write here. just follow JS rules for objects
            title: 'Users', // If not defined will be taken from key. Here will be `users`
            model: 'User', // !!! required !!!

            //  ==== Actions configuration here ====
        }
    }
};
```

Every action could be configured in several ways, **but it should have action key** (list/add/edit/view/remove):

+ `boolean` - Enable/disable functionality.
```
instances: {
    users: {
        // ...

        list: true, // will mean that list action should exist. Enabled by default.
        edit: false // Will disable edit functionality for instance.
    }
}
```

+ `object` - detailed configuration of action.

```
instances: {
    users: {
        list: {
            limit: 15, // will set a limit of actions. This option supports only list action !
            fields: {} // list of fields configuration
        }
    }
}
```


## Fields configuration

For now AdminPanel hook supports 3 notations into field configuration:

+ Boolean notation

```
fieldName: true // will enable field showing/editing
fieldName: false // will remove field from showing. Could be usefull for actions like edit
```

+ String natation

```
fieldName: "Field Ttitle"
```

+ Object notation

```
fieldName: {
    title: "Field title", // You can overwrite field title
    type: "string", //you can overwrite default field type in admin panel
    required: true, // you can mark field required or not
    editor: true, // you can add WYSTYG editor for the field in admin panel
}
```

**There are several places for field config definition and an inheritance of field configs.**

+ You could use a global `fields` property into `config/adminpanel.js` file into `instances` section.
+ You could use `fields` property into `instances:action` confguration. This config will overwrite global one

```
module.exports.adminpanel = {
    instances: {
        users: {
            title: 'Users', // Menu title for instance
            model: 'User', // Model definition for instance

            fields: {
                email: 'User Email', // It will define title for this field in all actions (list/add/edit/view)
                createdAt: false, // Will hide createdAt field in all actions
                bio: {
                    title: 'User bio',
                    type: 'text', // LOOK BELOW FOR TYPES DESCRIPTION
                    editor: true
                } // will set title `User bio` for the field and add editor into add/edit actions. Could be combined only with `text` type
            },
            // Action level config
            list: {
                bio: false // will hide bio field into list view
            },

            edit: {
                createdAt: 'Created at' //will enable field `createdAt` and set title to `Created at`
            }
        }
    }
}
```

## Ignored fields
You could add ignored fields to action using `fields` config option.

```
module.exports.adminpanel = {
    instances: {
        users: {
            title: 'Users', // Menu title for instance
            model: 'User', // Model definition for instance

            // this fields will be ignored into all actions
            fields: {
                'admin': false,
                'someAnotherField': false,
                'encryptedPassword': false
            }
        }
    }
}
```

## Field types

Field types could be set into `field` configuration or will be inherited from your model definition.

Now Admin panel supports several field types and add proper editor for every type.

Types included into admin panel:
+ `string` - textfield into add/edit actions
+ `string` with `enum` - selectbox
+ `password` - password field
+ `date` - input type date
+ `datetime` - input type datetime
+ `integer` / `float` - input type number
+ `boolean` - checkbox
+ `text` - textarea.

**If you will conbine `text` type with `editor` option for the field admin panel will create a WYSTYG editor for this field.**

## Select box

Sails.js Hook adminpanel supports selectboxes.

If you have `enum` field in your model it will be displayed into adminpanel as a select box.
You can overwrite `enum` title using fields configurations:

Example:

Your model:
```
module.exports = {
    attributes: {
        gender: {
            type: 'string',
            enum: ['male', 'female'],
            required: true
        }
    }
};
```

You admin panel configuration:
```
module.exports.adminpanel = {
    instances: {
        users: {
            title: 'Users', // Menu title for instance
            model: 'User', // Model definition for instance

            fields: {
                'gender': {
                    enum: {
                        male: 'Male',
                        female: 'Female'
                    }
                }
            }
        }
    }
}
```

## Associations

Now Adminpanel hook partially supports assotiations.

Adminpanel determinates such fields by waterline configuration.
Right now if you model field have such configuration:

```javascript
fieldName: {
    model: 'SomeModel'
}
```

Admin panel will create select list for `add/edit` actions and will populate record for `list/view` actions.

Available configuration options:
+ `title` - Default title option
+ `identifierField` - **Optional** Identifyer field name that will be stored into field. Default: `id`
+ `displayField` - **Optional** Field name that will be used to show record name. *Will be displayed into select list*. Default: `id`

Example:
```javascript
owner: {
    title: 'Owner',
    identifierField: 'id',
    displayField: 'email' // Owner emails will be displayed into list and view/list screen
}
```

## Limitations

+ For now admin panel do not fully support waterline associations. So some fields might be ignored ! It's planned.
+ No file upload functionality. Due to the nature of `skipper` I removed file upload functionality. **Not tested with latest one**
+ No custom actions support. For now you couldn't add custom actions and pages into admin panel.
+ No template engine support except of `jade`. I primary working with this template engine and didn't create a another templates
+ No custom assets support. You couldn't edit css/js for admin panel for now.
