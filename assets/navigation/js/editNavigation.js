class EditNavigation {
    constructor(config) {
        this.elName = config.element;
        this.field = config.field;
        this.dataInput = config.data;
        this.counter = 0;
        this.maxNestedItems = 3;

        this.logConfig();
        this.main(this);
    }

    main(menu) {

        // if textarea has value { render ul } else { add empty ul }
        if ($(`#form-${this.field}`).val() && $(`#form-${this.field}`).val().startsWith('[{')) {
            let list = this.createDOM(JSON.parse($(`#form-${this.field}`).val()));
            $(list).attr('id', 'sortableList').addClass('list-group list-group-flush').width('max-content');
            $(`#form-${this.field}`).before(list);
        } else { // use here empty ul
            $(`#form-${this.field}`).before('<ul class="list-group list-group-flush" id="sortableList" style="width: max-content;"></ul>')
        }

        // set options to sortableList
        $('#sortableList').sortableLists(this.getOptions());

        // creates jquery method toHierarchy, that gives creates json from sortable list
        this.listToHierarchy();

        // handlers for sortableList items
        $('#sortableList').on('click', '.deleteItem', function() { menu.deleteItem(this) });
        $('#sortableList').on('click', '.itemUp', function() { menu.itemUp(this) });
        $('#sortableList').on('click', '.itemDown', function() { menu.itemDown(this) });

        // add "Add item button"
        $(`#form-${this.field}`).before('<button type="button" id="addBtn" class="btn">Add element</button>')

        // handler for add button
        $('#addBtn').on('click', function() { menu.addItem() });

        // create modal window, append it and hide
        let modal = '<div class="modal fade" id="popUp">' +
            '<div class="modal-dialog modal-dialog-centered" role="dialog">' +
            '<div class="modal-content">' +
            '<div class="modal-header">' +
            'Header' +
            '</div>' +
            '<div class="modal-body">' +
            '<div>' +
            '<label for="parentSelector">Choose parent</label>' +
            '<select class="form-select" id="parentSelector" aria-label="Default select example">' +
            '</select>' +
            '</div>' +
            '<div>' +
            '<label for="propertyAdder">Add property</label>' +
            '<input type="text" id="propertyAdder" placeholder="Just words and numbers without spaces and special characters">' +
            '<a class="addProperty" href="#">Add</a>' +
            '</div>' +
            '</div>' +
            '<div class="modal-footer">' +
            '<a class="editItem btn btn-success" data-dismiss="modal" itemID="" href="#">Save</a>' +
            '<a class="close-btn btn btn-danger" data-dismiss="modal" href="#">Cancel</a>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>';
        $(`#form-${this.field}`).after(modal);
        $('#popUp').hide();

        // getAttr() creates jquery method .getAttr(), that gives an object with attributes and their values
        this.getAttr();

        // handlers for modal window
        $('#sortableList').on('click', '.popUpOpen', function() { menu.fillPopUp(this, menu) });
        $('#popUp').on('click', '.addProperty', function() { menu.addProperty() });
        $('#popUp').on('click', '.deleteProp', function() { menu.deleteProp(this) });
        $('#popUp').on('click', '.editItem', function() { menu.editItem() });
        $('.close-btn').on('click', function() { menu.clearPopup() });

        // add closing modal window using click and esc
        $(document).keydown(function(e) {
            if (e.keyCode === 27) {
                e.stopPropagation();
                menu.clearPopup();
            }
        });
        $('.modal').click(function(e) {
            if ($(e.target).closest('.modal-body').length === 0) {
                menu.clearPopup();
            }
        });
    }

    logConfig() {
        console.log(this.elName, this.field, this.dataInput);
    }

    saveChanges() {
        $(`#form-${this.field}`).val(JSON.stringify($('#sortableList').toHierarchy()));
        this.dataInput = $(`#form-${this.field}`).val();
        this.logConfig();
        // let replica = this.createDOM(JSON.parse($(`#form-${this.field}`).val()));
        // console.log(replica);
    }

    createDOM(data) {
        let ul = document.createElement('ul');
        for (let item of data) {
            $(ul).append(`<li id="${item.id}" class="list-group-item" data-hint="" data-link="" data-title="">` +
                `<div><label>${item.title}</label><a href="#" class="clickable itemUp btn btn-sm">[↑]</a>` +
                '<a href="#" class="clickable itemDown btn btn-sm">[↓]</a>' +
                '<a href="#" class="clickable popUpOpen btn btn-sm" data-toggle="modal" data-target="#popUp">[Edit]</a>' +
                `<a href="#" class="clickable deleteItem btn btn-sm">[X]</a></div>` +
                '</li>');
            for (let [key, value] of Object.entries(item)) {
                if (key !== 'id' && key !== 'order' && key !== 'children') {
                    $(' > li[id=' + item.id + ']', ul).attr(`data-${key}`, value);
                }
            }
            if (item.children.length > 0) {
                $(" > li[id=" + item.id + "]", ul).append(this.createDOM(item.children));
            }
        }
        return ul;
    }

    giveItemsUniqueId() {
        $('li[id^="item_"]').each(function (index, element) {
            $(element).attr('id', "item_" + index);
        })
    }

    addProperty() {
        let input = $('#propertyAdder').val().trim();
        if (input.match(/^[0-9A-Za-zа-яА-ЯёЁ]+$/) == null) {
            alert("Property can't contain whitespaces and special characters");
        } else {
            let property = input.charAt(0).toUpperCase() + input.slice(1);
            $("#propertyAdder").parent().before(`<div id="data-${property.charAt(0).toLowerCase() + input.slice(1)}">` +
                `<label for="item${property}">${property}</label>` +
                `<input type="text" id="item${property}">` +
                '<a href="#" class="deleteProp">[X]</a>' +
                '</div>');
            $('li[id^="item_"]').attr(`data-${property}`, "");
            this.saveChanges();
            $('#propertyAdder').val('');
        }
    }

    deleteProp(prop) {
        $('li[id^="item_"]').removeAttr($(prop).parent().attr('id'));
        $(prop).parent().hide();
        this.saveChanges();
    }

    addItem() {
        $('#sortableList').append(`<li id="item_new" class="list-group-item" data-title="New element #${this.counter}">` +
            `<div><label>New element #${this.counter}</label>` +
            '<a href="#" class="clickable itemUp btn btn-sm">[↑]</a>' +
            '<a href="#" class="clickable itemDown btn btn-sm">[↓]</a>' +
            '<a href="#" class="clickable popUpOpen btn btn-sm" data-toggle="modal" data-target="#popUp">[Edit]</a>' +
            '<a href="#" class="clickable deleteItem btn btn-sm">[X]</a>' +
            '</div>' +
            '</li>');
        for (let key of Object.keys($('#sortableList > li').getAttr())) {
            if ($('#item_new').attr(key) === undefined) {
                $('#item_new').attr(key, "");
            }
        }
        this.counter++;
        this.giveItemsUniqueId();
        this.saveChanges();
    }

    deleteItem(item) {
        $(item).parent().parent().remove();
        this.saveChanges();
    }

    editItem() {
        let itemId = '#' + $('.modal-footer > .editItem').attr('itemid');
        $(' > div > label', itemId).text($('.modal-body > div[id="data-title"] > input').val());
        $('.modal-body > div').each(function(index, element) {
            if ($(element).is(":visible") && $(element).attr('id')) {
                $(itemId).attr($(element).attr('id'), $('input', element).val());
            }
        })
        if ($('#parentSelector').val() === 'global') {
            $('#sortableList').append($(itemId));
        } else if ($('#' + $('.modal-body > div > select').val()).children().length === 1) {
            $('#' + $('#parentSelector').val()).append(document.createElement('ul'));
            $('#' + $('#parentSelector').val() + ' > ul').append($(itemId));
        } else {
            $('#' + $('#parentSelector').val() + ' > ul').append($(itemId));
        }
        this.saveChanges();
        this.clearPopup();
    }

    itemUp(item) {
        let currentItem = $(item).parent().parent();
        let prevItem = $(currentItem).prev();  // returns prev item or empty jQuery object

        if (prevItem && prevItem.length > 0) {
            $(currentItem).insertBefore($(prevItem));
        }
        this.saveChanges();
    }

    itemDown(item) {
        let currentItem = $(item).parent().parent();
        let nextItem = $(currentItem).next();

        if (nextItem && nextItem.length > 0) {
            $(currentItem).insertAfter($(nextItem));
        }
        this.saveChanges();
    }

    fillPopUp(item, menu) {
        let attributes = $(item).parent().parent().getAttr(); // getAttr() gives an object with attributes and their values
        let itemId;
        for (let [key, value] of Object.entries(attributes)) {
            if (key === 'id') {
                itemId = value;
                $(".editItem").attr('itemid', value);
            } else if (key.startsWith('data-')) {
                if (key === 'data-title') { // here add obligatory properties
                    let capitalizedKey = key.slice(5).charAt(0).toUpperCase() + key.slice(6);
                    $("#propertyAdder").parent().before(`<div id="${key}">` +
                        `<label for="item${capitalizedKey}">${capitalizedKey}</label>` +
                        `<input type="text" id="item${capitalizedKey}" value="${value}">` +
                        '</div>')
                } else {
                    let capitalizedKey = key.slice(5).charAt(0).toUpperCase() + key.slice(6);
                    $("#propertyAdder").parent().before(`<div id="${key}">` +
                        `<label for="item${capitalizedKey}">${capitalizedKey}</label>` +
                        `<input type="text" id="item${capitalizedKey}" value="${value}">` +
                        '<a href="#" class="deleteProp">[X]</a>' +
                        '</div>')
                }
            }
        }
        $('#parentSelector').append($('<option>', {
            value: 'global',
            text: 'global'
        }))
        $('li[id^="item_"]').each(function(index, element) {
            console.log($(element).attr('id'), ($('#' + $(element).attr('id')).parentsUntil('#sortableList').length) + 2)
            if ($(element).attr('id') !== itemId && (($('#' + $(element).attr('id')).parentsUntil('#sortableList').length) + 2)/2 < menu.maxNestedItems) {// there will be nesting value, maxLevel = 3
                $('#parentSelector').append($('<option>', {
                    value: $(element).attr('id'),
                    text: $(element).attr('data-title')
                }))
            }
        })
        $('#parentSelector').children().each(function(index, element) {
            if ($(item).parent().parent().parent().parent().attr('id') === $(element).val()) {
                $(element).prop('selected', true)
            }
        })
        $('#propertyAdder').append($('<option>', {
            value: 'None',
            text: 'None'
        }))
        $('.modal-body > div[id^="data-"]').each(function(index, element) {
            if ($('#' + itemId).attr($(element).attr('id')) === undefined) {
                $('#propertyAdder').append($('<option>', {
                    value: $(element).attr('id'),
                    text: $(element).attr('id')
                }))
            }
        })
    }

    clearPopup() {
        $('.modal-body > div[id^="data-"]').remove()
        $('#parentSelector').empty();
        $('#propertyAdder').val('');
    }

    // function that replaces sortableListsToHierarchy function from original module
    listToHierarchy() {
        $.fn.toHierarchy = function()
        {
            var arr = [],
                order = 0;

            $( this ).children( 'li' ).each( function()
            {
                var li = $( this ),
                    listItem = {},
                    id = li.attr( 'id' );

                if ( ! id )
                {
                    console.log( li ); // Have to be here! Read next exception message.
                    throw 'Previous item in console.log has no id. It is necessary to create the array.';
                }
                listItem.id = id;
                let dataAttributes = {};
                for (let [key, value] of Object.entries($(li).getAttr())) {
                    if (key.startsWith('data-')) {
                        dataAttributes[key.slice(5)] = value;
                    }
                }
                for (let [key, value] of Object.entries(dataAttributes)) {
                    listItem[key] = value;
                }
                listItem.order = order;
                arr.push( listItem );
                listItem.children = li.children( 'ul,ol' ).toHierarchy();
                order ++;
            } );

            return arr;
        };
        return $.fn.toHierarchy;
    }

    // function that improves attr()
    getAttr() {
        $.fn.getAttr = function() {
            if(arguments.length === 0) {
                if(this.length === 0) {
                    return null;
                }

                var obj = {};
                $.each(this[0].attributes, function() {
                    if(this.specified) {
                        obj[this.name] = this.value;
                    }
                });
                return obj;
            }

            return ($.fn.attr).apply(this, arguments);
        };
        return $.fn.getAttr;
    }

    getOptions() {
        let menu = this;
        let options = {
            // Like a css class name. Class will be removed after drop.
            currElClass: 'currElemClass',

            placeholderClass: 'placeholderClass',

            hintClass: 'hintClass',

            listsClass: 'listsClass',

            // All elements with class clickable will be clickable
            ignoreClass: 'clickable',

            insertZone: 50,

            insertZonePlus: true,

            scroll: 20,

            opener: {
                active: true,
                as: 'html',  // or "class"
                close: '<i class="fa fa-minus"></i>', // or 'fa fa-minus'
                open: '<i class="fa fa-plus"></i>', // or 'fa fa-plus'
                openerCss: {
                    'display': 'inline-block', // Default value
                    'float': 'left', // Default value
                    'width': '18px',
                    'height': '18px',
                    'margin-left': '-35px',
                    'margin-right': '5px',
                    'background-position': 'center center', // Default value
                    'background-repeat': 'no-repeat' // Default value
                },
            },

            isAllowed: function(currEl, hint, target)
            {
                if((hint.parentsUntil('#sortableList').length)/2 >= menu.maxNestedItems) { // there will be nesting value, maxLevel = 3
                    hint.css('background-color', '#8B0000');
                    return false;
                }
                else {
                    hint.css('background-color', '#008000');
                    return true;
                }
            },

            onChange: function()
            {
                menu.saveChanges();
            }
        }
        return options;
    }
}