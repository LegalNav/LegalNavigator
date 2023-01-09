<?php
    $emergency_phone = get_field('emergency_phone_number', 'option');

    if($emergency_phone) {
?>
        <section class="emergency-phone-block">
            <p class="emergency-phone-message">Are you safe? Call
                <a href="tel:<?=$emergency_phone?>" class="emergency-phone-number">
                    <?=$emergency_phone?>
                </a> to get help.
            </p>
        </section>
<?php } ?>

