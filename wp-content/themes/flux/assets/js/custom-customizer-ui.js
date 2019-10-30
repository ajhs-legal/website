/**
 * Theme Customizer enhancements for a better user experience.
 *
 * Contains handlers to make Theme Customizer preview reload changes asynchronously.
 */

 ( function( $ ) {
 	'use strict';

 	// set the mouse cursor to progress on launch
 	$("body").css("cursor", "progress");

 	// empty custom_logo callback
 	wp.customize( 'custom_logo', function( setting ) {});

	// events for moving from section to section
	$(document).on('click keydown', 'a[rel^="tc-"]' ,function(e) {
		e.preventDefault();
		var type = $(this).attr('rel');
		type = type.replace('tc-','');
		var id = $(this).attr('href').replace('#', '');
		var parentID = $(this).parent().parent().parent().parent().attr('id');
		if(api[type].has(id)) {
			if(type=='control'&&parentID) {
				parentID = parentID.replace('accordion-section-', '');
				$(api[type].instance(id).selector).after().append('<li class="returnBeforeLink"><a href="#'+parentID+'" rel="tc-section">Return to the previous section.</a></li>');
			}
			// move to target
			api[type].instance(id).focus();
			// fix margin top issue
			if(type == 'section') {
				$('#accordion-section-'+api[type].instance(id).id).find('.accordion-section-content').css("margin-top","0");
			} else if (type == 'control') {
				$(api[type].instance(id).selector).parent().css("margin-top","0");
			}
		}
	});
	// refresh to page
	$(document).on('click keydown', 'a.changePreview' ,function(e) {
		var _previewPath = $(this).attr("href");
		refreshPreviewPage(_previewPath);
		return false;
	});
	// remove returnBeforeLink
	$(document).on( 'click keydown', '.customize-section-back, .returnBeforeLink' , function( e ) {
		$('.returnBeforeLink').remove();
	});

	// allow tab in textarea
	$(document).on('keydown', 'textarea', function(_event) {
		switch(_event.keyCode) {
			case 9: // enter key
				var _start = this.selectionStart;
				var _end = this.selectionEnd;
				var $_this = $(this);
				var _value = $_this.val();
				$_this.val(_value.substring(0, _start) + "\t" + _value.substring(_end));
				this.selectionStart = this.selectionEnd = _start + 1;
				_event.preventDefault(); // prevent default only when enter is pressed in the textarea
				break;
		}
	});
	/**
	 * Sub routines
	 */
	// previewer
	function refreshPreviewPage(_previewPath) {
		var _home = wp.customize.settings.url.home;
		if(!_previewPath) {
			wp.customize.previewer.refresh();
		} else {
			wp.customize.previewer.previewUrl(_home + _previewPath);
		}
	}

	/**
	 * Utilities
	 */
	function capitalizeFirstLetter(string) {
		string = string.replace(/_/g,' ');
		return string.charAt(0).toUpperCase() + string.slice(1);
	}

	// wait till the customizer is initialied.
	var api = wp.customize;
	api.bind('ready', function() {
		// theme style name
		$('#accordion-section-themes h3').append(' (' +$('#customize-control-tm_theme_style input:hidden').val() + ')');
		// set the mouse cursor back to normal
		$("body").css("cursor", "default");

		/**
		 * Font pair chooser event needs to be set only after initialization
		 * The following method of capturing select2 changes is compliant with
		 * the SelectWoo 1.0.1, which is loaded by WooCommerce or by Kirki.
		 */
		var fontPresetChooser = 'select[data-id="tm_content_font_presets"]';
		$(document).on('change.select2', fontPresetChooser, function(_event) {
			var _currentValue = $(fontPresetChooser).val();
			if(_currentValue === 'none') return false;

			var _preset = tm_font_presets[_currentValue];
			var _field;
			// change mouse cursor
			$("body").css("cursor", "progress");
			// setTimeout to avoid loop freeze
			setTimeout( function() {
				for (var _key in _preset) {
					if(_preset[_key].type == 'text') {
						if(_preset[_key].hasOwnProperty('css_selector')) {
							_field = 'input[data-customize-setting-link="'+_key+'"]';
							$(_field).val(_preset[_key]['css_selector']);
							$(_field).trigger('change');
						}
					} else {
						_field = '#customize-control-'+_key;
						// variant
						if(_preset[_key].hasOwnProperty('variant')) {
							changeValue_selectTwo('#kirki-typography-variant-'+_key, _preset[_key]['variant']);
						}
						// font size
						if(_preset[_key].hasOwnProperty('font-size')) {
							$(_field + ' .font-size input').val(_preset[_key]['font-size']);
						}
						// line height
						if(_preset[_key].hasOwnProperty('line-height')) {
							$(_field + ' .line-height input').val(_preset[_key]['line-height']);
						}
						// letter spacing
						if(_preset[_key].hasOwnProperty('letter-spacing')) {
							$(_field + ' .letter-spacing input').val(_preset[_key]['letter-spacing']);
						}
						// color
						if(_preset[_key].hasOwnProperty('color')) {
							$(_field+ ' .kirki-color-control').wpColorPicker('color',_preset[_key]['color']);
						}
						// font family
						if(_preset[_key].hasOwnProperty('font-family')) {
							changeValue_selectTwo('#kirki-typography-font-family-'+_key, _preset[_key]['font-family']);
						}
					}
				}
				setTimeout( function() {$("body").css("cursor", "default");}, 1000);
			}, 500);
			// wp.customize.previewer.refresh();
		} );

		// controls
		function changeValue_selectTwo (_target, _value) {
			var $_select = $(_target);
			$_select.val(_value).trigger('change');
		}
		function changeValue_wpColorPicker (_target, _value) {
			var $_colorPicker = $(_target).wpColorPicker('color',_value);
		}
	});

} )( jQuery );
