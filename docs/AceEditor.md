# Ace editor


```javascript
module.exports.adminpanel = {
    instances: {
        users: {
            title: 'Users', 
            model: 'User', 

            add: {
                biography: {
                    type: 'json',
                    widget: 'Ace', // type of widget
                    Ace: { // widget configuration
                        height: 500,  // px
                        fontSize: 16, //  px
                        disabled: false, // mark field is disabled (default: false)
                        required: true // mark field as required (default: false)
                    }
                }         
            }
        }
    }
}
```
