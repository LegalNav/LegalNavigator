<?php
/**
 * The main template file
 */

get_header();
?>
    <main class="site-main">

    <?php
		if ( have_posts() ) {
			// Load posts loop.
			while ( have_posts() ) {
				the_post();
			}
		} else {
			// If no content, include the "No posts found" template.
			echo "Sorry, no posts found.";
		}
	?>

    </main>
<?php get_footer(); ?>
