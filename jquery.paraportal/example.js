﻿jQuery.paraportal.ready(function ($) {
    //Passing an object to your callback allows you to use it as your jQuery shorthand reference

    //Get Customer fields from my profile page, returns an array of fields
    $.paraportal.getCustomerFields()
        .done(function (fields) {
            //Store these values somewhere, local storage or cookies, so you don't make the request every time a page loads
            console.log(fields);
        }).fail(function(err) {
            console.log(err);
        });

    //Get products from my products page, returns an array of products
    $.paraportal.getProducts()
        .done(function (products) {
            //Also a good idea to store these values so you don't make the request every time
            console.log(products);
        }).fail(function(err) {
            console.log(err);
        });

    //Customer information will be parsed from the DOM
    console.log($.paraportal.customer);

    if ($.paraportal.customer.isAuthenticated) {
        //Customer is signed in, do whatever we need to based on if they're signed in or not

    }

    //Possible permissions are listed as an array
    for (var i = 0; i < $.paraportal.permissions; i++) {
        console.log($.paraportal.permissions[i]);
    }

    //Customer permissions are on the customer object
    for (var i = 0; i < $.paraportal.customer.permissions; i++) {
        console.log($.paraportal.customer.permissions[i]);
    }

    //Example of using the customer permissions array to determine if the customer has access to a particular feature
    var hasChatPermissions = $.inArray($.paraportal.permissions.Chat, $.paraportal.customer.permissions) != -1;

    //Do whatever you'd like to do with the DOM

});