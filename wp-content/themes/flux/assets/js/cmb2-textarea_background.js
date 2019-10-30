(function ($) {
	"use strict";
	/**
	 * Takes care of tinymce rich text editor background color changes
	 * Page Option needs to have both textarea_html and colorpicker with
	 * param name of "textarea_html_bkg_color" for the following code to work.
	 */
	 $(document).on('DOMNodeInserted', 'iframe#tm_grid_box_text_ifr', function(e) {
	 	// wait for vc modal to be loaded
		$('iframe#tm_grid_box_text_ifr').on('load' , function(){
			// change / clear event
			$('#tm_grid_box_background_color.cmb2-colorpicker.color-picker').wpColorPicker({
				change: function (event, ui) {
					var element = event.target;
					var color = ui.color.toString();
					changeTextAreaColor();
				},
				clear: function (event) {
					var element = jQuery(event.target).siblings('.wp-color-picker')[0];
					var color = '';
					if (element) {
						changeTextAreaColor();
					}
				}
			});

		 	var $_textarea_html_bkg_color = $('input#tm_grid_box_background_color');

			// init
			if(typeof $_textarea_html_bkg_color[0] !== 'undefined') {
				changeTextAreaColor();
			}

			function changeTextAreaColor (){
				if(!$_textarea_html_bkg_color) return false;
				var _color = $_textarea_html_bkg_color.val();
				$('iframe#tm_grid_box_text_ifr').contents().find('body').css('background',_color);
			}
		 });
	 });
})(window.jQuery);