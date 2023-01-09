<?php

/**
 * Single GA Template
 */

    get_header();

    $court_logo_url = get_field('court_logo', 'option');
    $show_court_lookup = get_field('show_court_lookup');

    get_template_part("/template-parts/single-ga-functions");
?>

<main class="site-main">
    <div class="container">

    <?php
        if (have_posts()) {
            // Load posts loop.
            while (have_posts()) {
                the_post();

                include_once 'classes/spot-action-data.php';

                $data = new SpotActionData(get_the_ID());

                if($_GET['gaSearchString']) {
                    $data_attr_spot_ids = $data->generate_data_attr_str();
                }
			?>

                <?php if($data_attr_spot_ids) { ?>
					<div class="resource-spot-term-ids" style="display: none;" <?php echo $data_attr_spot_ids; ?>></div>
				<?php } ?>

                <div class="content-wrapper">
                    <?php $guided_assistant_type = get_field('guided_assistant_type', get_post()); ?>

                    <div class="ga-type" data-ga-type="<?php echo $guided_assistant_type; ?>">

                    <?php if ($guided_assistant_type == 'a2j') { ?>
                        <?php
                        wp_enqueue_script('curated_experience', get_template_directory_uri() . '/assets/js/curated_experience.js', array('jquery'), 1.0, TRUE);

                        $ga_dir_name = get_post_meta(get_the_ID(), 'ga-dir-name', TRUE);

                        $guide_archive_path = wp_upload_dir()['baseurl'] . '/unzipped_gas/' . $ga_dir_name;

                        $text_justification = get_field('a2j_ga_text_justification');
                        ?>

                        <div id="post-data" class="hidden" data-curated-experience-id="<?php echo $guide_name; ?>" data-unzipped-path="<?php echo $guide_archive_path; ?>"></div>
                        <div class="personal-plan-header hidden">
                            <?php
                                echo render_action_toolbar();
                            ?>
                            <div class="plan-header-content">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96.33 88.36"> <defs> <style> .cls-1, .cls-2, .cls-3, .cls-4 { fill: none; stroke-width: 2px; } .cls-1, .cls-2, .cls-4 { stroke: #333; } .cls-1, .cls-2 { stroke-miterlimit: 10; } .cls-2, .cls-3, .cls-4 { stroke-linecap: round; } .cls-3 { stroke: #0d3fb8; } .cls-3, .cls-4 { stroke-linejoin: round; } </style> </defs> <title>Asset 17</title> <g data-name="Layer 2"> <g id="Secondary_Illustration" data-name="Secondary Illustration"> <polyline class="cls-1" points="7.87 8.23 7.87 1 74.35 1 74.35 80.49 67.12 80.49" /> <polygon class="cls-1" points="67.12 87.36 1 87.36 1 8.48 47.01 8.48 47.01 28.2 66.73 28.2 67.12 87.36" /> <line class="cls-2" x1="22.56" y1="43.3" x2="55.99" y2="43.3" /> <line class="cls-2" x1="22.56" y1="57.18" x2="55.99" y2="57.18" /> <line class="cls-2" x1="22.56" y1="71.07" x2="55.99" y2="71.07" /> <polyline class="cls-3" points="8.84 55.64 12.27 59.07 17.41 53.07" /> <polyline class="cls-3" points="8.84 42.78 12.27 46.21 17.41 40.21" /> <polyline class="cls-3" points="8.84 70.21 12.27 73.64 17.41 67.64" /> <line class="cls-4" x1="47.89" y1="8.48" x2="66.73" y2="27.32" /> <rect class="cls-1" x="89.06" y="19.45" width="6.27" height="43.91" /> <polyline class="cls-2" points="95.33 64.15 92.23 70.43 89.12 64.15" /> </g> </g> </svg>
                                <h3>Your Personalized Plan</h3>
                                <p>The information and resources below are from Legal Navigator’s partner organizations in <?=get_field('site_name', 'option')?>.</p>
                                <img src="<?php echo $court_logo_url; ?>">
                            </div>
                        </div>
                        <div class="personal-plan hidden">
                            <div class="plan-title"></div>
                            <div class="plan-steps"></div>
                        </div>
                        <div class="plan-actions hidden">
                            <div class="action action-print">
                                <a href="javascript:;">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 76.88 80"> <defs> <style> .cls-1 { fill: none; stroke: #333; stroke-miterlimit: 10; } .cls-1, .cls-2 { stroke-linecap: round; stroke-width: 2px; } .cls-2 { fill: #fff; stroke: #0d3fb8; stroke-linejoin: round; } </style> </defs> <title>Asset 18</title> <g id="Layer_2" data-name="Layer 2"> <g id="Secondary_Illustration" data-name="Secondary Illustration"> <polyline class="cls-1" points="9.82 57.16 1 57.16 1 13.48 75.88 13.48 75.88 57.16 67.58 57.16" /> <polyline class="cls-1" points="60.28 38.32 63.4 79 13.48 79 16.6 38.32" /> <polyline class="cls-1" points="19.72 9.48 20.8 1 56.08 1 57.16 9.48" /> <line class="cls-2" x1="26.2" y1="46.76" x2="50.12" y2="46.76" /> <line class="cls-2" x1="25.16" y1="57.16" x2="51.16" y2="57.16" /> <line class="cls-2" x1="24.12" y1="67.56" x2="52.2" y2="67.56" /> <line class="cls-1" x1="12.11" y1="34" x2="65.11" y2="34" /> </g> </g> </svg>
                                    <h6>Print your plan</h6>
                                </a>
                                <p>You can also just print this page too so you can take it with you.</p>

                                </div>
                            <div class="action action-restart">
                                <a href="javascript:;">
                                    <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 89.8 86.06"><path d="M87.44,11.63h0l-15.66.3a1.47,1.47,0,0,0-.29.05,2.19,2.19,0,0,0-2.11,1.93L67.51,29.1a2.24,2.24,0,0,0,2,2.5l.27,0a2.26,2.26,0,0,0,2.24-2l1.24-10.38A38.45,38.45,0,1,1,43,4.51,2.26,2.26,0,0,0,43,0,43,43,0,1,0,76.71,16.34l10.77-.21a2.25,2.25,0,0,0,0-4.5Z" fill="#334d9b"/><polygon points="32.42 42.61 32.42 27.13 44.84 34.87 57.27 42.61 44.84 50.35 32.42 58.09 32.42 42.61" fill="#333"/></svg>
                                    <h6>Restart the interview</h6>
                                </a>
                            </div>

                            <!-- The Modal -->
                            <div id="LSCModal" class="lsc-modal hidden">
                                <!-- Modal content -->
                                <div class="lsc-modal-content">
                                <a href="javascript:;" class="lsc-close">&times;</a>
                                <p>You will lose your Plan if you Restart<br/>the interview now. To save a copy,<br />Download or Print your Plan if you<br />haven't done so.</p>
                                <button id="lsc-refresh-btn">Ok</button>
                                </div>
                            </div>

                            <div class="action action-download">
                                <a href="javascript:;">
                                    <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 26 23.8"> <g data-name="Layer 2"> <g data-name="Small Icons"> <polyline points="25 12.4 25 22.8 1 22.8 1 12.4" fill="none" stroke="#0d3fb8" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" /> <line x1="13" y1="1" x2="13" y2="16" fill="none" stroke="#0d3fb8" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" /> <polyline points="7.8 11.9 13 17.2 18.2 11.9" fill="none" stroke="#0d3fb8" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" /> </g> </g> </svg>
                                    <h6>Download your plan</h6>
                                </a>
                                <p></p>
                            </div>
                        </div>
                        <div class="progress-bar">
                            <div class="bar" style="width: 0%"></div>
                        </div>
                        <div class="cur-exp-steps">
                            <span class="col-md-7 col-sm-8 col-xs-12 ps step">Part 1: Understanding your needs</span>
                            <span class="col-md-2 col-sm-4 col-xs-12 ps step">Part 2: View action plan</span>
                        </div>
                        <div class="curated-experience col-md-8 col-md-offset-2 col-sm-10 col-sm-offset-1 question <?=$text_justification?>">
                            <div class="question">
                                <div class="question-text"></div>
                                <div class="question-fields"></div>
                                <div class="question-buttons"></div>
                                <a class="back-button hidden" href="javascript:;">Back</a>
                                <div class="question-help"></div>
                            </div>
                        </div>
                    <?php } elseif ($guided_assistant_type == 'docassemble') {
                        $da_filename = get_field('docassemble_interview');
                        echo render_docassemble_ga($da_filename);
                    } elseif ($guided_assistant_type == 'legal_server') {
                        wp_enqueue_style('ls-styles', 'https://guided-navigation-static.legalserver.org/guided_nav.css', 1.0);
                        wp_enqueue_script('ls-js', 'https://guided-navigation-static.legalserver.org/guided_nav.js', 1.0, TRUE);

                        $process_id = get_field('legal_server_creds', 'options')['process_id'];
                        $token = get_field('legal_server_creds', 'options')['token'];

                        echo "<div class=\"personal-plan-header\">";
                        echo render_action_toolbar();
                        echo "</div>";

                        echo '<guided-nav language="en" process="'.$process_id.'" theme="light color-purple font-sans" token="'.$token.'" url="https://lashoi-demo.legalserver.org/api/v1/"></guided-nav>';
                    } ?>
                    </div>
                </div>
                <div class="clear"></div>
        <?php }
        } else {
            // If no content, include the "No posts found" template.
            echo "Sorry, guided assitant not found.";
        }

        if ($show_court_lookup) {
            get_template_part("/template-parts/blocks/court_case_lookup");
        }
        ?>
    </div>
</main>

<?php get_footer(); ?>
