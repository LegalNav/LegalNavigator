<?php

// Register Guided Assistant Post Type
function guided_assistant_post_type()
{
    register_post_type(
        'guided_assistant',
        array(
            'labels'      => array(
                'name'          => __('Guided Assistant', 'textdomain'),
                'singular_name' => __('Guided Assistant', 'textdomain'),
            ),
            'public'      => true,
            'has_archive' => false,
            'supports' => ['title','excerpt']
        ),
    );
}
add_action('init', 'guided_assistant_post_type');

// Register Resource Post Type
function ln_resource_post_type()
{
    register_post_type(
        'ln_resource',
        array(
            'labels'      => array(
                'name'          => __('Resources', 'textdomain'),
                'singular_name' => __('Resource', 'textdomain'),
            ),
            'public'      => true,
            'has_archive' => false,
            'rewrite' => array('slug' => 'resource'),
        )
    );
}
add_action('init', 'ln_resource_post_type');