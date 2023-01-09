<?php
    class SpotActionData {
        private $resc_id = null;
        private $resc_topics = null;
        private $spot_terms_data = null;
        private $data_attr_str = null;

        function __construct($resc_id) {
            $this->resc_id = $resc_id;
            $this->init_resc_topics();
            $this->init_spot_terms_data();
        }

        public function generate_data_attr_str() {
            $values = array_map(
                function($x) {
                    return $x->spot_id;
                },
                $this->spot_terms_data
            );

            if($values) {
                return 'data-spot-ids="' . implode("|", $values) . '"';
            } else {
                return '';
            }
        }

        private function init_resc_topics() {
            $this->resc_topics = get_the_terms($this->resc_id, 'topics');
        }

        private function init_spot_terms_data() {
            global $wpdb;
            $resc_spot_term_ids = $this->get_resc_spot_term_ids();
            

            if($resc_spot_term_ids) {
                $table_name = $wpdb->prefix . 'spot_api_terms';
                
                $this->spot_terms_data = $wpdb->get_results(
                    "SELECT * FROM $table_name WHERE id IN (".implode(",", $resc_spot_term_ids).")"
                );
            } else {
                $this->spot_terms_data = null;
            }

        }

        private function get_resc_spot_term_ids() {
            return array_reduce(
                array_map(function($x) {
                   return array_slice(explode(",", get_field('custom_spot_list', $x)), 0, -1);
                }, $this->resc_topics),
                'array_merge', 
                []
            );
        }
    }
?>