<?php
/**
 * Footer Template
 */
?>
        <footer>
			<?php
			$footer_bottom_content = get_field('footer_bottom_content', 'option');	// Fetch footer bottom content value
			$select_page = get_field('select_page', 'option');	// Fetch select_page value
			if (!empty($select_page) &&  is_array($select_page) ) {
				if(in_array(get_the_ID(),$select_page)){ ?>
					<div class="footer-bottom-content">
						<?php 
						if(!empty($footer_bottom_content)){
							$contentData = apply_filters('the_content', $footer_bottom_content);
							echo $contentData; 
						} ?>
					</div>
				<?php } ?>
			<?php } ?>
        </footer>
        <?php wp_footer(); ?>
    </body>
</html>