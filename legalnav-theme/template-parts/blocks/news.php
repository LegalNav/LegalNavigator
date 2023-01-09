<?php
    $news_heading = get_field('news_heading');
    $news_content = get_field('news_content');
    $news_list = get_field('news_list');
?>
<section class="news-callout">
	<div class="container">
		<div class="news-callout-top">
	    <?php if(!empty($news_heading)){	?>
			<h2 class="testimonial-title"><?php echo $news_heading ?></h2>
		<?php } ?>

		<?php if(!empty($news_content)){	?>
		<div class="news-section-inner-content">
			<?php
				$contentData = apply_filters('the_content', $news_content);
				echo $contentData;
			?>
		</div>
		<?php } ?>
	</div>
	<?php if(!empty($news_list)){	?>
    <div class="news">
        <?php
            if(have_rows('news_list')):
                while(have_rows('news_list')): the_row();
                    $news_title = get_sub_field('news_title');
                    $news_image = get_sub_field('news_image');
                    $news_summary = get_sub_field('news_summary');
                    $news_link_type = get_sub_field('news_link_type');
                    $news_internal_link = get_sub_field('news_internal_link');
                    $news_external_link = get_sub_field('news_external_link');
					if($news_link_type=="Internal Page Link"){
						$new_link_url = $news_internal_link;	// Fetch button Internal link value
					}
					if($news_link_type=="External Link"){
						$new_link_url = $news_external_link; 	// Fetch button  Internal link value
					}
					?>
                    <article class="news-item">
						<?php if(!empty($news_image)){	?>
						<div class="news-left-content">
							<div class="news-image" background-image="<?php get_image_dimension('news_image','','sub'); ?>" data-srcset="<?php get_image_dimension('news_image','','sub'); ?>" ></div>
						</div>
						<?php } ?>
						<div class="news-right-content">
							<?php if(!empty($news_title)){	?>
									<a class="news-title" href="<?php echo $new_link_url;?>"><?php echo $news_title?></a>
							<?php } ?>
							<?php if(!empty($news_summary)){	?>
								<?php
									$contentData = apply_filters('the_content', $news_summary);
									echo $contentData;
								?>
							<?php } ?>
						</div>
                    </article>
                <?php endwhile;
            endif;
        ?>
    </div>
	<?php } ?>
	</div>
</section>
