<?php
// ! query_spot_api
// - Accepts a string containing a search term ($search_term)
// - Returns an array containing spot's search terms.
// - Errors: curl errors
function query_spot_api($search_term) {
    $bearer_token = get_field('spot_creds', 'options')['bearer_token'];

    $curl = curl_init();
    curl_setopt_array($curl, array(
        CURLOPT_URL => 'https://spot.suffolklitlab.org/v0/entities-nested/',
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => '',
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 0,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => 'POST',
        CURLOPT_POSTFIELDS =>'{
        "text": "' . $search_term . '",
        "save-text": 1,
        "cutoff-lower": 0.25,
        "cutoff-pred": 0.5,
        "cutoff-upper": 0.5
        }',
        CURLOPT_HTTPHEADER => array(
            'Accept: application/json',
            'Content-Type: application/json',
            'Authorization: Bearer ' . $bearer_token
        ),
    ));
    $response = curl_exec($curl);
    curl_close($curl);

    return $response;    
}