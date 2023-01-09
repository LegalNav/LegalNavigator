<?php
function render_action_toolbar() {
    return <<<HTML
        <div class="plan-actions-toolbar hidden">
            <a href="javascript:;" class="toolbar-action action-print">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 76.88 80"> <defs><style>.cls-1 {fill: none;stroke: #333;stroke-miterlimit: 10;}.cls-1,.cls-2 {stroke-linecap: round;stroke-width: 2px;}.cls-2 {fill: #fff;stroke: #0d3fb8;stroke-linejoin: round;}</style></defs> <title>Asset 18</title> <g data-name="Layer 2"> <g id="Secondary_Illustration" data-name="Secondary Illustration"> <polyline class="cls-1" points="9.82 57.16 1 57.16 1 13.48 75.88 13.48 75.88 57.16 67.58 57.16" /> <polyline class="cls-1" points="60.28 38.32 63.4 79 13.48 79 16.6 38.32" /> <polyline class="cls-1" points="19.72 9.48 20.8 1 56.08 1 57.16 9.48" /> <line class="cls-2" x1="26.2" y1="46.76" x2="50.12" y2="46.76" /> <line class="cls-2" x1="25.16" y1="57.16" x2="51.16" y2="57.16" /> <line class="cls-2" x1="24.12" y1="67.56" x2="52.2" y2="67.56" /> <line class="cls-1" x1="12.11" y1="34" x2="65.11" y2="34" /> </g> </g> </svg>
                <span>Print</span>
            </a>
            <a href="javascript:;" class="toolbar-action action-download">
            <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 26 23.8"> <g data-name="Layer 2"> <g data-name="Small Icons"> <polyline points="25 12.4 25 22.8 1 22.8 1 12.4" fill="none" stroke="#0d3fb8" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" /> <line x1="13" y1="1" x2="13" y2="16" fill="none" stroke="#0d3fb8" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" /> <polyline points="7.8 11.9 13 17.2 18.2 11.9" fill="none" stroke="#0d3fb8" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" /> </g> </g> </svg>
                <span>Download</span>
            </a>
            <h5 class="copied-message"></h5>
        </div>
    HTML;
}

function render_docassemble_ga($da_filename) {
    $da_domain = get_field('docassemble_creds', 'option')['server_url'];

    $interview_file = urlencode($da_filename);
    $q_params = "js_target=dablock&i=$interview_file";
    $script_url = "$da_domain/interview?$q_params";

    return <<<HTML
        <div style="width: 100%; padding: 40px">
            <div id="dablock" class="dabody dajs-embedded dahide-navbar" style="width: 100%; height: 80vh; border-style: solid; border-width: 1px; border-color: #777"></div>
        </div>

        <script src="$da_domain/static/app/bundlenojquery.js"></script>
        <script src="$script_url"></script>
    HTML;
}
