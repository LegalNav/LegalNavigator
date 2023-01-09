<?php
$site_name = get_field('site_name', 'option');
$content = get_field('homepage_content', 'option');
$home_image_url = get_field('homepage_image', 'option');
?>

<section class="homepage-banner-block">
    <div class="container">
        <div class="homepage-banner-left-content">
            <div class="homepage-banner-heading"><h1> Get help with your legal questions in <?=$site_name?></h1></div>
            <div class="homepage-banner-spot-container">
                <h5>Tell us about your problem:</h5>
                <p>Type your story here. Don't include personal information like your name and address.	<span>Example: I want to get a divorce and I don't know how to start everything.</span></p>
                <form action="/guided-assistant/" id="homepage-form">
                    <textarea type="text" form="homepage-form" aria-label="Type your story here" autocomplete="off" class="homepage-spot-search" name="gaSearchString" placeholder="Type your story here" required></textarea>
                    <input aria-label="search button" class="btn btn-primary" type="submit" value="Continue">
                </form>
                <p class="fine-print">We use the SPOT legal problem spotter to help find the best legal resources for you. <a href="/">Learn more.</a></p>
            </div>
            <div class="homepage-content">
                <?=$content?>
            </div>
        </div>
        <div class="homepage-banner-image" style="background-image: url('<?=$home_image_url?>')">
            <div class="homepage-banner-arrow" style="background-image: url('https://www.legalnav.org/wp-content/uploads/2021/01/arrow_down.svg')"></div>
        </div>
        <div class="clear"></div>
    </div>
</section>
