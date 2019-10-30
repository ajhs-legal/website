jQuery(document).ready(function($){
	'use strict';

	function setUpOptionsTabs () {

		var $container = $('.cmb2-wrap.form-table');
		$container.prepend('<ul id="tab-nav"></ul>');

			// create the tabs from title fields
			$('.cmb2-metabox-title').each(function(i, item){
				var ret = '<li><a class="nav-tab" href="#tab-'+(i+1)+'">'+ $(this).text() +'</a></li>';
				$('#tab-nav').append(ret);
			});

			$container.tabs();
		}

		setUpOptionsTabs();
	}
);
