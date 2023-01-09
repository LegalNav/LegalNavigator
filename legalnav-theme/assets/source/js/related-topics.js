LEGALNAV.relatedTopics = {
    init: function() {
        var queryParams = new URLSearchParams(window.location.search);

        if(queryParams.has('gaSearchString')) {
            LEGALNAV.relatedTopics.getLegalNavTopics();
        }
    },

    getSpotTopicIds: function() {
        if(jQuery('.spot-data').data('spot-ids')) {
            return jQuery('.spot-data').data('spot-ids').split(",");
        }
    },

    getLegalNavTopics: function() {
        jQuery.ajax({
            url: 'https://' + window.location.hostname + '/wp-json/wp/v2/related-topics?spot-ids=' + LEGALNAV.relatedTopics.getSpotTopicIds(),
            success: function(data) {
                var topics = JSON.parse(data);
                arrayData = [];
                jQuery.each(topics, function(key, val) {
                    arrayData.push(val);
                });
                
                jQuery('.site-main .related-topics').html(LEGALNAV.relatedTopics.renderRelatedTopicsCTA(arrayData));
            }
        });
    },

    renderRelatedTopicsCTA: function(topics) {

        var output = '';

		if(topics.length < 1) {
			output += '<h2>No related topics for your search</h2>';
        	output += '<p> Check out our <a href="/topics-resources">Topics & Resources Page</a> for other topics.</p>';
			return output;
		}
        
        output = '<h2>We also found some possible topics related to your search</h2>';
        output += '<p> If none of these topics apply, check out our <a href="/topics-resources">Topics & Resources Page</a> for other topics.</p>';
        
        output += '<div class="row topic-cards-'+topics.length+'">';

        for (let i = 0; i < topics.length; i++) {
            var topic = topics[i];

            output += '<a href="'+topic.permalink+'" class="topic-card">';
            output += '<div class="topic-icon" style="background-image: url('+topic.icon_url+')"></div>';
            output += '<p class="topic-name">'+topic.name+'</p>';
            output += '</a>';
        }

        output += '</div>';

        return output;
    }
}