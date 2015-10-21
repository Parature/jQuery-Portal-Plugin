if (jQuery) {

    var paraportal = (new function() {
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

        this.permissions = {
            "Knowledgebase": "Knowledgebase",
            "Download": "Download",
            "Chat": "Chat",
            "Ticket": "Ticket",
            "My Support": "My Support",
            "My Profile": "My Profile",
            "KB Subscribe": "KB Subscribe",
            "Product": "Product",
            "Email": "Email",
            "Glossary": "Glossary",
            "Troubleshooter": "Troubleshooter"
        };

        //List of pages that we may use on the portal
        this.pages = {
            "splash": "splash",
            "ticketpresubmit": "ticketpresubmit",
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
            "myprofile": "myprofile",
            "forgotpassword": "forgotpassword",
            "contactregister": "contactregister",
            "glossary": "glossary"
        };

        this.portalModes = {
            "omni": "omni",
            "flexible": "flexible"
        };

        this.portalMode = window.location.pathname.toLowerCase().substring(0, 9) == "/support/" ? this.portalModes.omni : this.portalModes.flexible;

        if (this.portalMode == this.portalModes.flexible) {
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
                "/link/portal/\\d+/\\d+/article/\\d+/": this.pages.kbarticle,
                "/ics/support/kblist.asp": this.pages.kbfolder,
                "/link/portal/\\d+/\\d+/articlefolder/\\d+/": this.pages.kbfolder,
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
                "/ics/support/myemails.asp": this.pages.myemails,
                "/ics/support/myprofile.asp": this.pages.myprofile,
                "/ics/support/glossary.asp": this.pages.glossary
            }
        } else if (this.portalMode == this.portalModes.omni) {
            //Omni Portal Pages
            this.portalURLs = {
                "/support/\\d+/\\d+/.+/portal/index": this.pages.splash,
                "/support/\\d+/\\d+/.+/account/register": this.pages.contactregister,
                "/support/\\d+/\\d+/.+/ticket/new": this.pages.ticketsubmit,
                "/support/\\d+/\\d+/.+/ticket/confirmsubmission": this.pages.ticketconfirm,
                "/support/\\d+/\\d+/.+/ticket/view/\\d+": this.pages.ticketdetails,
                "/support/\\d+/\\d+/.+/account/forgotpassword": this.pages.forgotpassword,
                "/support/\\d+/\\d+/.+/article/index": this.pages.kbsplash,
                "/support/\\d+/\\d+/.+/article/view/\\d+/.+": this.pages.kbarticle,
                "/support/\\d+/\\d+/.+/article/folder/\\d+/.+": this.pages.kbfolder,
                "/support/\\d+/\\d+/.+/download/index": this.pages.downloadsplash,
                "/support/\\d+/\\d+/.+/download/downloadfolder/\\d+/.+": this.pages.downloadfolder,
                "/support/\\d+/\\d+/.+/search/searchquery": this.pages.kbsearchresults,
                "/support/\\d+/\\d+/.+/portal/contactus": this.pages.contactus,
                "/support/\\d+/\\d+/.+/account/login": this.pages.mylogin,
                "/support/\\d+/\\d+/.+/portal/history": this.pages.myhistory,
                "/support/\\d+/\\d+/.+/mychat/index": this.pages.mychats,
                "/support/\\d+/\\d+/.+/ticket/index": this.pages.mytickets,
                "/support/\\d+/\\d+/.+/myemail/index": this.pages.myemails,
                "/support/\\d+/\\d+/.+/article/subscribed": this.pages.mysubscriptions,
                "/support/\\d+/\\d+/.+/myproduct/index": this.pages.myproducts,
                "/support/\\d+/\\d+/.+/account/profiledetails": this.pages.myprofile,
                "/support/\\d+/\\d+/.+/glossary/index": this.pages.glossary
            };
        }

        this.customer = {};

        /* Initialization Methods */

        //Parse permissions from submenu
        function parsePermissions(paraportal) {
            //Permissions are exposed via the portal submenus...
            var menuToPermissions = {
                "#mli_knowledge": paraportal.permissions["Knowledgebase"],
                "#mli_download": paraportal.permissions["Download"],
                "#mli_realtime": paraportal.permissions["Chat"],
                "#mli_ticket": paraportal.permissions["Ticket"],
                "#mli_myHistory": paraportal.permissions["My Support"],
                "#mli_mySubscriptions": paraportal.permissions["KB Subscribe"],
                "#mli_myProducts": paraportal.permissions["Product"],
                "#mli_myProfile": paraportal.permissions["My Profile"],
                "#mli_email": paraportal.permissions["Email"],
                "#mli_glossary": paraportal.permissions["Glossary"],
                "#mli_troubleshooter": paraportal.permissions["Troubleshooter"] //FYI Troubleshooter is sub-optimal, just use EasyAnswer
            };

            paraportal.customer.permissions = {};

            for (var id in menuToPermissions) {
                //Parse our permissions from the submenu
                if (jQuery('.submenu ' + id).length > 0)
                    paraportal.customer.permissions[menuToPermissions[id]] = menuToPermissions[id];
            }
        }

        //Perform any callbacks provided on ready
        function performCallbacks() {

            isReady = true;

            //Execute any ready callbacks
            for (var i = 0; i < readyQueue.length; i++) {
                var callback = readyQueue[i];
                callback(jQuery);
            }
        }

        //Parse the page of the portal based on the URL
        function parsePage(paraportal) {
            for (var url in paraportal.portalURLs) {
                //Determine currentPage of the portal
                var regex = new RegExp(url);
                if (regex.test(window.location.pathname.toLowerCase())) {

                    paraportal.currentPage = paraportal.portalURLs[url];

                    if (portalMode == portalModes.omni && paraportal.currentPage == paraportal.pages.ticketsubmit && jQuery('#configFields').length > 0) {
                        //Omni has one page dedicated to both ticket submission and product/department selection before submitting a ticket. Need to check the DOM for a form to know which one we're on...
                        paraportal.currentPage = paraportal.pages.ticketpresubmit;
                    }

                    jQuery('body').addClass(paraportal.currentPage);

                    break;
                }
            }

            //If its some page that we haven't accounted for, just return the path
            if (!paraportal.currentPage) {
                paraportal.currentPage = window.location.pathname.toLowerCase();
            }

        }

        //Parse the DOM for customer information
        function parseLogin(paraportal) {
            loggedIn = jQuery('#welcome_email').length > 0 || jQuery('#welcome_firstname').length > 0;
            if (loggedIn) {
                paraportal.customer.firstName = jQuery('#welcome_firstname').text();
                paraportal.customer.lastName = jQuery('#welcome_lastname').text();
                paraportal.customer.username = jQuery('#welcome_username').text();
                paraportal.customer.email = jQuery('#welcome_email').text();

                if (portalMode == paraportal.portalModes.flexible) {
                    var numReg = /\d+/g;
                    var matches = jQuery('#welcome_custnum').text().match(numReg);
                    if (matches) {
                        paraportal.customer.custNum = matches[0];
                    } else {
                        if (window.console) console.log("Warning: Customer Number is not available. If you need this information, please make sure that the Customer Number static field is present and that the field is not set to internal.");
                    }
                } else if (portalMode == paraportal.portalModes.omni) {
                    paraportal.customer.custNum = paraCust.paraCustNum;
                }
            }

            paraportal.customer.isAuthenticated = loggedIn;
        }

        //Using different initializers since the DOM is very different from flexible to omni
        function flexiblePortalInit(paraportal) {
            //We only want to parse when the DOM is ready
            jQuery(document).ready(function($) {

                var fieldHelpers = {};
                /////////////////
                //Field Parsing//
                /////////////////
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
                            fieldHelpers.parseTextarea($('textarea', rowElement), field);
                        } else if ($('input[type="text"]', rowElement).length > 0) {
                            fieldHelpers.parseTextbox($('input[type="text"]', rowElement), field);
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
                //Dropdowns
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
                //Date Fields
                fieldHelpers.parseDate = function(row, field) {
                    field.type = "date";
                    field.value = {};
                    if ($('select[id*="dtMM"]', row).val() != "0" && $('select[id*="dtDD"]', row).val() != "0" && $('select[id*="dtYY"]', row).val() != "0") {
                        field.value.month = $('select[id*="dtMM"] option:selected', row).text();
                        field.value.Date = $('select[id*="dtDD"] option:selected', row).text();
                        field.value.year = $('select[id*="dtYY"] option:selected', row).text();
                    } else {
                        field.value.month = null;
                        field.value.date = null;
                        field.value.year = null;
                    }
                };
                //Text boxes
                fieldHelpers.parseTextbox = function(textInput, field) {
                    field.type = "text";
                    field.value = textInput.val();
                };
                //Text areas
                fieldHelpers.parseTextarea = function(textarea, field) {
                    field.type = "text";
                    field.value = textarea.val();
                };
                //Single Checkbox
                fieldHelpers.parseCheckbox = function(checkbox, field) {
                    field.type = "boolean";
                    field.value = checkbox.attr('checked') == "checked";
                };
                //Multiple Checkbox
                fieldHelpers.parseMulticheck = function(row, field) {
                    field.type = "option";
                    field.multiple = true;
                    field.selectedOptions = [];
                    $('input[checked]', row).each(function() {
                        var option = {
                            "selectedOptionValue": $(this).val(),
                            "selectedOptionName": $(this).next().text()
                        };
                        field.selectedOptions.push(option);
                    });
                };
                //Radio options
                fieldHelpers.parseRadio = function(row, field) {
                    field.type = "option";
                    var selectedValue = $('input[type="hidden"]', row).val();
                    if (selectedValue) {
                        var selectedRadio = $('input[type="radio"][value="' + selectedValue + '"]', row);
                        field.selectionOptionName = selectedRadio.next().text();
                        field.selectedOptionValue = selectedValue;
                    } else {
                        field.selectedOptionName = null;
                        field.selectedOptionValue = null;
                    }
                };

                //Get the product table from the myproducts page and return the resulting object
                paraportal.getProducts = function() {

                    var def = jQuery.Deferred();

                    if (!loggedIn) {
                        def.reject("Not logged in");
                    } else if (paraportal.customer.permissions[paraportal.permissions.Product]) {
                        $.get("/ics/support/myproducts.asp").done(function(data, status) {

                            if ($('.errormessage', data).length > 0) {
                                def.reject("No product access");
                            } else {
                                //Parse the product table into an object

                                var products = [];
                                var headers = [];
                                $('.tableList th', data).each(function() {
                                    headers.push($.trim($(this).text()));
                                });

                                $('.tableList tr', data).each(function() {

                                    var product = {};

                                    if ($('th', this).length == 0) {
                                        $('td', this).each(function() {
                                            var index = $(this).index();
                                            product[headers[index]] = $.trim($(this).html());
                                        });
                                        products.push(product);
                                    }
                                });

                                def.resolve(products);
                            }
                        }).fail(function(data, status) {
                            def.reject('HTTP Error: ' + status);
                        });
                    } else {
                        def.reject("No product access");
                    }

                    return def;
                }

                //Get the customer fields from the customer page and return the resulting object
                paraportal.getCustomerFields = function() {
                    var def = $.Deferred();

                    if (!loggedIn) {
                        def.reject("Not logged in");
                    } else if (paraportal.customer.permissions[paraportal.permissions["My Profile"]]) {
                        $.get("/ics/support/myprofile.asp").done(function(data, status) {

                            if ($('.errormessage', data).length > 0) {
                                def.reject("Does not have My Profile access");
                            } else {
                                var customerFields = [];

                                $('div[id*="ROW"]', data).each(function() {
                                    var field = fieldHelpers.parseRow(this);
                                    if (field)
                                        customerFields.push(field);
                                });

                                def.resolve(customerFields);
                            }
                        }).fail(function(data, status) {
                            def.reject('HTTP Error: ' + status);
                        });
                    } else {
                        def.reject("Does not have My Profile access");
                    }

                    return def;
                }

                parseLogin(paraportal);

                parsePermissions(paraportal);

                parsePage(paraportal);

                performCallbacks();
            });
        };

        function omniPortalInit(paraportal) {
            jQuery(document).ready(function($) {

                parseLogin(paraportal);

                parsePermissions(paraportal);

                parsePage(paraportal);

                performCallbacks();
            });
        }

        if (this.portalMode == this.portalModes.flexible) {
            flexiblePortalInit(this);
        } else if (this.portalMode == this.portalModes.omni) {
            omniPortalInit(this);
        }

    }());
} else {
    console.log('Warning: jQuery is missing. The Parature Portal plugin is dependant on jQuery.');
}