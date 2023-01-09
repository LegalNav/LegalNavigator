<?php
    class SiteSearch {
        private $query = null;

        function __construct($query) {
            $this->setQuery($query);
        }

        private function setQuery($query) {
            $this->query = $query;
        }

        private function buildTitleMatchQueryArgs() {
            return [
                'post_type' => ['ln_resource', 'guided_assistant'],
                'post_status' => 'publish',
                'posts_per_page' => -1,
                'orderby' => 'title',
                'order' => 'ASC',
                's' => $this->query,
                'fields' => 'ids'
            ];
        }

        // Gets topic ids of topics with query in keyword or title
        private function getTopicsWithQueryInKeyword() {
            return array_unique(array_merge(
                // Topic IDs w/ query in topic keywords
                get_terms([
                    'fields' => 'ids',
                    'taxonomy' => 'topics',
                    'meta_query' => [
                        [
                            'key' => 'keyword',
                            'value' => $this->query,
                            'compare' => 'LIKE',
                        ]
                    ],
                    'hide_empty' => false,
                ]),

                // Topic IDs w/ query in topic name
                get_terms([
                    'fields' => 'ids',
                    'taxonomy' => 'topics',
                    'name__like' => $this->query,
                    'hide_empty' => false,
                ])
            ));
        }

        private function buildTopicMatchQueryArgs() {
            return [
                'post_type' => ['ln_resource', 'guided_assistant'],
                'post_status' => 'publish',
                'posts_per_page' => -1,
                'orderby' => 'title',
                'order' => 'ASC',
                'tax_query' => [
                    [
                        'taxonomy' => 'topics',
                        'field' => 'id',
                        'terms' => $this->getTopicsWithQueryInKeyword()
                    ],
                ],
                'fields' => 'ids'
            ];
        }

        public function getResults() {
            // Posts where title or content matches query
            $title_match_ids = (new WP_Query($this->buildTitleMatchQueryArgs()))->posts;

            // Posts where topic name or topic keywords match query
            $topic_match_ids = (new WP_Query($this->buildTopicMatchQueryArgs()))->posts;

            // Merge query results and sort
            $result_ids = array_unique(array_merge($title_match_ids, $topic_match_ids));

            $result_objs = [];

            foreach($result_ids as $result_id) {
                // If 'form', 'guided-assistant', 'related-readings', or 'video' get content, else get overview for desc
                $result_terms = get_the_terms($result_id, 'resource_type');

                $has_result_terms = ($result_terms != false);

                $result_resource_type = ($has_result_terms)
                    ? $result_terms[0]->slug
                    : '';

                $use_overview = !in_array(
                    $result_resource_type,
                    [
                        'form',
                        'guided-assistant',
                        'related-readings',
                        'video'
                    ]
                );

                $desc = ($has_result_terms && $use_overview)
                            ? get_field('overview', $result_id)
                            : get_post($result_id)->post_content;

                $is_ls_resource = get_field('is_ls_resource', $result_id);

                $result = [
                    'title' => get_the_title($result_id),
                    'desc' => ($desc) ? substr(strip_tags($desc), 0, 150) . '...' : '',
                    'is_ls_resource' => $is_ls_resource,
                    'url' => get_permalink($result_id)
                ];
                array_push($result_objs, $result);
            }

            return $result_objs;
        }
    }
?>
