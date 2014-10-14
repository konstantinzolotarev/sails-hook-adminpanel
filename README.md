sails-hook-adminpanel
=====================

Admin panel generator fro Sails.js applications v0.10+

# Installation

For now this module could be installed only via:

    cd api/hooks
    git submodule add https://github.com/konstantinzolotarev/sails-hook-adminpanel.git admin
    

The you will need to create a config file for admin panel generator into `config/admin.js`

This is example of this file:

    mudule.exports.admin = {
    
        /**
         * Title for admin panel
         */
        title: 'Admin Panel',

        /**
         * Default url prefix for admin panel
         */
        routePrefix: '/admin',

        /**
         * Default path to views.
         * For now it's located inside admin hooks
         */
        pathToViews: '../api/hooks/admin/views/',

        /**
         * Name of model identifier field
         */
        identifierField: 'id',
                  
        /**
         * List of admin pages that should be generated
         */
        instances: {
                
                'users': {
                
                    title: 'Users',
                    model: 'User',
        
                    list: {
                        id: 'ID',
                        email: 'Email',
                        active: 'Active',
                        admin: 'Admin',
                        createdAt: 'Created'
                    },
        
                    edit: {
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
    };
    
    
And your admin panel will be accesible under: `http://yoururl.com/admin/users`