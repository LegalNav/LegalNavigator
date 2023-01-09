/**
 * Javascript functions for the topics page.
 * Updated on 2021-11-30
 */// ! LEGALNAV.topics
 LEGALNAV.topics = {
    // ! LEGALNAV.topics.init
    init: function () {

        //Adds click events to the filter buttons.
        LEGALNAV.topics.enableFilterButtons();

        //Gets our initial results.
        LEGALNAV.topics.getResults();
        LEGALNAV.topics.enablePageButtons();
        LEGALNAV.topics.toggleLocationSearch();

    },
    // ! LEGALNAV.topics.enableFilterButtons
    //Adds click events to the filter buttons.
    enableFilterButtons: function () {
        //Get all topic resource buttons.
        var topicButtons = jQuery('.result-tabs .topic-select');
        if (topicButtons.length < 1) {
            return;
        }

        //Apply a click event to each.
        topicButtons.on('click', function (element) {
            var button = jQuery(element.currentTarget);
            var topicResults = jQuery('#topics-results');
            selects = jQuery('.topic-select');
            selects.removeClass('active');
            button.addClass('active');
            topicResults.attr('data-resource', button.attr('data-slug'));
            //When clicked reload results.
            LEGALNAV.topics.getResults();
        });


        //Get all region checkboxes
        var regionCheckboxes = jQuery('.region-select-items input[type="checkbox"]');
        if (regionCheckboxes.length > 0) {
             //Apply a click event to each.
             regionCheckboxes.on('click', function () {
                var regionCheckboxes = jQuery('.region-select-items input[type="checkbox"]');
                var topicResults = jQuery('#topics-results');

                var regionString = '';
                regionCheckboxes.each(function (index, element) {
                    var currentCheckbox = jQuery(element);
                    if (currentCheckbox.prop('checked')) {
                        regionString += (regionString=='') ? currentCheckbox.attr('name') : ","+currentCheckbox.attr('name');
                    }
                });

                topicResults.attr('data-region', regionString);

                //When clicked reload results.
                LEGALNAV.topics.getResults();

            });
        }
    },
    // ! LEGALNAV.topics.getResults
    //Loads and replaces the filter's result content.
    getResults: function () {

        //Main filter results container.
        var topicResults = jQuery('#topics-results');
        if (topicResults.length < 1) {
            return;
        }
        //Get ajax url.
        var ajaxUrl = topicResults.attr('data-ajaxurl');
        var page = (topicResults.attr('data-page')) ? topicResults.attr('data-page') : 1;
        var state = topicResults.attr('data-state');
        var topic = topicResults.attr('data-topic');
        var resource = (topicResults.attr('data-resource')) ? topicResults.attr('data-resource') : '';
        var region = topicResults.attr('data-region');
        var location = topicResults.attr('data-location');
        if ((ajaxUrl.length < 1) || (topic.length < 1)) {
            return;
        }

        //Set loading indicator.
        topicResults.addClass('loading');

        var data = {};
        data.action = 'render_topic_results';
        data.page = page;
        data.state = state;
        data.topic = topic;
        data.resource = resource;
        data.region = region;
        data.location = location;
        //data.region = pagingationType;
        jQuery.ajax({
            url: ajaxUrl,
            method: 'post',
            data: data,
            success: function (response) {
                var topicResults = jQuery('#topics-results');
                topicResults.html(response);
                LEGALNAV.topics.enableLocationButton();
                LEGALNAV.topics.enablePageButtons();
                topicResults.removeClass('loading');
                datacoord = jQuery('#map-data').attr('data-coord');
                if (datacoord) {
                    var decodedDataCoord = datacoord.replace(/\+/g, '%20');
                    decodedDataCoord = decodeURIComponent(decodedDataCoord);
                    LEGALNAV.locations.init(JSON.parse(decodedDataCoord));
                }

                LEGALNAV.linkUpdater.updateLinks();
            }
        });


    },
    // ! LEGALNAV.topics.enableLocationButton
    //Adds click event to the location button.
    enableLocationButton: function () {

        //Get location input
        var locationButton = jQuery('#find-location-button');
        jQuery('#location').keypress(function(e) {
            var key = e.which;
            if (key == 13) {
                jQuery('#find-location-button').click();
                return false;
            }
        });
        if (locationButton.length > 0) {
             //Apply a click event to each.
             locationButton.on('click', function () {
                var locationInput = jQuery('.find-my-location input#location');
                var loc = locationInput.val().replace(' ', '+');
                var key = LEGALNAV.config.geocodeKey;

                var gc = new google.maps.Geocoder();

                gc.geocode({'address': loc}, function(results, status) {
                    if(status == 'OK') {
						var coordString = [
							results[0].geometry.location.lat(),
							results[0].geometry.location.lng()
						].join(",");

                        var topicResults = jQuery('#topics-results');
                        topicResults.attr('data-location', coordString);

                        //When clicked reload results.
                        LEGALNAV.topics.getResults();
                    } else {
                        console.log("Geocode Error: " + status);
                    }
                });
            });
        }

    },
    // ! LEGALNAV.topics.enablePageButtons
    //Adds click events to the pagination buttons.
    enablePageButtons: function () {

        //Get all pagination buttons.
        var paginationButtons = jQuery('.pagination-button');
        if (paginationButtons.length < 1) {
            return;
        }

        //Apply a click event to each.
        paginationButtons.each(function (index, element) {
            var button = jQuery(element);
            button.on('click', function (element) {
                var button = jQuery(element.currentTarget);
                var topicResults = jQuery('#topics-results');
                //Get the page number of the button.
                var page = button.attr('data-page');
                topicResults.attr('data-page', button.attr('data-page'));
                //Reload results for the new page.
                LEGALNAV.topics.getResults();
                LEGALNAV.topics.animatePage();
            });

        });
    },
    animatePage: function() {
        // scroll filter page appropriately depending on screen size
        var resultHeight = jQuery('.result-tabs').position().top;
        var headerHeight = jQuery('header').height();
        var breadcrumbHeight = jQuery('.breadcrumbs').height();
        var headerTopBarHeight = jQuery('.header-top-bar').height();

        var totalHeight = resultHeight + breadcrumbHeight + headerHeight - headerTopBarHeight;
        jQuery('html, body').animate({scrollTop:totalHeight}, 500);
    },
    toggleLocationSearch: function() {
        var toggleBtn = jQuery('.region-select-label');
        if (toggleBtn.length < 1) {
            return;
        }

        toggleBtn.on('click', function (element) {
            var button = jQuery(element.currentTarget);
            button.toggleClass('active');
            button.next('.region-select-items').toggleClass('active');
        });

    }
}
