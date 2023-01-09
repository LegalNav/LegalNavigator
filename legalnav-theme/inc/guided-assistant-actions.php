<?php
/*
 * GA Interaction Actions
*/

// Prepares GA files for later use in interviews
function add_ga_dir($new_status, $old_status, $post)
{
    if (($new_status == 'publish') && ($old_status != 'publish') && ($post->post_type == 'guided_assistant')) {
        $post_id = $post->ID;

        do_action('acf/save_post', $post_id);

        $file = get_field('zip_file', $post_id);
        $ga_type = get_field('guided_assistant_type', $post_id);

        // If GA Type is A2J handle it accordingly
        if ($ga_type == "a2j") {
            // Unzip file on WP side
            if (WP_Filesystem()) {
                $zip_file_name = str_replace('.zip', '', get_field('zip_file', $post_id)['filename']);

                function get_slug($term)
                {
                    return $term->slug;
                }

                $state_slugs_string = implode("", array_map('get_slug', get_the_terms($post_id, 'states')));

                // Hash used for ID only (does not need to be cryptographically secure)
                $name_state_hash = hash('md5', $zip_file_name . $state_slugs_string);

                // Name new dir according to hash of zip name and state with zip name appended
                $new_dir_name = str_replace('.zip', '', $name_state_hash) . "-" . $zip_file_name;

                // Add new_dir_name to post meta
                add_post_meta($post_id, 'ga-dir-name', $new_dir_name);

                $unzipped_ga_path = wp_upload_dir()['basedir'] . '/unzipped_gas/' . $new_dir_name;
                unzip_file(
                    get_attached_file(get_field('zip_file', $post_id)['ID']),
                    $unzipped_ga_path
                );
                $template_ids = json_decode(file_get_contents($unzipped_ga_path . "/templates.json"))->templateIds;
                $template_count = count($template_ids);

                // Get list of active templates
                $active_templates = [];

                foreach ($template_ids as $template_id) {
                    // Get template content
                    $template_content = json_decode(file_get_contents($unzipped_ga_path . "/template" . $template_id . ".json"));

                    // If active, add template to active templates
                    if ($template_content->active) {
                        array_push($active_templates, $template_content);
                    }
                }

                // Make the base template the first active template
                $base_template = $active_templates[0];

                // Create array of all active templates children to append to the base tempaltes children
                $children_array = array();

                // Start loop at 1 to skip template used as base
                for ($i = 1; $i < count($active_templates); $i++) {
                    $child_template = $active_templates[$i];
                    $child_template_children = $child_template->rootNode->children;

                    // Append template children to base template children
                    $children_array = array_merge($children_array, $child_template_children);
                }

                // Set base template's children to its own children plus the children templates children
                $base_template->rootNode->children = array_merge($base_template->rootNode->children, $children_array);

                // Write new aggregate template file to ga dir
                file_put_contents($unzipped_ga_path . "/template-aggregate.json", json_encode($base_template));
            }
        }
    } else {
        return;
    }
}
add_action('transition_post_status', 'add_ga_dir', 10, 3);

// Deletes the unzipped files associated with a GA when it is deleted
function delete_ga_dir($post_id, $post)
{
    $ga_type = get_field('guided_assistant_type', $post_id);

    if ($ga_type == "a2j") {
        // Delete ZIP file from uploads if GA is deleted
        // Get zip file name, which is the dir name in unzipped_gas dir
        $ga_dir_name = get_post_meta($post_id, 'ga-dir-name', TRUE);
        $ga_dir_path = wp_upload_dir()['basedir'] . '/unzipped_gas/' . $ga_dir_name;
        // remove files in dir
        array_map('unlink', glob("$ga_dir_path/*"));
        // remove dir
        rmdir($ga_dir_path);
    }
}
add_action('trash_guided_assistant', 'delete_ga_dir', 10, 2);