<?php
/**
 * legalnav2021 function and definitions
 */
 
function handle_user_location()
{
    // Create a session to last across site pages
    session_cache_limiter('private_no_expire'); // Remove Google Chrome page resubmission warning
    session_start();

    $locSetViaPOST = array_key_exists('location_select', $_POST) ? $_POST['location_select'] : NULL;
    $locSetViaGET = array_key_exists('location', $_GET) ? $_GET['location'] : NULL;

    if($locSetViaPOST || $locSetViaGET) {
        $user_state = $locSetViaPOST ? $locSetViaPOST : $locSetViaGET;
        $user_state_id = get_term_by('slug', str_replace(" ", "-", strtolower($user_state)), 'states')->term_id;

        $_SESSION['user_state_id'] = $user_state_id;
    }
}

/**
     Function name svg_mime_types
    Add SVG to allowed file uploads
    @version ​
    @version ​
    @params $mimes(Extensions of image )
    @return $mimes(Return all added image extensions)
 */
function svg_mime_types($file_types)
{
    $new_filetypes = array();
    $new_filetypes['svg'] = 'image/svg+xml';
    $file_types = array_merge($file_types, $new_filetypes);
    return $file_types;
}
add_action('upload_mimes', 'svg_mime_types');

/**
 * Custom Menus
 */
function custom_menus()
{
    register_nav_menus(
        array(
            'main-nav' => 'Main Navigation',
        )
    );
}
add_action('init', 'custom_menus');


/**
		Adding theme support for post thumbnails.
 */
add_theme_support('post-thumbnails');
/**
		Adding support for title tag.
 */
add_theme_support('title-tag');


/**
	  Function name main_menu_custom_menu_item_class
	  Add classes to menu link item.
	  @params $classes, $item, $args, $depth
	  @return $classes
 */
function main_menu_custom_menu_item_class($classes, $item, $args, $depth)
{
    if ($depth == 0 && $args->menu->name == "Footer Menu") {
        $title = strtolower($item->title);
        $class_of_link = str_replace(' ', '-', $title);
        $classes[] = $class_of_link;
        $item->url = "#";
    } elseif (($args->menu->name == "Main Nav Menu") && in_array('menu-item-has-children', $classes)) {
        $title = $item->title;
        $down_arrow_svg_tag = '<span class="icon-svg">
		  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="7.41" viewBox="0 0 12 7.41">
			<path   d="M7.41,8.59,12,13.17l4.59-4.58L18,10l-6,6L6,10Z"
			transform="translate(-6 -8.59)" />
		  </svg>
		</span>';
        $item->title = $title . $down_arrow_svg_tag;
        $item->url = "#";
        $classes[] = 'has-child';
    }
    return $classes;
}
add_filter('nav_menu_css_class', 'main_menu_custom_menu_item_class', 10, 4);

/**
	  Function name legalnav_replace_hash_to_javascript
	  Replace # to javascript:void(0); in menu item
	  @params $menu_item
	  @return $menu_item
 */
function legalnav_replace_hash_to_javascript($menu_item)
{
    if (strpos($menu_item, 'href="#"') !== false) {
        $menu_item = str_replace('href="#"', 'href="javascript:void(0);"', $menu_item);
    }
    return $menu_item;
}
add_filter('walker_nav_menu_start_el', 'legalnav_replace_hash_to_javascript', 999);

/**
	  Function name register_custom_styles
	  Register custom style to legalnav theme.
	  @params
	  @return
 */
function register_custom_styles()
{
    // Stylesheet
    wp_enqueue_style('bootstrap', get_theme_file_uri('/assets/css/bootstrap.css'));
    wp_enqueue_style('legalnav-screen', get_theme_file_uri('/assets/css/gulp.css'));
}
add_action('wp_enqueue_scripts', 'register_custom_styles');

/**
	  Function name legalnav_theme_scripts
	  Register custom scripts to legalnav theme.
	  @params
	  @return
 */
function legalnav_theme_scripts()
{
    // html2pdf JS Script
    wp_enqueue_script('html2pdf', get_template_directory_uri()."/assets/js/dependencies/html2pdf.bundle.min.js", array('jquery'), FALSE);

    // Scripts
    wp_enqueue_script('legalnav-global', get_template_directory_uri() . '/assets/js/main.js', array('jquery'), 1.1, TRUE);
    wp_localize_script('legalnav-global', 'MyAjax', array( // URL to wp-admin/admin-ajax.php to process the request
        'ajaxurl' => admin_url('admin-ajax.php'),
    ));

    wp_enqueue_script('jquery-ui-core');
}
add_action('wp_enqueue_scripts', 'legalnav_theme_scripts');


/**
	  Adding option page using ACF.
 */
if (function_exists('acf_add_options_page')) {
    acf_add_options_page(array(
        'page_title'  => 'Theme General Settings',
        'menu_title'  => 'Theme General Settings',
        'menu_slug'   => 'theme-general-settings',
        'capability'  => 'edit_posts',
        'redirect'    => false
    ));

    acf_add_options_sub_page(array(
        'page_title'  => 'Theme Footer Settings',
        'menu_title'  => 'Footer',
        'parent_slug' => 'theme-general-settings',
    ));
    
    acf_add_options_sub_page(array(
        'page_title'  => 'Theme API Settings',
        'menu_title'  => 'APIs',
        'parent_slug' => 'theme-general-settings',
    ));
}



/**
  Function name custom_image_sizes_choose
  Add images size
  @version
  @params  $sizes
 */
add_filter('image_size_names_choose', 'custom_image_sizes_choose');

function custom_image_sizes_choose($sizes)
{
    $custom_sizes = array(
        '400w' => '400w',
        '800w' => '800w',
        '1200w' => '1250w',
        '1920w' => '1920w',
    );
    return array_merge($sizes, $custom_sizes);
}
add_image_size('400w', 400);
add_image_size('800w', 800);
add_image_size('1250w', 1250);
add_image_size('1920w', 1900);
/**
  Function name get_image_dimension
  Apply image style.
  @params $field_name, $post_id, $field_type
 */
function get_image_dimension($field_name, $post_id = '', $field_type = 'normal')
{
    if (empty($post_id)) {
        $post_id = get_the_ID();
    }
    if ($field_type == 'normal') {
        $four_hundred = get_field($field_name, $post_id)['sizes']['400w'] . " " . "400w,";
        $eight_hundred = get_field($field_name, $post_id)['sizes']['800w'] . " " . "800w,";
        $twelve_hundred = get_field($field_name, $post_id)['sizes']['1250w'] . " " . "1250w,";
        $ninteen_hundred = get_field($field_name, $post_id)['sizes']['1920w'] . " " . "1920w";
    }
    if ($field_type == 'sub') {
        $four_hundred = get_sub_field($field_name, $post_id)['sizes']['400w'] . " " . "400w,";
        $eight_hundred = get_sub_field($field_name, $post_id)['sizes']['800w'] . " " . "800w,";
        $twelve_hundred = get_sub_field($field_name, $post_id)['sizes']['1250w'] . " " . "1250w,";
        $ninteen_hundred = get_sub_field($field_name, $post_id)['sizes']['1920w'] . " " . "1920w";
    }
    $all_dimension = $eight_hundred . $twelve_hundred . $ninteen_hundred;
    echo $all_dimension;
}

//Filters Guided Assisant and Resources by user's state setting.
function filter_by_user_state($query)
{

    //If not logged into the backend, this isn't the right query.
    if (!(is_admin())) {
        return $query;
    }
    //If an administrator, show us everthing.
    if (current_user_can('administrator')) {
        return $query;
    }

    global $pagenow, $post_type, $taxonomy;
    $current_user_id = wp_get_current_user()->ID;
    $user_state_id = get_user_meta($current_user_id, 'state', true);

    //If we're on the edit page, and the post type is GA or Resources
    if (($pagenow == 'edit.php') && (($post_type == 'guided_assistant') || ($post_type == 'ln_resource'))) {
        //Filter results by the user's state only if not on 'Mine' or 'Drafts' tab
        if (isset($_GET['all_posts']) || $_GET['post_status'] === 'publish' || isset($_GET['resource_type'])) {
            // Show all posts for authors state
            $query->query_vars['states'] = get_term($user_state_id[0])->slug;
        }
    }
}
add_filter('parse_query', 'filter_by_user_state');

//Disables user state selection if not an administrator.
function disable_state_selection($field)
{
    if (current_user_can('administrator')) {
        return $field;
    }
}
add_filter('acf/prepare_field/key=field_5fe1d191b25c4', 'disable_state_selection');


/**
	  Function name cloneRole
	  Add new role with publisher from auhor.
 */
function cloneRole()
{
    global $wp_roles;
    if (!isset($wp_roles))
        $wp_roles = new WP_Roles();

    $adm = $wp_roles->get_role('author');
    //Adding a 'new_role' with all admin caps
    $wp_roles->add_role('publisher', 'Publisher', $adm->capabilities);
}
add_action('init', 'cloneRole');

/**
	  Function name author_cap_filter
	  Add capabilities for author which assigned to state.
	  @params $allcaps, $cap, $args , $user
	  @return $allcaps
 */
function author_cap_filter($allcaps, $cap, $args, $user)
{
    global $post;
    if (!isset($post)) {
        return $allcaps;
    }
    $group = get_user_meta($user->ID, 'state', true);
    $taxonomy = 'states'; // maybe set to a, b or c?
    $terms = get_the_terms($post->ID, $taxonomy);

    if (is_array($group) && in_array($terms[0]->term_id, $group)) {
        $allcaps['edit_others_posts'] = TRUE;
    }

    return $allcaps;
}
add_filter('user_has_cap', 'author_cap_filter', 10, 4);



function my_acf_google_map_api($api)
{
    $Google_map_api_key = get_field('google_creds', 'options')['google_maps_key'];
    $api['key'] = $Google_map_api_key;
    return $api;
}
add_filter('acf/fields/google_map/api', 'my_acf_google_map_api');

/**
 * Use radio inputs instead of checkboxes for term checklists in specified taxonomies.
 *
 * @param   array   $args
 * @return  array
 */
function wpse_139269_term_radio_checklist($args)
{
    if (!empty($args['taxonomy']) && $args['taxonomy'] === 'resource_type' /* <== Change to your required taxonomy */) {
        if (empty($args['walker']) || is_a($args['walker'], 'Walker')) { // Don't override 3rd party walkers.
            if (!class_exists('WPSE_139269_Walker_Category_Radio_Checklist')) {
                /**
                 * Custom walker for switching checkbox inputs to radio.
                 *
                 * @see Walker_Category_Checklist
                 */
                class WPSE_139269_Walker_Category_Radio_Checklist extends Walker_Category_Checklist
                {
                    function walk($elements, $max_depth, ...$args)
                    {
                        $output = parent::walk($elements, $max_depth, ...$args);
                        $output = str_replace(
                            array('type="checkbox"', "type='checkbox'"),
                            array('type="radio"', "type='radio'"),
                            $output
                        );

                        return $output;
                    }
                }
            }

            $args['walker'] = new WPSE_139269_Walker_Category_Radio_Checklist;
        }
    }

    return $args;
}
add_filter('wp_terms_checklist_args', 'wpse_139269_term_radio_checklist');

/* New column 'Ranking' added to the list - Dt. 1st July 21 */
//add column for taxonomy
function theme_columns($theme_columns)
{
    $new_columns = array(
        'cb' => '<input type="checkbox" />',
        'name' => __('Name'),
        'state' => __('State'),
        'keyword' => __('Keyword'),
        'ranking' => __('Ranking'),
        //'description' => __('Description'),
        'slug' => __('Slug'),
        'posts' => __('Posts')
    );
    return $new_columns;
}
add_filter("manage_edit-topics_columns", 'theme_columns');

function add_topics_column_content($content, $column_name, $term_id)
{
    $term = get_term($term_id, 'topics');
    switch ($column_name) {
        case 'state':
            //do your stuff here with $term or $term_id
            $content = 'test';
            $content = get_field('associated_states', $term);
            $resource_states = '';
            if (!empty($content)) {
                foreach ($content as $contentVal) {
                    $category = get_term_by('id', $contentVal, 'states');
                    $resource_type .= $category->name . ", ";
                }
            }
            echo substr($resource_type, 0, -2);
            break;
        case 'keyword':
            //do your stuff here with $term or $term_id
            $content = 'test';
            $content = get_field('keyword', $term);
            echo $content;
            break;
        case 'ranking':
            //do your stuff here with $term or $term_id
            $content = 'test';
            $content = get_field('ranking', $term);
            echo $content;
            break;
        default:
            break;
    }
    //return $content;
}
add_filter('manage_topics_custom_column', 'add_topics_column_content', 10, 3);


add_action('save_post', 'x_update_lng_and_lat');
function x_update_lng_and_lat($post_id)
{
    $location = get_field('address', $post_id);
    $lat = $location['lat'];
    $lng = $location['lng'];
    update_post_meta($post_id, 'x_location_lat', $lat);
    update_post_meta($post_id, 'x_location_lng', $lng);
}


function get_taxonomy_hierarchy($taxonomy, $parent = 0)
{
    // only 1 taxonomy
    $taxonomy = is_array($taxonomy) ? array_shift($taxonomy) : $taxonomy;
    // get all direct descendants of the $parent
    $terms = get_terms($taxonomy, array('parent' => $parent));
    // prepare a new array.  these are the children of $parent
    // we'll ultimately copy all the $terms into this new array, but only after they
    // find their own children
    $children = array();
    // go through all the direct descendants of $parent, and gather their children
    foreach ($terms as $term) {
        // recurse to get the direct descendants of "this" term
        $term->children = get_taxonomy_hierarchy($taxonomy, $term->term_id);
        // add the term to our new array
        $children[$term->term_id] = $term;
    }
    // send the results back to the caller
    return $children;
}


add_filter('manage_edit-ln_resource_sortable_columns', 'set_custom_mycpt_sortable_columns');
function set_custom_mycpt_sortable_columns($columns)
{
    $columns['taxonomy-states'] = 'taxonomy-states';
    $columns['taxonomy-resource_type'] = 'taxonomy-resource_type';
    return $columns;
}

// Custom Filter for Resource Type
add_action('restrict_manage_posts', 'filter_resource_by_taxonomy');
function filter_resource_by_taxonomy()
{
    global $typenow;
    $post_type = 'ln_resource';
    $taxonomy  = 'resource_type';
    if ($typenow == $post_type) {
        $selected      = isset($_GET[$taxonomy]) ? $_GET[$taxonomy] : '';
        $info_taxonomy = get_taxonomy($taxonomy);
        wp_dropdown_categories(array(
            'show_option_all' => sprintf(__('Show all %s', 'textdomain'), $info_taxonomy->label),
            'taxonomy'        => $taxonomy,
            'name'            => $taxonomy,
            'orderby'         => 'name',
            'selected'        => $selected,
            'show_count'      => true,
            'hide_empty'      => true,
        ));
    };
}

add_filter('parse_query', 'id_to_resource_type');
function id_to_resource_type($query)
{
    global $pagenow;
    $post_type = 'ln_resource'; // change to your post type
    $taxonomy  = 'resource_type'; // change to your taxonomy
    $q_vars    = &$query->query_vars;

    if ($pagenow == 'edit.php' && isset($q_vars['post_type']) && $q_vars['post_type'] == $post_type && isset($q_vars[$taxonomy]) && is_numeric($q_vars[$taxonomy]) && $q_vars[$taxonomy] != 0) {
        $term = get_term_by('id', $q_vars[$taxonomy], $taxonomy);
        $q_vars[$taxonomy] = $term->slug;
    }
}

// Custom Filter for Topic
add_action('restrict_manage_posts', 'filter_resource_by_topic');
function filter_resource_by_topic()
{
    global $typenow;
    $post_type = 'ln_resource';
    $taxonomy  = 'topics';
    if ($typenow == $post_type) {
        $selected      = isset($_GET[$taxonomy]) ? $_GET[$taxonomy] : '';
        $info_taxonomy = get_taxonomy($taxonomy);
        wp_dropdown_categories(array(
            'show_option_all' => sprintf(__('Show all %s', 'textdomain'), $info_taxonomy->label),
            'taxonomy'        => $taxonomy,
            'name'            => $taxonomy,
            'orderby'         => 'name',
            'selected'        => $selected,
            'show_count'      => true,
            'hide_empty'      => true,
        ));
    };
}

add_filter('parse_query', 'id_to_topic');
function id_to_topic($query)
{
    global $pagenow;
    $post_type = 'ln_resource'; // change to your post type
    $taxonomy  = 'topics'; // change to your taxonomy
    $q_vars    = &$query->query_vars;

    if ($pagenow == 'edit.php' && isset($q_vars['post_type']) && $q_vars['post_type'] == $post_type && isset($q_vars[$taxonomy]) && is_numeric($q_vars[$taxonomy]) && $q_vars[$taxonomy] != 0) {
        $term = get_term_by('id', $q_vars[$taxonomy], $taxonomy);
        $q_vars[$taxonomy] = $term->slug;
    }
}



/**
  Function name lsc_add_snippet_to_footer
  Enqueueing admin js script.
  @params $hook
  @return none
  Modified: Dt: 13th July 2021
 */
function lsc_load_admin_scripts($hook)
{
    if (isset($_GET['taxonomy']) && isset($_GET['post_type']) && ('states' === $_GET['taxonomy'] && 'guided_assistant' === $_GET['post_type'] || 'ln_resource' === $_GET['post_type'])) {
        wp_register_script('admin-script', get_template_directory_uri() . '/assets/js/admin.js', array('jquery'), '', true);
        wp_enqueue_script('admin-script');
    }
}
add_action('admin_enqueue_scripts', 'lsc_load_admin_scripts');


/**
  Function name lsc_select_parent_terms
  Hook added to auto select parent term when child is selected, Executes when post saved.
  @params int $post_id Current post id passed.
  $params object $post Current post object passed.
  @return none
  Modified: Dt: 28th July 2021
 */
add_action('save_post', 'lsc_select_parent_terms', 10, 2);
function lsc_select_parent_terms($post_id, $post)
{

    if ($post->post_type == 'revision')
        return;

    $taxonomies = get_taxonomies(array('_builtin' => false));
    foreach ($taxonomies as $taxonomy) {
        $terms = wp_get_object_terms($post->ID, $taxonomy);
        foreach ($terms as $term) {
            $parenttags = get_ancestors($term->term_id, $taxonomy);
            wp_set_object_terms($post->ID, $parenttags, $taxonomy, true);
        }
    }
}
