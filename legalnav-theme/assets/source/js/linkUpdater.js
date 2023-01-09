LEGALNAV.linkUpdater = (function defineLinkUpdater() {

    return {
        updateLinks
    };

    // If present, append 'location' query param to all internal links
    function updateLinks() {
        var urlParams = new URLSearchParams(window.location.search);

        if(urlParams.has('location')) {
            var location = urlParams.get('location');

            absInternalLinks = jQuery('a[href*="' + window.location.hostname + '"]');;
            relInternalLinks = jQuery('a').filter(function(){
               return jQuery(this).attr('href')[0] === "/";
            });

            var internalLinks = jQuery.merge(absInternalLinks, relInternalLinks);

            internalLinks.each(function() {
                var href = jQuery(this).attr('href');
                var hasLocation = href.includes('?location=');

                if(!hasLocation) {
                    jQuery(this).attr('href', href + "?location=" + location);
                }
            });
        }
    }
})();
