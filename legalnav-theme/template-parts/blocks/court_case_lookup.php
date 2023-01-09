<?php
	$court_api_settings = get_field('court_api_settings', 'option');

	//Get properties from Api settings.
	$court_api_url = $court_api_settings['court_api_url'];
	$court_api_post_type = $court_api_settings['court_api_post_type'];
	$court_api_key = $court_api_settings['court_api_key'];
	//Bool flags to enable/disable search options.
	$court_search_by_first_name = $court_api_settings['court_search_by_first_name'];
	$court_search_by_last_name = $court_api_settings['court_search_by_last_name'];
	$court_search_by_case_id = $court_api_settings['court_search_by_case_id'];
	//Custom callout section texts
	$court_api_description = $court_api_settings['court_api_description'];
	$court_api_more_info = $court_api_settings['court_api_more_info'];
	$court_website_url = $court_api_settings['court_website_url'];
	$court_no_result_message = $court_api_settings['court_no_result_message'];

	$color_style = get_field('color_style');

	if(!empty($court_api_url && !empty($court_api_post_type))) { ?>
		<section class="court-case-callout <?php echo $color_style ?>">
			<div class="container">
				<div class="court-case-container">
					<div class="scale-icon">
						<svg xmlns="http://www.w3.org/2000/svg" width="251" height="192.062" viewBox="0 0 251 192.062"><g data-name="Component 17 – 5" transform="translate(0.5 0.5)"><path data-name="Union 3" d="M144.975,188.44V106.322c0-9.874,7.9-17.455,8.707-18.2a35.876,35.876,0,0,0,9.164-14.861,23.932,23.932,0,0,0,1.178-6.915c0-.025,0-.064,0-.089V54.171a5.127,5.127,0,0,0-1.4-3.867c-1.686-1.654-4.665-1.971-5.7-1.946H127.955c-.132,3.243.231,8.254,2.646,11.053A6.986,6.986,0,0,0,136.24,61.7H148.47a2.622,2.622,0,0,1,0,5.245H136.24a12.084,12.084,0,0,1-9.622-4.118,17.643,17.643,0,0,1-3.674-9.257,12.393,12.393,0,0,1-21.781-2.542A12.335,12.335,0,0,1,86.9,52.281v9.475c.067,1.048,1,14.311,5.769,24.64,1.38,1.945,8.506,12.353,8.506,19.926V188.44a2.622,2.622,0,0,1-5.245,0V106.322c0-5.284-5.531-14.11-7.663-17.064a2.621,2.621,0,0,1-.248-.421c-5.473-11.675-6.327-26.243-6.36-26.858,0-.047,0-.095,0-.143V46.269a12.33,12.33,0,0,1-.932-4.7V36.031H37.763a2.621,2.621,0,0,1-1.854-.769l-8.335-8.335a2.623,2.623,0,0,1,3.709-3.709l7.566,7.568H80.729V20.223a12.39,12.39,0,0,1,19.783-9.966,12.388,12.388,0,0,1,22-5.447,12.388,12.388,0,0,1,22,5.447A12.389,12.389,0,0,1,164.3,20.223V41.566a12.383,12.383,0,0,1-.431,3.229,10.748,10.748,0,0,1,2.388,1.732,10.358,10.358,0,0,1,3.008,7.644V66.219c.028,1.115.068,13.668-11.915,25.651-.03.03-.06.06-.091.088-.067.061-7.041,6.536-7.041,14.364V188.44a2.622,2.622,0,0,1-5.245,0ZM105.556,12.414V46.535a7.169,7.169,0,1,0,14.337,0V12.414a7.169,7.169,0,1,0-14.337,0ZM85.973,20.223V41.566a7.169,7.169,0,0,0,14.338,0V20.223a7.169,7.169,0,1,0-14.338,0Zm72.883,23.012a7.207,7.207,0,0,0,.2-1.669V20.223a7.169,7.169,0,1,0-14.337,0V42.77a2.525,2.525,0,0,1-.035.343h12.137c.052,0,.125,0,.216,0A14.757,14.757,0,0,1,158.856,43.235ZM125.138,12.414V43.152a2.571,2.571,0,0,1,.418-.038h13.955a2.621,2.621,0,0,1-.035-.343V12.414a7.169,7.169,0,1,0-14.338,0Zm85.48,164.236a31.838,31.838,0,0,1-31.8-31.8V131.13a2.623,2.623,0,0,1,2.623-2.623h65.936A2.623,2.623,0,0,1,250,131.13v13.719a31.838,31.838,0,0,1-31.8,31.8Zm-26.555-31.8a26.587,26.587,0,0,0,26.555,26.557h7.58a26.588,26.588,0,0,0,26.557-26.557v-11.1H184.063ZM31.8,176.65A31.837,31.837,0,0,1,0,144.848V131.13a2.622,2.622,0,0,1,2.622-2.623H68.558a2.622,2.622,0,0,1,2.622,2.623v13.719a31.837,31.837,0,0,1-31.8,31.8Zm-26.556-31.8A26.586,26.586,0,0,0,31.8,171.405h7.58a26.586,26.586,0,0,0,26.556-26.557v-11.1H5.245Zm235.92-24.992L214,52.725l-27.168,67.131a2.623,2.623,0,0,1-4.862-1.968l29.6-73.136a2.622,2.622,0,0,1,4.862,0l29.6,73.136a2.623,2.623,0,1,1-4.862,1.968Zm-178.817,0L35.178,52.725,8.009,119.856a2.623,2.623,0,0,1-4.862-1.968l29.6-73.136a2.622,2.622,0,0,1,4.862,0l29.6,73.136a2.623,2.623,0,1,1-4.862,1.968ZM171.162,36.031a2.622,2.622,0,1,1,0-5.245h43.028l7.568-7.568a2.622,2.622,0,1,1,3.708,3.708l-8.335,8.335a2.621,2.621,0,0,1-1.854.769Z" fill="#0d3fb8" stroke="rgba(0,0,0,0)" stroke-miterlimit="10" stroke-width="1"/></g></svg>
					</div>

					<div class="court-case-details" data-url= "<?php echo $court_api_url; ?>" data-post="<?php echo $court_api_post_type; ?>" data-key="<?php echo $court_api_key; ?>" data-weburl="<?php echo $court_website_url; ?>" data-state="<?php echo $state_term->slug; ?>">
						<h2>Court Case Lookup</h2>
						<p class="court-case-description"><?php echo $court_api_description; ?></p>
						<form method="<?php echo $court_api_post_type ?>">
							<div>
								<label class="da-top-label" for="case_id">Case ID</label>
								<?php if ($court_search_by_first_name) { ?>
								<input type="text" class="case-field" name="case_first_name" id="case_first_name" placeholder="Case First Name">
								<?php } if ($court_search_by_last_name) { ?>
								<input type="text" class="case-field" name="case_last_name" id="case_last_name" placeholder="Case Last Name">
								<?php } if ($court_search_by_case_id) { ?>
								<input type="text" class="case-field" name="case_id" id="case_id" placeholder="Case ID">
								<?php } ?>
								<button type="button" id="case_lookup_submit" disabled>Search</button>
								<div id="case_loading_indicator"></div>
							</div>
						</form>
						<p class="court-case-more-info"><?php echo $court_api_more_info; ?></p>
					</div>
				</div>

				<div class="case-information" id="case-information-results">
					<h2 class="case-information-header">Here is what we know about your case:</h2>
					<div class="case-information-error">
						<svg xmlns="http://www.w3.org/2000/svg" width="60.519" height="61" viewBox="0 0 60.519 61"><path d="M6.378,60A.681.681,0,0,1,5.7,59.32V55.041a3.877,3.877,0,0,1,3.873-3.873h3.195V48.585a2.9,2.9,0,0,1,2.9-2.9H49.554a2.9,2.9,0,0,1,2.9,2.9v2.583h3.2a3.877,3.877,0,0,1,3.873,3.873V59.32a.681.681,0,0,1-.681.681Zm.681-4.959v3.6h51.1v-3.6a2.515,2.515,0,0,0-2.512-2.512H9.571A2.515,2.515,0,0,0,7.059,55.041Zm7.068-6.456v2.583H51.089V48.585a1.537,1.537,0,0,0-1.535-1.535H15.662A1.537,1.537,0,0,0,14.127,48.585ZM1.057,48.39a3.62,3.62,0,0,1,0-5.112L19.8,24.536a.673.673,0,0,1,.278-.165l-5.116-5.116-.258.258A3.9,3.9,0,1,1,9.185,14L22.039,1.142a3.9,3.9,0,0,1,5.517,5.517l-.259.259,5,5a3.755,3.755,0,0,1,5.222,5.223l5,5,.258-.258A3.9,3.9,0,0,1,48.3,27.407L35.45,40.261a3.9,3.9,0,0,1-5.517-5.517l.259-.259L25.076,29.37a.675.675,0,0,1-.165.278L6.169,48.39a3.615,3.615,0,0,1-5.112,0ZM20.761,25.5,2.019,44.24a2.254,2.254,0,0,0,3.187,3.187L23.948,28.685a.67.67,0,0,1,.278-.165l-3.3-3.3A.675.675,0,0,1,20.761,25.5Zm22.988-2.645L30.9,35.707A2.54,2.54,0,0,0,34.488,39.3L47.341,26.445a2.54,2.54,0,0,0-3.592-3.592ZM15.923,18.292,31.154,33.523,41.566,23.112l-9.791-9.79h0L26.335,7.88ZM23,2.105,10.148,14.959a2.54,2.54,0,0,0,3.592,3.592l.738-.738v0h0L25.853,6.437h0l.74-.74A2.54,2.54,0,0,0,23,2.105Zm10.287,10.8,3.248,3.248a2.4,2.4,0,0,0-3.248-3.248Z" transform="translate(0.5 0.5)" fill="#333" stroke="rgba(0,0,0,0)" stroke-miterlimit="10" stroke-width="1"/></svg>
						<h4 class="case-information-error-msg">Sorry, your search did not return any results.</h4>
						<p class="case-information-no-result"><?php echo $court_no_result_message; ?></p>
					</div>
					<div class="case-information-container">
						<div class="case-information-left">
							<svg xmlns="http://www.w3.org/2000/svg" width="60.519" height="61" viewBox="0 0 60.519 61"><path d="M6.378,60A.681.681,0,0,1,5.7,59.32V55.041a3.877,3.877,0,0,1,3.873-3.873h3.195V48.585a2.9,2.9,0,0,1,2.9-2.9H49.554a2.9,2.9,0,0,1,2.9,2.9v2.583h3.2a3.877,3.877,0,0,1,3.873,3.873V59.32a.681.681,0,0,1-.681.681Zm.681-4.959v3.6h51.1v-3.6a2.515,2.515,0,0,0-2.512-2.512H9.571A2.515,2.515,0,0,0,7.059,55.041Zm7.068-6.456v2.583H51.089V48.585a1.537,1.537,0,0,0-1.535-1.535H15.662A1.537,1.537,0,0,0,14.127,48.585ZM1.057,48.39a3.62,3.62,0,0,1,0-5.112L19.8,24.536a.673.673,0,0,1,.278-.165l-5.116-5.116-.258.258A3.9,3.9,0,1,1,9.185,14L22.039,1.142a3.9,3.9,0,0,1,5.517,5.517l-.259.259,5,5a3.755,3.755,0,0,1,5.222,5.223l5,5,.258-.258A3.9,3.9,0,0,1,48.3,27.407L35.45,40.261a3.9,3.9,0,0,1-5.517-5.517l.259-.259L25.076,29.37a.675.675,0,0,1-.165.278L6.169,48.39a3.615,3.615,0,0,1-5.112,0ZM20.761,25.5,2.019,44.24a2.254,2.254,0,0,0,3.187,3.187L23.948,28.685a.67.67,0,0,1,.278-.165l-3.3-3.3A.675.675,0,0,1,20.761,25.5Zm22.988-2.645L30.9,35.707A2.54,2.54,0,0,0,34.488,39.3L47.341,26.445a2.54,2.54,0,0,0-3.592-3.592ZM15.923,18.292,31.154,33.523,41.566,23.112l-9.791-9.79h0L26.335,7.88ZM23,2.105,10.148,14.959a2.54,2.54,0,0,0,3.592,3.592l.738-.738v0h0L25.853,6.437h0l.74-.74A2.54,2.54,0,0,0,23,2.105Zm10.287,10.8,3.248,3.248a2.4,2.4,0,0,0-3.248-3.248Z" transform="translate(0.5 0.5)" fill="#333" stroke="rgba(0,0,0,0)" stroke-miterlimit="10" stroke-width="1"/></svg>
							<div class="case-title"></div>
						</div>
						<div class="case-information-right">
							<div class="case-details"></div>
						</div>
					</div>
				</div>
			</div>
		</section>
	<?php } ?>
