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