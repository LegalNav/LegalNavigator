<?php
/**
 * Header Template
 */

$parts = parse_url( home_url() );
$current_uri = "{$parts['scheme']}://{$parts['host']}" . add_query_arg( NULL, NULL );

$input_value = array_key_exists('search', $_REQUEST) ? esc_attr($_REQUEST['search']) : "";

$show_search = get_field('show_search', 'option');
?>

<html <?php language_attributes(); ?>>
    <head>
        <?php wp_head(); ?>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">

        <?php if(get_field('guided_assistant_type') == 'docassemble') {
            $da_domain = get_field('docassemble_creds', 'option')['server_url'];
        ?>
            <script defer src="<?=$da_domain?>/static/fontawesome/js/all.js"></script>
            <link href="<?=$da_domain?>/static/bootstrap/css/bootstrap.min.css" rel="stylesheet">
            <link href="<?=$da_domain?>/static/app/bundle.css" rel="stylesheet">
        <?php } ?>
    </head>

    <body <?php body_class(); ?>>
        <header>

			<a href="javascript:;" class="skip-nav" aria-label="skip to main content">Skip to main content</a>
			<!-- Header Top Bar Start -->
			<div class="header-top-bar">
				<div class="container">

			<?php
			$google_translate_shortcode = get_field('google_translate_shortcode', 'option');			// Fetch google_translate_shortcode value
			if(!empty($google_translate_shortcode)){	?>
			<div class="header-top-left-bar">
				<?php echo do_shortcode($google_translate_shortcode); ?>
			</div>
			<?php
			}
			$header_link = get_field('header_link', 'option');			// Fetch Header link value
			if(!empty($header_link)){
				?>
				<div class="header-top-right-bar">
					<?php
					foreach($header_link as $header_linkVal){
						$label = $header_linkVal['label'];  					// Fetch Header Heading value
						$label_icon = $header_linkVal['label_icon'];			// Fetch Header iconv value
						$label_link = $header_linkVal['label_link'];			// Fetch Header link value
						$internal_link = $header_linkVal['internal_link'];		// Fetch Header Internal link value
						$external_link = $header_linkVal['external_link'];		// Fetch Header Internal link value
						if($label_link=="Internal Page Link"){
						  $link_url = $internal_link;	// Fetch button Internal link value
						}
						if($label_link=="External Link"){
						  $link_url = $external_link; 	// Fetch button  Internal link value
						}
						if(!empty($label)){ ?>
							<a class="link-data" href="<?php echo $link_url;?>"><?php
								if(!empty($label_icon)){	?>
									<img src="<?php echo $label_icon['url'];?>" alt="<?php echo $label;?>" ><?php
								} ?>
								<?php echo $label;?>
							</a>
						<?php }
					}
					?>
				</div>
				<?php
			}
			?>
			</div>
			</div>
			<!-- Header Top Bar End -->
            <!-- Header Logo -->
			<div class="header-bottom-bar">
				<div class="container">
				<div class="logo">
					<a href="<?php echo get_home_url(); ?>" title="<?php echo get_bloginfo( 'name' ); ?>" class="header-logo">
						<?php echo @file_get_contents(get_field('header_logo', 'option')); ?>
						<span class="vh"> <?php get_bloginfo('name'); ?></span>
					</a>
				</div>
				<nav>
					<a href="javascript:;" class="hamburger-button menu" role="button" aria-expanded="false">
					  <span class="line"></span> <span class="line"></span> <span class="line"></span>
					</a>
	                <?php
	                    wp_nav_menu(
	                        array(
	                            'theme_location' => 'main-nav',
	                            'container' => false,
	                        )
	                    );
	                ?>
					<?php
					$header_link = get_field('header_link', 'option');			// Fetch Header link value
					if(!empty($header_link)){
						?>
						<div class="secondary-nav-links">
							<?php
							foreach($header_link as $header_linkVal){
								$label = $header_linkVal['label'];  					// Fetch Header Heading value
								$label_icon = $header_linkVal['label_icon'];			// Fetch Header iconv value
								$label_link = $header_linkVal['label_link'];			// Fetch Header link value
								$internal_link = $header_linkVal['internal_link'];		// Fetch Header Internal link value
								$external_link = $header_linkVal['external_link'];		// Fetch Header Internal link value
								if($label_link=="Internal Page Link"){
								  $link_url = $internal_link;	// Fetch button Internal link value
								}
								if($label_link=="External Link"){
								  $link_url = $external_link; 	// Fetch button  Internal link value
								}
								if(!empty($label)){ ?>
									<a class="link-data" href="<?php echo $link_url;?>"><?php
										if(!empty($label_icon)){	?>
											<img src="<?php echo $label_icon['url'];?>" alt="<?php echo $label;?>" ><?php
										} ?>
										<?php echo $label;?>
									</a>
								<?php }
							}
							?>
						</div>
					<?php } ?>
	            </nav>

				<!-- Header Logo -->
				<!-- Hamburger button Begin -->
				<a href="javascript:;" class="hamburger-button" role="button" aria-expanded="false">
				  <span class="line"></span> <span class="line"></span> <span class="line"></span>
				  <p>
					Menu
				  </p>
				</a>

				<?php if($show_search) { ?>
					<a href="javascript:;" class="close-search-form" aria-label="close search form" role="button">
						<svg xmlns="http://www.w3.org/2000/svg" width="24.765" height="24.765" viewBox="0 0 24.765 24.765"><g transform="translate(-1766.617 -197.617)"><g transform="translate(866.977 -3067.005)"><line x2="22.154" y2="22.154" transform="translate(900.946 3265.928)" fill="none" stroke="#333" stroke-linecap="round" stroke-miterlimit="10" stroke-width="1.846"/><line x1="22.154" y2="22.154" transform="translate(900.946 3265.928)" fill="none" stroke="#333" stroke-linecap="round" stroke-miterlimit="10" stroke-width="1.846"/></g><path d="M1779,210l11.077,11.077Zm0,0-11.077,11.077Zm0,0,11.077-11.076ZM1779,210Zm-11.077-11.076L1779,210Z" fill="#0d3fb8"/></g></svg>
					</a>

					<form id="searchform" class="searchform">
						<input type="text" name="search" class="" value="<?=$input_value;?>">
						<input id="searchsubmit">
						<label for="searchsubmit">Search</label>
					</form>
				<?php } ?>
			</div>
			</div>
			<!-- Hamburger button End -->

        </header>
			<?php
                $feat_topics = get_field('homepage_feat_topics', 'option');
                if(!empty($feat_topics)) {
				    $sliced_feat_topics = array_slice($feat_topics, 0, 3);
                }
			?>
			<div class="search-results hidden">
				<a href="javascript:;" class="close-search-results" aria-label="close search results" role="button">
					<svg xmlns="http://www.w3.org/2000/svg" width="24.765" height="24.765" viewBox="0 0 24.765 24.765"><g transform="translate(-1766.617 -197.617)"><g transform="translate(866.977 -3067.005)"><line x2="22.154" y2="22.154" transform="translate(900.946 3265.928)" fill="none" stroke="#333" stroke-linecap="round" stroke-miterlimit="10" stroke-width="3"></line><line x1="22.154" y2="22.154" transform="translate(900.946 3265.928)" fill="none" stroke="#333" stroke-linecap="round" stroke-miterlimit="10" stroke-width="3"></line></g><path d="M1779,210l11.077,11.077Zm0,0-11.077,11.077Zm0,0,11.077-11.076ZM1779,210Zm-11.077-11.076L1779,210Z" fill="#0d3fb8"></path></g></svg>
				</a>
				<div class="query-msg"></div>
				<div class="result-list"></div>
				<a href="javascript:;" class="load-more-btn hidden btn btn-primary">Load More Results</a>
				<div class="state-topics related-topics">
					<?php if(!empty($sliced_feat_topics)) { ?>
						<h2> Or Pick a Topic </h2>
						<p>If none of these topics apply, check out our <a href="/topics-resources">Topics & Resources Page</a> for other topics.</p>
						<div class="row">
							<?php foreach ($sliced_feat_topics as $topic) { ?>
								<a href="<?php echo get_term_link($topic->slug, 'topics') ?>" class="topic-card col-md-3 col-sm-4 col-xs-6">
									<div class="topic-icon" style="background-image: url('<?php echo get_field('icon', $topic) ?>')"></div>
									<p class="topic-name"><?php echo $topic->name ?></p>
								</a>
							<?php } ?>
						</div>
					<?php } ?>
				</div>
			</div>
