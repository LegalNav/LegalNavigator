<?php
// Function to retrieve resources associated with a topic and state
function get_topics_resources($data)
{
    $state_name = $data['state'];
    $topic_id = $data['topic_id'];

    $args = array(
        'numberposts' => -1,
        'post_type' => 'ln_resource',
        'tax_query' => array(
            array(
                'taxonomy' => 'states',
                'field' => 'slug',
                'terms' => $state_name
            ),
            array(
                'taxonomy' => 'topics',
                'field' => 'term_id',
                'terms' => $topic_id
            )
        ),
    );

    $resource_objs = get_posts($args);

    // link
    // video_link
    function create_resource_urls($resource_obj)
    {
        $res_id = $resource_obj->ID;
        $output_link = "";
        $resource_type = get_the_terms($resource_obj, 'resource_type')[0]->slug;

        if ($resource_type == 'organization') {
            $output_link = get_permalink($resource_obj);
        } else if (get_field('link', $res_id)) {
            $output_link = get_field('link', $res_id);
        } else if (get_field('video_link', $res_id)) {
            $output_link = get_field('video_link', $res_id);
        } else {
            $output_link = get_permalink($resource_obj);
        }

        return array(
            'name' => $resource_obj->post_title,
            'url' => $output_link
        );
    }

    return array_map('create_resource_urls', $resource_objs);
}
add_action('rest_api_init', function () {
    register_rest_route('wp/v2', '/state-topic-resources/(?P<state>\w+)/(?P<topic_id>\d+)', array(
        'methods' => 'GET',
        'callback' => 'get_topics_resources',
    ));
});

// Function to retrieve a state's topics, for the API
function get_state_topic_names($data)
{
    $state_topics = array();
    $state_name = $data['state'];

    $all_topics = get_terms('topics');
    $state_term = get_term_by('slug', $state_name, 'states');
    $state_id = $state_term->term_id;

    foreach ($all_topics as $topic) {
        if (in_array($state_id, get_field('associated_states', $topic))) {
            array_push($state_topics, array("topic-id" => $topic->term_id, "topic-name" => $topic->name, "topic-slug" => $topic->slug));
        }
    }

    return $state_topics;
}
add_action('rest_api_init', function () {
    register_rest_route('wp/v2', '/topics/(?P<state>\w+)', array(
        'methods' => 'GET',
        'callback' => 'get_state_topic_names',
    ));
});

function get_states($data)
{
    $state_terms = get_terms(array(
        'taxonomy' => 'states',
    ));

    function package_state_data($state_term)
    {
        return array(
            'name' => $state_term->name,
            'slug' => $state_term->slug,
            'abbreviation' => get_field('abbreviation', 'term_' . $state_term->term_id)
        );
    }

    return array_map('package_state_data', $state_terms);
}
add_action('rest_api_init', function () {
    register_rest_route('wp/v2', '/states', array(
        'methods' => 'GET',
        'callback' => 'get_states',
    ));
});

require_once get_template_directory() . '/classes/site-search.php';

function get_site_search_results($data) {
    $query = $_GET['q'];
    $id = $_GET['state-id'];
    $site_search = new SiteSearch($query);
    return json_encode($site_search->getResults($id));
}
add_action('rest_api_init', function() {
    register_rest_route('wp/v2', '/siteSearch', array(
        'methods' => 'GET',
        'callback' => 'get_site_search_results'
    ));
});

function get_related_topics($data)
{
    // Format IDs w/ quotes for MySQL
    //$spot_ids = implode(',', );
    $unparsed_spot_ids = $_GET['spot-ids'];
    if (!$unparsed_spot_ids) {
        return null;
    }
    $spot_ids = implode(', ', array_map(
        function($x) {
            return '"'.$x.'"';
        },
        explode(',', $unparsed_spot_ids)
    ));

    global $wpdb;
    $term_ids = $wpdb->get_results(
        $wpdb->prepare(
            "SELECT tm.term_id FROM ".$wpdb->prefix."spot_api_terms AS sat JOIN ".$wpdb->prefix."termmeta AS tm ON sat.id = tm.meta_value WHERE sat.spot_id IN ($spot_ids)"
        )
    );

    if($term_ids) {
        $term_objs = get_terms([
            'taxonomy' => 'topics',
            'include' => array_map(function($x){return $x->term_id;}, $term_ids),
            'hide_empty' => true
        ]);
    } else {
        $term_objs = [];
    }

    $parent_terms = array();
    if(!empty($term_objs)){
        foreach($term_objs as $term) {
            // If the topic is a parent topic add it to the list
            if($term->parent == 0) {
                $children = get_term_children($term->term_id, 'topics');

                $parent_terms[$term->term_id] = $term;
            }
        }
    }

    return json_encode(
        array_map(function($term) {
            return [
                'name' => $term->name,
                'icon_url' => get_field('icon', $term->taxonomy.'_'.$term->term_id),
                'permalink' => get_term_link($term->term_id)
            ];
        }, $parent_terms)
    );


}
add_action('rest_api_init', function () {
    register_rest_route('wp/v2', '/related-topics', array(
        'methods' => 'GET',
        'callback' => 'get_related_topics',
    ));
});
