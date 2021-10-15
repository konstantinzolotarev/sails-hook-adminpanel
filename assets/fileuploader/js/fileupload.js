class File_ {
    constructor(id, name, url, urlS, urlL, width, height, size, sizes, title, descritpion, year, author) {
        this.id = id;
        this.name = name;
        this.url = url;
        this.urlS = urlS;
        this.urlL = urlL;
        this.width = width;
        this.height = height;
        this.size = size;
        this.sizes = sizes;

        this.title = title || name.substr(0, name.lastIndexOf('.'));
        this.description = descritpion || '';
        this.year = year || new Date().getFullYear();
        this.author = author || '';
    }
}

class FileUploader {
    constructor(config) {
        // init values
        this.type = config.type;
        this.elName = config.element;
        this.url = config.url;
        this.acceptedFiles = config.acceptedFiles;
        this.dataInput = config.data;
        this.small = config.small;
        this.large = config.large;
        this.field = config.field;
        this.filesize = config.filesize;
        this.resize = config.resize;
        this.aspect = config.aspect;

        this.files = [];
        this.el = $('#' + this.elName);

        if (this.type === 'images') {
            const ci = config.images;
            if (ci.dataPreview)
                if ($('#' + ci.dataPreview))
                    this.dataPreview = ci.dataPreview;
            this.aspect = config.aspect;
            this.size = config.size;
            try {
                this.size.width = JSON.parse(this.size.width);
            } catch (e) {}
            try {
                this.size.height = JSON.parse(this.size.height);
            } catch (e) {}
        }
        if (this.type === 'image') {
            this.aspect = config.aspect;
            this.size = config.size;
            try {
                this.size.width = JSON.parse(this.size.width);
            } catch (e) {}
            try {
                this.size.height = JSON.parse(this.size.height);
            } catch (e) {}
        }

        if (!this.acceptedFiles)
            this.acceptedFiles = '*';
        else
            this.acceptedFiles = this.acceptedFiles.map(function(x) {
                return "." + x;
            });
        this.acceptedFiles = this.acceptedFiles.join(', ');

        const fu = this;

        // add progress, gallery, dropzone and modal
        const modalDOM = [
            '<div id="file-info-modal-' + this.elName + '" class="modal">\n' +
            '  <div class="modal-dialog modal-lg" role="dialog" aria-hidden="true">\n' +
            '    <div class="modal-content">\n' +
            '      <div class="modal-header"></div>\n' +
            '      <div class="modal-body"><img id="file-image" class="block-center"/>\n' +
            '        <div class="info">\n' +
            '          <div class="form-group">\n' +
            '            <label for="name" class="col-md-2">File name:</label>\n' +
            '            <label id="name-' + this.elName + '" class="col-md-8"></label>\n' +
            '          </div>\n' +
            '          <div class="form-group">\n' +
            '            <label for="dimensions" class="col-md-2">File dimensions:</label>\n' +
            '            <label id="dimensions-' + this.elName + '" class="col-md-8"></label>\n' +
            '          </div>\n' +
            '          <div class="form-group">\n' +
            '            <label for="size" class="col-md-2">File size:</label>\n' +
            '            <label id="size-' + this.elName + '" class="col-md-8"></label>\n' +
            '          </div>\n' +
            '          <div class="form-group">\n' +
            '            <label for="url">URL:</label>\n' +
            '            <input id="url-' + this.elName + '" type="text" readonly="readonly" class="form-control"/>\n' +
            '          </div>\n' +
            '          <div class="form-group">\n' +
            '            <label for="title">Title:</label>\n' +
            '            <input id="title-' + this.elName + '" type="text" class="form-control"/>\n' +
            '          </div>\n' +
            '          <div class="form-group">\n' +
            '            <label for="desc">Description:</label>\n' +
            '            <input id="desc-' + this.elName + '" type="text" class="form-control"/>\n' +
            '          </div>\n' +
            '          <div class="form-group">\n' +
            '            <label for="year">Year:</label>\n' +
            '            <input id="year-' + this.elName + '" type="text" class="form-control"/>\n' +
            '          </div>\n' +
            '          <div class="form-group">\n' +
            '            <label for="author">Author:</label>\n' +
            '            <input id="author-' + this.elName + '" type="text" class="form-control"/>\n' +
            '          </div>\n' +
            '        </div>\n' +
            '      </div>\n' +
            '      <div class="modal-footer">\n' +
            '        <button id="file-uploader-save-' + this.elName + '" class="btn btn-success" type="button">Save</button>\n' +
            '        <button id="file-uploader-close-' + this.elName + '" class="btn btn-danger" type="button">Close</button>\n' +
            '      </div>\n' +
            '    </div>\n' +
            '  </div>\n' +
            '  <div class="modal-backdrop" aria-hidden="true"></div>' +
            '</div>'
        ];
        this.progressDiv = "<div class='progress-bar'></div>";
        const contId = this.elName + '-container';
        const containerDiv = "<div class='container' id='" + contId + "'></div>";
        const dzId = this.elName + '-dropzone';
        const dzDiv = "<form method='post' id=" + dzId + " class='dropzone dropzone-fileuploader'></form>";
        this.el.append(this.progressDiv, containerDiv, dzDiv, modalDOM[0]);
        $('#file-info-modal-' + this.elName).hide();
        this.container = $('#' + contId);
        this.fileContainer = this.elName + '-file-container';
        this.previewName = this.elName + '-preview';

        // init dropzone
        Dropzone.autoDiscover = false;
        const myDropzone = new Dropzone('#' + dzId, {
            url: this.url,
            acceptedFiles: this.acceptedFiles,
            maxFiles: (this.type === 'image' || this.type === 'file') ? 1 : null,
            maxFilesize: this.filesize,
            addRemoveLinks: true,
            timeout: 240000,
            sending: (file, xhr, data) => {
                // send filename and type
                data.append("filename", file.name);
                data.append("type", fu.type);
                data.append("small", fu.small);
                data.append("large", fu.large);
                data.append("resize", JSON.stringify(fu.resize));
                data.append("field", fu.field);
                data.append("stop", file.stop);
                data.append("aspect", JSON.stringify(fu.aspect));
                data.append("size", JSON.stringify(fu.size));
            },
            success: (file, res) => {
                // create new file
                const f = new File_(fu.files.length, res.name, res.url, res.urlSmall, res.urlLarge, res.width, res.height, res.size, res.urls);
                fu.files.push(f);
                // add in html
                fu.addFile(f);
                // remove from dropzone
                $(file.previewElement).remove();
            },
            queuecomplete: () => {
                $('.dz-message').css({ 'display': 'block' });
            },
            maxfilesexceeded: (file) => {
                // if there must by only one file, delete others
                myDropzone.removeAllFiles();
                myDropzone.addFile(file);
            },
            thumbnail: function(file) {
                const t = this;
                file.previewElement.addEventListener("click", function() {
                    t.removeFile(file);
                });
            }
        });

        // make sortable items
        if (this.type === 'images' || this.type === 'files')
            this.container.sortable({
                tolerance: 'pointer',
                stop: () => {
                    this.saveData();
                }
            });

        this.setListeners();
        this.loadData();
    }

    addFile(file) {
        const check = this.dataPreview ?
            "    <i class='las la-check' title='Pick as primary'></i>" : "";
        const control =
            "  <div class='item-control'>" +
            check +
            "    <i class='las la-times' title='Delete file'></i>" +
            "  </div>";
        let item = "";
        console.log(this.type)
        if (this.type === 'file' || this.type === 'files') {
            item =
                "<div class='" + this.fileContainer + " file-container'>" +
                "  <div class='item-file'>" +
                "    <img src=" + file.urlS + " id='" + file.id + "'>" +
                "     <div class='fileuploader_name'>" + file.name + "</div>" +
                "  </div>" + control +
                "</div>";

        } else if (this.type === 'image' || this.type === 'images') {
            item =
                "<div class='" + this.fileContainer + " file-container'>" +
                "  <div class='item-image'>" +
                "    <img src=" + file.urlS + " id='" + file.id + "'>" +
                "  </div>" + control +
                "</div>";

        }

        /*
        How it looks

        <div class='file-container' data-toggle='modal' data-target='#myModal'"
          <div class='item-control'>
            <i class='las la-check' title='Pick as primary'></i>
            <i class='las la-times' title='Delete file'></i>
          </div>
          <div class='item-image'>
            <img src="">
          </div>
        </div>

         */
        if (this.type === 'image' || this.type === 'file')
            this.container.empty();
        this.container.append(item);

        // make first image preview
        if (this.files.length === 1) {
            if (this.dataPreview) {
                const i = $('.' + this.fileContainer);
                i.addClass('preview');
                i.addClass(this.previewName);
            }
        }

        // const t = this;
        setTimeout(() => this.saveData(), 100);
        this.setListeners();
    }

    setModalFile(file) {
        // set data in modal
        $('.modal-header').text(file.name);
        const body = '.modal-body #';

        // static data
        $(body + 'file-image').attr('src', file.urlL);
        $(body + 'name').text(file.name);
        let d;
        if (this.type === 'images' || this.type === 'image')
            d = file.width + 'x' + file.height;
        else
            d = '-----';
        $(body + 'dimensions-' + this.elName).text(d);
        $(body + 'size-' + this.elName).text(file.size);
        $(body + 'url-' + this.elName).val(window.location.hostname + file.url);

        // dynamic data
        $(body + 'title-' + this.elName).val(file.title);
        $(body + 'desc-' + this.elName).val(file.description);
        $(body + 'year-' + this.elName).val(file.year);
        $(body + 'author-' + this.elName).val(file.author);

        // save changes
        $('#file-uploader-save-' + this.elName).click(() => {
            file.title = $(body + 'title-' + this.elName).val();
            file.description = $(body + 'desc-' + this.elName).val();
            file.year = $(body + 'year-' + this.elName).val();
            file.author = $(body + 'author-' + this.elName).val();
            this.saveData();
            $('#file-info-modal-' + this.elName).hide();
        });
        // save changes
        $('#file-uploader-close-' + this.elName).click(() => {
            $('#file-info-modal-' + this.elName).hide();
        });
    }

    setListeners() {
        // make click for modal
        const fu = this;
        $('.' + this.fileContainer + ' > .item-image').click(function() {
            const fileEl = $(this).find('img');
            const id = fileEl.attr('id');
            const file = fu.files[id];
            fu.setModalFile(file);
            $('#file-info-modal-' + fu.elName).show();
        });

        $('.' + this.fileContainer + ' > .item-file').click(function() {
            const fileEl = $(this).find('img');
            const id = fileEl.attr('id');
            const file = fu.files[id];
            fu.setModalFile(file);
            $('#file-info-modal-' + fu.elName).show();
        });


        // make picture preview
        $('.' + this.fileContainer + ' > .item-control > .la-check').click(function() {
            const fc = $('.' + fu.fileContainer);
            fc.removeClass('preview');
            fc.removeClass(fu.previewName);
            $(this).parents('.' + fu.fileContainer).addClass('preview');
            $(this).parents('.' + fu.fileContainer).addClass(fu.previewName);
            fu.saveData();
        });

        // delete item
        $('.' + this.fileContainer + ' > .item-control > .la-times').click(function() {
            $(this).parents('.' + fu.fileContainer).remove();
            fu.saveData();
        });
    }

    saveData() {
        // save general data
        let data = [];
        const fu = this;
        $('.' + this.fileContainer).each((i, item) => {
            const ind = $(item).find('img').attr('id');
            data.push(fu.files[ind]);
        });
        $('#' + this.dataInput).val(JSON.stringify(data));

        // save preview
        if (this.dataPreview) {
            const id = $('.' + this.previewName).find('img').attr('id');
            const previewUrl = this.files[id].url;
            $('#' + this.dataPreview).val(previewUrl);
        }
    }

    loadData() {
        const data = $('#' + this.dataInput).val();
        if (data) {
            try {
                const files = JSON.parse(data);
                if (Array.isArray(files)) {
                    files.forEach((i) => {
                        const f = new File_(this.files.length, i.name, i.url, i.urlS, i.urlL, i.width, i.height, i.size, i.sizes,
                            i.title, i.description, i.year, i.author);
                        this.files.push(f);
                        this.addFile(f);
                    });
                }
            } catch (e) {}

            const preview = $('#' + this.dataPreview).val();
            if (preview) {
                $('.' + this.fileContainer).each((i, item) => {
                    const url = $(item).find('img').attr('src').replace('_tumblrDEFAULT', '');
                    if (url === preview) {
                        $('.' + this.fileContainer).removeClass('preview');
                        $(item).addClass('preview');
                        $(item).addClass(this.previewName);
                    }
                });
            }
        }
    }
}