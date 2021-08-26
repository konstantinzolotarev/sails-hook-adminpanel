# File uploader

File uploader is one of widgets admin panel. It allow upload files and images or single file and image

```javascript
module.exports.adminpanel = {
    instances: {
        users: {
            title: 'Users', 
            model: 'User', 

            fields: {
                email: 'User Email', 
                avatar: false,
            },
            add: {
                avatar: {
                    type: 'json',
                    widget: 'FilesUploader', // type of widget
                    FilesUploader: { // widget configuration
                        filesize: 2, 
                        accepted: ['pdf', 'avi']
                    }
                }         
            }
        }
    }
}
```

File uploader widget save files in `.tmp/public/admin/uploads/modelName/fieldName` and save data about file in field, that provide this widget

## Widget configuration

### Files Uploader
Provides widget for upload a many files. You can change order, add and remove files uses this widget. 
```metadata json
FilesUploader: { 
    filesize: number,  // max size of file in Mb, by default 1
    accepted: string[] // accepted extensions for upload
}
```

### File Uploader
Provides widget for upload only one file. If you upload new file, old will be forgotten

Config is like `Files Uploader `

### Gallery Uploader
Provides widget for upload a many images. Save image and a few resize. Default resize is small and large. You can add your own resize.

```metadata json
GalleryUploader: { 
    filesize: number,  // max size of file in Mb, by default 1
    accepted: string[], // accepted extensions for upload
    small: number, // size of thumbl version of image
    large: number, // size of large verison of image
    aspect: { // aspect of image, optional. Validate image aspect after upload on server and image can be refused if aspect not valid.
        width: number, // horizontal aspect
        height: number // vertical aspect
    },
    size: { //image size, optional
        width: number or string that contain number or string array,
        height: number or string that contain number or string array
    },
    resize: [ //cusom resize, optional
        {
            name: string, //resize name
            w: number // width 
            h: number //height
        }
    ],
    preview: string // preview of gallery, see below
}
```

#### Size

You can add size validation of uploaded images. 
```metadata json
size: {
    width: number, // image width
    height: number // image height
}
```

You can use stings, for example:
```metadata json
size: {
    width: '200',
    height: '300'
}
```

Also, you can set range of width or height:
```metadata json
size: {
    width: '>=200',
    height: ['>100', '<=300']
}
```

#### Preview
Gallery let you choice preview of images set using preview property

Usage example

```javascript
// MODEL User.js:
module.exports = {
  attributes: {
    photos: 'json',
    photosPreview: 'string'
  }
}
```

```javascript
module.exports.adminpanel = {
    instances: {
        users: {
            title: 'Users', 
            model: 'User', 

            fields: {
                photos: false,
                preview: false
            },
            add: {
                photos: {
                    widget: 'GalleryUploader',
                    GalleryUploader: {
                        preview: 'photosPreview'
                    }
                }
            }
        }
    }
}
```
