<?php

// ! get_video_img_url
// - Accepts a string containing the URL of a video ($video_url)
// - Returns a string containing the URL of a thumbnail for the passed $video_url
// - Errors: -1 = No Video Url, -2 Invalid/Unknown Video URL
function get_video_img_url($video_url)
{

	//Check if $video_url is unset. If so return error -1.
	if (empty($video_url)) {
		return -1;
	}

	//If youtube is in the url get a tube img.
	if (strpos($video_url, 'youtube') > 0) {

		//Get Video ID from the last array item in the exploded URL.
		$video_id = @end(explode('/', $video_url));

		//Return the youtube img URL.
		return 'https://img.youtube.com/vi/' . $video_id . '/0.jpg';
	}

	//If vimeo is in the url get a tube img.
	if (strpos($video_url, 'vimeo') > 0) {

		//Get Video ID from the last array item in the exploded URL.
		$video_id = @end(explode('/', $video_url));

		//Get the result of the id lookup, unserialize into an array.
		$video_result = unserialize(@file_get_contents("https://vimeo.com/api/v2/video/" . $video_id . ".php"));

		//Return the proper thumbnail URL in the
		return $video_result[0]['thumbnail_large'];
	}

	//Nothing found. Return error -2.
	return -2;
}

function calculate_miles($latA, $lngA, $latB, $lngB)
{
	$miles =
		(
			(ACOS(
				SIN(
					PI() * $latA / 180.0
				) *
					SIN(
						PI() * $latB / 180.0
					) +
					COS(
						PI() * $latA / 180.0
					) *
					COS(
						PI() * $latB / 180.0
					) *
					COS(
						($lngA - $lngB
						) *
							PI() / 180
					)
			) *
				180 / PI()
			) *
			60 * 1.1515
		);
	return $miles;
}

// ! render_organization_post
// - Accepts a single post_id
// - Returns nothing, this is a render function
// - Errors: N/A
function render_organization_post($post_id, $miles)
{
	//Get the post item's resource type
	$post_types = get_the_terms($post_id, 'resource_type');
	$post_type_slug = $post_types[0]->slug;

	//Initiate the post item's class
	$post_class = $post_type_slug;
	$post_class .= " " . $post_id;

	//Get the post item's address info.
	$post_latitude = get_field('x_location_lat', $post_id);
	$post_longitude = get_field('x_location_lng', $post_id);
	$post_address = get_field('address_details', $post_id);
	$additional_addresses = get_field('additional_addresses', $post_id);
	$post_phone = get_field('phone_number', $post_id);
	$post_website = get_field('website', $post_id);

	//Get the post item's url
	$post_url = get_the_permalink($post_id);


	//Get the post item's priority
	$resource_priority = get_field('priority_resource', $post_id);
	//If it exists add it to the post item's class
	$post_class .= (!empty($resource_priority)) ? ' priority-resource-container' : '';

	//Add search-list to post item's class if lat and long are both set.
	$post_class .= (!empty($post_latitude) && !empty($post_latitude)) ? ' search-list' : ''; ?>

	<!-- Organization Post Begins -->
	<article class="resource <?php echo $post_class; ?>" data-lat="<?php echo $post_latitude; ?>" data-lng="<?php echo $post_longitude; ?>" data-permalink="<?php echo $post_url; ?>" data-addressdetails="<?php echo htmlspecialchars($post_address, ENT_QUOTES, 'UTF-8'); ?>" data-title="<?php echo get_the_title($post_id); ?>">
		<div class="resource-details">
			<a class="resource-link-title" href="<?= $post_url ?>">
				<h4 class="resource-title"><?= get_the_title($post_id) ?></h4>
			</a>
			<p class="resource-desc"><?= get_field('overview', $post_id) ?></p>
			<?php if (!empty($post_address) || !empty($post_phone) || !empty($post_website)) { ?>
				<ul class="organization-details">
					<?php
					$liCount = 0;
					$liClassWidth = "";

					if (!empty($post_address)) {
						$liCount++;
					}
					if (!empty($post_phone)) {
						$liCount++;
					}
					if (!empty($post_website)) {
						$liCount++;
					}

					if ($liCount >= 1) {
						$liClassWidth = "link-topics-$liCount";
					} else {
						$liClassWidth = "";
					}

					if (!empty($post_address)) {
						$address_text = $post_address;
						if (!empty($additional_addresses)) {
							$address_text = "Multiple Locations";
						} ?>
						<li class="organization-address <?= $liClassWidth ?>">
							<a href="<?= $post_url ?>"><?= $address_text ?></a>
							<?php if ($miles !== NULL) { echo round($miles)." miles from your location"; } ?>
						</li>
					<?php }
					if (!empty($post_phone)) { ?>
						<li class="organization-phone-number <?= $liClassWidth ?>"><a href="tel:<?= $post_phone ?>"><?= $post_phone ?></a></li>
					<?php }
					if (!empty($post_website)) { ?>
						<?php
						// Remove https/https from links when they render out to user
						$no_protocal_link = preg_replace("#^[^:/.]*[:/]+#i", "", $post_website);
						?>
						<li class="organization-website <?= $liClassWidth ?>"><a href="<?= $post_website ?>" target="_blank"><?= $no_protocal_link ?></a></li>
					<?php } ?>
				</ul>
			<?php } ?>
		</div>
	</article>
	<!-- Organization Post Ends -->
<?php }


// ! render_video_post
// - Accepts a single post_id
// - Returns nothing, this is a render function
// - Errors: N/A
function render_video_post($post_id)
{
	//Get the post item's resource type
	$post_types = get_the_terms($post_id, 'resource_type');
	$post_type_slug = $post_types[0]->slug;

	//Initiate the post item's class
	$post_class = $post_type_slug;
	$post_class .= " " . $post_id;

	//Get the post item's url
	$post_url = get_the_permalink($post_id);

	//Get the posts video url and thumbnai url
	$post_video_url = get_field('video_link', $post_id);
	$post_video_img_url = get_video_img_url($post_video_url);

	//Get the post item's priority
	$resource_priority = get_field('priority_resource', $post_id);
	//If it exists add it to the post item's class
	$post_class .= (!empty($resource_priority)) ? ' priority-resource-container' : ''; ?>

	<!-- Video Post Begins -->
	<article class="resource <?php echo $post_class; ?>" data-permalink="<?php echo $post_url; ?>" data-title="<?php echo get_the_title($post_id); ?>">
		<div class="article-img cover-bg video-callout video-callout-small" style="background-image: url('<?= $post_video_img_url ?>');"></div>
		<iframe allowfullscreen="" frameborder="0" src="<?= $post_video_url ?>"></iframe>
		<div class="resource-details">
			<a class="resource-link-title" href="<?= $post_url ?>">
				<h4 class="resource-title"><?= get_the_title($post_id) ?></h4>
			</a>
			<?php if (!empty(get_field('link', $post_id))) { ?>
				<a class="resource-link-title-external" href="<?= get_field('link', $post_id) ?>">
					<span class="resource-link">External Link</span>
				</a>
			<?php } ?>
			<p class="resource-desc"><?= get_the_content($post_id) ?></p>
		</div>
	</article>
	<!-- Video Post Ends -->
<?php }

// ! render_generic_post
// - Accepts a single post_id
// - Returns nothing, this is a render function
// - Errors: N/A
function render_generic_post($post_id)
{
	//Get the post item's resource type
	$post_types = get_the_terms($post_id, 'resource_type');
	$post_type_slug = $post_types[0]->slug;

	//Initiate the post item's class
	$post_class = $post_type_slug;
	$post_class .= " " . $post_id;

	//Get the post item's priority
	$resource_priority = get_field('priority_resource', $post_id);
	//If it exists add it to the post item's class
	$post_class .= (!empty($resource_priority)) ? ' priority-resource-container' : '';

	//Get the post item's url, if it's not available use the post item's permalink
	$post_url = get_field('link', $post_id);
	if (empty($post_url)) {
		$post_url = get_the_permalink($post_id);
	}
	//FIXME I'm not sure what the situation for this is, didn't see it happen in testing. Add comments if found or remove.
	if (is_array($post_url)) {
		$post_url = $post_url['url'];
	}

	//Set the post item's url text, check the url's extension to see if it's a doc.
	$post_url_extension = end(explode(".", $post_url));
	$post_url_text = (trim($post_url_extension) == 'doc') ? 'External Download' : 'External Link';

	//Get the post item's desc depending on resource type.
	if (in_array($post_type_slug, array('form', 'guided-assistant', 'related-readings', 'video'))) {
		$post_desc = get_the_content($post_id);
	} else {
		$post_desc = get_field('overview', $post_id);
	}

    $is_ls_resource = get_field('is_ls_resource');

    $target = ($is_ls_resource) ? "_blank" : (($post_url['target']) ? $post_url['target'] : '_self');

    ?>

	<!-- Generic Post Begins -->
	<a class="resource 11 <?php echo $post_class; ?>" href="<?php echo $post_url; ?>" target="<?=$target?>">
		<div class="resource-details">
			<div class="resource-link-title">
				<h4 class="resource-title"><?= get_the_title($post_id); ?></h4>
			</div>
			<?php
			// Check if post_url is an external link or not
			$url_is_external = (
				(strpos($post_url, $_SERVER['SERVER_NAME']) === false)) ? true : false;
			?>
			<?php if (!empty($post_url) && $post_type_slug != 'guided-assistant' && $url_is_external) { ?>
				<div class="resource-link-title-external">
					<span class="resource-link"><?= $post_url_text; ?></span>
				</div>
			<?php } ?>
			<p class="resource-desc"><?= $post_desc; ?></p>
		</div>
	</a>
	<!-- Generic Post Ends -->
<?php }


// ! render_search_post
// - Accepts a single post_id
// - Returns nothing, this is a render function
// - Errors: N/A
function render_search_post($post_id, $miles = NULL)
{
	$post_types = get_the_terms($post_id, 'resource_type');
	$post_type_slug = $post_types[0]->slug;

	//If the post items resource type is organization or video, use an article containter.
	if ($post_type_slug == 'organization') {
		render_organization_post($post_id, $miles);
	} elseif ($post_type_slug == 'video') {
		render_video_post($post_id);
	} else {
		render_generic_post($post_id);
	}
}

function render_topic_results()
{

	$current_page = $_REQUEST['page'] ? $_REQUEST['page'] : 1;
	$topic = $_REQUEST['topic'] ? $_REQUEST['topic'] : '';
	$resource = $_REQUEST['resource'] ? $_REQUEST['resource'] : '';
	$region = $_REQUEST['region'] ? $_REQUEST['region'] : '';
	$location = $_REQUEST['location'] ? $_REQUEST['location'] : '';

	$posts_per_page = 6;

	if (empty($topic)) {
		echo 'Topic not found.';
		wp_die();
	}

	//Set up the default tax query.
	$tax_query = array(
		array(
			'taxonomy' => 'topics',
			'field' => 'slug',
			'terms' => $topic,
		),
	);

	//If Resource Type is set, add to tax query.
	if (!empty($resource)) {
		$tax_query[] = array(
			'taxonomy' => 'resource_type',
			'field' => 'slug',
			'terms' => $resource,
		);
	}

	//If Region is set, add to tax query.
	if (!empty($region)) {
		$tax_query[] = array(
			'taxonomy' => 'region',
			'field' => 'slug',
			'terms' => $region,
		);
	}

	//If there is no resource, we're on the default/featured page, add meta_query. And set posts per page to all.
	$meta_query = array();
	if (empty($resource)) {
		$posts_per_page = -1;
		$meta_query = array(
			array(
				'key'     => 'featured_resource',
				'value'   => '1',
				'compare' => '=='
			)
		);
	}

	$args = array(
		'post_type' => array('guided_assistant', 'ln_resource'),
		'posts_per_page' => $posts_per_page,
		'paged' => $current_page,
		'post_status' => 'publish',
		'tax_query' => $tax_query,
		'meta_query' => $meta_query,
		'orderby' => 'title',
		'order' => 'ASC',
		'fields' => 'ids'
	);
	$result = new WP_Query($args);
	$resource_ids = (!empty($result)) ? $result->posts : array();

	$resource_array = array();
	foreach ($resource_ids as $post_id) {
		$resource_array[] = [$post_id, NULL];
	}

	$new_resource_array = array();
	if ((!empty($resource_array)) && (!empty($resource)) && ($resource == 'organization') && (!empty($location))) {
		foreach ($resource_array as $resource_item) {
			$miles = 0;
			$post_latitude = get_field('x_location_lat', $resource_item[0]);
			$post_longitude = get_field('x_location_lng', $resource_item[0]);
			$location_array = explode(',', $location);
			if ((count($location_array) > 1) && ($post_latitude) && ($post_longitude)) {
				$miles = calculate_miles($location_array[0], $location_array[1], $post_latitude, $post_longitude);
			}
			$new_resource_array[] = [$resource_item[0], $miles];
		}
		uasort($new_resource_array, function($a, $b) {
			return strcmp($a[1], $b[1]);
		});
		foreach ($new_resource_array as $key => $value) {
			if ($value[1] == 0) { $new_resource_array[$key] == NULL; }
		}
		$resource_array = $new_resource_array;
	}

	//Get Resource Types
	$taxonomy_array = get_terms(array(
		'taxonomy' => 'resource_type',
		'hide_empty' => false
	));
	$taxonomies = array("Featured Resources");
	foreach ($taxonomy_array as $taxonomy) {
		$taxonomies[] = $taxonomy->slug;
	} ?>

	<div class='result-container'>

		<?php if (empty($resource_array)) {
			echo 'Sorry, no resources available for this type.';
			wp_die();
		}

		foreach ($taxonomies as $taxonomy) {

			$section_opened = false;
			//Get the post item's icon
			$icon_term = get_term_by('slug', $taxonomy, 'resource_type');
			$post_icon = get_field('resource_type_icon', $icon_term);
			$post_icon_id = (is_array($post_icon)) ? $post_icon['id'] : $post_icon;

			foreach ($resource_array as $resource_item) {
				$terms_array = get_the_terms($resource_item[0], 'resource_type');
				$terms = array();
				foreach ($terms_array as $term) {
					$terms[] = $term->slug;
				}

				if (in_array($taxonomy, $terms)) {
					if ((!$section_opened) && (!empty($post_icon_id))) {
						$section_opened = true; ?>
						<div class="resource-icon">
							<?= wp_get_attachment_image($post_icon_id); ?>
							<h4><?= $icon_term->name; ?></h4>
							<?= $icon_term->description; ?>
						</div>
						<?php if ((!empty($resource)) && ($resource == 'organization') && (get_field('show_find_location_filter', 'option'))) { ?>
							<div class="find-my-location">
								<label for="location">Find My Location</label>
								<input type="text" id="location" name="location" placeholder="Address">
								<a id="find-location-button" class="button" href='javascript:;'>Search</a>
							</div>
						<?php } ?>
					<?php }
					render_search_post($resource_item[0], $resource_item[1]);
				}
			}
		}

		if ((!empty($resource)) && ($resource == 'organization')) {
			$latlongdata = [];
			$i = 0;

			foreach ($resource_array as $resource_item) {

				if (get_field('x_location_lat', $resource_item[0]) && get_field('x_location_lng', $resource_item[0])) {
					$latlongdata[$i][] = get_field('x_location_lat', $resource_item[0]);
					$latlongdata[$i][] = get_field('x_location_lng', $resource_item[0]);
					$latlongdata[$i][] = get_the_title($resource_item[0]);
					$latlongdata[$i][] = get_field('address_details', $resource_item[0]);
					$latlongdata[$i][] = get_the_permalink($resource_item[0]);

					$i++;
				}
			} ?>
			<div id="map-data" style="display:none;" data-coord="<?= urlencode(json_encode($latlongdata)); ?>"></div>
			<div id="map-canvas" style="width: 100%;height: 100%;"></div>
		<?php
		}


		//Get pagination info.
		$number_of_pages = $result->max_num_pages;

		//Pagination
		if ($number_of_pages > 1) { ?>
			<div class="pagination">
				<?php
				//Previous Page Buttons
				if ($current_page > 1) { ?>
					<a href="javascript:void(0);" aria-label="go to first results page" data-page="<?= 1 ?>" class="pagination-button">First</a>
					<a href="javascript:void(0);" aria-label="go to previous page" data-page="<?= $current_page - 1 ?>" class="pagination-button">&#60;</a>
					<a href="javascript:void(0);" aria-label="go to page <?= $current_page - 1 ?> of results" data-page="<?= $current_page - 1 ?>" class="pagination-button"><?= $current_page - 1 ?></a>
				<?php }

				//Current Page Button
				?>
				<span data-page="<?= $current_page ?>" class="pagination-display active"><?= $current_page ?></span>
				<?php

				//Next page Buttons
				if ($current_page < $number_of_pages) { ?>
					<a href="javascript:void(0);" aria-label="go to page <?= $current_page + 1 ?> of results" data-page="<?= $current_page + 1 ?>" class="pagination-button"><?= $current_page + 1 ?></a>
					<a href="javascript:void(0);" aria-label="go to next page" data-page="<?= $current_page + 1 ?>" class="pagination-button">&#62;</a>
					<a href="javascript:void(0);" aria-label="go to last results page" data-page="<?= $number_of_pages ?>" class="pagination-button">Last</a>
				<?php } ?>

			</div>
		<?php } ?>

	</div>

	<div class="clear"></div>

<?php wp_die();
}

add_action('wp_ajax_nopriv_render_topic_results', 'render_topic_results');
add_action('wp_ajax_render_topic_results', 'render_topic_results');
