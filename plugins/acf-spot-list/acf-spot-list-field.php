<?php

/*
Plugin Name: Advanced Custom Fields: Spot List
Plugin URI: PLUGIN_URL
Description: Multi-select groups based on LIST term labels returned from the SPOT API.
Version: 1.0.0
Author: Will Birdsall
Author URI: ignition72.com
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html
*/

// exit if accessed directly
if( ! defined( 'ABSPATH' ) ) exit;


// check if class already exists
if( !class_exists('LN_acf_plugin_spot_list') ) :

class LN_acf_plugin_spot_list {
	
	// vars
	var $settings;
	
	
	/*
	*  __construct
	*
	*  This function will setup the class functionality
	*
	*  @type	function
	*  @date	17/02/2016
	*  @since	1.0.0
	*
	*  @param	void
	*  @return	void
	*/
	
	function __construct() {
		
		// settings
		// - these will be passed into the field class.
		$this->settings = array(
			'version'	=> '1.0.0',
			'url'		=> plugin_dir_url( __FILE__ ),
			'path'		=> plugin_dir_path( __FILE__ )
		);

		// include field
		add_action('acf/include_field_types', 	array($this, 'include_field')); // v5
		add_action('acf/register_fields', 		array($this, 'include_field')); // v4
	}
	
	/*
	*  include_field
	*
	*  This function will include the field type class
	*
	*  @type	function
	*  @date	17/02/2016
	*  @since	1.0.0
	*
	*  @param	$version (int) major ACF version. Defaults to false
	*  @return	void
	*/
	
	function include_field( $version = false ) {
		
		// support empty $version
		if( !$version ) $version = 4;
		
		
		// load textdomain
		load_plugin_textdomain( 'TEXTDOMAIN', false, plugin_basename( dirname( __FILE__ ) ) . '/lang' ); 
		
		
		// include
		include_once('fields/class-LN-acf-field-spot-list-v' . $version . '.php');
	}
	
}


// initialize
new LN_acf_plugin_spot_list();

// class_exists check
endif;

// Creates a table in the DB for the SPOT terms
function create_spot_terms_table() {
	global $wpdb;

	$table_name = $wpdb->prefix . "spot_api_terms";

	$charset_collate = $wpdb->get_charset_collate(); 

	$sql_statement = "CREATE TABLE $table_name (
		id smallint NOT NULL AUTO_INCREMENT,
		updated boolean,
		parent_id smallint,
		spot_id varchar(14) NOT NULL,
		spot_term text NOT NULL,
		PRIMARY KEY  (id)
	) $charset_collate;";

	require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );
	dbDelta($sql_statement);
}
register_activation_hook( __FILE__, 'create_spot_terms_table' );

// Create new 3 day cron interal
function example_add_cron_interval( $schedules ) { 
	$schedules['three_days'] = array(
		'interval' => 3 * DAY_IN_SECONDS,
		'display'  => esc_html__( 'Every Three Days' ), );
	return $schedules;
}
add_filter( 'cron_schedules', 'example_add_cron_interval' );

// Check if spot_id already exists w/ the specified parent_id
function rowAlreadyExists($table_name, $spot_term, $parent_id) {
	global $wpdb;

	$parent_id_string = is_null($parent_id) ? "NULL" : $parent_id;
	$parent_operator = is_null($parent_id) ? "IS" : "="; 

	$results = $wpdb->get_row(
		"SELECT * FROM $table_name WHERE spot_id = \"$spot_term->id\" AND parent_id $parent_operator $parent_id_string"
	);

	return !is_null($results) && !empty($results);
}

function addLabelToDB($spot_term, $parent_id) {
	global $wpdb;

	$table_name = $wpdb->prefix . "spot_api_terms";

	$rowAlreadyExists = rowAlreadyExists($table_name, $spot_term, $parent_id);

	if($rowAlreadyExists) {
		// If row exists, update it
		$rowAddedOrUpdated = $wpdb->update( 
			$table_name, 
			array(
				'updated' => true,
				'spot_term' => $spot_term->name
			),
			array(
				'spot_id' => $spot_term->id,
				'parent_id' => $parent_id
			) 
		);
	} else {
		// Insert new row if non-existant
		$rowAddedOrUpdated = $wpdb->insert(
			$table_name,
			array(
				'updated' => true,
				'parent_id' => $parent_id,
				'spot_id' => $spot_term->id,
				'spot_term' => $spot_term->name
			)
		);
	}
}

// Update SPOT list
function update_spot_terms() {
	global $wpdb;

	$table_name = $wpdb->prefix . "spot_api_terms";

	// Set 'updated' column of each current term to 0
	$wpdb->query(
		"UPDATE $table_name SET updated = false"
	);
	

	// Query SPOT API for terms
	$api_spot_terms = json_decode(file_get_contents('https://spot.suffolklitlab.org/v0/taxonomy'))->labels;

	// Parse terms and add to DB
	// WARNING: This creates DB rows as it recursively parses the tree
	function parse_spot_term_tree(&$term_tree, $max_depth, $current_depth = 0, $parent_db_id = NULL) {
		global $wpdb;

		$table_name = $wpdb->prefix . "spot_api_terms";

		if($current_depth <= $max_depth) {
			foreach($term_tree as $spot_term) {				
				// Base and recursive
				addLabelToDB($spot_term, $parent_db_id);

				// Recursive Case:
				if(!empty($spot_term->children)) {
					$new_parent_db_id = $wpdb->get_var(
						"SELECT id FROM $table_name WHERE spot_id = \"$spot_term->id\""
					);

					// Recurse
					parse_spot_term_tree($spot_term->children, $max_depth, $current_depth + 1, $new_parent_db_id);
				}
			}
		}
	}

	parse_spot_term_tree($api_spot_terms, 1);

	// Delete rows w/ 'updated' set to 0
	$wpdb->delete(
		$wpdb->prefix . "spot_api_terms",
		array(
			'updated' => false // value in column to target for deletion
		)
	);
}
// Explicitly update DB w/ SPOT terms on plugin activation
register_activation_hook( __FILE__, 'update_spot_terms');

// Add custom hook
add_action('spot_cron_hook', 'update_spot_terms');

// Creates a new cron schedule to run update_spot_terms
function spot_cron_activate() {
	if (!wp_next_scheduled('spot_cron_hook')) {
		wp_schedule_event(time(), 'three_days', 'spot_cron_hook');
	}
}
register_activation_hook( __FILE__, 'spot_cron_activate' );

function spot_cron_deactivate() {
    $timestamp = wp_next_scheduled( 'spot_cron_hook' );
    wp_unschedule_event( $timestamp, 'spot_cron_hook' );
}
register_deactivation_hook( __FILE__, 'spot_cron_deactivate' );
	
?>