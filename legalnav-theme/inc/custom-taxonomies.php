<?php


// Create custom Topic Taxonomy
function create_topic_taxonomy()
{
    $labels = array(
        'name' => _x('Topics', 'taxonomy general name'),
        'singular_name' => _x('Topic', 'taxonomy singular name'),
        'search_items' =>  __('Search Topics'),
        'all_items' => __('All Topic'),
        'parent_item' => __('Parent Topic'),
        'parent_item_colon' => __('Parent Topic:'),
        'edit_item' => __('Edit Topic'),
        'update_item' => __('Update Topic'),
        'add_new_item' => __('Add New Topic'),
        'new_item_name' => __('New Topic Name'),
        'menu_name' => __('Topics'),
    );

    register_taxonomy('topics', array('ln_resource', 'guided_assistant'), array(
        'hierarchical' => true,
        'labels' => $labels,
        'show_ui' => true,
        'show_in_rest' => true,
        'show_admin_column' => true,
        'update_count_callback' => '_update_post_term_count',
        'query_var' => true,
        'rewrite' => array('slug' => 'topic'),
        'capabilities' => array(
            'manage_terms' => 'edit_posts',
            'edit_terms' => 'edit_posts',
            'delete_terms' => 'administrator',
            'assign_terms' => 'edit_posts'
        )
    ));
}

add_action('init', 'create_topic_taxonomy', 0);

// Create Custom State Taxonomy
function create_state_taxonomy()
{
    $labels = array(
        'name' => _x('States', 'taxonomy general name'),
        'singular_name' => _x('State', 'taxonomy singular name'),
        'search_items' =>  __('Search States'),
        'popular_items' => __('Popular States'),
        'all_items' => __('All States'),
        'parent_item' => null,
        'parent_item_colon' => null,
        'edit_item' => __('Edit State'),
        'update_item' => __('Update State'),
        'add_new_item' => __('Add New State'),
        'new_item_name' => __('New State Name'),
        'separate_items_with_commas' => __('Separate states with commas'),
        'add_or_remove_items' => __('Add or remove states'),
        'choose_from_most_used' => __('Choose from the most used states'),
        'menu_name' => __('States'),
    );

    register_taxonomy('states', array('ln_resource', 'topics', 'guided_assistant'), array(
        'hierarchical' => true,
        'labels' => $labels,
        'show_ui' => true,
        'show_in_rest' => true,
        'show_admin_column' => true,
        'update_count_callback' => '_update_post_term_count',
        'query_var' => true,
        'rewrite' => array('slug' => 'state'),
        'show_in_rest' => true,
        'rest_base' => 'states',
        'rest_controller_class' => 'WP_REST_Terms_Controller',
        'capabilities' => array(
            'manage_terms' => 'edit_posts',
            'edit_terms' => 'edit_posts',
            'delete_terms' => 'administrator',
            'assign_terms' => 'edit_posts'
        )
    ));
}

add_action('init', 'create_state_taxonomy', 0);

// Create Resource Type Taxonomy
function create_resource_type_taxonomy()
{
    $labels = array(
        'name' => _x('Resource Type', 'taxonomy general name'),
        'singular_name' => _x('Resource Type', 'taxonomy singular name'),
        'search_items' =>  __('Search Resource Type'),
        'popular_items' => __('Popular Resource Type'),
        'all_items' => __('All Resource Type'),
        'parent_item' => null,
        'parent_item_colon' => null,
        'edit_item' => __('Edit Resource Type'),
        'update_item' => __('Update Resource Type'),
        'add_new_item' => __('Add New Resource Type'),
        'new_item_name' => __('New Resource Type Name'),
        'separate_items_with_commas' => __('Separate Resource Type with commas'),
        'add_or_remove_items' => __('Add or remove Resource Type'),
        'choose_from_most_used' => __('Choose from the most used Resource Type'),
        'menu_name' => __('Resource Type'),
    );

    register_taxonomy('resource_type', array('ln_resource', 'guided_assistant'), array(
        'hierarchical' => true,
        'labels' => $labels,
        'show_ui' => true,
        'show_in_rest' => true,
        'show_admin_column' => true,
        'update_count_callback' => '_update_post_term_count',
        'query_var' => true,
        'rewrite' => array('slug' => 'resource_types'),
        'capabilities' => array(
            'manage_terms' => 'edit_posts',
            'edit_terms' => 'edit_posts',
            'delete_terms' => 'administrator',
            'assign_terms' => 'edit_posts'
        )
    ));
}

add_action('init', 'create_resource_type_taxonomy', 0);

// Create Region Type Taxonomy
function create_region_taxonomy()
{
    $labels = array(
        'name' => _x('Region', 'taxonomy general name'),
        'singular_name' => _x('Region', 'taxonomy singular name'),
        'search_items' =>  __('Search Region'),
        'popular_items' => __('Popular Region'),
        'all_items' => __('All Region'),
        'parent_item' => null,
        'parent_item_colon' => null,
        'edit_item' => __('Edit Region'),
        'update_item' => __('Update Region'),
        'add_new_item' => __('Add New Region'),
        'new_item_name' => __('New Region Name'),
        'separate_items_with_commas' => __('Separate Region with commas'),
        'add_or_remove_items' => __('Add or remove Region'),
        'choose_from_most_used' => __('Choose from the most used Region'),
        'menu_name' => __('Region'),
    );

    register_taxonomy('region', array('ln_resource'), array(
        'hierarchical' => true,
        'labels' => $labels,
        'show_ui' => true,
        'show_in_rest' => true,
        'show_admin_column' => true,
        'update_count_callback' => '_update_post_term_count',
        'query_var' => true,
        'rewrite' => array('slug' => 'region'),
        'capabilities' => array(
            'manage_terms' => 'edit_posts',
            'edit_terms' => 'edit_posts',
            'delete_terms' => 'administrator',
            'assign_terms' => 'edit_posts'
        )
    ));
}

add_action('init', 'create_region_taxonomy', 0);
