class EditNavigation {
    constructor(config) {
        this.elName = config.element;
        this.field = config.field;
        this.dataInput = config.data;

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
        let modal = '<div className="modal fade" id="popUp">' +
                        '<div className="modal-dialog modal-dialog-centered" role="dialog">' +
                            '<div className="modal-content">' +
                                '<div className="modal-header">' +
                                    'Header' +
                                '</div>' +
                                '<div className="modal-body">' +
                                    '<div id="data-hint" style="display: none;">' +
                                        '<label htmlFor="itemHint">Hint</label>' +
                                        '<input type="text" id="itemHint">' +
                                        '<a href="#" className="applyToAll">Apply to all</a>' +
                                    '</div>' +
                                    '<div id="data-link" style="display: none;">' +
                                        '<label htmlFor="itemLink">Link</label>' +
                                        '<input type="text" id="itemLink">' +
                                        '<a href="#" className="applyToAll">Apply to all</a>' +
                                    '</div>' +
                                    '<div id="data-title" style="display: none;">' +
                                        '<label htmlFor="itemTitle">Title</label>' +
                                        '<input type="text" id="itemTitle">' +
                                        '<a href="#" className="applyToAll">Apply to all</a>' +
                                    '</div>' +
                                    '<div id="data-something" style="display: none;">' +
                                        '<label htmlFor="itemSomething">Something</label>' +
                                        '<input type="text" id="itemSomething">' +
                                        '<a href="#" className="applyToAll">Apply to all</a>' +
                                        '<a href="#" className="deleteProp">[X]</a>' +
                                    '</div>' +
                                    '<div>' +
                                        '<label htmlFor="parentSelector">Choose parent</label>' +
                                        '<select className="form-select" id="parentSelector" aria-label="Default select example">' +
                                        '</select>' +
                                    '</div>' +
                                    '<div>' +
                                        '<label htmlFor="propertyAdder">Add property</label>' +
                                        '<select className="form-select" id="propertyAdder" aria-label="Default select example">' +
                                        '</select>' +
                                        '<a className="addProperty" href="#">Add</a>' +
                                    '</div>' +
                                '</div>' +
                                '<div className="modal-footer">' +
                                    '<a className="editItem btn btn-success" data-dismiss="modal" itemID="" href="#">Save</a>' +
                                    '<a className="close-btn btn btn-danger" data-dismiss="modal" href="#">Cancel</a>' +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                    '</div>';
        // $(`#form-${this.field}`).after(modal);
        // $('#popUp').hide();

        // getAttr() creates jquery method .getAttr(), that gives an object with attributes and their values
        this.getAttr();

        // handlers for modal window
        $('#sortableList').on('click', '.popUpOpen', function() { menu.fillPopUp(this) });
        $('#popUp').on('click', '.addProperty', function() { menu.addProperty() });
        $('#popUp').on('click', '.deleteProp', function() { menu.deleteProp(this) });
        $('#popUp').on('click', '.applyToAll', function() { menu.applyToAll(this) });
        $('#popUp').on('click', '.editItem', function() { menu.editItem() });
        $('.close-btn').on('click', function() { menu.cleanSelects() });

        // add closing modal window using click and esc
        $(document).keydown(function(e) {
            if (e.keyCode === 27) {
                e.stopPropagation();
                menu.cleanSelects();
            }
        });
        $('.modal').click(function(e) {
            if ($(e.target).closest('.modal-body').length === 0) {
                menu.cleanSelects();
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
        $('.modal-body > div[id^="data-"]').each(function(index, element) {
            if ($(element).attr('id') === $('#propertyAdder').val()) {
                $(element).show();
                $('li[id^="item_"]').attr($('#propertyAdder').val(), "");
                $('#propertyAdder option:selected').remove();

            }
        })
        this.saveChanges();
    }

    deleteProp(prop) {
        $(prop).parent().hide();
        $('li[id^="item_"]').removeAttr($(prop).parent().attr('id'));
        this.saveChanges();
    }

    applyToAll(prop) {
        $('li[id^="item_"]').attr($(prop).parent().attr('id'), $(prop).siblings('input').val());
        if ($(prop).parent().attr('id') === 'data-title') {
            $('li[id^="item_"] > div > label').text($(prop).siblings('input').val())
        }
    }

    addItem() {
        $('#sortableList').append('<li id="item_new" class="list-group-item" data-hint="Whatever you want here" data-link="/" data-title="New element">' +
            '<div><label>New element</label>' +
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
        this.cleanSelects();
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

    fillPopUp(item) {
        let attributes = $(item).parent().parent().getAttr(); // getAttr() gives an object with attributes and their values
        let itemId;
        for (let [key, value] of Object.entries(attributes)) {
            if (key === 'id') {
                itemId = value;
                $(".editItem").attr('itemid', value);
            }
            $(".modal-body").children().each(function(index, element) {
                if ($(element).getAttr().id === key) {
                    $('> input', element).val(value);
                    $(element).show();
                }
            })
        }
        $('#parentSelector').append($('<option>', {
            value: 'global',
            text: 'global'
        }))
        $('li[id^="item_"]').each(function(index, element) {
            console.log($(element).attr('id'), ($('#' + $(element).attr('id')).parentsUntil('#sortableList').length) + 2)
            if ($(element).attr('id') !== itemId && (($('#' + $(element).attr('id')).parentsUntil('#sortableList').length) + 2)/2 < 3) {// there will be nesting value, maxLevel = 3
                $('#parentSelector').append($('<option>', {
                    value: $(element).attr('id'),
                    text: $(element).attr('id')
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

    cleanSelects() {
        $('#parentSelector').empty();
        $('#propertyAdder').empty();
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
                if((hint.parentsUntil('#sortableList').length)/2 >= 3) { // there will be nesting value, maxLevel = 3
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