<?php
    // UTILITIES
    function remove_link_protocol($link) {
        return preg_replace("#^[^:/.]*[:/]+#i", "", $link);
    }

    function create_address_array($address_data) {
        $is_main_address = !is_array($address_data['address']);

        $address = [];

        $address[] = $is_main_address ? $address_data['lat'] : $address_data['address']['lat'];
        $address[] = $is_main_address ? $address_data['lng'] : $address_data['address']['lng'];
        $address[] = get_the_title();
        $address[] = $is_main_address ? get_field('address_details') : $address_data['address_details'];
        $address[] = get_the_permalink();

        return $address;
    }

    function has_coords($a) {
        return $a[0] && $a[1];
    }

    function generate_google_map_data($main_address_data, $additional_addresses) {
        $gmap_data = [];

        if($additional_addresses) {
            // Create and add additional addresses
            $gmap_data = array_map('create_address_array', $additional_addresses);
        }

        // Create and add main address
        array_push($gmap_data, create_address_array($main_address_data));

        // Filter out addresses without lat and lng
        $gmap_data = array_filter($gmap_data, 'has_coords');

        return $gmap_data;
    }

    // RENDERING
    function render_contact_icon($svg_name) {
        $asset_contents = file_get_contents(get_template_directory().'/assets/images/'.$svg_name);
        return "<div class=\"contact-icon no-dl\">".$asset_contents."</div>";
    }

    function render_link($label, $link = "javascript:;") {
        $text = ucfirst($label);

        $output_html = "";

        $output_html .= "<a href=\"$link\" class=\"toolbar-action action-$label\" download>";

        $icon_url = get_template_directory()."/assets/images/$label.svg";

        $output_html .= file_get_contents($icon_url);
        $output_html .= "<span>$text</span>";
        $output_html .= "</a>";

        return $output_html;
    }

    function render_action_links($is_ls_resource, $ls_resource_url) {
        if($is_ls_resource) {
            $output_html = "";

            $output_html .= render_link("share");
            $output_html .= render_link("download", $ls_resource_url);

            return $output_html;
        } else {
            return array_reduce(
                array_map(
                    'render_link',
                    ["share", "print", "download"]
                ),
                function($s, $t) { return $s . $t; },
                ""
            );
        }
    }

    function render_address_contact_section($address) {
        $output_html = "<div class=\"organization-details\">";

        if($address['label']) {
            $output_html .= "<div class=\"organization-label\">";
            $output_html .= "<p>{$address['label']}</p>";
            $output_html .= "</div>";
        }

        if($address['address_details']) {
            $output_html .= "<div class=\"organization-address\">";
            $output_html .= render_contact_icon('location.svg');
            $output_html .= "<p>{$address['address_details']}</p>";
            $output_html .= "</div>";
        }

        if($address['phone_number']) {
            $output_html .= "<div class=\"organization-phone-number\">";
            $output_html .= render_contact_icon('call.svg');
            $output_html .= "<a href=\"tel:{$address['phone_number']}\">{$address['phone_number']}</a>";
            $output_html .= "</div>";
        }

        if($address['website'] && !$address['has_shared_website']) {
            $no_protocol_link = remove_link_protocol($address['website']);

            $output_html .= "<div class=\"organization-website\">";
            $output_html .= render_contact_icon('url.svg');
            $output_html .= "<a href=\"{$address['website']}\" target=\"_blank\">{$no_protocol_link}</a>";
            $output_html .= "</div>";
        }

        $output_html .= "</div>";
        return $output_html;
    }

    function render_address_contact_sections($addresses) {
        return join("", array_map('render_address_contact_section', $addresses));
    }
?>
