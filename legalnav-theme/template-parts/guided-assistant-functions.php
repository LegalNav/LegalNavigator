<?php

function render_ga_topics($heading_text) {

    // Get all topic terms
    $topics = get_terms('topics');
    // Filter only parent topics that are in the currently selected state
    $parent_topics = array();
    if (!empty($topics)) {
        foreach ($topics as $topic) {
            // If the topic is a parent topic add it to the list, else add its parent to the list
            if ($topic->parent == 0) {
                $parent_topics[$topic->term_id] = $topic;
            }
        }
    }

    if (!empty($parent_topics)) {?>

        <div class="row">

            <section class="topic-section guided-assistant-topics col-md-12 col-sm-12 col-xs-12">
                <h2><?php echo $heading_text; ?></h2>
                <ul>
                    <?php foreach ($parent_topics as $topic) {
                        $hierarchylist = array();
                        if (!empty($topic)) {
                            if (!empty($topic->term_id)) {
                                $hierarchylist[] = $topic->term_id;
                                $hierarchy = get_taxonomy_hierarchy('topics', $topic->term_id);
                                if (!empty($hierarchy)) {
                                    foreach ($hierarchy as $hierarchyVal) {
                                        $hierarchylist[] = $hierarchyVal->term_id;
                                        if (!empty($hierarchyVal->children)) {
                                            foreach ($hierarchyVal->children as $hierarchychildrenVal) {
                                                $hierarchylist[] = $hierarchychildrenVal->term_id;
                                            }
                                        }
                                    }
                                }
                            } else {
                                $hierarchylist[] = $topics;
                            }
                        }
                        $arr = array_unique($hierarchylist);
                        $topics = implode(" ,", $arr);
                        $args = array(
                            'post_type' => array('guided_assistant'),
                            'posts_per_page' => -1,
                            'post_status' => 'publish',
                            'tax_query' => array(
                                array(
                                    'taxonomy' => 'topics',
                                    'field' => 'term_id',
                                    'terms' => $topics,
                                ),
                            ),
                        );

                        $resources = new WP_Query($args);

                        if ($resources->have_posts()) { ?>

                            <li class="ga-topic-card topic-card-container col-md-3 col-sm-4 col-xs-6" data-ga="<?php echo $topic->slug; ?>">
                                <a href="javascript:void(0)" class="topic-card <?php echo $topic->slug; ?>">
                                    <div class="topic-icon" style="background-image: url('<?php echo get_field('icon', $topic) ?>')"></div>
                                    <p class="topic-name"><?php echo $topic->name; ?></p>
                                </a>
                            </li>

                        <?php }

                    } ?>

                </ul>
                <div class="clear"></div>

                <div class="ga-post-list">

                    <?php foreach ($parent_topics as $topic) {

                        $hierarchylist = array();
                        if (!empty($topic)) {
                            if (!empty($topic->term_id)) {
                                $hierarchylist[] = $topic->term_id;
                                $hierarchy = get_taxonomy_hierarchy('topics', $topic->term_id);
                                if (!empty($hierarchy)) {
                                    foreach ($hierarchy as $hierarchyVal) {
                                        $hierarchylist[] = $hierarchyVal->term_id;
                                        if (!empty($hierarchyVal->children)) {
                                            foreach ($hierarchyVal->children as $hierarchychildrenVal) {
                                                $hierarchylist[] = $hierarchychildrenVal->term_id;
                                            }
                                        }
                                    }
                                }
                            } else {
                                $hierarchylist[] = $topics;
                            }
                        }
                        $arr = array_unique($hierarchylist);
                        $topics = implode(" ,", $arr);
                        $args = array(
                            'post_type' => array('guided_assistant'),
                            'posts_per_page' => -1,
                            'post_status' => 'publish',
                            'tax_query' => array(
                                array(
                                    'taxonomy' => 'topics',
                                    'field' => 'term_id',
                                    'terms' => $topics,
                                ),
                            ),
                        );

                        $resources = new WP_Query($args);

                        usort($resources->posts, function ($a, $b) {
                            if (get_field('ranking', $a) == get_field('ranking', $b)) {
                                return 0;
                            }
                            return (get_field('ranking', $a) > get_field('ranking', $b)) ? -1 : 1;
                        });

                        if ($resources->have_posts()) { ?>

                            <ul class="ga-posts <?php echo $topic->slug; ?>">

                                <?php while ($resources->have_posts()) {
                                    $resources->the_post();
                                    $postid = get_the_ID(); ?>
                                    <li class="">
                                        <a href="<?php echo get_permalink(); ?>"><?php echo get_the_title(); ?></a>
                                    </li>
                                <?php } ?>

                            </ul>

                        <?php }

                    } ?>

                </div>

            </section>

        </div>
    <?php } else { ?>

        <h2 class="no-message">
            <?php echo "Sorry, no topics found."; ?>
        </h2>

    <?php }

}

?>
