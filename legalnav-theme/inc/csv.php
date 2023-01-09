<?php
/**
 * Name: CSV Menu
 * URI: https://dev.legalnav.i72dev.com
 * Description: Menu for downloading an CSV of Resources
 * Version: 1.0.0
 */

defined('ABSPATH') or die('Unauthorized Access!');

function jsonToCSV($json, $cfilename)
{
    $fp = fopen('../'.$cfilename, 'w');
    $header = false;
    foreach ($json as $row)
    {
        if (empty($header))
        {
            $header = array_keys($row);
            fputcsv($fp, $header);
            $header = array_flip($header);
        }
        fputcsv($fp, array_merge($header, $row));
    }
    fclose($fp);
    return;
}

function get_resource_csv($site_url) {
    global $wpdb;
    $full_query = 
        'SELECT t.name AS "State Name", p.ID AS "Resource ID", REPLACE(REPLACE(p.post_type,"guided_assistant", "Guided Assistant"), "ln_resource", "Resource") AS "Post Type",
        p.post_title AS "Post Title", p.post_modified as "Last Modified", p.post_status AS "Post Status",
        CONCAT("'.$site_url.'", "/", REPLACE(p.post_type, "ln_resource", "resource"), "/", p.post_name) as "URL", 
        (SELECT GROUP_CONCAT(t.name SEPARATOR " | ")
            FROM ' . $wpdb->prefix . 'term_relationships as tr
            JOIN ' . $wpdb->prefix . 'terms as t ON tr.term_taxonomy_id = t.term_id
            JOIN ' . $wpdb->prefix . 'term_taxonomy as tt on tr.term_taxonomy_id = tt.term_taxonomy_id
            AND tt.taxonomy = "topics"
            WHERE tr.object_id = p.ID) AS "Topics",
        (SELECT GROUP_CONCAT(t.name SEPARATOR " | ")
            FROM ' . $wpdb->prefix . 'term_relationships as tr
            JOIN ' . $wpdb->prefix . 'terms as t ON tr.term_taxonomy_id = t.term_id
            JOIN ' . $wpdb->prefix . 'term_taxonomy as tt on tr.term_taxonomy_id = tt.term_taxonomy_id
            AND tt.taxonomy = "resource_type"
            WHERE tr.object_id = p.ID) AS "Resource Type"
    FROM ' . $wpdb->prefix . 'posts as p
    JOIN ' . $wpdb->prefix . 'term_relationships as tr ON p.ID = tr.object_id
    JOIN ' . $wpdb->prefix . 'terms as t ON tr.term_taxonomy_id = t.term_id
    WHERE (p.post_type = "ln_resource" OR p.post_type = "guided_assistant")
    AND p.post_status = "publish"
    AND (tr.term_taxonomy_id = "16" OR tr.term_taxonomy_id = "17")
    ORDER BY t.name, p.ID';
    $csv_results = $wpdb->get_results($full_query, ARRAY_A);
    $new_csv_results = array();
    foreach ($csv_results as $csv_result) {
        $address = get_field('address_details', $csv_result['Resource ID']);
        $csv_result['Address'] = ($address) ? $address : "N/A";
        $term_obj_list = get_the_terms( $csv_result['Resource ID'], 'region' );
        $terms_string = join(', ', wp_list_pluck($term_obj_list, 'name'));
        $csv_result['Region'] = ($terms_string) ? $terms_string : "N/A";
        $new_csv_results[] = $csv_result;
    }
    jsonToCSV($new_csv_results, 'resources.csv');
    return;
}

function dashboard_ui() {

    $site_url = 'https://'. $_SERVER['HTTP_HOST'];
    get_resource_csv($site_url);

    $dashboard_html = '<!-- header_html() -->
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
    <style>
    table {
        border-collapse: collapse;
        width: 100%;
    }
    th, td {
        padding: 8px;
        text-align: left;
        border-bottom: 1px solid #ddd;
    }
    .proc {
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 150px;
    }
    /*data tables*/
    div.dataTables_wrapper {
        margin-bottom: 3em;
        width: 100%;
    }
    </style>';

    //Quick and dirty styling.
    $dashboard_html .= '
    <style>
    #wpbody-content {
        text-align: center;
        width:80%;
    }
    </style>';

    //Text and Buttons.
    $dashboard_html .= '<!-- Dashboard Start -->
    <br><br>
    <h1>Resource CSV Generated</h1>
    <br><br>';
    $dashboard_html .= '<td><a href="'.$site_url.'/resources.csv"><button type="button">Download Now</button></a></td>';
    echo $dashboard_html;
}

//Add new menu 'csv_menu'
add_action( 'admin_menu', 'csv_menu' );

//Function called for 'screening_menu'
function csv_menu(){

  //Adds the main menu page for 'csv_dashboard'
  add_menu_page('Download CSV', 'Download CSV', 4, 'csv_dashboard', '', 'dashicons-analytics');

  //Adds the first submenu, using 'csv_dashboard' as both it's parent slug and it's own slug to set it as the default page.
  add_submenu_page('csv_dashboard', 'Download CSV', 'Download CSV', 4, 'csv_dashboard', 'dashboard_ui');    

}
?>