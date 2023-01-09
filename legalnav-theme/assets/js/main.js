var LEGALNAV = {
	config: {
		spotBearerToken: "ADD_SPOT_BEARER_TOKEN_HERE",
        geocodeKey: "ADD_GEOCODE_KEY_HERE"
	},

	// ! LEGALNAV.init
	init: function() {
		// analyze and show appropriate image size for spaces
		LEGALNAV.images.init();

		LEGALNAV.quotes.init();

		LEGALNAV.nav.init();

		LEGALNAV.locationModal.init();
		LEGALNAV.accordion.init();

		LEGALNAV.search.init();

		jQuery('.skip-nav').click(LEGALNAV.skipNav);

		LEGALNAV.courtCaseLookUp.init();

		LEGALNAV.topicCards.init();

		LEGALNAV.selectLocation.init();

		LEGALNAV.searchFilter.init();

		LEGALNAV.filter.init();

		LEGALNAV.guidedAssistantSearch.init();

		LEGALNAV.copyUrl.init();

		LEGALNAV.resourceActions.init();

		LEGALNAV.refreshPlan.init();

		LEGALNAV.topics.init();

		LEGALNAV.relatedTopics.init();

		LEGALNAV.spotActions.init();

		LEGALNAV.expertAccordion.init();

		LEGALNAV.eventHandlers.init();

		LEGALNAV.singleResource.init();

		LEGALNAV.linkUpdater.updateLinks();

		LEGALNAV.papActions.init();
	},

	singleResource: {
		init: function() {
			if (jQuery('body.single-ln_resource')) {
				datacoord = jQuery('#map-data').attr('data-coord');
				if (datacoord) {
					var decodedDataCoord = datacoord.replace(/\+/g, '%20');
					decodedDataCoord = decodeURIComponent(decodedDataCoord);
					LEGALNAV.locations.init(JSON.parse(decodedDataCoord));
				}
			}
		}
	},

	eventHandlers: {
		init: function() {
			jQuery('.homepage-spot-search').keypress(function(e) {
				if ((e.keyCode || e.which) == 13) {
					jQuery(this).parents('form').submit();
					return false;
				}
			});
		}
	},

	getUrlParam: function(params) {
		var results = new RegExp("[?&]" + params + "=([^&#]*)").exec(
		  window.location.href
		);
		return results ? decodeURI(results[1]) : null;
	},

	refreshPlan: {
		init: function() {

			jQuery(".lsc-close").on("click",function(){
				jQuery(".lsc-modal").addClass('hidden');
			});

			jQuery("#lsc-refresh-btn").on("click",function(){
				window.location.reload();
			});

			jQuery(".action-restart").on("click",function(){
				jQuery(".lsc-modal").removeClass('hidden');
			});

		}
	},

	resourceActions: {
		init: function() {
			// If on resource single page
			if(jQuery('.single-ln_resource').length > 0) {
				// Set up event handlers for actions
				// Share already copies when clicked
				jQuery('.action-download> span').click(function(evt) {
					var html = jQuery('.resource-container').first()[0].innerHTML;

					// Remove tabs and new lines
					html = html.replace(/\t|\n/gm, '');

					// Remove elements with no-dl class
					html = LEGALNAV.resourceActions.excludeElems(html);

					// Remove col-md-8 class to fix margins on output
					html = html.replace(/col-md-8/gm, '');

					var finalHTML = "<!DOCTYPE html><html>" + html + "</html>";
					var opt = {
						margin: 16,
						pagebreak: { mode: 'avoid-all' }
					}

					html2pdf(finalHTML, opt);
				});

				jQuery('.action-print').click(function() {
					window.print();
				})
			}
		},
		// Exclude elements w/ 'no-dl' class
		excludeElems: function(htmlInput) {
			var htmlObj = jQuery(htmlInput);
			htmlObj.find('.no-dl').remove();

			// Hack to turn FULL jquery object into HTML, not just first elem
			return jQuery('<div>').append(htmlObj.clone()).remove().html();
		}
	},

	nav: {
		init: function() {
			jQuery('.hamburger-button').on('click', LEGALNAV.nav.toggleNav)
			jQuery('.update-location-link').on('click', LEGALNAV.nav.openLocationModal);
			jQuery('.user-state').on('click', LEGALNAV.nav.openLocationModal);
		},
		toggleNav: function(event) {
			jQuery('nav').toggleClass('active')
		},
		openLocationModal: function(event) {
			jQuery('.location-modal').removeClass('hidden');
			jQuery('.location-modal .location-select').focus();
		}
	},

	skipNav: function() {
		// finds first focusable element after navigation
		jQuery('header').nextAll().find(':focusable').first().focus();
	},

	guidedAssistantSearch: {
		init: function() {
			if (jQuery('.ga-topic-card').length < 1) {
				return false;
			}
			// add dynamic containers to topic cards
			LEGALNAV.guidedAssistantSearch.addContainers();

			var resizeTimer;
			// retrigger logic for guided assistant topic cards if screen size width is adjusted
			jQuery(window).on('resize', function(e) {
				clearTimeout(resizeTimer);
				resizeTimer = setTimeout(function() {
					LEGALNAV.guidedAssistantSearch.addContainers();
				}, 250);

			});
			// trigger logic to show all guided assistants for specific topic
			jQuery('.ga-topic-card').click(LEGALNAV.guidedAssistantSearch.gaNav);

		},

		addContainers: function() {

			var topicCards = jQuery('.ga-topic-card');

			// remove dynamically added 'new-topic=container' div after screen resizing and add a new one in logic below
			if (topicCards.parents('.new-topic-container').length) {
				topicCards.unwrap();
			}
			// dynamically add(wrap) container around every 2,3, or 4 topicCards depending on screen size
			if (jQuery(window).width() >= 992) {
				for (var i = 0; i < topicCards.length; i += 4) {
					topicCards.slice(i, i + 4).wrapAll("<div class='new-topic-container'></div>");
				}
			} else if (jQuery(window).width() >= 768) {
				for (var i = 0; i < topicCards.length; i += 3) {
					topicCards.slice(i, i + 3).wrapAll("<div class='new-topic-container'></div>");
				}
			} else {
				for (var i = 0; i < topicCards.length; i += 2) {
					topicCards.slice(i, i + 2).wrapAll("<div class='new-topic-container'></div>");
				}
			}

			// remove dynamically added clear element after screen resizing
			jQuery('.new-topic-container .clear, .topic-section ul .clear').remove();
			// add a clear element after the last topic card in each topic container
			jQuery('.new-topic-container').each(function(index, elem) {
				jQuery(elem).children().last().after('<div class="clear"></div>');
			})

		},

		gaNav: function(event) {
			var topicCard = jQuery(event.currentTarget);
			var topicContainer = jQuery(topicCard).closest('.new-topic-container');

			jQuery('.ga-topic-card').removeClass('active');
			jQuery(topicCard).toggleClass('active');
			jQuery('.ga-posts').removeClass('active');
			// add ga-posts ul after the appropriate new-topic-container
			jQuery(topicContainer).after(jQuery(".ga-posts." + jQuery(topicCard).data('ga')))
			jQuery(".ga-posts." + jQuery(topicCard).data('ga')).toggleClass('active');
		},
	},

	locationModal: {
		init: function() {
			// Set up click handler to close modal
			jQuery('.location-modal-close-icon').on('click', function() {
				jQuery('.location-modal').addClass('hidden');
				jQuery('.update-location-link').focus();
			});
			// jQuery('nav').toggleClass('active')
		}
	},

	// ! LEGALNAV.images
	images: {
		// LEGALNAV.images.init
		init: function() {
			// pull all unloaded images
			jQuery('[data-srcset][data-loaded!="true"]').each(function(index, element) {
				element = jQuery(element);
				var targetWidth = element.width(),
					srcSet = element.attr('data-srcset').split(','),
					newSrc = false,
					lastSrc = false;
				jQuery(srcSet).each(function(imgIndex, scale) {
					var scaleSplit = scale.split(' '),
						imgSrc = scaleSplit[0], // the image path
						size = scaleSplit[1].substr(0, (scaleSplit[1].length - 1)), // the image size (need to strip off the "w")
						diff = (size - targetWidth);
					lastSrc = imgSrc;
					if (newSrc === false && diff >= 0) {
						newSrc = imgSrc;
					}
				});
				if (newSrc === false) {
					newSrc = lastSrc;
				}
				element.css('background-image', 'url(' + newSrc + ')');
				element.attr('data-loaded', true);
			});
		}
	},
	// logic to control the testimonial slider
	quotes: {
		init: function() {
			if (jQuery('.testimonial-callout').length > 0 && jQuery('.testimonial').length > 1) {
				var stopped = false;
				var slideCount = jQuery('.testimonial').length,
					slideWidth = jQuery('.testimonial').outerWidth();

				// display bullets equal to quote quantity
				jQuery('.testimonial').each(function(index, elem) {
					jQuery(elem).attr('index', index)
					jQuery('.testimonial-bullets').append('<li><span></span></li>');
				});

				// show arrows if more than one testimonial
				jQuery('.prev-testimonial, .next-testimonial').addClass('active');

				// set up first bullet
				jQuery('.testimonial-bullets li').first().addClass('active');

				jQuery('.prev-testimonial').on('click', function() {
					stopped = true;
					LEGALNAV.quotes.moveSlider(400, "left", slideWidth);
				});

				jQuery('.next-testimonial').on('click', function() {
					stopped = true;
					LEGALNAV.quotes.moveSlider(400, "right", slideWidth);
				});

				// set autoplay to move slider every 8 seconds
				setInterval(function() {
					if (!stopped) {
						LEGALNAV.quotes.automate(400, slideWidth);
					}
				}, 8000)
			}
		},

		automate: function(delay, slideWidth) {
			this.moveSlider(delay, "right", slideWidth);
		},

		moveSlider: function(delay, direction, slideWidth) {
			jQuery('.testimonials').animate({
				left: (direction === "right" ? -slideWidth : slideWidth)
			}, delay, function() {
				if (direction === "right") {
					jQuery('.testimonial:first-child').appendTo('.testimonials');
				} else {
					jQuery('.testimonial:last-child').prependTo('.testimonials');
				}
				// highlight the correct bullet during autoplay or left/right arrow click
				jQuery('.testimonial-bullets li').removeClass('active').eq(jQuery('.testimonial:first-child').attr('index')).addClass('active');
				jQuery('.testimonials').css('left', 0);
			});
		}
	},

	accordion: {
		init: function() {
			// check if accordion element is on page
			if (jQuery('.accordion-callout').length < 1) {
				return false;
			}

			jQuery('.accordion-image').on('click', LEGALNAV.accordion.toggleAccordion);
		},
		toggleAccordion: function(event) {
			var accordion = jQuery(event.currentTarget);

			accordion.toggleClass('active');
			accordion.next('.accordion-content').toggleClass('active');
		}
	},

	search: {
		curPage: 1,
		resultsPerPage: 5,
		init: function() {
			jQuery('#searchsubmit').on('click', LEGALNAV.search.toggleSearch);
			jQuery('#searchform').keypress(function(e) {
                var key = e.which;
                if (key == 13) {
                    jQuery('#searchsubmit').click();
                    return false;
                }
            });
			jQuery('#searchsubmit').on('submit', function(event){ event.preventDefault(); });
			jQuery('.close-search-form').on('click', LEGALNAV.search.closeSearch);
		},
		toggleSearch: function(event) {
			if (jQuery('#searchform').hasClass('active')) {
				event.preventDefault();
				var query = jQuery('#searchform input[type="text"]').val();
				var id = jQuery('#searchform input[type="text"]').attr('data-state-id');
                if (query) {
                    LEGALNAV.search.getSearchResults(query, id);
                }
			}
			jQuery('#searchform, .hamburger-button, .close-search-form').addClass('active');
			jQuery('#searchform input[type="text"]').focus();
		},
		closeSearch: function(event) {
			jQuery('#searchform, .hamburger-button, .close-search-form').removeClass('active');
			jQuery('.search-results').addClass('hidden');
			jQuery('#searchform input[type="text"]').val('');
		},
		getSearchResults: function(query, id) {
			var state_id = jQuery('')
			jQuery.ajax({
				'url': 'https://' + window.location.hostname + '/wp-json/wp/v2/siteSearch?q='+query+'&state-id='+id,
				'success': function(data) {
					var results = JSON.parse(data);
					var resultsContainer = jQuery('.search-results');

					// Clear any prev results and hide load more
					jQuery('.result-list').html('');
					jQuery('.load-more-btn').addClass('hidden');

					jQuery('.load-more-btn').on('click', function(){
						LEGALNAV.search.curPage += 1;
						LEGALNAV.search.appendMoreResults(results);
					});

					jQuery('.query-msg').html('<h3>You searched for: <span>' + query + '</span></h3>');
					// close search results
					jQuery('.close-search-results').on('click', LEGALNAV.search.closeSearch);
					if(results.length) {
						LEGALNAV.search.appendMoreResults(results);
					} else {
						jQuery('.result-list').html('<p class="no-results-text">Sorry, your search did not return any results.</p>')
					}

					resultsContainer.removeClass('hidden');

                    LEGALNAV.linkUpdater.updateLinks();
				}
			})

		},
		determineLoadMoreVisibility: function(resultsCount) {
			var moreResultsAvailable = (LEGALNAV.search.curPage * LEGALNAV.search.resultsPerPage) <= resultsCount;

			if(moreResultsAvailable) {
				jQuery('.load-more-btn').removeClass('hidden');
			} else {
				jQuery('.load-more-btn').addClass('hidden');
			}
		},
		appendMoreResults: function(results) {
			jQuery(LEGALNAV.search.getMoreResultsHTML(results)).appendTo(jQuery('.result-list'));
			LEGALNAV.search.determineLoadMoreVisibility(results.length);
            LEGALNAV.linkUpdater.updateLinks();
		},
		getMoreResultsHTML: function(results) {
			var output = '';
			var startIndex = (LEGALNAV.search.curPage - 1) * LEGALNAV.search.resultsPerPage;
			var stopIndex = (startIndex + LEGALNAV.search.resultsPerPage > results.length) ? results.length - 1 : startIndex + LEGALNAV.search.resultsPerPage;

			for (let i = startIndex; i < stopIndex; i++) {

				output += LEGALNAV.search.getResultHTML(results[i]);
			}

			return output;
		},
		getResultHTML: function(result) {
            var target = result.is_ls_resource ? "_blank" : "";

			var output = '<div class="result">';
			output += '<h5>' + result.title + '</h5>';

			if(result.desc) {
				output += '<div class="desc">' + result.desc + '</div>';
			}

			output += '<a href="' + result.url + '" target="'+ target +'">' + result.url + '</a>';
			output += '</div>';

			return output;
		}
	},

	topicCards: {
		init: function() {
			// check if topic cards are on page
			if (jQuery('.topic-card').length < 1) {
				return false;
			}
			// add unique class depending on how many cards per section
			jQuery('.topic-section ul').each(function(index, item) {
				var topicCardQuantity = jQuery(item).children().length

				jQuery(item).addClass(`topic-cards-${topicCardQuantity}`)

			});

			// add unique class depending on how many cards per section
			jQuery('.topics-resource-block .row').each(function(index, item) {
				var topicCardQuantity = jQuery(item).children().length

				jQuery(item).addClass(`topic-cards-${topicCardQuantity}`)

			});
		}
	},

	selectLocation: {
		// Checks if location selection has been made, then rendering the button clickable
		init: function() {
			jQuery('.location-select').on('change', LEGALNAV.selectLocation.toolBarChange);
			jQuery('.location-select-home').on('change', LEGALNAV.selectLocation.homeChange);
			var locationParameter = LEGALNAV.getUrlParam('location');
			if (locationParameter) {
				jQuery('a[href*="' + jQuery(location).attr('hostname') + '"]').each(function(index, link) {
					var link = jQuery(link),
						href = link.attr('href'),
						updateHref = href.includes('?location=') ? href : href + "?location=" + locationParameter;
					link.attr('href', updateHref);
				});
			} else if (!jQuery('.user-state').text()) {
				// If not on Home, Privacy Policy, or FAQ Page
				if(jQuery('.home, .privacy-policy, .page-id-769').length <= 0) {
					LEGALNAV.nav.openLocationModal();
				}
			}
		},
		toolBarChange: function() {
			jQuery('.location-select').next('button').addClass('active');
			var locationName = jQuery('#state-selected').find(":selected").text().toLowerCase();
			//var params = "?location=" + locationName;

			var currentpageurl = jQuery('#currentpageurl').val();
			var locationName = jQuery('#state-selected').find(":selected").text().toLowerCase();
			if (currentpageurl) {
				var params = "?search=" + currentpageurl + "&location=" + locationName;
			} else {
				var params = "?location=" + locationName;
			}
			jQuery("#select-state").attr("action", params);
			jQuery("#searchform-location").attr('value', locationName);
		},
		homeChange: function() {
			jQuery('.location-select-home').next('button').addClass('active');
			var locationName = jQuery('#state-selected').find(":selected").text().toLowerCase();
			var params = "?location=" + locationName;
			jQuery("#select-state").attr("action", params);
			jQuery("#searchform-location").attr('value', locationName);
		}

	},

	searchFilter: {
		scrollToTop: function() {
			jQuery('html, body').animate({
				scrollTop: jQuery('.resource-list-result').position().top
			}, 700);
		},
		init: function() {
			// Handler for clear buttons
			jQuery('.clear-filter-btn').on('click', function(e) {
				// Clear sibling divs inputs
				var inputElems = jQuery(e.target).siblings('.filter-inputs').find('input'),
					activeFilter = jQuery(e.target).closest('.filter-container-mobile').next('.active-filters');
				jQuery(inputElems).each(function(checkbox) {
					inputElems[checkbox].checked = false;
				});
				// clear active filter (mobile only)
				activeFilter.empty();
				// remove active filter clear btn (mobile only)
				activeFilter.next('.clear-active-resource').removeClass('active');
				LEGALNAV.searchFilter.submitFilters();
			});

			// Handler for clear active filters (mobile only)
			jQuery('.clear-active-filter').on('click', function(e) {
				// Clear appropriate inputs
				var inputElems = jQuery(e.target).prevAll('.filter-container-mobile:first').find('input'),
					activeFilter = jQuery(e.target).prevAll('.active-filters:first');
				jQuery(inputElems).each(function(checkbox) {
					inputElems[checkbox].checked = false;
				});
				// clear active filter (mobile only)
				activeFilter.empty();
				// remove active filter clear btn (mobile only)
				jQuery(e.target).removeClass('active');
				LEGALNAV.searchFilter.submitFilters();
				LEGALNAV.searchFilter.scrollToTop();
			});

			jQuery('.clear-active-filter').on('click', function(e) {
				location.reload();
			});

			// Handler for location search filter
			jQuery('.location-submit').on('click', function(e){
				LEGALNAV.searchFilter.submitFilters();
				LEGALNAV.searchFilter.scrollToTop();
			});

			// Handlers for onchange and location search click events
			jQuery('.filter-form input[type="checkbox"]').on('change', function(e) {
				LEGALNAV.searchFilter.submitFilters();
				LEGALNAV.searchFilter.scrollToTop();
			});

			LEGALNAV.searchFilter.initPaginationEvents();
		},
		initPaginationEvents: function() {
			// Handle pagination change
			jQuery('.pagination-button').on('click', function(e) {
				var pageNumber = e.target.dataset.page;
				LEGALNAV.searchFilter.submitFilters(pageNumber);
			});
		},
		submitFilters: function(pageNumber) {
			// remove results
			jQuery('.resource-list-result')[0].innerHTML = "";
			// Unhide loader
			jQuery('.item-loader').removeClass('hidden');
			// Build URL based on filters
			// Make searchString the topic if on topic page
			if(jQuery('.tax-topics').length) {
				var searchString = jQuery('.topics-page-container')[0].dataset.topic;
			} else {
				var searchString = LEGALNAV.getUrlParam('search');
			}

			var formData = jQuery('.filter-form').first().serializeArray();

			var isType = function(data) {return data.name === 'type'}
			var isRegion = function(data) {return data.name === 'region'}
			var isLocation = function(data) {return data.name === 'findLocation'}
			var hasValue = function(data) {return data.value}

			var types = formData.filter(isType).filter(hasValue).map(hasValue);
			var regions = formData.filter(isRegion).filter(hasValue).map(hasValue);
			var location = formData.filter(isLocation).filter(hasValue).map(hasValue);

			// If location is given, it is in lat,lon
			function buildURL(coordString) {
				return "/wp-json/wp/v2/search/?search=" + encodeURIComponent(searchString.replaceAll('+',' ')) +
					((coordString) ? "&findLocation=" + coordString : "") +
					((types.length) ? "&type=" + types.join(",") : "") +
					((regions.length) ? "&region=" + regions.join(",") : "") +
					((pageNumber) ? "&curpage=" + pageNumber : "");
			}

			// Only run google API if there is a location
			if(location.length) {
				var formatedLocation = location.join().replace(' ', '+');
				var key = LEGALNAV.config.geocodeKey;

				// Hit Google API to get findLocation lat and lon
				jQuery.ajax({
					url: "https://maps.google.com/maps/api/geocode/json?address=" + formatedLocation + "&sensor=false&key=" + key,
					success: function(locationData) {
						// Call ajax request to update search results based on filters
						var coordString = [
							locationData.results[0].geometry.location.lat,
							locationData.results[0].geometry.location.lng
						].join(",");
						jQuery.ajax({
							url: buildURL(coordString),
							success: function(results) {
								jQuery('.results-container')[0].innerHTML = results;
								jQuery('.item-loader').addClass('hidden');
								LEGALNAV.searchFilter.initPaginationEvents();
							}
						});
					}
				});
			} else {
				// Call ajax request to update search results based on filters
				jQuery.ajax({
					url: buildURL(),
					success: function(results) {
						jQuery('.results-container')[0].innerHTML = results;
						jQuery('.item-loader').addClass('hidden');
						LEGALNAV.searchFilter.initPaginationEvents();
					}
				});
			}
		}
	},

	filterChoices: [],

	filter: {
		init: function() {
			// check if filter is on page
			if (jQuery('.filter-container').length < 1) {
				jQuery('#map-canvas').removeClass('active');
				return false;
			}
			jQuery('#map-canvas').addClass('active');
			// toggle filter on smaller screens
			jQuery('.filter-dropdown').on('click', LEGALNAV.filter.mobileToggle);
			// observe checkboxes
			jQuery('.filter-container input[type="checkbox"]').change(LEGALNAV.filter.filterChange);

		},
		mobileToggle: function(event) {
			var toggleFilter = jQuery(event.currentTarget);
			//toggle dropdown of filters
			toggleFilter.toggleClass('active');
			toggleFilter.next('.input-container').toggleClass('active');
		},
		filterChange: function(event) {
			var target = jQuery(event.currentTarget),
				form = target.closest('.filter-container-mobile'),
				filter = target.closest('.filter-container');

			LEGALNAV.filterChoices = [];
			target.closest('label').toggleClass('checked');
			// add active filter to list when checked
			filter.find('input[type="checkbox"]').each(function(index, input) {
				input = jQuery(input);
				if (input.is(':checked')) {
					var label = input.next('label'),
						obj = {
							value: input.val(),
							name: input.attr("name"),
							label: label.html()
						};
					LEGALNAV.filterChoices.push(obj);
				}
			});
			LEGALNAV.filter.processFilters();
		},
		filterYank: function(event) {
			var element = jQuery(event.currentTarget),
				value = element.closest('li').attr('data-entry');
			// uncheck filter item when clicking on active filter item
			jQuery(LEGALNAV.filterChoices).each(function(index, item) {
				if (item.value == value) {
					jQuery('input[type="checkbox"][value="' + item.value + '"]').click();
				}
			});
			LEGALNAV.filter.processFilters();
		},
		processFilters: function() {
			var list = jQuery('.active-filters');
			// clear those observers, really
			list.find('a').off('click');
			list.children().remove();
			jQuery(LEGALNAV.filterChoices).each(function(index, value) {
				// add filter to correct filter list
				if (value.name == "type") {
					jQuery('.active-filters.resources').append('<li data-entry="' + value.value + '"><a href="javascript:;" tabindex="' + index + '" role="button"><p>' + value.label + '</p><span> &#10005; </span></a></li>');
				} else {
					jQuery('.active-filters.region').append('<li data-entry="' + value.value + '"><a href="javascript:;" tabindex="' + index + '" role="button"><p>' + value.label + '</p><span> &#10005; </span></a></li>');
				}
			});
			// remove active filter when clicked
			list.find('a').click(LEGALNAV.filter.filterYank);

			if (jQuery('.active-filters.region').children().length) {
				jQuery('.clear-active-region').addClass('active');
			} else {
				jQuery('.clear-active-region').removeClass('active');
			}

			if (jQuery('.active-filters.resources').children().length) {
				jQuery('.clear-active-resource').addClass('active');
			} else {
				jQuery('.clear-active-resource').removeClass('active');
			}
		}
	},

	/*
	Function Name : LEGALNAV.searchFilterListing
	Object Containing both search and Filter listing
	@version: 1
	*/
	searchFilterListing: {

	},
	copyUrl: {
		init: function() {
			// check if on individual organization page or individual GA (until save is worked out)
			if (jQuery('.single-ln_resource').length > 0 || jQuery('.single-guided_assistant').length > 0 ) {
			    jQuery('.action-share').on('click', LEGALNAV.copyUrl.copy);
			} else {
			    return false;
			}
		},
		copy: function() {
			var temp = jQuery("<input>");
			var url = jQuery(location).attr('href');

			jQuery("body").append(temp);
			temp.val(url).select();
			document.execCommand("copy");
			temp.remove();
			jQuery(".copied-message").text("Link copied to clipboard!").addClass('active');

			setTimeout(function() {
				jQuery(".copied-message").text("").removeClass('active');
			}, 2000);
		}
	},

	expertAccordion: {
		init: function() {
			// check if expert accordion element is on page
			if (jQuery('.expert-accordion').length < 1) {
				return false;
			}

			jQuery('.expert-toggle').on('click', LEGALNAV.expertAccordion.toggleDropdown);
		},
		toggleDropdown: function(event) {
			var accordion = jQuery(event.currentTarget);

			accordion.toggleClass('active');
			accordion.next('.topics').toggleClass('active');
		}
	}

};

jQuery(document).ready(function() {
	LEGALNAV.init();
});

LEGALNAV.courtCaseLookUp = {

    //Containers
    detailContainer: jQuery('.court-case-details'),
    informationContainer: jQuery('.case-information'),
    lookupButton: jQuery('#case_lookup_submit'),
    loadingIndicator: jQuery('#case_loading_indicator'),
    caseFields: jQuery('.case-field'),

    //Arrays
    //resultArray: [],
    //Properties
    //LEGALNAV.courtCaseLookUp.detailContainer.attr('data-state')

    init: function() {

        if (LEGALNAV.courtCaseLookUp.detailContainer.length > 0) {
       
            //Check on keyup if any fields have values
            LEGALNAV.courtCaseLookUp.caseFields.on('input', function() {
                //Run a check to see if any case-fields come back with a length
                var empty = true;
                LEGALNAV.courtCaseLookUp.caseFields.each(function(index, element) {
                    if (jQuery(element).val().length > 0) empty = false;
                });

                if (empty) {
                    //Disable submit button
                    LEGALNAV.courtCaseLookUp.lookupButton.attr('disabled', true);
                } else {
                    //Enable submit button
                    LEGALNAV.courtCaseLookUp.lookupButton.attr('disabled', false);
                }
                return false;
            });

            //Check if enter button is pressed on any case-fields
            LEGALNAV.courtCaseLookUp.caseFields.each(function(index, element) {
                jQuery(element).keydown(function(e) {
                    if (e.keyCode == 13) {
                        //If enter is pressed, prevent default submit
                        e.preventDefault();
                        return false;
                    }
                });
            });

            //Check if submit button is clicked
            LEGALNAV.courtCaseLookUp.lookupButton.on('click', function(e) {
                //Pull in case-field values.
                var caseFirstName = jQuery.trim(jQuery("#case_first_name").val()),
                caseLastName = jQuery.trim(jQuery("#case_last_name").val()),
                caseId = jQuery.trim(jQuery("#case_id").val());

                //Set loading indicator
                LEGALNAV.courtCaseLookUp.loadingIndicator.html('Loading...');
                //Run lookupCase function passing in case-field values.
                LEGALNAV.courtCaseLookUp.lookupCase(caseFirstName, caseLastName, caseId);

                //Prevent default submit
                e.preventDefault();
                return false;
            });

        }

    },
    
    
    lookupCase: function(caseFirstName, caseLastName, caseId) {

        //Setup Search Object
        var courtObj = {
            "CaseSearchInputMessage": {
                "CaseData": {
                    "CaseName": "", //Ex. In the Matter of: Curtiss, Aaron and Curtiss, Ashley
                    "CaseNumber": caseId ? caseId : "", //Ex. 3KN-19-00179CI
                    "CaseType": "", //Ex. CIADA
                    "Status": "", //Ex. Open
                    "FiledDate": {
                        "gte": "", //Ex. 2019-01-01
                        "lte": "" //Ex. 2020-01-01
                    },
                    "CourtLocation": "", //Ex. 3AN
                    "CaseParticipant": {
                        "FirstName": caseFirstName ? caseFirstName : "", //Ex. Aaron
                        "LastName": caseLastName ? caseLastName : "", //Ex. Curtiss
                        "MiddleName": "",
                        "CompanyName": "", //Ex. ABC Inc.
                        "Role": "", //Ex. DFNDT
                        "ParticipantAddress": {}, //not implemented
                        "ParticipantAutoRegistration": {}, //not implemented
                        "ParticipantDriversLicense": {} //not implemented
                    }
                }
            }
        }

        //Run search ajax
        jQuery.ajax({
            url: LEGALNAV.courtCaseLookUp.detailContainer.attr('data-url'),
            type: LEGALNAV.courtCaseLookUp.detailContainer.attr('data-post'),
            contentType: 'application/json',
            processData: false,
            data: JSON.stringify(courtObj),
            beforeSend: setHeader,
            success: function(data) {
                LEGALNAV.courtCaseLookUp.processResult(data);

            },
            error: function() {
                //Activate error element
                LEGALNAV.courtCaseLookUp.informationContainer.addClass('active error');
            }
        });
        //Set headers for ajax call
        function setHeader(xhr) {
            xhr.setRequestHeader('X-Api-Key', LEGALNAV.courtCaseLookUp.detailContainer.attr('data-key'));
        };

    },

    // ! LEGALNAV.courtCaseLookUp.processResult
    processResult: function(data) {

        //if CaseData was returned
        if (data && data.CaseSearchOutputMessage && data.CaseSearchOutputMessage.CaseData && data.CaseSearchOutputMessage.CaseData.length > 0) {
            LEGALNAV.courtCaseLookUp.displayResult(data.CaseSearchOutputMessage.CaseData[0]);

        //Otherwise errror.
        } else {
            //Activate error element
            LEGALNAV.courtCaseLookUp.informationContainer.addClass('active error');
            LEGALNAV.courtCaseLookUp.loadingIndicator.html('');
            LEGALNAV.courtCaseLookUp.scrollToResult();
        }

    },

    // ! LEGALNAV.courtCaseLookUp.displayResult
    displayResult: function(resultArray) {
        //Activate case-information
        LEGALNAV.courtCaseLookUp.informationContainer.addClass('active');
        //Remove error element if one exists (consequtive searches)
        LEGALNAV.courtCaseLookUp.informationContainer.removeClass('error');
        //Fill case-information's elements
        jQuery(".case-title").html("<div class='case-box'><span>Case Name: </span><p>" + resultArray.CaseName + "</p></div>");

        var isCaseNumber = false,
        isCasePeople = false,
        isCaseStartInfo = false,
        isCaseNextHearing = false,
        isCaseLastCase = false,
        isCaseStatus = false,
        isCaseWebUrl = false;
        
        var casePeople = "",
        nextHearing = "",
        lastCase = "";
        
        if (LEGALNAV.courtCaseLookUp.detailContainer.attr('data-state') == "alaska") {               
            //Get Case Participants
            if (resultArray.CaseParticipant && resultArray.CaseParticipant.length > 0) {
                for (var person in resultArray.CaseParticipant) {
                    casePeople += resultArray.CaseParticipant[person].FirstName + " ";
                    casePeople += resultArray.CaseParticipant[person].LastName + " ";
                    casePeople += "(" + resultArray.CaseParticipant[person].Role + ")";
                    casePeople += (resultArray.CaseParticipant.length-1 == person) ? "" : ", ";
                }
                isCasePeople = true;
            }
            if (resultArray.Hearings && resultArray.Hearings.length > 0) {
                //Get Next Hearing
                nextHearing += resultArray.Hearings[resultArray.Hearings.length-1].HearingType + " on ";
                nextHearing += LEGALNAV.courtCaseLookUp.parseDate(resultArray.Hearings[resultArray.Hearings.length-1].HearingDate);
                isCaseNextHearing = true;
            }
            if (resultArray.CaseFilings && resultArray.CaseFilings.length > 0) {
                //Get Last Case
                lastCase += resultArray.CaseFilings[resultArray.CaseFilings.length-1].DocumentTitle + " on ";
                lastCase += LEGALNAV.courtCaseLookUp.parseDate(resultArray.CaseFilings[resultArray.CaseFilings.length-1].FiledDate);
                isCaseLastCase = true;
            }
            //Set bools.
            isCaseStartInfo = true;
            isCaseWebUrl = true;
        } else if (LEGALNAV.courtCaseLookUp.detailContainer.attr('data-state') == "hawaii") {   
            //Set bools
            isCaseNumber = true;
            isCaseStatus = true;
            isCaseWebUrl = true;
        }

        var caseDetails = "";
        caseDetails += (isCaseNumber) ? "<div class='case-box'><span>Case ID: </span><p>" + resultArray.CaseNumber + "</p></div>" : "";

        caseDetails += (isCasePeople) ? "<div class='case-box'><span>People in this case: </span><p>" + casePeople + "</p></div>" : "";
        caseDetails += (isCaseStartInfo) ? "<div class='case-box'><span>The case was started on: </span><p>" + LEGALNAV.courtCaseLookUp.parseDate(resultArray.FiledDate) + " in " + resultArray.CourtLocation + "</p></div>" : "";
        caseDetails += (isCaseNextHearing) ? "<div class='case-box'><span>The next hearing is: </span><p>" + nextHearing + "</p></div>" : "";
        caseDetails += (isCaseLastCase) ? "<div class='case-box'><span>The last case entry was: </span><p>" + lastCase + "</p></div>" : "";

        caseDetails += (isCaseStatus) ? "<div class='case-box'><span>Status: </span><p>" + resultArray.Status + "</p></div>" : "";
        caseDetails += (isCaseWebUrl) ? "<div class='case-box'><span>For More Information: </span><p><button class='btn btn-primary' onclick='window.open(\"" + LEGALNAV.courtCaseLookUp.detailContainer.attr('data-weburl') + "\" ,\"_blank\")'>Visit the Court's Website</button></p></div>" : "";
            
        jQuery(".case-details").html(caseDetails);
        
        //Set loading indicator
        LEGALNAV.courtCaseLookUp.loadingIndicator.html('');
        LEGALNAV.courtCaseLookUp.scrollToResult();
    },

    // ! LEGALNAV.courtCaseLookUp.parseDate
    parseDate: function(dateString) {
        var Date = dateString.replace('T',' ').replace('Z','');
        return Date;
    },

    // ! LEGALNAV.courtCaseLookUp.scrollToResult
    scrollToResult: function() {
        //Scroll down to case-information-results
        var scrollElement = document.getElementById("case-information-results");
        if (scrollElement) {
            scrollElement.scrollIntoView({
                behavior: 'smooth',
                block: 'end'
            });
        }
    }
    
}


LEGALNAV.locations = {
	locationMaps: [],
	fullMap: {},
	data: false,

	init: function(data) {
		LEGALNAV.locationsData = '';
		LEGALNAV.normalIcon = "/wp-content/themes/legalnav2021/assets/images/map-pin.png";
		LEGALNAV.highlightedIcon = "/wp-content/themes/legalnav2021/assets/images/map-pin.png";
		LEGALNAV.locations.renderFullMap(data);
	},

	// ! LEGALNAV.locations.renderFullMap
	// Renders map for large map view on locations page
	renderFullMap: function(data) {
		var locations = data;
		if ((locations) && (locations.length)) {

			var map = new google.maps.Map(document.getElementById('map-canvas'), {
				zoom: 18,
				center: new google.maps.LatLng(locations[0][0], locations[0][1]),
				mapTypeId: google.maps.MapTypeId.ROADMAP,
				mapTypeControl: false,
				streetViewControl: false,
				panControl: false,
				zoomControlOptions: {
					position: google.maps.ControlPosition.LEFT_BOTTOM
				}
			});
			jQuery('#map-canvas').show();
			var infowindow = new google.maps.InfoWindow({
				maxWidth: 200
			});
			var marker;
			var markers = new Array();
			var bounds = new google.maps.LatLngBounds();
			if (locations != null) {
				var markerClusterer;
				// Add the markers and infowindows to the map
				for (var i = 0; i < locations.length; i++) {
					var position = new google.maps.LatLng(locations[i][0], locations[i][1]);
					bounds.extend(position);
					marker = new google.maps.Marker({
						position: position,
						map: map,
						icon: LEGALNAV.normalIcon
					});
					markers.push(marker);
					google.maps.event.addListener(marker, 'click', (function(marker, i) {
						return function() {
							jQuery.each(markers, function(index, markerobj) {
								markerobj.setIcon(LEGALNAV.normalIcon);
							});

							var content = '<div class="map-content">';
							content += '<div class="map-link"><a href=' + locations[i][4] + '><h5>' + locations[i][2] + '</h5></a> <div class="info">' + locations[i][3] + '</div>';
							content += '</div>';
							if (locations[i][2] != undefined && locations[i][2] != '') {
								infowindow.setContent(content);
								infowindow.open(map, marker);
							}
						}
					})(marker, i));
					google.maps.event.addListener(infowindow, 'domready', function() {
						jQuery(".gm-style-iw").next("div").css({
							"top": "76px",
							"right": "12px"
						});;
					});
					if (locations.length > 1) {
						map.fitBounds(bounds);
					}

				}
			}
			if (locations.length == 0) {
				jQuery('#map-canvas').empty();
			}
			jQuery('.resource-list').on({
				mouseenter: function() {
					jQuery.each(markers, function(index, markerobj) {
						markerobj.setIcon(LEGALNAV.normalIcon);
					});
					var index = jQuery('.resource-list .search-list').index(this);

					//var mlat = jQuery(this).data('lat');
					//var mlng = jQuery(this).data('lng');

					google.maps.event.trigger(markers[index], 'click');
					//markers[index].setIcon(LEGALNAV.highlightedIcon);
					var myLatLng = new google.maps.LatLng(mlat, mlng);


					var index = jQuery('.resource-list .search-list').index(this);
					var mlat = jQuery(this).data('lat');
					var mlng = jQuery(this).data('lng');
					var permalink = jQuery(this).data('link');
					var addressdetails = jQuery(this).data('addressdetails');
					var title = jQuery(this).data('title');

					var content = '<div class="map-content">';
					content += '<div class="map-link"><a href=' + permalink + '><h5>' + title + '</h5></a> <div class="info">' + addressdetails + '</div>';
					content += '</div>';

					//var content = '<div class="map-content">';
					//content += '<div class="map-link"><a href=' + locations[index][4] + '><h5>' + locations[index][2] + '</h5></a> <div class="info">' + locations[index][3] + '</div>';
					//content += '</div>';

					//if (locations[index][2] != undefined && locations[index][2] != '') {
					infowindow.setContent(content);
					infowindow.open(map, markers[index]);
					//}
				},
				mouseleave: function() {
					var index = jQuery('.resource-list .search-list').index(this);
					//markers[index].setIcon(LEGALNAV.normalIcon);
					infowindow.close();
				}
			}, '.search-list');
		}
	},
};
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

LEGALNAV.papActions = (function() {
    return {
        init
    }

    function init() {
        var gaType = jQuery('.ga-type').first().data('ga-type');

        if(!gaType) {
            return; // Early return if not on GA page
        }

        var downloadActionButtons = jQuery('.action-download');
        var printActionButtons = jQuery('.action-print');

        downloadActionButtons.click(function(e) {
            e.preventDefault();

            downloadAP(gaType);
        });

        printActionButtons.click(function() {
            printAP(gaType);
        });
    }

    function downloadAP(gaType) {
        var content = getActionPlanContent(gaType);

        if(!content) {
            return;
        }

        var pdfHTML = "<!DOCTYPE html><html>" + content + "</html>";

        html2pdf(pdfHTML, {
            margin: 16,
            pagebreak: { mode: 'avoid-all' }
        });
    }

    function printAP(gaType) {
        switch(gaType) {
            case 'a2j':
                break;
            case 'legal_server':
                // Open PAP steps
                jQuery('guided-nav details').attr("open", "");
                break;
        }

        window.print();
    }

    function getActionPlanContent(gaType) {
        switch(gaType) {
            case 'a2j':
                return getA2JPlanContent();
            case 'legal_server':
                return getLSPlanContent();
        }
    }

    function getA2JPlanContent() {
        var content = jQuery('.personal-plan').first()[0].innerHTML;

        // Exclude 'no-print' elements
        content = excludeNoPrintElems(content);

        // Remove step 'toggle' links
        content = content.replace(
            /<a href=\"javascript:;\"[^<]*(.*)<\/a>/gm,
            "$1"
        );

        return content;
    }

    function getLSPlanContent() {
        // Get initial AP content
        var content = jQuery('.gn-for-element-wrapper').first()[0].innerHTML;

        // Add 'open' attribute to details elements
        content = openDetails(content);

        // Remove button elements
        content = content.replace(
            /<button.*<\/button>/gm,
            ""
        );

        return content;
    }

    function excludeNoPrintElems(html) {
        var htmlObj = jQuery(html);
        htmlObj.find('.no-print').remove();

        // Hack to turn FULL jquery object into HTML, not just first elem
        return jQuery('<div>').append(htmlObj.clone()).remove().html();
    }

    function openDetails(html) {
        var htmlObj = jQuery(html);
        htmlObj.find('details').attr("open", "");

        // Hack to turn FULL jquery object into HTML, not just first elem
        return jQuery('<div>').append(htmlObj.clone()).remove().html();
    }
})();
