class EditNavigation {
    constructor(config) {
        this.elName = config.element;
        this.field = config.field;
        this.dataInput = config.data;
        this.counter = 0;
        this.maxNestedItems = config.maxNestedItems || 4;
        this.visibleElement = config.visibleElement || 'visible'; // can be 'visible', 'hidden', false
        this.titleProperties = config.titleProperties || 'title';
        let defaultPropertyList = {
            'title': {
                'type': 'string',
                'title': 'Title',
                'description': "this is the title",
                'required': 'true'
            },
            'visible': {
                'type': 'boolean',
                'title': 'Visible',
                'description': "element visibility",
                'required': 'true'
            },
            'link': {
                'type': 'string',
                'title': 'Link',
                'description': "this is the link"
            }
        };
        this.propertyList = config.propertyList || defaultPropertyList;
        this.displacementControl = config.displacementControl || true;

        //this.logConfig();
        this.main(this);
    }

    main(menu) {

        // if textarea has value { render ul } else { add empty ul }
        if ($(`#form-${this.field}`).val() && $(`#form-${this.field}`).val().startsWith('[{')) {
            let list = this.createDOM(JSON.parse($(`#form-${this.field}`).val()), menu);
            this.counter = 0;
            $(list).attr('id', 'sortableList').addClass('navigation-item').width('max-content');
            $(`#form-${this.field}`).before(list);
            if (this.visibleElement === false) {
                $('.navigation-eye').remove();
            } else {
                $('li[id^="item_"]').each(function() {
                    if ($(this).attr('data-visible') === 'false') {
                        $(` > div > div > .navigation-eye > .la-eye`, this).replaceWith('<i class="las la-eye-slash"></i>');
                    }
                })
            }
        } else { // use here empty ul
            $(`#form-${this.field}`).before('<ul class="navigation-item" id="sortableList" style="width: max-content;"></ul>')
        }

        // set options to sortableList
        $('#sortableList').sortableLists(this.getOptions());

        // creates jquery method toHierarchy, that gives creates json from sortable list
        this.listToHierarchy();

        // handlers for sortableList items
        $('#sortableList').on('click', '.deleteItem', function() { menu.deleteItem(this) });
        $('#sortableList').on('click', '.itemUp', function() { menu.itemUp(this) });
        $('#sortableList').on('click', '.itemDown', function() { menu.itemDown(this) });
        $('#sortableList').on('click', '.changeEye', function() { menu.changeEye(this) });

        // add "Add item button"
        $(`#form-${this.field}`).before('<button type="button" id="addBtn" class="btn">Add element</button>')

        // handler for add button
        $('#addBtn').on('click', function() { menu.addItem() });

        // create modal window, append it and hide
        let modal = '<div class="modal fade navigation-popup" id="popUp">' +
                        '<div class="modal-dialog modal-dialog-centered navigation-modal" role="dialog">' +
                            '<div class="modal-content">' +
                                '<div class="modal-header navigation-header">' +
                                '</div>' +
                                '<div class="modal-body">' +
                                    '<div class="navigation-block">' +
                                        '<div class="navigation-wrap">' +
                                            '<label for="parentSelector">Choose parent</label>' +
                                            '<select class="form-select navigation-select" id="parentSelector" aria-label="Default select example">' +
                                            '</select>' +
                                        '</div>' +
                                    '</div>' +
                                    '<div class="navigation-block">' +
                                        '<div class="navigation-wrap">' +
                                            '<label for="propertyAdder navigation-text">Add property</label>' +
                                            '<select class="form-select navigation-select" id="propertyAdder" aria-label="Default select example">' +
                                            '</select>' +
                                        '</div>' +
                                        '<a class="addProperty navigation-plus" href="#"><i class="las la-plus"></i></a>' +
                                    '</div>' +
                                '</div>' +
                                '<div class="modal-footer navigation-footer">' +
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
        $('#popUp').on('click', '.editItem', function() { menu.editItem(menu) });
        $('.close-btn').on('click', function() { menu.clearPopup() });

        // add closing modal window using click and esc
        $(document).keydown(function(e) {
            if (e.keyCode === 27) {
                e.stopPropagation();
                menu.clearPopup();
                $('#popUp').modal('hide');
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
        // this.logConfig();
        // let replica = this.createDOM(JSON.parse($(`#form-${this.field}`).val()));
        // console.log(replica);
    }

    createDOM(data, menu) {
        let ul = document.createElement('ul');
        $(ul).addClass("root-navigation");

        for (let item of data) {
            if (!item.id) { item.id = `item_${menu.counter}` }
            menu.counter++;
            $(ul).append(`<li id="${item.id}" class="navigation-list">` +
                `<div class="navigation-content">` +
                    `<div class="navigation-left">` +
                        `<a href="#" class="clickable navigation-eye changeEye">` +
                            '<i class="las la-eye"></i>' +
                        '</a>' +
                        `<label class="navigation-label">${item[this.titleProperties]}</label>` +
                    `</div>` +
                    `<div class="navigation-right">` +
                        `<a href="#" class="clickable navigation-btn navigation-arrow itemUp">` +
                            `<i class="las la-angle-up"></i>` +
                        `</a>` +
                        '<a href="#" class="clickable navigation-btn navigation-arrow itemDown">' +
                            '<i class="las la-angle-down"></i>' +
                        '</a>' +
                        '<a href="#" class="clickable navigation-btn navigation-edit popUpOpen" data-toggle="modal" data-target="#popUp">' +
                            '<i class="las la-pencil-alt"></i>' +
                        '</a>' +
                        `<a href="#" class="clickable navigation-btn navigation-close deleteItem">` +
                            '<i class="las la-times"></i>' +
                        '</a>' +
                    '</div>' +
                `</div>` +
                '</li>');
            for (let [key, value] of Object.entries(item)) {
                if (key !== 'id' && key !== 'order' && key !== 'children') {
                    $(' > li[id=' + item.id + ']', ul).attr(`data-${key}`, value);
                }
            }
            if (item.children && item.children.length > 0) {
                $(" > li[id=" + item.id + "]", ul).append(this.createDOM(item.children, menu));
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
        if ($('#propertyAdder').val() !== "None") {
            let typeRecognition = this.recognizeType($('#propertyAdder').val());
            let capitalizedKey = $('#propertyAdder').val().charAt(0).toUpperCase() + $('#propertyAdder').val().slice(1);
            $("#propertyAdder").closest('.navigation-block').before(`<div class="navigation-wrapper" id="data-${$('#propertyAdder').val()}">` +
                `<div class="navigation-inner">` +
                    `<label for="item${capitalizedKey}">${capitalizedKey}</label>` +
                    `<input type=${typeRecognition.inputType} id="item${capitalizedKey}">` +
                `</div>` +
                '<a href="#" class="deleteProp navigation-del"><i class="las la-times"></i></a>' +
                '</div>')
            if (typeRecognition.required === "true") {
                $(`data-${$('#propertyAdder').val()} > .deleteProp`).remove();
            }
            $('li[id^="item_"]').attr(`data-${$('#propertyAdder').val()}`, typeRecognition.defaultValue);
            $('#propertyAdder option:selected').remove();
            this.saveChanges();
        }
    }

    deleteProp(prop) {
        $('li[id^="item_"]').removeAttr($(prop).parent().attr('id'));
        $(prop).parent().hide();
        this.saveChanges();
    }

    addItem() {
        $('#sortableList').append(`<li id="item_new" class="navigation-list navigation-new" data-${this.titleProperties}='New element #${this.counter}'>` +
            `<div class="navigation-content">` +
                   '<div class="navigation-left">' +
                        '<a href="#" class="clickable navigation-eye changeEye">' +
                            '<i class="las la-eye"></i>' +
                        '</a>' +
                        `<label class="navigation-label">New element #${this.counter}</label>` +
                   `</div>` +
                   '<div class="navigation-right">' +
                        '<a href="#" class="clickable navigation-btn navigation-arrow itemUp">' +
                            '<i class="las la-angle-up"></i>' +
                        '</a>' +
                        '<a href="#" class="clickable navigation-btn navigation-arrow itemDown">' +
                            '<i class="las la-angle-down"></i>' +
                        '</a>' +
                        '<a href="#" class="clickable navigation-btn navigation-edit popUpOpen" data-toggle="modal" data-target="#popUp">' +
                            '<i class="las la-pencil-alt"></i>' +
                        '</a>' +
                        '<a href="#" class="clickable navigation-btn navigation-close deleteItem">' +
                            '<i class="las la-times"></i>' +
                        '</a>' +
                   '</div>' +
            '</div>' +
            '</li>');
        for (let key of Object.keys($('#sortableList > li').getAttr())) {
            if ($('#item_new').attr(key) === undefined) {
                let typeRecognition = this.recognizeType(key.slice(5))
                $('#item_new').attr(key, typeRecognition.defaultValue);
            }
        }
        if (this.visibleElement === 'hidden') {
            $('#item_new > div > div > .navigation-eye > .la-eye').replaceWith('<i class="las la-eye-slash"></i>');
            $('li[id="item_new"]').attr('data-visible', 'false')
        } else if (this.visibleElement === false) {
            $('#item_new > div > div > .navigation-eye').remove();
        } else {
            $('li[id="item_new"]').attr('data-visible', 'true')
        }
        this.counter++;
        this.giveItemsUniqueId();
        this.saveChanges();
    }

    deleteItem(item) {
        $(item).closest('li').remove();
        this.saveChanges();
    }

    recognizeType(inputValue) {
        let output = {
            'inputType': "",
            'defaultValue': "",
            'required': "false"
        }
        for (let [key, value] of Object.entries(this.propertyList)) {
            if (inputValue === key) {
                switch (value.type) {
                    case 'string':
                        output.inputType = "text";
                        output.defaultValue = "";
                        break;
                    case 'number':
                        output.inputType = "number";
                        output.defaultValue = 0;
                        break;
                    case "boolean":
                        output.inputType = "checkbox";
                        output.defaultValue = "false";
                        break;
                }

                if (value.required === 'true') {
                    output.required = "true"
                }
            }
        }
        return output;
    }

    editItem(menu) {
        let itemId = '#' + $('.modal-footer > .editItem').attr('itemid');
        $(' > div > div > label', itemId).text($(`.modal-body > div[id="data-${this.titleProperties}"] > div > input`).val());
        $('.modal-body > div').each(function(index, element) {
            if ($(element).is(":visible") && $(element).attr('id')) {
                if ((menu.recognizeType(($(element).attr('id')).slice(5))).inputType === 'checkbox') {
                    $(itemId).attr($(element).attr('id'), $(' > div > input', element).prop("checked"));
                    if (this.visibleElement !== false) {
                        if ($(element).attr('id') === 'data-visible') {
                            if ($(' > div > input', element).prop("checked") === true) {
                                $(`${itemId} > div > div > .navigation-eye > i`).attr('class', 'las la-eye');
                            } else {
                                $(`${itemId} > div > div > .navigation-eye > i`).attr('class', 'las la-eye-slash');
                            }
                        }
                    }
                } else {
                    $(itemId).attr($(element).attr('id'), $(' > div > input', element).val());
                }
            }
        })
        if ($('#parentSelector').val() === 'global') {
            $('#sortableList').append($(itemId));
        } else if ($('#' + $('#parentSelector').val()).children().length === 1) {
            $('#' + $('#parentSelector').val()).append(document.createElement('ul'));
            $('#' + $('#parentSelector').val() + ' > ul').addClass()
            $('#' + $('#parentSelector').val() + ' > ul').append($(itemId));
        } else {
            $('#' + $('#parentSelector').val() + ' > ul').append($(itemId));
        }
        this.saveChanges();
        this.clearPopup();
        $('#parentSelector').closest('.navigation-block').show();
    }

    itemUp(item) {
        let currentItem = $(item).closest('li');
        let prevItem = $(currentItem).prev();  // returns prev item or empty jQuery object

        if (prevItem && prevItem.length > 0) {
            $(currentItem).insertBefore($(prevItem));
        }
        this.saveChanges();
    }

    itemDown(item) {
        let currentItem = $(item).closest('li');
        let nextItem = $(currentItem).next();

        if (nextItem && nextItem.length > 0) {
            $(currentItem).insertAfter($(nextItem));
        }
        this.saveChanges();
    }

    changeEye(item) {
        let currentItem = $(item).closest('li');
        let currentEye = $(' > i', item);
        if ($(currentEye).attr('class') === 'las la-eye') {
            $(currentEye).attr('class', 'las la-eye-slash');
            $(currentItem).attr('data-visible', 'false')
        } else if ($(currentEye).attr('class') === 'las la-eye-slash') {
            $(currentEye).attr('class', 'las la-eye');
            $(currentItem).attr('data-visible', 'true')
        }
        this.saveChanges();
    }

    fillPopUp(item, menu) {
        let currentItem = $(item).closest('li');
        let attributes = $(currentItem).getAttr(); // getAttr() gives an object with attributes and their values
        let itemId;
        for (let [key, value] of Object.entries(attributes)) {
            if (key === 'id') {
                itemId = value;
                $(".editItem").attr('itemid', value);
            } else if (key.startsWith('data-')) {
                let typeRecognition = menu.recognizeType(key.slice(5));
                let capitalizedKey = key.slice(5).charAt(0).toUpperCase() + key.slice(6);
                $("#propertyAdder").closest('.navigation-block').before(`<div class="navigation-wrapper" id="${key}">` +
                    `<div class="navigation-inner">` +
                    `<label for="item${capitalizedKey}">${capitalizedKey}</label>` +
                    `<input type=${typeRecognition.inputType} id="item${capitalizedKey}">` +
                    `</div>` +
                    '<a href="#" class="deleteProp navigation-del"><i class="las la-times"></i></a>' +
                    '</div>')
                if (typeRecognition.inputType === 'checkbox') {
                    if (value === 'true') {
                        $(`#${key} > div > input`).prop("checked", "checked");
                    }
                } else {
                    $(`#${key} > div > input`).attr('value', value);
                }
                if (typeRecognition.required === "true") {
                    $(`#${key} > .deleteProp`).remove();
                }
            }
        }
        // cant move items with children if displacementControl on
        if (menu.displacementControl) {
            if ($(currentItem).children().length === 1) {
                menu.fillParentSelector(itemId, menu.maxNestedItems, menu);
            } else {
                $('#parentSelector').closest('.navigation-block').hide();
            }
        } else {
            menu.fillParentSelector(itemId, menu.maxNestedItems, menu);
        }
        $('#parentSelector').children().each(function(index, element) {
            if ($(currentItem).parent().parent().attr('id') === $(element).val()) {
                $(element).prop('selected', true)
            }
        })
        $('#propertyAdder').append($('<option>', {
            value: 'None',
            text: 'None'
        }))
        let proposedList = {};
        for (let [item, value] of Object.entries(this.propertyList)) {
            let unique = true;
            for (let key of Object.keys($('#' + itemId).getAttr())) {
                if (`data-${item}` === key) {
                    unique = false;
                    break;
                }
            }
            if (unique === true) {
                proposedList[item] = value;
            }
        }
        for (let [item, value] of Object.entries(proposedList)) {
            $('#propertyAdder').append($('<option>', {
                value: item,
                text: value.title
            }))
        }
    }

    fillParentSelector(itemId, maxNestedItems, menu) {
        $('#parentSelector').append($('<option>', {
            value: 'global',
            text: 'global'
        }))
        $('li[id^="item_"]').each(function(index, element) {
            let nestedLevel = $('#' + $(element).attr('id')).parentsUntil('#sortableList').length;
            if ($(element).attr('id') !== itemId && (nestedLevel + 2)/2 < maxNestedItems) {// there will be nesting value, maxLevel = 3
                $('#parentSelector').append($('<option>', {
                    value: $(element).attr('id'),
                    text: '- '.repeat(nestedLevel/2) + $(element).attr(`data-${menu.titleProperties}`)
                }))
            }
        })
    }

    clearPopup() {
        $('.modal-body > div[id^="data-"]').remove();
        $('#parentSelector').empty();
        $('#propertyAdder').empty();
        $('#parentSelector').closest('.navigation-block').show();
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
                close: '<i class="las la-angle-up"></i>', // or 'fa fa-minus'
                open: '<i class="las la-angle-down"></i>', // or 'fa fa-plus'
            },

            isAllowed: function(currEl, hint, target) {
                if (menu.displacementControl) {
                    if ($(currEl).children().length === 1) {
                        if((hint.parentsUntil('#sortableList').length)/2 >= menu.maxNestedItems) { // there will be nesting value, maxLevel = 3
                            hint.css('background-color', '#8B0000');
                            return false;
                        }
                        else {
                            hint.css('background-color', '#008000');
                            return true;
                        }
                    } else {
                        hint.css('background-color', '#8B0000');
                        return false;
                    }
                } else {
                    if((hint.parentsUntil('#sortableList').length)/2 >= menu.maxNestedItems) { // there will be nesting value, maxLevel = 3
                        hint.css('background-color', '#8B0000');
                        return false;
                    }
                    else {
                        hint.css('background-color', '#008000');
                        return true;
                    }
                }
            },

            onChange: function()
            {
                menu.saveChanges();
            },
            start: function(e, ui){
                ui.placeholder.height(ui.item.height());
                ui.placeholder.css('visibility', 'visible');
            }
        }
        return options;
    }
}
