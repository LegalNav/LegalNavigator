<?php
/**
  File Name flexible-content.php
  This File for the flexible content.
  This is fof the flexible content for Defalut, Home, About and Contact us template.
  @path ​	/wp-content/legalnav2021/template-parts/blocks/flexible-content.php (full path from root) ​
  @link
 */
 
if (have_rows('content')) {
 	$cnt=0;
 	$is_three_up=0;
	?>
	<div class="repeat-sections">
	<?php
		while (have_rows('content')) {
			the_row();
			
			if (get_row_layout() == 'guided_assistant_cta_callout') {
				?>
				<section class="repetition-section <?php echo $three_up_class;?>">
					<div class="container">
						<?php	
						$headline=get_sub_field('headline');
						$content=get_sub_field('content');
						$svg=get_sub_field('svg');
						$button_label=get_sub_field('button_label');
						$select_button_link=get_sub_field('select_button_link');
						$select_internal_link=get_sub_field('select_internal_link');
						$enter_external_link=get_sub_field('enter_external_link');
						if($select_button_link=="Internal Page Link"){	
							$link_url = $select_internal_link;	// Fetch button Internal link value
						}
						if($label_link=="External Link"){
							$link_url = $enter_external_link; 	// Fetch button  Internal link value
						}
						?>
						<div class="guide-section">
							<?php if(!empty($headline)){	?>
								<div class="guide-section-heading">
									<h3><?php echo $headline;?></h3>
								</div>
							<?php } ?>
							<div class="guide-section-content">
								<?php if(!empty($svg)){	?>
									<div class="guide-section-left-content">
										<img src="<?php echo $svg['url'];?>" alt="<?php echo $headline;?>" >
									</div>
								<?php } ?>
								<div class="guide-section-right-content">
									<?php if(!empty($content)){	?>
									<div class="guide-section-right-inner-content">
										<?php
											$contentData = apply_filters('the_content', $content);
											echo $contentData; 
										?>	
									</div>
									<?php } ?>
									<?php if(!empty($button_label)){	?>
									<div class="guide-section-right-inner-link">
										<a class="" href="<?php echo $link_url;?>"><?php echo $button_label;?></a>
									<?php } ?>
								</div>
							</div>
						</div> <!-- column end-->							
					</div><!-- three-up-callouts end -->					
				</section>
				<?php
			}					
		}	
	?>
	</div>
	<?php
}	