class EditNavigation {
    constructor(config) {
        this.elName = config.element;
        this.field = config.field;
        this.dataInput = config.data;
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

    getModal() {
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
                        '<div id="data-thing" style="display: none;">' +
                            '<label htmlFor="itemthing">thing</label>' +
                            '<input type="text" id="itemthing">' +
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
        $(`#form-${this.field}`).after(modal);
        $('#popUp').hide();
    }

    getSortableList() {
        if ($(`#form-${this.field}`).val() && $(`#form-${this.field}`).val().startsWith('[{')) {
            let list = this.createDOM(JSON.parse($(`#form-${this.field}`).val()));
            $(list).attr('id', 'sortableList').addClass('list-group list-group-flush').width('max-content');
            $('#addBtn').before(list);
        } else {
            $('#addBtn').before('<ul class="list-group list-group-flush" id="sortableList" style="width: max-content;">' +
                '<li id="item_1" class="list-group-item" data-hint="Whatever you want here" data-link="/" data-title="Home">' +
                    '<div><label>Home</label><a href="#" class="clickable itemUp btn btn-sm">[↑]</a>' +
                        '<a href="#" class="clickable itemDown btn btn-sm">[↓]</a>' +
                        '<a href="#" class="clickable popUpOpen btn btn-sm" data-toggle="modal" data-target="#popUp">[Edit]</a>' +
                        '<a href="#" class="clickable deleteItem btn btn-sm">[X]</a>' +
                        '</div></li><li id="item_2" class="list-group-item" data-hint="About page" data-link="#about" data-title="About us">' +
                    '<div><label>About us</label><a href="#" class="clickable itemUp btn btn-sm">[↑]</a>' +
                        '<a href="#" class="clickable itemDown btn btn-sm">[↓]</a>' +
                        '<a href="#" class="clickable popUpOpen btn btn-sm" data-toggle="modal" data-target="#popUp">[Edit]</a>' +
                        '<a href="#" class="clickable deleteItem btn btn-sm">[X]</a>' +
                        '</div></li><li id="item_3" class="list-group-item" data-hint="Feedback" data-link="#feedback" data-title="Feedback">' +
                    '<div><label>Feedback</label><a href="#" class="clickable itemUp btn btn-sm">[↑]</a>' +
                        '<a href="#" class="clickable itemDown btn btn-sm">[↓]</a>' +
                        '<a href="#" class="clickable popUpOpen btn btn-sm" data-toggle="modal" data-target="#popUp">[Edit]</a>' +
                        '<a href="#" class="clickable deleteItem btn btn-sm">[X]</a></div></li></ul>')
        }
    }

    // getHandlers() {
    //     $('#addBtn').on('click', function() { this.addItem() });
    //     $('#sortableList').on('click', '.deleteItem', function() { this.deleteItem(this) });
    //     $('#sortableList').on('click', '.itemUp', function() { this.itemUp(this) });
    //     $('#sortableList').on('click', '.itemDown', function() { this.itemDown(this) });
    //     $('#popUp').on('click', '.editItem', function() { this.editItem() });
    //     $('.close-btn').click(function() { this.cleanSelects() });
    //     $('#popUp').on('click', '.addProperty', function() { this.addProperty() });
    //     $('#popUp').on('click', '.deleteProp', function() { this.deleteProp(this) });
    //     $('#popUp').on('click', '.applyToAll', function() { this.applyToAll(this) });
    //     $('#sortableList').on('click', '.popUpOpen', function() { this.fillPopUp(this) });
    //
    //     $(document).keydown(function(e) {
    //         if (e.keyCode === 27) {
    //             e.stopPropagation();
    //             this.cleanSelects();
    //         }
    //     });
    //
    //     $('.modal').click(function(e) {
    //         if ($(e.target).closest('.modal-body').length === 0) {
    //             this.cleanSelects();
    //         }
    //     });
    // }
}