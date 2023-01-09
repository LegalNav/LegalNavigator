<?php 

/**
     Adding Block using ACF.
    */
function register_acf_block_types() {

    //register internal page flexible block.
    acf_register_block_type(array(
        'name'              => 'content',
        'title'             => __('Flexible Content'),
        'description'       => __('A customizable flexible content'),
        'render_template'   => 'template-parts/blocks/flexible-content.php',
        'category'          => 'formatting',
        'icon'              => 'admin-comments',
        'mode'              => 'edit',
        'keywords'          => array( 'flexible', 'content' ),
    ));

    // Register Testimonial Carousel Block
    acf_register_block_type(array(
        'name' => 'testimonial_carousel',
        'title' => __('Testimonoal Carousel'),
        'description'       => __('A variable length carousel of testimonials'),
        'render_template'   => 'template-parts/blocks/testimonial_carousel.php',
        'category'          => 'common',
        'icon'              => 'admin-comments',
        'mode'              => 'edit',
        'keywords'          => array( 'testimonial', 'carousel' ),
    ));

    // Register Generic CTA Callout
    acf_register_block_type(array(
        'name' => 'generic_cta',
        'title' => __('Generic CTA'),
        'description'       => __('A customizable generic CTA callout'),
        'render_template'   => 'template-parts/blocks/generic_cta.php',
        'category'          => 'common',
        'icon'              => 'admin-comments',
        'mode'              => 'edit',
        'keywords'          => array( 'generic', 'cta' ),
    ));

    // Register News Block
    acf_register_block_type(array(
        'name' => 'news',
        'title' => __('News'),
        'description'       => __('A block that shows selected news items'),
        'render_template'   => 'template-parts/blocks/news.php',
        'category'          => 'common',
        'icon'              => 'admin-comments',
        'mode'              => 'edit',
        'keywords'          => array( 'news' ),
    ));

    // Register Emergency Phone Block
    acf_register_block_type(array(
        'name' => 'emergency_phone',
        'title' => __('Emergency Phone Number'),
        'description'       => __('A block that renders the emergency phone number in the users state'),
        'render_template'   => 'template-parts/blocks/emergency_phone.php',
        'category'          => 'common',
        'icon'              => 'admin-comments',
        'mode'              => 'edit',
        'keywords'          => array( 'emergency', 'phone' ),
    ));

    // Register Structure for Topics & Resources Block
    acf_register_block_type(array(
        'name' => 'topics_resource',
        'title' => __('Topics & Resources'),
        'description'       => __('A block that renders for Topics & Resources Block.'),
        'render_template'   => 'template-parts/blocks/topics_resource.php',
        'category'          => 'common',
        'icon'              => 'admin-comments',
        'mode'              => 'edit',
        'keywords'          => array( 'location', 'topics', 'resources' ),
    ));

    // Register Create Structure for Homepage Banner Block
    acf_register_block_type(array(
        'name' => 'homepage_banner',
        'title' => __('Homepage Banner'),
        'description'       => __('A block that renders for Homepage Banner Block.'),
        'render_template'   => 'template-parts/blocks/homepage_banner.php',
        'category'          => 'common',
        'icon'              => 'admin-comments',
        'mode'              => 'edit',
        'keywords'          => array( 'Homepage', 'Banner' ),
    ));

    acf_register_block_type(array(
        'name' => 'accordion',
        'title' => __('Accordion'),
        'description'       => __('A block that renders for Accordion Block.'),
        'render_template'   => 'template-parts/blocks/accordion.php',
        'category'          => 'common',
        'icon'              => 'admin-comments',
        'mode'              => 'edit',
        'keywords'          => array( 'Accordion', 'FAQ' ),
    ));

    acf_register_block_type(array(
        'name' => 'court_case_lookup',
        'title' => __('Court Case Look Up Callout'),
        'description'       => __('A block that renders for Court Look Up Callout Block.'),
        'render_template'   => 'template-parts/blocks/court_case_lookup.php',
        'category'          => 'common',
        'icon'              => 'admin-comments',
        'mode'              => 'edit',
        'keywords'          => array( 'Court Look Up Callout', 'Callout' ),
    ));
}

// Check if function exists and hook into setup.
if( function_exists('acf_register_block_type') ) {
    add_action('acf/init', 'register_acf_block_types');
}