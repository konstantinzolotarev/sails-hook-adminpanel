# Navigation editor

Navigation editor is a widget, that allows you to create and edit menu lists.
You can move elements wherever you want using sortable or arrow buttons,
create nested levels of them by inserting one element into another with
sortable-lists or parent selector, which is inside pop-up.

```javascript
navigation: {
    title: "Навигация",
        model: "navigation",
        fields: {
        menu: {
                title: "Редактор меню", 
                type: "menu",
                opts: {
                    maxNestedLevel: number,
                    displacementControl: boolean,
                    propertyList: {}
                }
        }
        },
        createdAt: false,
            updatedAt: false
    }
```

Navigation editor has opts field where you can add next properties:
+ maxNestedLevel
+ displacementControl
+ propertyList

Using propertyList you can add list of properties that can be chosen.
It can contain three types of properties: string, boolean and number.

For example:
```javascript
propertyList: {
    title: {
            type: "string", 
            title: "Title",
            description: "this is the title",
            required: "true",
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

Using maxNestedLevel you can choose max number of nested elements.

For example:
```javascript
maxNestedLevel: 4
```

Using displacementControl you can forbid using sortable 
if element has inserted elements.

For example:
```javascript
displacementControl: true
```


