<?php
// Determine if topic has no children
function topic_is_leaf_node($sub_topics)
{
    return !boolval(sizeof($sub_topics));
}

function query_subtopics($topic)
{
    $sub_topics = get_terms(array(
        'taxonomy' => 'topics',
        'parent' => $topic->term_id,
    ));

    return $sub_topics;
}

function render_breadcrumbs($topic_term_id)
{
    $parent_topics = get_term_parents_list($topic_term_id, 'topics', array('separator' => ''));
    echo '<div class="breadcrumbs">';
    echo '<a href="/topics-resources">All Topics</a>' . $parent_topics;
    echo '</div>';
}

function render_sidebar($result_resource_items)
{

    $sidebar_heading = get_field('sidebar_heading', 'option');
    $sidebar_text = get_field('sidebar_text', 'option');
    $sidebar_button_text = get_field('sidebar_button_text', 'option');
    $sidebar_link = get_field('sidebar_link', 'option');
    $sidebar_image = get_field('sidebar_image', 'option'); ?>

    <aside class="sidebar col-md-3 col-sm-12 pull-right">
        <div class="side-ga-callout">
            <h5>Need help? Use our Guided Assistant to receive personalized recommendations.</h5>
            <p>No account necessary. We never share any information you provide. Read our <a href="/privacy-policy">Privacy Notice</a>.</p>
            <a href="/guided-assistant" class="btn btn-primary">Start the Guided Assistant</a>
        </div>
        <?php if (!empty($sidebar_heading)) { ?>
            <div class="sidebar-callout">
                <?php
                if (!empty($sidebar_heading)) { ?>
                    <h3><?=$sidebar_heading?></h3>
                <?php
                }
                if (!empty($sidebar_image)) { ?>
                    <div class="topic-icon" style="background-image: url('<?=$sidebar_image?>')"></div>
                <?php
                }
                if (!empty($sidebar_text)) { ?>
                    <h6><?=$sidebar_text?></h6>
                <?php
                }
                if (!empty($sidebar_button_text)) { ?>
                    <a class="btn btn-primary" href="<?=$sidebar_link?>" target="_blank"><?=$sidebar_button_text?></a>
                <?php
                }
                ?>

            </div>
        <?php } ?>

    </aside>

<?php }

function render_topics_branch($topic, $sub_topics)
{ ?>
    <div class="topic-list-container col-md-8 col-sm-12">
    <div class="topic-heading-lockup">
        <div class="topic-left">
            <div class="topic-icon" style="background-image: url('<?php echo get_field('icon', $topic); ?>')"></div>
        </div>
        <div class="topic-details">
            <h4>More Topics Related To <?php echo $topic->name; ?></h4>
            <p>Which topic would you like to learn more about?</p>
        </div>
    </div>

    <?php if (!empty($topic->description)) { ?>
        <h2>Overview</h2>
        <p><?php echo $topic->description; ?></p>
    <?php } ?>

    <?php
    if (!empty($sub_topics)) {

        $sorted_sub_topics = array();

        foreach ($sub_topics as $sub_topic) {
            $sorted_sub_topics[] = $sub_topic;
        }

        //Sort list based on Ranking.
        uasort($sorted_sub_topics, function ($a, $b) {
            if (get_field('ranking', $a) == get_field('ranking', $b)) {
                return 0;
            }
            return (get_field('ranking', $a) > get_field('ranking', $b)) ? -1 : 1;
        });

        //Loop through each item.
        foreach ($sorted_sub_topics as $sorted_sub_topic) { ?>
            <a class="topic-links" href="<?php echo get_term_link($sorted_sub_topic->slug, 'topics') ?>"><?php echo $sorted_sub_topic->name ?></a>
        <?php }
    } ?>
    </div>
    <?php

    $result_resource_items = array(); //FIXME This was part of the location mapping.
    render_sidebar($result_resource_items);
}

function render_region_checkboxes($regions, $region_id = NULL) { ?>
    <div class="checkbox-layer">
        <?php foreach($regions as $region) {
            if (($region_id == NULL && $region->parent == 0) || $region_id == $region->parent) { ?>
                <div class="checkbox-container">
                    <input type="checkbox" autocomplete="off" id="<?php echo $region->slug; ?>" name="<?php echo $region->slug; ?>" data-name="<?=$region->name;?>" data-slug="<?=$region->slug;?>">
                    <label for="<?php echo $region->slug; ?>"><?php echo $region->name; ?></label>
                </div>
                <?php render_region_checkboxes($regions, $region->term_id);
            }
        } ?>
    </div>
<?php }


function render_topics_leaf($topic) { ?>
<div class="topics-page-box">
    <div class="topics-page-box-left">
        <h2><?= $topic->name; ?></h2>
        <?php if (!empty($topic->description)) { ?>
            <p><?= $topic->description; ?></p>
        <?php } ?>
    </div>
    <?php
    //Get Resource Types
    $region_array = get_terms(array(
        'taxonomy' => 'region',
        'hide_empty' => false,
    ));
    if (count($region_array)) { ?>
        <div class="region-select" id="regions">
            <a href="javascript:;" class="region-select-label">Search By Location</a>
            <div class="region-select-items">
                <?php render_region_checkboxes($region_array); ?>
            </div>
        </div>
    <?php } ?>
    </div>
    <div class="result-tabs-container">
        <div class="result-tabs">
            <?php
            //Get Resource Types
            $taxonomy_array = get_terms(array(
                'taxonomy' => 'resource_type',
                'hide_empty' => true
            )); ?>
            <a href="javascript:;" class="topic-select active" data-name="Featured Resources" data-slug="">Featured Resources</a>
            <?php foreach ($taxonomy_array as $taxonomy) {
                $posts_array = get_posts(
                    array(
                        'posts_per_page' => -1,
                        'post_type' => ['ln_resource', 'guided_assistant'],
                        'tax_query' => array(
                            'relation' => 'AND',
                            array(
                                'taxonomy' => 'resource_type',
                                'field' => 'name',
                                'terms' => $taxonomy->name
                            ),
                            array(
                                'taxonomy' => 'topics',
                                'field'    => 'slug',
                                'terms'    => $topic->slug
                            )
                        )
                    )
                );
                if (!count($posts_array)) { continue; }
                ?>
                <a href="javascript:;" class="topic-select" data-name="<?= $taxonomy->name ?>" data-slug="<?= $taxonomy->slug ?>"><?= $taxonomy->name ?></a>
            <?php } ?>
        </div>
    </div>
    <div class="swipe-container"><p class="swipe-to-scroll">swipe to see more</p></div>
    <div id="topics-results" data-ajaxurl="<?=admin_url('admin-ajax.php');?>" data-page="" data-topic="<?=$topic->slug;?>" data-resource="" data-region="" data-location=""></div>

<?php
    $maps_key = get_field('google_creds', 'options')['google_maps_key'];
    wp_enqueue_script('legalnav-google-map', 'https://maps.google.com/maps/api/js?v=3&key='.$maps_key, array('jquery'), 1.1, false);
}
?>
