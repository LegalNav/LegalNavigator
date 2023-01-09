<?php
    class GASearch {
        private $query = null;
        private $spotTopics = [];
        private $spotSearchID = null;
        public $hasResults = false;

        function __construct($query) {
            $this->setQuery($query);
        }

        private function setQuery($query) {
            $this->query = $this->sanitizeQuery($query);
        }

        private function sanitizeQuery($query) {
            return preg_replace('/[^A-Za-z0-9\-\s]/','',$query);
        }

        private function addSpotTopic($topic) {
            $this->spotTopics[] = $topic;
        }

        public function getSpotTopics() {
            return $this->spotTopics;
        }

        public function getSpotSearchID() {
            return $this->spotSearchID;
        }

        private function getSpotTopicNamesHTML() {
            $topic_names = array_map(function($x){return $x->name;}, $this->getSpotTopics());
            $topics_string = implode(", ",$topic_names);

            return "<p style=\"text-align: center;\">Spot returned the following topics: $topics_string</p>";
        }

        private function buildTitleMatchQueryArgs() {
            return [
                'post_type' => ['guided_assistant'],
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
                'post_type' => ['guided_assistant'],
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

        private function getExpertOpinionAccordionHTML() {
            $thumbs_up_svg = file_get_contents(get_template_directory().'/assets/images/expert-up.svg');
            $thumbs_down_svg = file_get_contents(get_template_directory().'/assets/images/expert-down.svg');

            $output = "<div class=\"expert-accordion\">";
            $output .= "<a href=\"javascript:;\" class=\"expert-toggle\">Are these topics related to your search?</a>";

            $output .= "<div class=\"topics\">";

            foreach ($this->getSpotTopics() as $topic) {
                $output .= "<div class=\"topic\" data-topic-spot-id=\"$topic->id\">";
                $output .= "<h5 class=\"topic-name\">$topic->name</h5>";
                $output .= "<div class=\"buttons\">";
                $output .= "<a href=\"javascript:;\" class=\"present\"><span>Yes</span>$thumbs_up_svg</a>";
                $output .= "<a href=\"javascript:;\" class=\"not-present\"><span>No</span>$thumbs_down_svg</a>";
                $output .= "</div>";
                $output .= "</div>";
            }

            $output .= "</div></div>";

            return $output;
        }

        public function getResults() {
            // Posts where title or content matches query
            $title_match_ids = (new WP_Query($this->buildTitleMatchQueryArgs()))->posts;
            // Posts where topic name or topic keywords match query
            $topic_match_ids = (new WP_Query($this->buildTopicMatchQueryArgs()))->posts;
            // Merge query results and sort
            $result_ids = array_unique(array_merge($title_match_ids, $topic_match_ids));

            if (empty($result_ids)) {

                $output = json_decode(query_spot_api($this->query));

                // Set spot search ID
                $query_id_prop = "query-id";
                $this->spotSearchID = $output->$query_id_prop;

                if (!empty($output->labels)) {
                    foreach ($output->labels as $search_item) {
                        $this->addSpotTopic($search_item);
                        $this->setQuery($search_item->name);
                        //Posts where title or content matches query
                        $title_match_ids = (new WP_Query($this->buildTitleMatchQueryArgs()))->posts;
                        //Posts where topic name or topic keywords match query
                        $topic_match_ids = (new WP_Query($this->buildTopicMatchQueryArgs()))->posts;
                        // // Merge query results and sort
                        $result_ids = array_unique(array_merge($title_match_ids, $topic_match_ids, $result_ids));
                    }
                }


            }

            if($result_ids) {
                // Set hasResults flag
                $this->hasResults = true;
            }

            if(!empty($result_ids)) {

                if (!empty($this->getSpotTopics())) {
                    echo $this->getSpotTopicNamesHTML();

                    if(get_field('expert_opinions_active', 'option')) {
                        echo $this->getExpertOpinionAccordionHTML();
                    }
                } ?>

                <div class="ga-posts-info">
                    <h2>Pick a Guided Assistant Interview Below:</h2>
                    <ol>
                        <li>Answer questions to help us understand your needs.</li>
                        <li>We’ll create a personalized plan with easy steps and resources.</li>
                        <li>Share or print your personalized plan.</li>
                    </ol>
                </div>

                <?php foreach($result_ids as $result_id) {
                    $ga_title = get_the_title($result_id);
                    $ga_permalink = get_permalink($result_id);
                    $ga_excerpt = get_the_excerpt($result_id);

                    // Get ga's topics
                    $ga_topics = get_the_terms($result_id, 'topics');

                    // Get spot topic ids for each topic
                    $ga_topics_spot_ids = array_map(
                        function($x){return get_field('custom_spot_list', 'topics_'.$x->term_id);},
                        $ga_topics
                    );

                    $ga_topics_spot_ids_str = substr(implode('', $ga_topics_spot_ids), 0, -1);

                    // Get spot IDs assocaited with each spot topic's DB ID
                    global $wpdb;
                    $ga_topic_associated_spot_ids = $wpdb->get_results(
                        $wpdb->prepare(
                            "SELECT spot_id FROM ".$wpdb->prefix."spot_api_terms WHERE id IN ($ga_topics_spot_ids_str)"
                        )
                    );

                    $ga_spot_ids = implode(',', array_map(function($x) {return $x->spot_id;}, $ga_topic_associated_spot_ids));

                ?>

                    <div class="posts">
                        <a href="<?php echo $ga_permalink; ?>" data-ga-spot-ids="<?php echo $ga_spot_ids; ?>"><h4><?php echo $ga_title; ?></h4>
                            <p class="ga-description"><?php echo $ga_excerpt; ?></p>
                        </a>
                    </div>
                <?php }

            } else {

                if(!empty($this->getSpotTopics())) {
                    echo $this->getSpotTopicNamesHTML();

                    if(get_field('expert_opinions_active', 'option')) {
                        echo $this->getExpertOpinionAccordionHTML();
                    }
                } ?>

                <h4 class="no-ga-results">We did not find any Guided Assistants that match your search.</h4>

            <?php }
        }
    }
?>
