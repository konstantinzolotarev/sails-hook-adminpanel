sails-hook-adminpanel
=====================

Admin panel generator fro Sails.js applications v0.11+

# Installation

To install this hook you will need to run:

    npm install --save sails-hook-adminpanel

Unfortunately I didn't created assetic management for admin panel so you have to copy css/js to assets

    cd /your/app/base/path
    mkdir assets/admin
    cp -R api/hooks/admin/assets assets/admin

Then you will need to create a config file for admin panel generator into `config/admin.js`

This is example of this file:

    'use strict';

    module.exports.admin = {
        instances: {

            users: {

                title: 'Users',
                model: 'User',

                list: {
                    fields: {
                        id: 'ID',
                        email: 'Email',
                        active: 'Active',
                        admin: 'Admin',
                        createdAt: 'Created'
                    }
                },

                edit: {
                    fields: {
                        email: 'Email',

                        active: {
                            title: 'Active'
                        },
                        admin: {
                            title: 'Admin',
                            disabled: true
                        }
                    }
                }
            }
        }
    };


And your admin panel will be accesible under: `http://yoururl.com/admin/users`


#### What is this?

This repo contains a hook, one of the building blocks Sails is made out of.

#### What version of Sails is this for?

The versioning of a hook closely mirrors that of the Sails version it depends on.  While the "patch" version (i.e. the "Z" in "X.Y.Z") will normally differ from that of Sails core, the "minor" version number (i.e. the "Y" in "X.Y.Z") of this hook is also the minor version of Sails for which it is designed.  For instance, if a hook is version `0.11.9`, it is designed for Sails `^0.11.0` (that means it'll work from 0.11.0 all the way up until 0.12.0).

#### Does this hook use only Jade for template engine ?

Yes. For now only Jade.

#### Are there changes?

Yes, see the [v0.11 migration guide](http://sailsjs.org/#/documentation/concepts/Upgrading). You probably won't need to change anything unless you were extensively using the old Socket.io v0.9 configuration.


## License

MIT
