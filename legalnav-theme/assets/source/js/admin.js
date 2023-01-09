jQuery(document).ready(function(){
	var cPage = jQuery("#c_page").val();
	if( cPage = "pg_state" ){
		var cStates = jQuery("#c_states").val().split(",");
		
		if( cStates.length > 0 ){
			var list = jQuery("#the-list tr");
			var tagArray = [];
			jQuery.each( cStates , function( index, value ) {
				tagArray.push(value);
			});

			jQuery("#the-list > tr").each( function( index_l, value_l ) {
				var cID = jQuery(this).attr("id");
				if( jQuery.inArray( cID, tagArray ) ){
					jQuery(this).show();
				} else {
					jQuery(this).hide();
				}
			});						
		}
	}
});