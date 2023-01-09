<?php
/**
 * Single Resource Template
 */
ob_start();
include 'inc/resource-page-functions.php';
include 'classes/ls-resource.php';
$resource_types = array();
$ls_resource_url = "";
if (have_posts()) {
	while (have_posts()) {
		the_post();

		// Redirect if:
		//  - Referrer is GA
		//  - Resource is not an organization
		//  - Resource is simply an external link (video or external)
		$resource_types = array_map(function ($x) {return $x->slug;}, get_the_terms(get_the_ID(), 'resource_type'));
		$is_ga_referrer = (strpos($_SERVER['HTTP_REFERER'], 'guided_assistant') !== false);
		$is_organization = in_array('organization', $resource_types);
		$external_link = (get_field('link', get_the_ID())) ? get_field('link', get_the_ID()) : get_field('video_link', get_the_ID());
		if ($is_ga_referrer && !$is_organization && !empty($external_link)) {
			// Redirect Header Location to external/video link
			header("Location: " . $external_link);
			ob_end_flush();
		}
	}
}
ob_end_flush();
rewind_posts();
get_header();
?>
<main class="site-main">
	<div class="container">
		<?php if (have_posts()) {
			while (have_posts()) {
				the_post();

                $postID = get_the_ID();

				$is_ls_resource = get_field('is_ls_resource');

                // LS Resource Fields
                $content_uuid = get_field('cr_uuid');
                $kr_uuid = get_field('kr_uuid');
                $ls_api_domain = get_field('legal_server_resource_api_domain', 'option');
                $ls_resource_url = "{$ls_api_domain}/{$kr_uuid}/translated_contents/{$content_uuid}";

                // Referrer options
				$prev_page = $_SERVER['HTTP_REFERER'];
				$refered_by_topic_page = strpos($_SERVER['HTTP_REFERER'], 'topic');

				// Get true/false court lookup field.
				$show_court_lookup = get_field('show_court_lookup');

				// Resource fields
				$overview = get_field('overview');

				//Get organizational fields.
				$address_label = get_field('location_label');
				$google_map_address = get_field('address');
				$address_details = get_field('address_details');
				$phone_number = get_field('phone_number');
				$website_url = get_field('website');
				$specialties = get_field('specialties');
				$eligibility_information = get_field('eligibility_information');
				$additional_information = get_field('additional_information');
				$office_hours = get_field('office_hours');

				//Get additional addresses. Check for additional urls.
				$additional_addresses = get_field('additional_addresses');
				$additional_urls = array_map(function($x){return $x['website'];}, $additional_addresses);

				// Main address data
				$main_address_data = [
					'address' => [
						'label' => $address_label,
						'address_details' => $address_details,
						'phone_number' => $phone_number,
						'website' => $website_url,
						'has_shared_website' => !$additional_urls
					]
				];

				//Google Map Data
				$gmap_data = generate_google_map_data($google_map_address, $additional_addresses);

				// Resource type flags
				$is_organization = in_array('organization', $resource_types);
				$is_video = in_array('video', $resource_types);
				$is_related_reading = in_array('related-readings', $resource_types);
				$is_form = in_array('form', $resource_types);
                ?>

					<div class="org-actions-toolbar">
						<?php if ($refered_by_topic_page) { ?>
							<a class="back-to-results-btn" href="<?= $prev_page; ?>">← Back to Results</a>
						<?php } ?>

                        <?php echo render_action_links($is_ls_resource, $ls_resource_url); ?>

                        <h5 class="copied-message"></h5>
                    </div>
					<div class="resource-container">
						<h1><?php the_title(); ?></h1>

						<?php if (!$additional_urls && $is_organization) { ?>
							<div class="organization-website">
								<a href="<?= $website_url ?>" target="_blank"><?= remove_link_protocol($website_url); ?></a>
							</div>
						<?php } ?>

						<div class="col-md-8 col-sm-12 org-video-container">

							<?php if ($main_address_data) {
								if ($additional_addresses) { ?>
									<h4>Our Locations</h4>
									<div class="organization-details-container">
								<?php }

								// Render address blocks with contact info
								$addresses = $additional_addresses ? array_merge($main_address_data, $additional_addresses) : $main_address_data;

								// If 'website' and 'has_shared' are the only non-empty values, dont render address contact sections.
								if($addresses[0]['address_details'] || $addresses[0]['phone_number']) {
									echo render_address_contact_sections($addresses);
								}

								if ($additional_addresses) { ?>
									</div>
								<?php }
							} ?>

							<?php the_content(); ?>

                            <?php if($is_ls_resource) { ?>
                                <iframe src="<?=$ls_resource_url?>" frameborder="0"></iframe>
                            <?php } ?>

							<?php if ($is_video) {
								$video_link = get_field('video_link');
								$video_id = @end(explode('/', $video_link));
								if (strpos($video_link, 'youtube') > 0) {
									$imageURL = 'https://img.youtube.com/vi/' . $video_id . '/0.jpg';
								} elseif (strpos($video_link, 'vimeo') > 0) {
									$hash = unserialize(@file_get_contents("https://vimeo.com/api/v2/video/$video_id.php"));
									$imageURL = $hash[0]['thumbnail_large'];
								}
							?>
								<div class="article-img cover-bg video-callout video-callout-small" style="background-image: url('<?=$imageURL; ?>');"></div>
								<iframe allowfullscreen="" frameborder="0" src="<?=$video_link; ?>"></iframe>
							<?php } ?>

							<?php if ($is_related_reading && !$is_ls_resource) { ?>
								<a class="btn btn-primary external" href="<?=get_field('link', $postID); ?>" target="_blank">View External Resource</a>
							<?php } ?>

							<?php if ($is_form) { ?>
								<a class="btn btn-primary external" href="<?=get_field('link', $postID); ?>" target="_blank">Go To Form</a>
							<?php } ?>

							<?php if ($overview || $specialties) { ?>
								<div class="organization-overview-info">
									<?php if ($overview) { ?>
										<div class="organization-overview">
											<h4>Overview</h4>
											<p><?= $overview; ?></p>
										</div>
									<?php } ?>

									<?php if ($specialties) { ?>
										<div class="organization-specialties">
											<h5>Specialties</h5>
											<p><?= $specialties; ?></p>
										</div>
									<?php } ?>
								</div>
							<?php } ?>

							<?php if ($eligibility_information) { ?>
								<div class="organization-eligibility-information">
									<h4>Eligibility Information</h4>
									<p><?= $eligibility_information; ?></p>
								</div>
							<?php } ?>

							<?php if ($additional_information) { ?>
								<div class="organization-description">
									<h4>Additional Information</h4>
									<?= $additional_information; ?>
								</div>
							<?php } ?>
						</div>
					</div>
					<div class="sidebar col-md-4 col-sm-12 pull-right org-sidebar">
						<?php if (!empty($address_details)) {?>
							<div class="mapouter">
								<div id="map-data" style="display:none;" data-coord="<?=urlencode(json_encode($gmap_data));?>"></div>
								<div id="map-canvas" style="width: 100%;height: 100%;"></div>
							</div>
						<?php } else { ?>
							<aside>
								<div class="side-ga-callout">
									<h4>Need help? Use our Guided Assistant to receive personalized recommendations.</h4>
									<p>No account necessary. We never share any information you provide. Read our <a href="/privacy-policy">Privacy Notice</a>.</p>
									<a href="/guided-assistant" class="btn btn-primary">Start the Guided Assistant</a>
								</div>
							</aside>
						<?php } ?>

						<?php if (!empty($office_hours)) { ?>
							<div class="office_hours">
								<h4>Business Hours</h4>
								<p><?=$office_hours; ?></p>
							</div>
						<?php } ?>
					</div>

					<div class="clear"></div>

					<div class="org-mobile-toolbar">
                        <h5 class="copied-message"></h5>
                        <?php echo render_action_links($is_ls_resource, $ls_resource_url); ?>
                        <div class="clear"></div>
					</div>

					<div class="clear"></div>
				<?php }
			}

		if ($show_court_lookup) {
			get_template_part("/template-parts/blocks/court_case_lookup");
		} ?>
	</div>
</main>

<?php
	$maps_key = get_field('google_creds', 'options')['google_maps_key'];
	wp_enqueue_script('legalnav-google-map', 'https://maps.google.com/maps/api/js?v=3&key='.$maps_key, array('jquery'), 1.1, false);
?>

<?php get_footer(); ?>
