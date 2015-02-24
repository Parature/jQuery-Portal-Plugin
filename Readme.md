#jQuery Portal Plugin

##Description

The jQuery plugin included with this solution abstracts the retrieval of some of the common pieces of data that normally need to be retrieved from the DOM. This plugin can only be used on the Parature portal.

The plugin will assist with the following:

* Determining Customer Information:
	* Email Address
	* Username (if available)
	* Customer Number (if available)
	* First Name
	* Last Name
	* If the customer is authenticated
	* Permissions
* Retrieving Customer Fields (if available)
* Retrieving Customer Products (if available)
* Providing Page specific logic or determining the current page of the end user
* A list of possible permissions
* A list of common URLs found on the portal

##Disclaimer

This plugin is provided as is. Feel free to fork, modify, whatever you need to do to it to make it suit your needs.

##Usage

To make use of the plugin:

1. Upload and host the jquery.paraportal.js script to the hosting location of your choice.
2. Reference the jQuery library from the portal, if it is not already referenced.
3. Reference the jquery.paraportal.js script from the portal using the hosting location from Step 1.
4. Add your own scripts to the portal make use of the plugin. Refer to the example.js file for sample usage.