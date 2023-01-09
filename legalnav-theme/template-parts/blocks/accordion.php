<?php
$accordion_list = get_field('accordion_list');
if(!empty($accordion_list)){
?>
<section class="accordion-callout">
	<div class="container">
	    <div class="accordion-list">
	        <?php
	            foreach( $accordion_list as $accordion_listVal)
				{
					$question = $accordion_listVal['question'];
					$answer = $accordion_listVal['answer'];
					if(!empty($question)){?>
						<div class="accordion">
							<a href="javascript:;" class="accordion-image">
								<h4><?php echo $question; ?></h4>
							</a>
							<?php if(!empty($answer)){?>
								<div class="accordion-content">
									<?php
										$contentData = apply_filters('the_content', $answer);
										echo $contentData;
									?>
								</div><?php
							} ?>
						</div>
						<?php
					}
				}
	        ?>
	    </div>
	</div>
</section>
<?php } ?>
