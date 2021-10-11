# Schedule editor

Schedule editor is a widget, that allows you to create and edit schedules.
You can choose day of week, time, date, break and add some other options in 
pop-up. With sortable.ui you can grab editors and move them wherever you want.

```javascript
module.exports.adminpanel = {
    fields: {
        schedule: {
            title: "Редактор распорядка",
            type: "worktime",
            opts: {
                propertyList: {},
                permutations: {}
            }
        }
    }
}
```

Schedule editor has opts field where you can add next properties:
+ propertyList
+ permutations

Using propertyList you can add list of properties that can be chosen.
It can contain three types of properties: string, boolean and number.

For example:
```javascript
propertyList: {
    title: {
            type: "string", 
            title: "Title",
            description: "this is the title",
    },
    checkmark: {
            type: "boolean",
            title: "Checkmark",
            description: "this is the checkmark",
    },
    age: {
            type: "number",
            title: "Age",
            description: "this is the age",
    },
}
```

Using permutations you can forbid or allow displaying data, 
time or break fields. Also, you can forbid or allow displaying
the pop-up (modal window) where you can edit options field.

For example:
```javascript
permutations = {
      time: true,
      date: true,
      break: true,
      options: true,
    };
```


