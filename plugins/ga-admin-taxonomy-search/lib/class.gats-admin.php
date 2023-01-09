<?php

if( !class_exists('GATS_Admin') ){
    class GATS_Admin {

        private static $initiated = false;

        public static function init( ) {
            if ( ! self::$initiated ) {
                self::init_hooks();
            }
        }

        /**
         * Initializes WordPress hooks
         */
        private static function init_hooks( ) {
            self::$initiated = true;

            //add_action( 'admin_menu', array( 'GATS_Admin', 'init_menus' ), 10, 2 );
            add_action( 'admin_enqueue_scripts', array( 'GATS_Admin', 'admin_enqueue_scripts' ), 10, 1 );
        }

        public static function init_menus( ) {
            //add_options_page( 'Wiser Plugin Core', 'Wiser Plugin Core', 'manage_options', 'wiser-plugin-core_settings', array( 'GATS_Admin' ,'i_settings'), 1 );
        }

        public static function admin_enqueue_scripts( $hook ){
            if ( 'post.php' != $hook && $hook != 'post-new.php' )
                return;

            wp_enqueue_style( 'gats-admin-style', GATS_PLUGIN_URL.'resources/style/admin_style.css', null, GATSVersion, 'all' );
            wp_enqueue_script( 'gats-admin-js', GATS_PLUGIN_URL.'resources/js/admin_js.js' , array('jquery'), GATSVersion, true );
            wp_localize_script( 'gats-admin-js', 'gats_infos',
                array(
                    'GATS_NAME' => GATS_NAME
                )
            );
        }

        public static function i_settings( ){

            //wp_enqueue_script( 'gats-admin-js', GATS_PLUGIN_URL.'resources/js/admin_js.js' , array('jquery'), GATSVersion, true );

            //require_once ( GATS_PLUGIN_DIR . 'view/admin/gats_settings.php' );
        }


        /*
         * AJAX
         */

    }
}
