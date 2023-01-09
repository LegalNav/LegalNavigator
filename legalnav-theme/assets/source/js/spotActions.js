LEGALNAV.spotActions = {
    init: function() {
        // If previous search hit spot add auto action on click of GA link in results
        if(jQuery('.spot-query-id').data('query-id')) {
            // Set up auto action click events
            jQuery('.ga-posts .posts a').on('click', function(evt) {
                evt.preventDefault();
                // Get topics spot ids
                var gaSpotIDs = jQuery(evt.target).data('ga-spot-ids').split(',');
                // Send data to spot
                var gaLink = jQuery(evt.target).attr('href')
                LEGALNAV.spotActions.autoAction(gaLink, gaSpotIDs);
            });

            // Set up expert opinion click events
            jQuery('.expert-accordion .topic .buttons a').on('click', function(evt) {
                evt.preventDefault();
                // Get topics spot id
                var gaSpotID = jQuery(evt.target).closest('.topic').data('topic-spot-id').split(',');
                // Get favor type
                var favorType = jQuery(evt.target).closest('a').attr('class');
                // Send data to spot
                LEGALNAV.spotActions.manualAction(favorType, 'opinions', gaSpotID);

                // Remove topic from accordion
                jQuery(evt.target).closest('.topic').addClass('clicked');
            });
        }
    },
    openExpertAccordion: function() {
        jQuery('.expert-accordion').addClass('open');
    },
    // Sends action to spot after specified amount of time in ms
    autoAction: function(gaLink, gaSpotIDs) {
        jQuery.post(
            LEGALNAV.spotActions.generatePostSettings('in-favor', 'actions', gaSpotIDs)
        ).always(function() {
            // Send user to GA
            window.location.replace(gaLink);
        });
    },
    manualAction: function(favorType, endpoint, gaSpotIDs) {
        jQuery.post(LEGALNAV.spotActions.generatePostSettings(favorType, endpoint, gaSpotIDs));
    },
    generatePostSettings: function(favorType, endpoint, gaSpotTermIds) {
        if(jQuery('.spot-data').data('spot-ids')) {
            var searchResultSpotTermIDs = jQuery('.spot-data').data('spot-ids');
            
            var spotTermIDArraysIntersection = gaSpotTermIds.filter(
                function(id) {
                    return searchResultSpotTermIDs.includes(id);
                }
            );
        }

        var spotQueryID = jQuery('.spot-query-id').data('query-id');

        var dataObj = {
            "query-id":spotQueryID
        }

        dataObj[favorType] = (spotTermIDArraysIntersection) ? spotTermIDArraysIntersection : searchResultSpotTermIDs;

        var settings = {
            "url": "https://spot.suffolklitlab.org/v0/"+endpoint+"/",
            "method": "POST",
            "timeout": 0,
            "headers": {
                "Authorization": "Bearer " + LEGALNAV.config.spotBearerToken,
                "Content-Type": "application/json"
            },
            "data": JSON.stringify(dataObj),
        };

        return settings;
    }
}