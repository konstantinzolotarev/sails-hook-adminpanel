# Admin panel assets

## Used staff

First of all this hook is build on a list of OpenSourse libraries and tools.

+ [Twitter Bootstrap 3](getbootstrap.com)
+ [LESS](http://lesscss.org/)
+ [CkEditor](http://ckeditor.com/)
+ [jQuery](https://jquery.com)


## Configuration

All styles and js files will be linked to your project automatically.

There are 2 ways of how it will be linked.

+ `copy` - Assets will be copied into your projects `assets` folder
+ `link` - Assets will be linked to your projects `assets` folder using `symlink`

**By default `copy` method is using.**

You can change this behaviour using `assets` configuration field into main frame of config object.

Example:
```
module.exports.adminpanel = {
    assets: 'copy', /* or 'link' */

    instances: { /* ... */ }
};

```
