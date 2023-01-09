<?php
    $title = get_field('title');
?>
<section class="testimonial-callout text-center">
	<div class="container">
	    <h2 class="testimonial-title"><?php echo $title ?></h2>
	    <div class="testimonials">
	        <?php
	            if(have_rows('testimonials')):
	                while(have_rows('testimonials')): the_row();
	                    $image = get_sub_field('image');
	                    $quote = get_sub_field('quote');
	                    $author = get_sub_field('author');
	                    $location = get_sub_field('location'); ?>

	                    <article class="testimonial">
							<div class="testimonial-container">
		                        <div class="testimonial-image col-sm-4" style="background-image: url(<?php echo $image ?>)"></div>
		                        <div class="testimonial-content col-sm-8">
		                            <div class="testimonial-quote">
		                                <?php echo $quote?>
		                            </div>
									<hr class="large">
									<p class="testimonial-author large"><?php echo $author ?></p>
									<p class="testimonial-location large"><?php echo $location ?></p>
		                        </div>
								<div class="clear"></div>
							</div>
							<hr>
							<p class="testimonial-author"><?php echo $author ?></p>
							<p class="testimonial-location"><?php echo $location ?></p>
	                    </article>
	                <?php endwhile;
	            endif;
	        ?>
	    </div>
		<a class="prev-testimonial" href="javascript:;" aria-label="click for previous testimonial">
			<svg xmlns="http://www.w3.org/2000/svg" width="60.413" height="22.234" viewBox="0 0 60.413 22.234"><g transform="translate(-3328.01 -3231.883)"><line x2="56.29" transform="translate(3329.01 3242.01)" fill="none" stroke="#0d3fb8" stroke-linecap="round" stroke-width="2"/><path d="M3377.185,3233.3,3387,3243l-9.815,9.7" fill="none" stroke="#0d3fb8" stroke-linecap="round" stroke-width="2"/></g></svg>
		</a>
		<a class="next-testimonial" href="javascript:;" aria-label="click for previous testimonial">
			<svg xmlns="http://www.w3.org/2000/svg" width="60.413" height="22.234" viewBox="0 0 60.413 22.234"><g transform="translate(-3328.01 -3231.883)"><line x2="56.29" transform="translate(3329.01 3242.01)" fill="none" stroke="#0d3fb8" stroke-linecap="round" stroke-width="2"/><path d="M3377.185,3233.3,3387,3243l-9.815,9.7" fill="none" stroke="#0d3fb8" stroke-linecap="round" stroke-width="2"/></g></svg>
		</a>
		<ul class="testimonial-bullets"></ul>
	</div>
</section>
