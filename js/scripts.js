$(document).ready(function() {

	// Будет нужно на WordPress (а здесь чтобы не было ошибки)
	if(typeof(window.wp)==='undefined') {
		window.wp = {
			theme_url: ''
		};
	}
	window.masks = {
		phone: '+7 (999) 999-99-99',
		date: '99.99.9999',
	};
	
	// Стандартные действия
	$(document.body).on('click', 'a[href^="tel"]', function(e){
		if(!isMobile.any()) {
			e.preventDefault();
		}
	});
	$(document.body).on('keydown', 'input[name="width"], input[name="height"], input[name="quantity"]', function(e){
		var key = e.charCode || e.keyCode || 0;
		return (key==8 || key==9 || key==13 || key==46 || key==110 || key==190 || (key>=35 && key<=40) || (key>=48 && key<=57) || (key>=96 && key<=105));
	});

	// Поиск по сайту
	$(window).on('load', function(e) {
		var $ss_overlay = $(document.body).find('.ss-overlay');
		var $ss = $(document.body).find('.search-section');
		setTimeout(function(){
			$ss_overlay.removeClass('display-none');
			$ss.removeClass('display-none');
		}, 500);
	});
	$(document.body).on('click', '#header .search a, .search-section .search .search-close', function(e) {
		e.preventDefault();
		var is_open = true;
		var $ss_overlay = $(document.body).find('.ss-overlay');
		var $ss = $(document.body).find('.search-section');
		var $ss_result = $(document.body).find('.search-section .search-result');
		if(!$ss.hasClass('open')) {
			is_open = true;
			$ss_overlay.removeClass('is_hidden').addClass('is_visible open');
			$ss.removeClass('is_hidden').addClass('is_visible open');
		} else {
			is_open = false;
			$ss_overlay.removeClass('open');
			$ss.removeClass('open');
			$ss_result.removeClass('open');
		}
		var ss_result_height = $ss_result[0].scrollHeight;
		var ss_result_height_max = parseInt($ss_result.css('max-height').replace('px', '').trim());
		if(ss_result_height>ss_result_height_max) {
			$ss_result.addClass('elongated');
		} else {
			$ss_result.removeClass('elongated');
		}
		$ss.one('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd', function(e) {
			if(is_open) {
				$ss.find('input.search-input').trigger('focus');
				$ss_result.removeClass('is_hidden').addClass('is_visible open');
			} else {
				setTimeout(function(){
					$ss.find('input.search-input').trigger('blur');
					$ss_overlay.removeClass('is_visible').addClass('is_hidden');
					$ss.removeClass('is_visible').addClass('is_hidden');
					$ss_result.removeClass('is_visible').addClass('is_hidden');
				}, 100);
			}
		});
	});
	$(document.body).on('click', '.ss-overlay', function(e) {
		e.preventDefault();
		$('.search-section .search .search-close').trigger('click');
	});
	var get_search_result = function(e) {
		var $ss_result = $(document.body).find('.search-section .search-result');
		var query = $(this).val();
		if(query.trim().length===0) {
			$ss_result.removeClass('searching');
			return false;
		}
		if(e.data.sourceId==='presearch') {
			$ss_result.addClass('searching');
		} else if(e.data.sourceId==='search') {
			// Будет нужно на WordPress
			/*
			var response = {
				quick: '',
				found: '',
			};
			if(response.quick.length===0 && response.found.length===0) {
				$ss_result.find('.search-result-section').addClass('is-empty');
				$ss_result.find('.search-result-section[data-search_section="empty"]').removeClass('is-empty');
			} else {
				$ss_result.find('.search-result-section').addClass('is-empty');
				if(response.quick.length===0) {
					$ss_result.find('.search-result-section[data-search_section="quick"]').removeClass('is-empty');
				}
				if(response.found.length===0) {
					$ss_result.find('.search-result-section[data-search_section="found"]').removeClass('is-empty');
				}
			}
			*/
			$ss_result.removeClass('searching');
		}
	}
	$('.search-section input.search-input').keyup({sourceId:'presearch'}, get_search_result).keyup({sourceId:'search'}, $.debounce(500, get_search_result));

	// Поиск по сайту (мобильное меню)
	$(document.body).on('click', '.mm-menu .search .search-close', function(e) {
		e.preventDefault();
		var $mms = $(document.body).find('.mm-menu .search');
		$mms.find('input.search-input').val('').trigger('keyup');
	});
	var get_search_result_mm = function(e) {
		var $mms = $(document.body).find('.mm-menu .search');
		var $mms_result = $(document.body).find('.mm-menu .search-result');
		var query = $(this).val();
		if(query.trim().length===0) {
			$mms_result.removeClass('is_visible');
			$mms.removeClass('searching');
			$mms_result.removeClass('searching');
			$mms.find('.search-loading').removeClass('is_visible').addClass('is_hidden');
			$mms.find('.search-close').removeClass('is_visible').addClass('is_hidden');
			return false;
		}
		if(e.data.sourceId==='presearch') {
			$mms.addClass('searching');
			$mms_result.addClass('searching');
			$mms.find('.search-close').removeClass('is_visible').addClass('is_hidden');
			$mms.find('.search-loading').removeClass('is_hidden').addClass('is_visible');
		} else if(e.data.sourceId==='search') {
			// Будет нужно на WordPress
			/*
			var response = {
				quick: '',
				found: '',
			};
			$mms_result.addClass('is_visible');
			if(response.quick.length===0 && response.found.length===0) {
				$mms_result.find('.search-result-section').addClass('is-empty');
				$mms_result.find('.search-result-section[data-search_section="empty"]').removeClass('is-empty');
			} else {
				$mms_result.find('.search-result-section').addClass('is-empty');
				if(response.quick.length===0) {
					$mms_result.find('.search-result-section[data-search_section="quick"]').removeClass('is-empty');
				}
				if(response.found.length===0) {
					$mms_result.find('.search-result-section[data-search_section="found"]').removeClass('is-empty');
				}
			}
			*/
			$mms.removeClass('searching');
			$mms_result.removeClass('searching');
			$mms.find('.search-loading').removeClass('is_visible').addClass('is_hidden');
			$mms.find('.search-close').removeClass('is_hidden').addClass('is_visible');
		}
	}
	$('.mm-menu input.search-input').keyup({sourceId:'presearch'}, get_search_result_mm).keyup({sourceId:'search'}, $.debounce(1000, get_search_result_mm));

	// Меню (мобильное)
	$(window).on('load', function(e) {
		var $mm_menu = $(document.body).find('.mm-menu');
		var chain_start = 0;
		var chain_iterator = 100;
		$.each($mm_menu.find('.list > ul > li'), function(index, value) {
			chain_start = index*chain_iterator;
			$(this).css({'-webkit-animation-delay': (chain_start/1000)+'s', 'animation-delay': (chain_start/1000)+'s'});
			$(this).removeClass('animated');
		});
	});
	$(document.body).on('click', '#header .menu .menu-mobile', function(e) {
		e.preventDefault();
		var is_open = true;
		var $header = $(document.body).find('#header');
		var $mm_overlay = $(document.body).find('.mm-overlay');
		var $mm_menu = $(document.body).find('.mm-menu');
		var $mm_icon = $(this).find('.menu-mobile-icon');
		$mm_icon.toggleClass('open');
		if(!$mm_menu.hasClass('open')) {
			is_open = true;
			$header.addClass('bg_blue');
			$mm_overlay.removeClass('is_hidden').addClass('is_visible open');
			$mm_menu.removeClass('is_hidden').addClass('is_visible open');
		} else {
			is_open = false;
			$header.removeClass('bg_blue');
			$mm_overlay.removeClass('open');
			$mm_menu.removeClass('open');
		}
		$mm_menu.one('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd', function(e) {
			if(is_open) {
				$.each($mm_menu.find('.list > ul > li'), function(index, value) {
					$(this).css('visibility', 'visible').addClass('fadeInLeftMMItem animated');
				});
			} else {
				setTimeout(function(){
					$mm_overlay.removeClass('is_visible').addClass('is_hidden');
					$mm_menu.removeClass('is_visible').addClass('is_hidden');
					$mm_menu.find('.list > ul > li').css('visibility', 'hidden').removeClass('fadeInLeftMMItem animated');
				}, 100);
			}
		});
	});

	// Меню в подвале
	$(document.body).on('click', '#footer .menu-column .menu-column-list-name, #footer .menu-column .menu-column-list-more', function(e) {
		e.preventDefault();
		var window_width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
		if(window_width<=767) {
			console.log('test');
			var $column_list = $(this).closest('.menu-column-list');
			if(!$column_list.hasClass('active')) {
				$column_list.addClass('active');
				$column_list.find('.menu-column-list-more').text('-');
			} else {
				$column_list.removeClass('active');
				$column_list.find('.menu-column-list-more').text('+');
			}
		}
	});

	// Плавающий блок под шапкой
	$(window).load(function(){
		var $subheader = $('#subheader');
		if($subheader.length>0) {
			$(window).resize(function(){
				var offset = parseInt($('#header').height())+0;
				$(window).scroll(function(){
					if($(this).scrollTop()>offset){
						if(!$subheader.hasClass('float')){
							$subheader.addClass('float');
						}
					} else {
						if($subheader.hasClass('float')){
							$subheader.removeClass('float');
						}
					}
				}).scroll();
			}).resize();
		}
	});

	// Меню в плавающем блоке (мобильное меню)
	$(window).on('load', function(e) {
		var $subheader_overlay = $(document.body).find('.subheader-overlay');
		setTimeout(function(){
			$subheader_overlay.removeClass('display-none');
		}, 500);
	});
	$(document.body).on('click', '#subheader .menu-mobile-arrow .menu-mobile-arrow-icon', function(e) {
		e.preventDefault();
		var is_open = true;
		var $subheader_overlay = $(document.body).find('.subheader-overlay');
		var $subheader = $(document.body).find('#subheader');
		if(!$subheader.hasClass('menu-active')) {
			is_open = true;
			$subheader_overlay.removeClass('is_hidden').addClass('is_visible open');
			$subheader.addClass('menu-active');
		} else {
			is_open = false;
			$subheader_overlay.removeClass('open');
			$subheader.removeClass('menu-active');
		}
		$subheader_overlay.one('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd', function(e) {
			if(!is_open) {
				setTimeout(function(){
					$subheader_overlay.removeClass('is_visible').addClass('is_hidden');
				}, 100);
			}
		});
	});
	$(document.body).on('click', '.subheader-overlay', function(e) {
		$(document.body).find('#subheader .menu-mobile-arrow .menu-mobile-arrow-icon').trigger('click');
	});

	// Статья (слайдеры)
	function owl_article() {
		var $owls = $('.article-slider-wrapper .owl-carousel');
		if($owls.length>0) {
			$.each($owls, function() {
				var $owl = $(this);
				var options = {
					items: 1,
					nav: false,
					dots: true,
					dotsContainer: $owl.closest('.article-slider-wrapper').find('.slider-dots'),
					loop: true,
					autoHeight: true,
					margin: 0,
					slideBy: 1,
					autoplay: false, 
					autoplayTimeout: 5000, 
					autoplayHoverPause: true, 
					smartSpeed: 500,
					mouseDrag: false,
					navText: ['', ''],
				};
				if(parseInt($owl.find('.article-slider-item').length)==1) {
					options.loop = false;
				}
				$owl.owlCarousel(options);
				$owl.closest('.article-slider-wrapper').on('click', '.slider-nav-item-prev', function(e) {
					e.preventDefault();
					$owl.trigger('prev.owl.carousel');
				});
				$owl.closest('.article-slider-wrapper').on('click', '.slider-nav-item-next', function(e) {
					e.preventDefault();
					$owl.trigger('next.owl.carousel');
				});
			});
		}
	}
	owl_article();

	// Похожие статьи (слайдер)
	function owl_article_related() {
		var $owl = $('#owl-related');
		if($owl.length>0) {
			var options = {
				items: 3,
				nav: false,
				dots: false,
				loop: true,
				margin: 0,
				slideBy: 1,
				startPosition: 1,
				stagePadding: 0,
				center: true,
				autoWidth: true,
				autoplay: false, 
				autoplayTimeout: 5000, 
				autoplayHoverPause: true, 
				smartSpeed: 800,
				mouseDrag: false,
				navText: ['', ''],
				responsive : {
					0: {
						items: 1,
						autoWidth: false,
					},
					768: {
						center: true,
						autoWidth: true,
					}
				}
			};
			if(parseInt($owl.find('.article-related-item').length)==1) {
				options.loop = false;
			}
			$owl.owlCarousel(options);
			$('.article-related-section .article-related-slider-wrapper').on('click', '.slider-nav-item-prev', function(e) {
				e.preventDefault();
				$owl.trigger('prev.owl.carousel');
			});
			$('.article-related-section .article-related-slider-wrapper').on('click', '.slider-nav-item-next', function(e) {
				e.preventDefault();
				$owl.trigger('next.owl.carousel');
			});
		}
	}
	owl_article_related();

	// Подгрузка статей
	$(document.body).on('click', '.watch-more[data-page]', function(e) {
		e.preventDefault();
		var $btn = $(this);
		var data = new FormData();
		if(!$btn.hasClass('loading')) {
			data.append('action', 'more_articles');
			data.append('page', parseInt($btn.attr('data-page')));
			if($btn.hasAttr('data-category')) {
				data.append('category', $btn.attr('data-category'));
			}
			$.ajax({
				url: window.wp.ajax_url,
				type: 'POST',
				data: data,
				async: true,
				cache: false,
				processData: false,
				contentType: false,
				beforeSend: function(xhr) {
					$btn.addClass('loading');
					$btn.find('.watch-more-label').text('Загрузка');
					$btn.find('.watch-more-icon').animateCSS('rotateAround', {
						infinite: true, 
						duration: 500,
					});
				},
				success: function(response) {
					if(response.success) {
						if(!response.is_end) {
							$btn.removeClass('loading');
							$btn.find('.watch-more-label').text('Посмотреть больше');
							$btn.find('.watch-more-icon').removeClass('animate rotateAround');
							$btn.attr('data-page', (parseInt($btn.attr('data-page'))+1));
						} else {
							$btn.remove();
						}
						$(document.body).find('.articles .article-items').append(response.content);
					} else {
						$btn.remove();
					}
				},
			});
		}
	});

	// Социальные ссылки
	$(document.body).on('click', 'a[data-share]', function(e) {
		e.preventDefault();
		var $this = $(this);
		var share = $this.attr('data-share');
		if(share.length>0) {
			var wo = {
				href: $this.attr('href'),
				title: 'Поделиться ссылкой',
				options: 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,width=626,height=434,left='+((screen.width-626)/2)+',top='+((screen.height-434)/2)
			};
			if(share==='facebook') {
				window.open(wo.href, wo.title, wo.options);
			} else if(share==='twitter') {
				window.open(wo.href, wo.title, wo.options);
			} else if(share==='link') {
				var $tempinp = $('<input>');
				$(document.body).append($tempinp);
				$tempinp.val(wo.href).select();
				document.execCommand('copy');
				$tempinp.remove();
			} else if(share==='mail') {
				window.location.href = wo.href;
			} else if(share==='download') {
				var xhr = new XMLHttpRequest();
				xhr.open('GET', wo.href, true);
				xhr.responseType = 'blob';
				xhr.onload = function(){
					var urlCreator = window.URL || window.webkitURL;
					var imageUrl = urlCreator.createObjectURL(this.response);
					var tag = document.createElement('a');
					tag.href = imageUrl;
					tag.download = $this.attr('download');
					document.body.appendChild(tag);
					tag.click();
					document.body.removeChild(tag);
				}
				xhr.send();
			}
		}
	});
	
	// Фансибокс
	$('[data-fancybox]').fancybox({
		loop: true,
		idleTime: 3600,
		hideScrollbar: false,
		animationEffect: 'fade',
		buttons: ['slideShow', 'close'],
		lang: 'ru',
		i18n: {
			ru: {
				CLOSE: 'Закрыть',
				NEXT: 'Следующий',
				PREV: "Предыдущий",
				PLAY_START: 'Начать слайдшоу',
				PLAY_STOP: 'Пауза слайдшоу',
				FULL_SCREEN: 'Полный экран',
				THUMBS: 'Миниатюры',
				DOWNLOAD: 'Скачать',
				ZOOM: 'Увеличить',
			},
		},
		youtube: {
			controls: 0,
			showinfo: 0,
		},
	});

	// Переезд к блоку
	$(document.body).on('smooth_scrolling', function(event, toBlock, offset, duration) {
		if($(document.body).find(toBlock).length>0) {
			var scrollTopWindow = $(window).scrollTop();
			var scrollTop = $(toBlock).offset().top;
			var scrolling = scrollTop+offset;
			if(typeof(duration)=='undefined') {
				duration = Math.abs((scrolling-scrollTopWindow)/1.5);
			} else {
				duration = parseInt(duration);
			}
			$('html,body').stop().animate({scrollTop: scrolling}, {
				queue: false,
				duration: duration,
			});
		}
	});

	// Запрос на перевозку (подгрузка справочников)
	$(window).load(function() {
		var request = $.ajax({
			url: '/rest/zapros/countries/',
			type: 'GET',
			async: true,
			cache: false,
		});
		$.when(request).done(function(response){
			setTimeout(function(){
				if(response.length>0) {
					$.each(['country_loading', 'country_unloading'], function(index, name) {
						var $forms = $(document.body).find('.white-form form');
						$.each($forms, function() {
							var $form = $(this);
							var $input = $form.find('input[name="'+name+'"]');
							if($input.length>0) {
								var $field_wrapper = $input.closest('.field-wrap');
								var $ul = $field_wrapper.find('.autocomplete-items ul');
								if($ul.length>0) {
									$ul.find('li').remove();
									$.each(response, function(idx, val) {
										$ul.append('<li data-value="'+val+'"><span class="option-label">'+val+'</span></li>');
									});
								}
							}
						});
					});
				}
			}, 0);
		});
		var request = $.ajax({
			url: '/rest/zapros/cities/',
			type: 'GET',
			async: true,
			cache: false,
		});
		$.when(request).done(function(response){
			setTimeout(function(){
				if(response.length>0) {
					$.each(['city_loading', 'city_unloading'], function(index, name) {
						var $forms = $(document.body).find('.white-form form');
						$.each($forms, function() {
							var $form = $(this);
							var $input = $form.find('input[name="'+name+'"]');
							if($input.length>0) {
								var $field_wrapper = $input.closest('.field-wrap');
								var $ul = $field_wrapper.find('.autocomplete-items ul');
								if($ul.length>0) {
									$ul.find('li').remove();
									$.each(response, function(idx, val) {
										$ul.append('<li data-value="'+val+'"><span class="option-label">'+val+'</span></li>');
									});
								}
							}
						});
					});
				}
			}, 0);
		});
	});

	// Запрос на перевозку (поля ввода)
	$(document.body).on('focus', '.white-form form .field-wrap:not(.field-wrap-autocomplete) input, .white-form form .field-wrap textarea', function(e) {
		var $field = $(this);
		var $field_wrapper = $field.closest('.field-wrap');
		if($field.attr('name')==='phone' && $field_wrapper.hasClass('field-wrap-error')) {
			$field.inputmask('remove');
			$field.inputmask({
				mask: window.masks.phone,
				clearIncomplete: false,
				showMaskOnFocus: true,
				showMaskOnHover: false,
				positionCaretOnTab: true
			});
		}
		if(['birthday', 'cargo_readiness_date'].includes($field.attr('name')) && $field_wrapper.hasClass('field-wrap-error')) {
			$field.inputmask('remove');
			$field.inputmask({
				mask: window.masks.date,
				alias: 'datetime',
				inputFormat: 'dd.mm.yyyy',
				placeholder: '_',
				clearIncomplete: true,
				showMaskOnFocus: true,
				showMaskOnHover: false,
				positionCaretOnTab: true,
				onincomplete: function(){
					$(this).trigger('blur');
				}
			});
		}
		if($field_wrapper.hasClass('field-wrap-error')) {
			$field_wrapper.removeClass('field-wrap-error');
		}
		$field_wrapper.addClass('field-wrap-focus');
		$field.attr('placeholder', $field.attr('data-placeholder_focus').trim());
	});
	$(document.body).on('blur', '.white-form form .field-wrap:not(.field-wrap-autocomplete) input, .white-form form .field-wrap textarea', function(e) {
		var $field = $(this);
		var $field_wrapper = $field.closest('.field-wrap');
		$field_wrapper.removeClass('field-wrap-focus');
		if($field.val().trim().length===0) {
			$field_wrapper.removeClass('field-wrap-valued');
			$field.attr('placeholder', $field.attr('data-placeholder_blur').trim());
			setTimeout(function(){
				$field.attr('placeholder', $field.attr('data-placeholder_blur').trim());
			}, 10);
			setTimeout(function(){
				$field.attr('placeholder', $field.attr('data-placeholder_blur').trim());
			}, 20);
		} else {
			$field_wrapper.addClass('field-wrap-valued');
		}
	});
	$(document.body).on('keydown', '.white-form form input[name="first_name"], .white-form form input[name="last_name"]', function(e){
		var $field = $(this);
		var $field_wrapper = $field.closest('.field-wrap');
		var key = e.charCode || e.keyCode || 0;
		var arr = [8,9,16,17,20,35,36,37,38,39,40,45,46];
		for(var i=65; i<=90; i++){
			arr.push(i);
		}
		if($.inArray(key, arr)===(-1)){
			event.preventDefault();
			return false;
		}
	});
	$(document.body).on('input', '.white-form form input[name="first_name"], .white-form form input[name="last_name"]', function(e){
		var input = $(this);
		var start = input[0].selectionStart;
		$(this).val(function (_, val) {
			return val.trim().substr(0,1).toUpperCase()+val.trim().substr(1);
		});
		input[0].selectionStart = input[0].selectionEnd = start;
	});
	$(document.body).on('input', '.white-form form textarea[name="comments"]', function(e){
		var input = $(this);
		$(this).val(function (_, val) {
			return val.trim().substr(0,1).toUpperCase()+val.substr(1);
		});
	});
	$(document.body).on('input', '.white-form form input[name="phone"]', function(e){
		var restricted = false;
		var input = $(this);
		var flag = input.closest('.field-wrap').find('.field-flags-active > i');
		var start = input[0].selectionStart;
		if(flag.length>0 && flag.attr('data-code').trim()==='ru') {
			$(this).val(function (_, val) {
				var mask_start_position = 4;
				if(val.trim().length<=mask_start_position) {
					restricted = true;
					return '';
				}
				var first_symbol = parseInt(val.trim().substr(mask_start_position,1));
				if(typeof(first_symbol)==='number') {
					if([1,2].includes(first_symbol)) {
						restricted = true;
						return '';
					}
				}
				return val.trim().substr(mask_start_position);
			});
		}
		if(restricted) {
			input.inputmask('remove');
			input.inputmask({
				mask: window.masks.phone,
				clearIncomplete: false,
				showMaskOnFocus: true,
				showMaskOnHover: false,
				positionCaretOnTab: true,
			});
		} else {
			input[0].selectionStart = input[0].selectionEnd = start;
		}
	});
	$(document.body).on('select', 'input[name="birthday"], input[name="cargo_readiness_date"]', function(e){
		var input = $(this);
		if(input.val().trim().length===0) {
			input[0].selectionStart = input[0].selectionEnd = 0;
		}
	});

	// Запрос на перевозку (выпадающий список флагов телефона)
	$(document.body).on('click', '.white-form form .field-wrap.field-wrap-phone .field-flags .field-flags-active > i', function(e) {
		e.preventDefault();
		$this = $(this);
		$wrapper = $this.closest('.field-flags');
		$options = $wrapper.find('.field-flags-items');
		$wrapper.closest('.field-wrap').removeClass('field-wrap-error');
		if($options.find('li').length>0) {
			if($options.find('li').length>parseInt($options.attr('data-size'))) {
				var li_border_height = 1;
				var li_padding = (parseInt($options.find('li').css('padding-top').replace('px', ''))*2);
				var max_height = ($options.find('li > i').outerHeight()+li_border_height+li_padding)*parseInt($options.attr('data-size'));
				$options.css('max-height', max_height+'px').addClass('scrollbar');
			} else {
				$options.removeAttr('style').removeClass('scrollbar');
			}
			if($wrapper.hasClass('flags-opened')) {
				$wrapper.removeClass('flags-opened');
				$wrapper.attr('data-opened', 0);
			} else {
				$('.white-form form .field-wrap .select-wrapper.flags-opened').removeClass('flags-opened');
				$wrapper.addClass('flags-opened');
				$wrapper.attr('data-opened', 1);
			}
		}
	});
	$(document.body).on('click', '.white-form form .field-wrap .field-flags .field-flags-items ul li', function(e) {
		e.preventDefault();
		$this = $(this);
		$wrapper = $this.closest('.field-flags');
		$options = $wrapper.find('.field-flags-items');
		$options.find('li').removeClass('selected-option');
		$this.addClass('selected-option');
		$('.white-form form .field-wrap .field-flags.flags-opened').removeClass('flags-opened');
		$wrapper.removeClass('flags-opened');
		$wrapper.attr('data-opened', 0);
		$(document.body).trigger('select_flags_change', $wrapper);
	});
	$(document.body).on('select_flags_change', function(event, wrapper) {
		$wrapper = $(wrapper);
		$wrapper_field = $wrapper.closest('.field-wrap');
		var placeholder = $wrapper.find('.selected-option').attr('data-mask').trim();
		var mask = placeholder.replace(/_/g, '9');
		var option = {
			mask: mask,
			code: $wrapper.find('.selected-option').attr('data-code').trim(),
			name: $wrapper.find('.selected-option .option-label').text().trim(),
			icon: $wrapper.find('.selected-option i').css('background-image')
		};
		option.icon = option.icon.replace('url(', '').replace(')', '').replace(/\"/gi, "");
		$wrapper.find('.field-flags-active > i').css('background-image', 'url('+option.icon+')');
		$wrapper.find('.field-flags-active > i').attr('data-code', option.code);
		$wrapper_field.find('.field-inner input[name="phone"]').attr('data-placeholder_focus', placeholder)
		window.masks.phone = option.mask;
		$.each($wrapper_field.find('input[name="phone"]'), function() {
			var input = $(this);
			var val = input.inputmask('unmaskedvalue').trim();
			input.inputmask('remove');
			input.inputmask({
				mask: window.masks.phone,
				clearIncomplete: false,
				showMaskOnFocus: true,
				showMaskOnHover: false,
				positionCaretOnTab: true,
			});
			if(val.length>0) {
				input.inputmask('setvalue', val);
			}
		});
	});
	$(document.body).on('click', '*', function(e){
		$target = $(e.target);
		if($target.closest('.field-flags').length>0) {
			if(parseInt($target.closest('.field-flags').attr('data-opened'))!==1) {
				$('.white-form form .field-wrap .flags-opened').removeClass('flags-opened');
			}
		} else {
			$('.white-form form .field-wrap .flags-opened').removeClass('flags-opened');
		}
	});

	// Запрос на перевозку (выпадающие списки)
	$(document.body).on('click', '.white-form form .field-wrap .select-wrapper:not(.disabled) .selected-item', function(e) {
		e.preventDefault();
		$this = $(this);
		$wrapper = $this.closest('.select-wrapper');
		$options = $wrapper.find('.select-items');
		$wrapper.closest('.field-wrap').removeClass('field-wrap-error');
		if($wrapper.hasClass('select-opened')) {
			$wrapper.removeClass('select-opened');
			$wrapper.attr('data-opened', 0);
		} else {
			$('.white-form form .field-wrap .select-wrapper.select-opened').removeClass('select-opened');
			$wrapper.addClass('select-opened');
			$wrapper.attr('data-opened', 1);
		}
	});
	$(document.body).on('click', '.white-form form .field-wrap .select-wrapper .select-items ul li', function(e) {
		e.preventDefault();
		$this = $(this);
		$wrapper = $this.closest('.select-wrapper');
		$options = $wrapper.find('.select-items');
		$options.find('li').removeClass('selected-option');
		$this.addClass('selected-option');
		$('.white-form form .field-wrap .select-wrapper.select-opened').removeClass('select-opened');
		$wrapper.removeClass('select-opened');
		$wrapper.attr('data-opened', 0);
		$(document.body).trigger('select_change', $wrapper);
	});
	$(document.body).on('select_change', function(event, wrapper) {
		$wrapper = $(wrapper);
		$wrapper_field = $wrapper.closest('.field-wrap-select');
		var option = {
			label: $wrapper.find('.selected-option').attr('data-value').trim(),
		};
		if(option.label.length>0) {
			$wrapper_field.addClass('field-wrap-valued');
			$wrapper.find('.selected-item > span').text(option.label);
			$wrapper.find('.selected-item').removeClass('selected-item-placeholder');
		} else {
			$wrapper_field.removeClass('field-wrap-valued');
			var label = $wrapper_field.find('label[for]').text().trim();
			$wrapper.find('.selected-item > span').text(label);
			$wrapper.find('.selected-item').addClass('selected-item-placeholder');
		}
		$wrapper.find('select option[value="'+option.label+'"]').attr('selected', 'selected').prop('selected', true);
	});
	$(document.body).on('click', '*', function(e){
		$target = $(e.target);
		if($target.closest('.select-wrapper').length>0) {
			if(parseInt($target.closest('.select-wrapper').attr('data-opened'))!==1) {
				$('.white-form form .field-wrap .select-wrapper.select-opened').removeClass('select-opened');
			}
		} else {
			$('.white-form form .field-wrap .select-wrapper.select-opened').removeClass('select-opened');
		}
	});

	// Запрос на перевозку (автозаполнение)
	$(document.body).on('focus', '.white-form form .field-wrap.field-wrap-autocomplete input', function(e) {
		var $field = $(this);
		var $field_wrapper = $field.closest('.field-wrap');
		if($field_wrapper.hasClass('field-wrap-error')) {
			$field_wrapper.removeClass('field-wrap-error');
		}
		$field_wrapper.addClass('field-wrap-valued');
		$field.attr('placeholder', $field.attr('data-placeholder_focus').trim());
		$field.trigger('keyup');
	});
	$(document.body).on('blur', '.white-form form .field-wrap.field-wrap-autocomplete input', function(e) {
		var $field = $(this);
		var $field_wrapper = $field.closest('.field-wrap');
		if($field.val().trim().length===0) {
			$field_wrapper.removeClass('field-wrap-valued');
			$field.attr('placeholder', $field.attr('data-placeholder_blur').trim());
		} else {
			$field_wrapper.addClass('field-wrap-valued');
		}
	});
	$(document.body).on('keyup', '.white-form form .field-wrap.field-wrap-autocomplete input', function(e) {
		$input = $(this);
		$wrapper = $input.closest('.field-wrap-autocomplete');
		$options = $wrapper.find('.autocomplete-items ul');
		var value = $input.val().trim();
		if(value.length>=3) {
			$options.find('li').removeClass('option-hidden option-last');
			if($wrapper.hasClass('field-wrap-email')) {
				var e_address = value.split('@');
				$options.find('li > span.option-label > span').text(e_address[0].trim());
				$options.find('li').filter(function() {
					if(parseInt($(this).text().trim().toUpperCase().indexOf(value.toUpperCase()))!==(-1)) {
						return false;
					} else {
						return true;
					}
				}).addClass('option-hidden');
			} else {
				$options.find('li').filter(function() {
					if(parseInt($(this).attr('data-value').trim().toUpperCase().indexOf(value.toUpperCase()))!==(-1)) {
						return false;
					} else {
						return true;
					}
				}).addClass('option-hidden');
			}
			if($options.find('li:not(.option-hidden)').length>0) {
				$options.find('li:not(.option-hidden)').last().addClass('option-last');
				$('.white-form form .field-wrap.field-wrap-autocomplete.autocomplete-opened').removeClass('autocomplete-opened');
				$wrapper.addClass('autocomplete-opened');
				$wrapper.attr('data-opened', 1);
			} else {
				$wrapper.removeClass('autocomplete-opened');
				$wrapper.attr('data-opened', 0);
			}
		} else {
			$wrapper.removeClass('autocomplete-opened');
			$wrapper.attr('data-opened', 0);
			$options.find('li').removeClass('option-hidden option-last');
		}
	});
	$(document.body).on('click', '.white-form form .field-wrap.field-wrap-autocomplete .autocomplete-items ul li', function(e) {
		e.preventDefault();
		$this = $(this);
		$wrapper = $this.closest('.field-wrap-autocomplete');
		$options = $wrapper.find('.autocomplete-items');
		$options.find('li').removeClass('selected-option');
		$this.addClass('selected-option');
		$wrapper.removeClass('autocomplete-opened');
		$wrapper.attr('data-opened', 0);
		$(document.body).trigger('autocomplete_change', $wrapper);
	});
	$(document.body).on('autocomplete_change', function(event, wrapper) {
		$wrapper = $(wrapper);
		var option = {
			label: $wrapper.find('.selected-option .option-label').text().trim(),
		};
		$wrapper.find('input').val(option.label);
	});
	$(document.body).on('click', '*', function(e){
		$target = $(e.target);
		if($target.closest('.field-wrap-autocomplete').length>0) {
			if(parseInt($target.closest('.field-wrap-autocomplete').attr('data-opened'))!==1) {
				$('.white-form form .field-wrap.field-wrap-autocomplete.autocomplete-opened').removeClass('autocomplete-opened');
			}
		} else {
			$('.white-form form .field-wrap.field-wrap-autocomplete.autocomplete-opened').removeClass('autocomplete-opened');
		}
	});
	$.each($('.white-form form .field-wrap input, .white-form form .field-wrap textarea'), function() {
		if($(this).hasAttr('autocomplete')) {
			var isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
			if(isChrome) {
				$(this).attr('autocomplete', 'disabled');
			}
		}
	});

	// Запрос на перевозку (форма)
	$(document.body).on('submit', 'form[toMail], form[toZaprosPerevozki], form[toContacts]', function(e) {
		e.preventDefault();
		e.stopPropagation();
		var $form = $(this);
		var $submit = $form.find('.btn-submit');
		if($submit.hasClass('btn-success')) {
			return false;
		}
		var errors = [];
		var errorClass = 'field-wrap-error';
		var fixmobilemask = false;
		$form.find('.'+errorClass).removeClass(errorClass);
		$.each(['first_name', 'last_name', 'company', 'cargo_name', 'country_loading', 'city_loading', 'country_unloading', 'city_unloading'], function(index, name) {
			var $input = $form.find('input[name="'+name+'"]');
			if($input.length>0) {
				var $field_wrapper = $input.closest('.field-wrap');
				if($input.hasAttr('required')) {
					var minlength = 1;
					var maxlength = 256;
					if($input.hasAttr('minlength')) {
						minlength = parseInt($input.attr('minlength').trim());
					}
					if($input.hasAttr('maxlength')) {
						maxlength = parseInt($input.attr('maxlength').trim());
					}
					var value = $input.val().trim();
					if(value.length<minlength || value.length>maxlength) {
						$field_wrapper.addClass(errorClass);
						$input.attr('placeholder', $input.attr('data-placeholder_focus').trim());
						errors.push(name);
					}
				}
			}
		});
		$.each(['comments'], function(index, name) {
			var $textarea = $form.find('textarea[name="'+name+'"]');
			if($textarea.length>0) {
				var $field_wrapper = $textarea.closest('.field-wrap');
				if($textarea.hasAttr('required')) {
					var minlength = 5;
					var maxlength = 256;
					if($textarea.hasAttr('minlength')) {
						minlength = parseInt($textarea.attr('minlength').trim());
					}
					if($textarea.hasAttr('maxlength')) {
						maxlength = parseInt($textarea.attr('maxlength').trim());
					}
					var value = $textarea.val().trim();
					if(value.length<minlength || value.length>maxlength) {
						$field_wrapper.addClass(errorClass);
						$textarea.attr('placeholder', $textarea.attr('data-placeholder_focus').trim());
						errors.push(name);
					}
				}
			}
		});
		if($form.find('input[name="email"]').length>0) {
			var $email = $form.find('input[name="email"]');
			if($email.hasAttr('required')) {
				if(!$email.val().match(/^[-\w.]+@([A-z0-9][-A-z0-9]+\.)+[A-z]{2,4}$/)) {
					$email.closest('.field-wrap').addClass(errorClass);
					$email.attr('placeholder', $email.attr('data-placeholder_focus').trim());
					errors.push('email');
				}
			}
		}
		if($form.find('input[name="phone"]').length>0) {
			var $phone = $form.find('input[name="phone"]');
			if($phone.hasAttr('required')) {
				if(fixmobilemask===true){
					if(isMobile.any()) {
						if($phone.val().length<=2) {
							$phone.closest('.field-wrap').addClass(errorClass);
							$phone.attr('placeholder', $phone.attr('data-placeholder_focus').trim());
							errors.push('phone');
						}	
					} else {
						if(!$phone.inputmask('isComplete')) {
							$phone.closest('.field-wrap').addClass(errorClass);
							$phone.attr('placeholder', $phone.attr('data-placeholder_focus').trim());
							errors.push('phone');
						}
					}
				} else {
					if(!$phone.inputmask('isComplete')) {
						$phone.closest('.field-wrap').addClass(errorClass);
						$phone.attr('placeholder', $phone.attr('data-placeholder_focus').trim());
						errors.push('phone');
					}
				}
			}
		}
		$.each(['birthday', 'cargo_readiness_date'], function(index, name) {
			var $input = $form.find('input[name="'+name+'"]');
			if($input.length>0) {
				var $field_wrapper = $input.closest('.field-wrap');
				if(fixmobilemask===true){
					if(isMobile.any()) {
						if($input.val().length<=(3+3+4)) {
							$input.closest('.field-wrap').addClass(errorClass);
							$input.attr('placeholder', $input.attr('data-placeholder_focus').trim());
							errors.push(name);
						}	
					} else {
						if(!$input.inputmask('isComplete')) {
							$input.closest('.field-wrap').addClass(errorClass);
							$input.attr('placeholder', $input.attr('data-placeholder_focus').trim());
							errors.push(name);
						}
					}
				} else {
					if(!$input.inputmask('isComplete')) {
						$input.closest('.field-wrap').addClass(errorClass);
						$input.attr('placeholder', $input.attr('data-placeholder_focus').trim());
						errors.push(name);
					}
				}
			}
		});
		$.each(['connect', 'service'], function(index, name) {
			var $select = $form.find('select[name="'+name+'"]');
			if($select.length>0) {
				var $select_wrapper = $select.closest('.select-wrapper');
				var $select_field_wrapper = $select.closest('.field-wrap-select');
				if($select_wrapper.hasAttr('data-required') || $select.hasAttr('required')) {
					var value = $select.find('option:selected').attr('value').trim();
					if(value.length===0) {
						$select_field_wrapper.addClass(errorClass);
						errors.push(name);
					}
				}
			}
		});
		if($form.find('input[type="file"][name="image"]').length>0 && window.FileReader) {
			var $images = $form.find('input[type="file"][name="image"]');
			if($images.hasAttr('required')) {
				var files = $images[0].files;
				if(files.length>0) {
					var file = {};
					file['extension'] = files[0].name.split('.').pop();
					file['size'] = parseFloat(parseFloat(files[0].size/1024/1024).toFixed(2));
					var extensions = ['jpg', 'jpeg', 'png', 'bmp', 'gif'];
					if(!extensions.includes(file['extension'].toLowerCase())) {
						alert('Вы пытаетесь загрузить файл с недопустимым расширениям. Допустимые значения: .jpg, .jpeg, .png, .bmp, .gif');
						errors.push('image');
					}
					if(file['size']>5) {
						alert('Вы пытаетесь загрузить файл больше 5 МБ. Пожалуйста, загрузите фотографию меньшего размера.');
						errors.push('image');
					}
				} else {
					alert('Выбор изображения является обязательным полем.');
					errors.push('image');
				}
			}
		}
		if($form.find('input[type="file"][name="file"]').length>0 && window.FileReader) {
			var $file = $form.find('input[type="file"][name="file"]');
			if($file.hasAttr('required')) {
				var files = $file[0].files;
				if(files.length>0) {
					var file = {};
					file['extension'] = files[0].name.split('.').pop();
					file['size'] = parseFloat(parseFloat(files[0].size/1024/1024).toFixed(2));
					var extensions = ['xls', 'txt', 'doc', 'rtf', 'pdf'];
					if(!extensions.includes(file['extension'].toLowerCase())) {
						alert('Вы пытаетесь загрузить файл с недопустимым расширениям. Допустимые значения: .xls, .txt, .doc, .docx, .rtf, .pdf');
						errors.push('file');
					}
					if(file['size']>5) {
						alert('Вы пытаетесь загрузить файл больше 5 МБ. Пожалуйста, загрузите файл меньшего размера.');
						errors.push('file');
					}
				} else {
					alert('Выбор файла является обязательным полем.');
					errors.push('file');
				}
			}
		}
		if(errors.length>0) {
			var $phone = $form.find('input[name="phone"]');
			if($phone.length>0) {
				$phone.inputmask('remove');
				var phone_inputmask = {
					mask: window.masks.phone,
					clearIncomplete: false,
					showMaskOnFocus: true,
					showMaskOnHover: false,
					positionCaretOnTab: true
				};
				if(errors.includes('phone')) {
					phone_inputmask.showMaskOnHover = true;
				} else {
					phone_inputmask.showMaskOnHover = false;
				}
				$phone.inputmask(phone_inputmask);
			}
			$.each(['birthday', 'cargo_readiness_date'], function(index, name) {
				var $input = $form.find('input[name="'+name+'"]');
				if($input.length>0) {
					var $field_wrapper = $input.closest('.field-wrap');
					$input.inputmask('remove');
					var input_inputmask = {
						mask: window.masks.date,
						alias: 'datetime',
						inputFormat: 'dd.mm.yyyy',
						placeholder: '_',
						clearIncomplete: true,
						showMaskOnFocus: true,
						showMaskOnHover: false,
						positionCaretOnTab: true,
						onincomplete: function(){
							$(this).trigger('blur');
						}	
					};
					if(errors.includes(name)) {
						input_inputmask.showMaskOnHover = true;
					} else {
						input_inputmask.showMaskOnHover = false;
					}
					if(fixmobilemask===true){
						if(!isMobile.any()) {
							$input.inputmask(input_inputmask);
						}
					} else {
						$input.inputmask(input_inputmask);
					}
				}
			});
			setTimeout(function(){
				var offset = ($('#subheader').height()+25)*(-1);
				$(document.body).trigger('smooth_scrolling', [$form.find('.'+errorClass)[0], offset, 1000]);
			}, 50);
			return false;
		}
		if($submit.is('input')) {
			$submit.addClass('btn-success').val('Отправлено');
		}
		if($submit.is('button')) {
			$submit.addClass('btn-success').find('span').text('Отправлено');
		}
		$form.ajaxSubmit({
			url: window.wp.theme_url+'/mail/zapros.php',
			clearForm: false,
			resetForm: false,
			success: function(response) {
				if(!response.success) {
					alert('Простите, но сервер не смог отправить вашу запрос. Попробуете ещё раз, пожалуйста.');
				}
			},
		});
	});
	
	// Запрос на перевозку (подсказки)
	$.each($('.white-form form .field-wrap .field-notice .field-notice-icon'), function() {
		var content = $(this).attr('data-tooltip');
		$(this).tooltipster({
			content: content,
			contentAsHTML: true,
			offsetY: -2,
			animation: 'fade',
			position: 'top',
			delay: 0,
			speed: 250,
			touchDevices: true,
			arrow: true,
			trigger: 'hover',
		});
	});

	// Placeholder
    $('input, textarea').placeholder();

	// Маски поля
	$(window).load(function() {
		$.cachedScript(window.wp.theme_url+'/js/vendors/inputmask.js').done(function(){
			$('input[name="phone"]').inputmask({
				mask: window.masks.phone,
				clearIncomplete: false,
				showMaskOnFocus: true,
				showMaskOnHover: false,
				positionCaretOnTab: true
			});
			$('input[name="birthday"], input[name="cargo_readiness_date"]').inputmask({
				mask: window.masks.date,
				alias: 'datetime',
				inputFormat: 'dd.mm.yyyy',
				placeholder: '_',
				clearIncomplete: true,
				showMaskOnFocus: true,
				showMaskOnHover: false,
				positionCaretOnTab: true,
				onincomplete: function(){
					$(this).trigger('blur');
				}
			});
		});
	});

	// Календарь
	var daterangepicker_options = {
		locale: {
			format: 'DD.MM.YYYY',
			separator: ' - ',
			applyLabel: 'Применить',
			cancelLabel: 'Отмена',
			fromLabel: 'От',
			toLabel: 'До',
			customRangeLabel: 'Произвольно',
			weekLabel: 'W',
			daysOfWeek: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
			monthNames: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
			firstDay: 1
		},
		singleDatePicker: true,
		showDropdowns: false,
		autoUpdateInput: false,
		alwaysShowCalendars: true,
		parentEl: 'body',
		opens: 'center',
		buttonClasses: 'btn btn-sm',
		applyButtonClasses: 'btn-primary',
		cancelClass: 'btn-default'
	};
	var daterangepicker_options_birthday = daterangepicker_options;
	daterangepicker_options_birthday.showDropdowns = true;
	daterangepicker_options_birthday.startDate = moment().subtract(18, 'years').format('DD.MM.YYYY');
	daterangepicker_options_birthday.maxDate = moment().subtract(18, 'years').format('DD.MM.YYYY');
	$('input[name="birthday"]').daterangepicker(daterangepicker_options_birthday, function(start, end, label) {});
	var daterangepicker_options_cargo_readiness_date = daterangepicker_options;
	daterangepicker_options_cargo_readiness_date.minDate = moment().format('DD.MM.YYYY');
	daterangepicker_options_cargo_readiness_date.maxDate = moment().add(10, 'years').format('DD.MM.YYYY');
	$('input[name="cargo_readiness_date"]').daterangepicker(daterangepicker_options_cargo_readiness_date, function(start, end, label) {});
	$('input[name="birthday"], input[name="cargo_readiness_date"]').on('apply.daterangepicker', function(ev, picker) {
		$(this).val(picker.startDate.format('DD.MM.YYYY'));
	});
	$('input[name="birthday"], input[name="cargo_readiness_date"]').on('cancel.daterangepicker', function(ev, picker) {
		$(this).val('');
	});

	// Ленивая загрузка изображение
	window.lazySizesConfig = window.lazySizesConfig || {};
	window.lazySizesConfig.init = false;
	window.lazySizesConfig.lazyClass = 'lazyload';
	window.lazySizesConfig.expand = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
	window.lazySizesConfig.expFactor = 1.5;
	window.lazySizesConfig.loadMode = 1;
	window.lazySizesConfig.preloadAfterLoad = true;
	setTimeout(function(){
		$.each($(document.body).find('[data-src], [data-bg], iframe[data-src]'), function() {
			$(this).addClass('lazyload');
		});
		lazySizes.init();
	}, 0);
	$(document).on('lazybeforeunveil', function(e){
		var $el = $(e.target);
		if($el.hasAttr('data-bg')){
			if($el.closest('.module-item').length>0) {
				$el.css('background-image', 'url('+$el.attr('data-bg')+')').addClass('is_visible');
				$el.one('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd', function(e) {
					$el.closest('.module-item').removeClass('module-item-loading');
				});
			} else if($el.closest('.article-item').length>0) {
				$el.css('background-image', 'url('+$el.attr('data-bg')+')').addClass('is_visible');
				$el.one('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd', function(e) {
					$el.closest('.article-item').removeClass('article-item-loading');
				});
			} else if($el.closest('.article-related-item').length>0) {
				$el.css('background-image', 'url('+$el.attr('data-bg')+')').addClass('is_visible');
				$el.one('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd', function(e) {
					$el.closest('.article-related-item').removeClass('article-related-item-loading');
				});
			} else {
				$el.css('background-image', 'url('+$el.attr('data-bg')+')');
			}
		}
	});

	// Подгрузка изображений
	preload = (function() {
		var imgs = [];
		return function() {
			var images = arguments[0].images;
			var args = Array.prototype.slice.call(images);
			while(args.length>0) {
				imgs.unshift(new Image());
				imgs[0].src = args.shift();
			}
			if(typeof(arguments[0].callback)==='function') {
				arguments[0].callback(images);
			}
		}
	}());
	preload({
		images: [
			window.wp.theme_url+'/images/social/icon-footer-social-facebook-hover.svg',
			window.wp.theme_url+'/images/social/icon-footer-social-twitter-hover.svg',
			window.wp.theme_url+'/images/social/icon-footer-social-youtube-hover.svg',
			window.wp.theme_url+'/images/social/icon-footer-social-instagram-hover.svg',
			window.wp.theme_url+'/images/social/icon-article-social-download-hover.svg',
			window.wp.theme_url+'/images/social/icon-article-social-facebook-hover.svg',
			window.wp.theme_url+'/images/social/icon-article-social-link-hover.svg',
			window.wp.theme_url+'/images/social/icon-article-social-mail-hover.svg',
			window.wp.theme_url+'/images/social/icon-article-social-twitter-hover.svg',
			window.wp.theme_url+'/images/social/icon-article-figure-social-download-hover.svg',
			window.wp.theme_url+'/images/social/icon-article-figure-social-facebook-hover.svg',
			window.wp.theme_url+'/images/social/icon-article-figure-social-link-hover.svg',
			window.wp.theme_url+'/images/social/icon-article-figure-social-mail-hover.svg',
			window.wp.theme_url+'/images/social/icon-article-figure-social-twitter-hover.svg',
			window.wp.theme_url+'/images/articles/icon-article-related-slider-arrow-prev-hover.svg',
			window.wp.theme_url+'/images/articles/icon-article-related-slider-arrow-next-hover.svg',
		]
	});
	var flags_icons = [];
	$.each($(document.body).find('.field-flags-items ul li > i'), function() {
		var $this = $(this);
		var bg = $this.css('background-image');
		bg = bg.replace('url(', '').replace(')', '').replace(/\"/gi, "");
		flags_icons.push(bg);
	});
	preload({images: flags_icons});
	
	// Анимация
	if(!isMobile.any() && window.innerWidth>=1240) {
		$('[data-animate]').ScrollMagicAnimate({
			triggerHook: 0.9
		});
	} else {
		$(document.body).find('*[data-visibility-hidden]').removeAttr('data-visibility-hidden');
	}
	$(window).resize(function() {
		if(window.innerWidth<1240) {
			$(document.body).find('*[data-visibility-hidden]').removeAttr('data-visibility-hidden');
		}
	}).resize();

	// ----------------

	$("[data-dropdown-link]").on("click", function(e) {
		e.preventDefault();
		var menuName = $(this).attr("data-dropdown-link");
		$(".dropdown_menu").each(function() {
			if($(this).is(":visible") && $(this).attr("data-dropdown-menu") != menuName ) {
				$(this).css({
					"display" : "none"
				})
			}
		});
		var dropdownMenu = $("[data-dropdown-menu='"+menuName+"']");
		if(dropdownMenu.is(":hidden")) {
			dropdownMenu.slideDown(300);
			$(this).addClass("active");
			$(".menu_bg").addClass("visible");
		} else {
			dropdownMenu.css({
				"display" : "none"
			});
			$(this).removeClass("active");
			$(".menu_bg").removeClass("visible");
		}
		dropdownMenu.offset({left:0});
	});
	$(this).keydown(function(eventObject){
        if (eventObject.which == 27 &&
            $(".dropdown_menu").is(":visible") ) {
                $(".dropdown_menu").css({
                	"display" : "none"
                });
				$("[data-dropdown-link]").removeClass("active");
				$(".menu_bg").removeClass("visible");
        }
    });
    $(".menu_bg").on("click", function(e) {
		e.preventDefault();
		$(".dropdown_menu").css({
			"display" : "none"
		});
		$("[data-dropdown-link]").removeClass("active");
		$(".menu_bg").removeClass("visible");
    });
    $(window).scroll(function () {
	  if ($(this).scrollTop() > 1) {
	    $(".dropdown_menu").css({
			"display" : "none"
		});
		$("[data-dropdown-link]").removeClass("active");
		$(".menu_bg").removeClass("visible");
	  }
	});

	var w = window,
	d = document,
	e = d.documentElement,
	g = d.getElementsByTagName('body')[0],
	bodyWidth = w.innerWidth || e.clientWidth || g.clientWidth;
	function getDropdownMenuPosition() {
		var menuName;
		if(bodyWidth<=1280) {
			$('[data-dropdown-menu]').each(function() {
				menuName = $(this).attr('data-dropdown-menu');
				$(this).insertAfter($('[data-dropdown-link="'+menuName+'"]'));
			});
		} else {
			$('[data-dropdown-menu]').each(function() {
				$(this).appendTo('.dropdown_menu_wrapp');
			});
		}
		$('.dropdown_menu').offset({left: 0});
		$('.dropdown_menu').width($('#subheader').width());
	}
	$(window).resize(function() {
		bodyWidth = w.innerWidth || e.clientWidth || g.clientWidth;
		getDropdownMenuPosition();
	});
	getDropdownMenuPosition();

	$(document.body).on('click', '#subheader .dropdown_menu ul li:not(.tab-link-active) a', function(e){
		e.preventDefault();
		var $this = $(this);
		var $item = $this.closest('li');
		var $list = $item.closest('ul');
		var $wrapper = $this.closest('.dropdown_menu_items');
		$list.find('li.tab-link-active').removeClass('tab-link-active');
		$item.addClass('tab-link-active');
		$wrapper.find('.col-tab-active').removeClass('col-tab-active');
		$wrapper.find('.col-tab:eq('+$item.index()+')').addClass('col-tab-active');
	});

	// ----------

	$(".vacansie_dropdown").each(function() {
		if($(this).hasClass("active")) {
			$(this).find(".vacansie_contet").css({
				"display" : "block"
			});
		}
	});

	$(".dropdown_btn").on("click", function(e) {
		e.preventDefault();
		var parentBlock = $(this).closest(".vacansie_dropdown");
		var dropdownContent = parentBlock.find(".vacansie_contet");
		if(dropdownContent.is(":hidden")) {
			dropdownContent.slideDown(300);
			parentBlock.addClass("active");
		} else {
			dropdownContent.slideUp(300);
			parentBlock.removeClass("active");
		}
	});

});