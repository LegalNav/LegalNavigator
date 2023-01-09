<?php
    $title = get_field("title");
    $image = get_field("image");
    $image_justification = get_field("image_justification");
    $content = get_field("content");
	$content_images = get_field("content_images");
    $btn_link = get_field("button_link");
	$btn_text = get_field("button_text");
	$light_btn_style = get_field("light_button_style");
	$center_btn = get_field("center_button"); 
    $background_color = get_field("background_color");
    $text_color = get_field("text_color");
	$light_title = get_field("light_title_color");
?>

<section class="generic-cta text-center <?php echo $light_title ? 'light-title' : ''; ?>" style="background-color: <?php echo $background_color; ?>">
	<div class="container">
	    <h2 class="generic-cta-title"><?php echo $title; ?></h2>
	    <div class="generic-cta-content-wrapper">
			<?php if($image) { ?>
				<div class="generic-cta-image <?php echo $image_justification ?> col-sm-4" style="background-image: url(<?php echo $image; ?>)"></div>
			<?php } ?>
	        <div class="generic-cta-content <?php echo $image ? 'col-sm-7' : ''; ?>" style="color: <?php echo $text_color ?>">
	            <?php echo $content; ?>
				<div class="generic-cta-content-imgs">		
					<?php 
						if($content_images){
							foreach($content_images as $image) { ?>
								<img src="<?php echo $image['image']['url'] ?>" alt="<?php echo $image['image']['alt']; ?>">
							<?php }
						} 
					?>
				</div>
				<a href="<?php echo $btn_link; ?>" class="generic-cta-btn btn <?php echo $light_btn_style ? "btn-secondary" : "btn-primary" ?> <?php echo $center_btn ? "center" : "" ?>" style="color: <?php echo $text_color ?>"><?php echo $btn_text; ?></a>
	        </div>
			
			<div class="clear"></div>
	    </div>
	</div>
</section>
