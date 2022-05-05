var SPOTSELECT = {

	// ! SPOTSELECT.init
	init: function() {

		SPOTSELECT.filter.init();
	},

	filterChoices: [],

	filter: {
		init: function() {
			// check if filter is on page
			if (jQuery('.spot-selected').length < 1) {
				return false;
			}
            // get active filters
            SPOTSELECT.filter.spotSelectedLoad()
			// observe checkboxes
			jQuery('.topic-children-container input[type="checkbox"]').change(SPOTSELECT.filter.filterChange);

		},
        // load spot selected active filters on page load
        spotSelectedLoad: function() {
            var filter = jQuery('[data-type="spot_list"]');

			SPOTSELECT.filterChoices = [];
			// add active filter to list on load
			filter.find('input[type="checkbox"]').each(function(index, input) {
				input = jQuery(input);
				if (input.is(':checked')) {
					var label = input.next('label'),
						obj = {
							value: input.val(),
							name: input.attr("name"),
							label: label.html(),
                            id: input.attr("id")
						};
					SPOTSELECT.filterChoices.push(obj);
				}
			});
			SPOTSELECT.filter.processFilters();
        },
	
		filterChange: function(event) {
			var target = jQuery(event.currentTarget),
				filter = target.closest('[data-type="spot_list"]');

			SPOTSELECT.filterChoices = [];
			target.closest('label').toggleClass('checked');
			// add active filter to list when checked
			filter.find('input[type="checkbox"]').each(function(index, input) {
				input = jQuery(input);
				if (input.is(':checked')) {
					var label = input.next('label'),
						obj = {
							value: input.val(),
							name: input.attr("name"),
							label: label.html(),
                            id: input.attr("id")
						};
					SPOTSELECT.filterChoices.push(obj);
				}
			});
			SPOTSELECT.filter.processFilters();
		},
		filterYank: function(event) {
			var element = jQuery(event.currentTarget),
				id = element.closest('li').attr('data-entry')
            
			// uncheck filter item when clicking on active filter item
			jQuery(SPOTSELECT.filterChoices).each(function(index, item) {
				if (item.id == id) {
					jQuery('input[type="checkbox"][id="' + item.id + '"]').click();
				}
			});
			SPOTSELECT.filter.processFilters();
		},
		processFilters: function() {
			var list = jQuery('.spot-selected');
			// clear those observers, really
			list.find('a').off('click');
			list.children().remove();
			jQuery(SPOTSELECT.filterChoices).each(function(index, value) {
                if (value.label != undefined) {
                    jQuery('.spot-selected').append('<li data-entry="' + value.id + '"><a href="javascript:;" tabindex="' + index + '" role="button"><p>' + value.label + '</p><span> &#10005; </span></a></li>');
                }	
			});
			// remove active filter when clicked
			list.find('a').click(SPOTSELECT.filter.filterYank);
		}
	}

};

jQuery(document).ready(function() {
	SPOTSELECT.init();
});