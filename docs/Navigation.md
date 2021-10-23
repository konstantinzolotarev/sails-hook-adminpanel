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
                    maxNestedItems: number,
                    displacementControl: boolean,
                    propertyList: {},
                    visibleElement: string or false,
                    titleProperties: string
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
+ visibleElement
+ titleProperties

Using propertyList you can add list of properties that can be chosen.
It can contain three types of properties: string, boolean and number.
Also, you have to declare there all properties that would be placed in
elements. And every element should have an id. Without ids DOM will not be
displayed properly.

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

Using maxNestedItems you can choose max number of nested elements.

For example:
```javascript
maxNestedItems: 4
```

Using displacementControl you can forbid using sortable 
if element has inserted elements.

For example:
```javascript
displacementControl: true
```

Using visibleElement you can set default value of visible
property. ```'visible'``` means that all elements will be
visible by default, ```'hidden``` means that they will be
hidden, ```false``` means that visible property is off.

For example:
```javascript
visibleProperty: false
```
or
```javascript
visibleProperty: 'hidden'
```

Using titleProperties you can set the property, that would
be title of the element. It would better be a word of a
collocation.

For example:
```javascript
titleProperties: 'label'
```
