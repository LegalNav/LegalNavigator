<?php

if( !class_exists('GATS') ){
    class GATS {

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

        }

        public static function plugin_activation( ) {

        }

        public static function load_resources(){

        }

        /**
         * Removes all connection options
         * @static
         */
        public static function plugin_deactivation( ) {

        }

    }
}
