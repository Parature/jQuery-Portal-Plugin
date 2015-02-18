if (jQuery) {
    jQuery.paraportal = (new function() {
        var readyQueue = [];
        var isReady = false;
        var loggedIn;

        //Mimicking jquery ready functionality
        this.ready = function(callback) {
            if (isReady) {
                //If the portal is already ready, just perform the callback
                callback(jQuery);
            } else {
                //Queue it up
                readyQueue.push(function() {
                    callback(jQuery);
                });
            }
        }

        //List of pages that we may use on the portal
        this.pages = {
            "splash": "splash",
            "ticketsubmit": "ticketsubmit",
            "ticketconfirm": "ticketconfirm",
            "srsplash": "srsplash",
            "downloadsplash": "downloadsplash",
            "downloadfolder": "downloadfolder",
            "kbsplash": "kbsplash",
            "kbarticle": "kbarticle",
            "kbfolder": "kbfolder",
            "ticketdetails": "ticketdetails",
            "ticketpreview": "ticketpreview",
            "kbsearchresults": "kbsearchresults",
            "contactus": "contactus",
            "advancedsearch": "advancedsearch",
            "mytickets": "mytickets",
            "myhistory": "myhistory",
            "mylogin": "mylogin",
            "myproducts": "myproducts",
            "mychats": "mychats",
            "mysubscriptions": "mysubscriptions",
            "myemails": "myemails",
        }

        this.customer = {};

        var customer = this.customer;

        jQuery(document).ready(function ($) {
            //Parse the dom for customer information

            loggedIn = $('#welcome_email').length > 0;
            if (loggedIn) {
                customer.firstName = $('#welcome_firstname').text();
                customer.lastName = $('#welcome_lastname').text();
                customer.username = $('#welcome_username').text();
                customer.email = $('#welcome_email').text();
                
                var numReg = /\d+/g;
                var matches = $('#welcome_custnum').text().match(numReg);
                if (matches) {
                    customer.custNum = matches[0];
                } else {
                    customer.custNum = (function() {
                        throw "Configuration Issue: Customer Number is not available. Please make sure that the Customer Number static field is present and that the field is not set to internal.";
                    })();
                }
            }

            customer.isAuthenticated = loggedIn;

            isReady = true;
        });
    }());
}

jQuery.paraportal.ready(function ($) {
    
});
    