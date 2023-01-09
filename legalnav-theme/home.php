<?php
/**
 * Homepage Template
 */

    get_header();
?>

<main class="site-main">
<?php
    if ( have_posts() ) {
        // Load posts loop.
        while ( have_posts() ) {
            the_post(); ?>
            <div class="content-wrapper">
                <?php the_content(); ?>
            </div>
        <?php }
    } else {
        // If no content, include the "No posts found" template.
        echo "Sorry, no posts found.";
    }
?>
</main>

<?php get_footer();?>
