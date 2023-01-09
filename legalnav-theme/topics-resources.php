<?php
    /**
     * Template Name: Topics & Resources
     */

    get_header();
?>

    <main class="site-main">
    <?php
        // Get all topic terms
        $topics = get_terms('topics');
        // Filter only parent topics that are in the currently selected state
        $parent_topics = array();
        if(!empty($topics)){
            foreach($topics as $topic) {
                // If topic has hidden toggle, dont show it
                $isHidden = get_field('topic_hidden', $topic);
                if(!$isHidden) {
                    // If the topic is a parent topic add it to the list, else add its parent to the list
                    if($topic->parent == 0) {
                        $parent_topics[$topic->term_id] = $topic;
                    }
                }
            }
        }
        // Render parent topics and their icons
        ?>
			<div class="container">
				<div class="row">


			<section class="topic-section col-md-8 col-sm-12 col-xs-12">
				<ul>
				<?php
            foreach($parent_topics as $topic) {

				$hierarchylist = array();
				if(!empty($topic)){
					if(!empty($topic->term_id)){
						$hierarchylist[] = $topic->term_id;
						$hierarchy = get_taxonomy_hierarchy( 'topics' , $topic->term_id );
						if(!empty($hierarchy)){
							foreach($hierarchy as $hierarchyVal){
								$hierarchylist[] = $hierarchyVal->term_id;
								if(!empty($hierarchyVal->children)){
									foreach($hierarchyVal->children as $hierarchychildrenVal){
										$hierarchylist[] = $hierarchychildrenVal->term_id;
									}
								}
							}
						}
					} else {
						$hierarchylist[] = $topics;
					}
				}
				$arr = array_unique($hierarchylist);
				$topics = implode(" ,",$arr);

				$args = array(
						'post_type' => array('ln_resource'),
						'posts_per_page' => -1,
						'post_status' => 'publish',
						'tax_query'=> array(
							array(
								'taxonomy' => 'topics',
								'field' => 'term_id',
								'terms' => $topics,
							)
						)
					);
				$resources = new WP_Query($args);
				if($resources->have_posts()) {
					?>
					<li class="topic-card-container col-md-3 col-sm-4 col-xs-6">
						<a href="<?php echo get_term_link($topic->slug, 'topics') ?>" class="topic-card">
							<div class="topic-icon" style="background-image: url('<?php echo get_field('icon', $topic) ?>')"></div>
							<p class="topic-name"><?php echo $topic->name ?></p>
						</a>
					</li>
					<?php
				}
            }
			?>
			</ul>
		</section>

		<?php
            $sidebar_heading = get_field('sidebar_heading', 'option');
            $sidebar_text = get_field('sidebar_text', 'option');
            $sidebar_button_text = get_field('sidebar_button_text', 'option');
            $sidebar_link = get_field('sidebar_link', 'option');
            $sidebar_image = get_field('sidebar_image', 'option');
		?>
			<div class="col-md-4 col-sm-12 text-center pull-right sidebar-container">
				<div class="side-ga-callout">
                    <h5>Need help? Use our Guided Assistant to receive personalized recommendations.</h5>
                    <p>No account necessary. We never share any information you provide. Read our <a href="/privacy-policy">Privacy Notice</a>.</p>
                    <a href="/guided-assistant" class="btn btn-primary">Start the Guided Assistant</a>
                </div>
				<?php if (!empty($sidebar_heading)) { ?>
                    <div class="sidebar-callout">
                        <?php if(!empty($sidebar_heading)) { ?>
                            <h3><?=$sidebar_heading?></h3>
                        <?php }
                        if(!empty($sidebar_image)){ ?>
                            <div class="topic-icon" style="background-image: url('<?=$sidebar_image?>')"></div>
                        <?php }
                        if(!empty($sidebar_text)){ ?>
                            <h6><?=$sidebar_text?></h6>
                        <?php }
                        if(!empty($sidebar_button_text)){ ?>
                            <a class="btn btn-primary" href="<?=$sidebar_link?>" target="_blank"><?=$sidebar_button_text?></a>
                        <?php } ?>
                    </div>
				<?php } ?>
			</div>
		</div>
		</div>
    </main>

<?php get_footer();?>
