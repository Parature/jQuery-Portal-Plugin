if (jQuery) {

    var fieldHelpers = {};
    fieldHelpers.parseRow = function(rowElement) {
        if ($('input[type="password"]', rowElement).length == 0) {
            var field = {};
            //determine if its required
            field.required = $('.required', rowElement).length > 0;
            $('.required,.colon,.maxchars', rowElement).remove();

            //Get the name
            field.name = $.trim($('label', rowElement).text());

            if ($('select', rowElement).length == 1) {
                //This is an dropdown field
                fieldHelpers.parseSelect($('select', rowElement), field);
            } else if ($('select', rowElement).length == 3) {
                //This is a date field
                fieldHelpers.parseDate(rowElement, field);
            } else if ($('textarea', rowElement).length > 0) {
                fieldHelpers.parseTextarea($('textarea', rowElement));
            } else if ($('input[type="text"]', rowElement).length > 0) {
                fieldHelpers.parseTextbox($('input[type="text"]', rowElement));
            } else if ($('input[type="checkbox"]', rowElement).length == 1) {
                fieldHelpers.parseCheckbox($('input[type="checkbox"]', rowElement), field);
            } else if (($('input[type="checkbox"]', rowElement).length > 1)) {
                fieldHelpers.parseMulticheck(rowElement, field);
            } else if ($('input[type="radio"]', rowElement).length > 0) {
                fieldHelpers.parseRadio(rowElement, field);
            }

            return field;
        }
    };
    fieldHelpers.parseSelect = function(selectElement, field) {
        field.type = "option";
        if ($(selectElement).attr('multiple') == "multiple") {
            field.multiple = true;
            field.selectedOptions = [];
            var selectedOptions = $('option:selected', selectElement);
            selectedOptions.each(function() {
                if ($(this).val()) {
                    var option = {};
                    option.selectedOptionValue = $(this).val();
                    option.selectedOptionName = $(this).text();
                    field.selectedOptions.push(option);
                }
            });
        } else {
            //Single option dropdown
            var selectedOption = $('option:selected', selectElement);
            if (selectedOption.val()) {
                field.selectedOptionValue = selectedOption.val();
                field.selectedOptionName = selectedOption.text();
            } else {
                field.selectedOptionValue = null;
                field.selectedOptionName = null;
            }
        }
    };
    fieldHelpers.parseDate = function(row, field) {
        field.type = "date";
        throw "Not implemented";
    };
    fieldHelpers.parseTextbox = function(textInput, field) {
        field.type = "text";
        throw "Not implemented";
    };
    fieldHelpers.parseTextarea = function (textarea, field) {
        field.type = "text";
        throw "Not implemented";
    };
    fieldHelpers.parseCheckbox = function(checkbox, field) {
        field.type = "boolean";
        throw "Not implemented";
    };
    fieldHelpers.parseMulticheck = function(row, field) {
        field.type = "option";
        field.multiple = true;
    };
    fieldHelpers.parseRadio = function(row, field) {
        field.type = "option";
        throw "Not implemented";
    };

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

        var permissions = {
            "Knowledgebase" : "Knowledgebase",
            "Download" : "Download",
            "Chat" : "Chat",
            "Ticket" : "Ticket",
            "My Support" : "My Support",
            "My Profile" : "My Profile",
            "KB Subscribe" : "KB Subscribe",
            "Product" : "Product",
            "Email" : "Email",
            "Glossary" : "Glossary",
            "Troubleshooter" : "Troubleshooter" 
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

        this.portalURLs = {
            "/ics/support/splash.asp": this.pages.splash,
            "/ics/support/default.asp": this.pages.splash,
            "/ics/support/ticketnewwizard.asp": this.pages.ticketsubmit,
            "/ics/support/srsplash.asp": this.pages.srsplash,
            "/ics/support/ticketnewconfirm.asp": this.pages.ticketconfirm,
            "/ics/support/dlsplash.asp": this.pages.downloadsplash,
            "/ics/support/dllist.asp": this.pages.downloadfolder,
            "/ics/support/kbsplash.asp": this.pages.kbsplash,
            "/ics/support/kbanswer.asp": this.pages.kbarticle,
            "/link/portal/\\d+/\\d+/article/\\d+/" : this.pages.kbarticle,
            "/ics/support/kblist.asp": this.pages.kbfolder,
            "/link/portal/\\d+/\\d+/articlefolder/\\d+/" : this.pages.kbfolder,
            "/ics/support/ticketview.asp": this.pages.ticketdetails,
            "/ics/support/ticketpreview.asp": this.pages.ticketpreview,
            "/ics/support/kbresult.asp": this.pages.kbsearchresults,
            "/ics/support/contactus.asp": this.pages.contactus,
            "/ics/support/frameless/search.asp": this.pages.advancedsearch,
            "/ics/support/mytickets.asp": this.pages.mytickets,
            "/ics/support/myhistory.asp": this.pages.myhistory,
            "/ics/support/mylogin.asp": this.pages.mylogin,
            "/ics/support/myproducts.asp": this.pages.myproducts,
            "/ics/support/mychats.asp": this.pages.mychats,
            "/ics/support/mysubscriptions.asp": this.pages.mysubscriptions,
            "/ics/support/myemails.asp": this.pages.myemails
        }

        this.customer = {};
        this.permissions = [];

        var paraportal = this;

        jQuery(document).ready(function ($) {

            //Get the product table from the myproducts page and return the resulting object
            paraportal.getProducts = function () {

                var def = jQuery.Deferred();

                if (!loggedIn) {
                    def.reject("Not logged in");
                } else if ($.inArray(permissions.Product, paraportal.permissions) != -1) {
                    $.get("/ics/support/myproducts.asp").done(function (data, status) {

                        if ($('.errormessage', data).length > 0) {
                            def.reject("No product access");
                        } else {
                            //Parse the product table into an object

                            var products = [];
                            var headers = [];
                            $('.tableList th', data).each(function () {
                                headers.push($.trim($(this).text()));
                            });

                            $('.tableList tr', data).each(function () {

                                var product = {};

                                if ($('th', this).length == 0) {
                                    $('td', this).each(function () {
                                        var index = $(this).index();
                                        product[headers[index]] = $.trim($(this).html());
                                    });
                                    products.push(product);
                                }
                            });

                            def.resolve(products);
                        }
                    }).fail(function (data, status) {
                        def.reject('HTTP Error: ' + status);
                    });
                } else {
                    def.reject("No product access");
                }

                return def;
            }


            //Get the customer fields from the customer page and return the resulting object
            paraportal.getCustomerFields = function () {
                var def = $.Deferred();

                if (!loggedIn) {
                    def.reject("Not logged in");
                } else if ($.inArray(permissions["My Profile"], paraportal.permissions) != -1) {
                    $.get("/ics/support/myprofile.asp").done(function (data, status) {

                        if ($('.errormessage', data).length > 0) {
                            def.reject("Does not have My Profile access");
                        } else {
                            var customerFields = [];

                            $('div[id*="ROW"]', data).each(function () {
                                var field = fieldHelpers.parseRow(this);
                                if (field)
                                    customerFields.push(field);
                            });

                            def.resolve(customerFields);
                        }
                    }).fail(function (data, status) {
                        def.reject('HTTP Error: ' + status);
                    });
                } else {
                    def.reject("Does not have My Profile access");
                }

                return def;
            }

            //Parse the dom for customer information
            loggedIn = $('#welcome_email').length > 0;
            if (loggedIn) {
                paraportal.customer.firstName = $('#welcome_firstname').text();
                paraportal.customer.lastName = $('#welcome_lastname').text();
                paraportal.customer.username = $('#welcome_username').text();
                paraportal.customer.email = $('#welcome_email').text();
                
                var numReg = /\d+/g;
                var matches = $('#welcome_custnum').text().match(numReg);
                if (matches) {
                    paraportal.customer.custNum = matches[0];
                } else {
                    if(window.console) console.log("Warning: Customer Number is not available. If you need this information, please make sure that the Customer Number static field is present and that the field is not set to internal.");
                }
            }

            paraportal.customer.isAuthenticated = loggedIn;

            //Permissions are exposed via the portal submenus...
            var menuToPermissions = {
                "#mli_knowledge": permissions["Knowledgebase"],
                "#mli_download": permissions["Download"],
                "#mli_realtime": permissions["Chat"],
                "#mli_ticket": permissions["Ticket"],
                "#mli_myHistory" : permissions["My Support"],
                "#mli_mySubscriptions": permissions["KB Subscribe"],
                "#mli_myProducts": permissions["Product"],
                "#mli_myProfile" : permissions["My Profile"],
                "#mli_email": permissions["Email"],
                "#mli_glossary": permissions["Glossary"],
                "#mli_troubleshooter": permissions["Troubleshooter"] //FYI Troubleshooter is sub-optimal, just use EasyAnswer
            };

            for (var id in menuToPermissions) {
                if ($('.submenu ' + id).length > 0)
                    paraportal.permissions.push(menuToPermissions[id]);
            }

            for (var url in paraportal.portalURLs) {
                var regex = new RegExp(url);
                if (regex.test(window.location.pathname.toLowerCase())) {
                    paraportal.currentPage = paraportal.portalURLs[url];
                    break;
                }
            }

            //If its some page that we haven't accounted for, just return the path
            if (!paraportal.currentPage) {
                paraportal.currentPage = window.location.pathname.toLowerCase();
            }

            isReady = true;

            //Execute any ready callbacks
            for (var i = 0; i < readyQueue.length; i++) {
                var callback = readyQueue[i];
                callback(jQuery);
            }
        });
    }());
}