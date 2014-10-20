sails-hook-adminpanel
=====================

Admin panel generator fro Sails.js applications v0.10+

# Installation

For now this module could be installed only via:

    cd api/hooks
    git submodule add https://github.com/konstantinzolotarev/sails-hook-adminpanel.git admin
    
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