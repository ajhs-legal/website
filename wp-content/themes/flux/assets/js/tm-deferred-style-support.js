/**
 * deferred style support
 *
 * The following copies css contents in script.deferred_style_css
 * over to the head. This workaround is here so that the html ouput can
 * pass w3c validation.
 *
 * @since      1.0
 * @access     public
 *
 * @see        ThemeMountain/TM_StyleAndScripts::tm_enqueue_styles_in_footer()
 */
jQuery(function($){
	'use strict';

	if(tm_deferred_css) {
		var _css = tm_deferred_css.join('\n');
		_css = '<style id="tm_deferred_css" type="text/css">'+_css+'</style>';
		$(_css).appendTo("head");
	};
});