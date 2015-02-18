if (jQuery) {
    jQuery.paraportal = (new function() {
        var readyQueue = [];
        var isReady = false;

        //Mimicking jquery ready functionality
        this.ready = function (callback) {
            if (isReady) {
                //If the portal is alrady ready, just perform the callback
                callback(jQuery);
            } else {
                //Queue it up
                readyQueue.push(function () {
                    callback(jQuery);
                });
            }
        }

        jQuery(document).ready(function ($) {
            //Parse the dom


            isReady = true;
        });
    }());   
}

jQuery.paraportal.ready(function ($) {
    
});
    