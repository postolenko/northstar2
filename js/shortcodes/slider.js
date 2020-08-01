(function() {
	jQuery(document).ready(function($){
		tinymce.PluginManager.add('slider_mce_button', function(editor, url) {
			editor.addButton('slider_mce_button', {
				text: 'Слайдер',
				icon: false,
				onclick: function() {
					var options = [];
					$.each($('.acf-fields > .acf-field[data-name="article_sliders"] .acf-table > tbody > tr[data-id^="row-"]'), function() {
						var $row = $(this);
						var id = $row.find('.acf-fields .acf-field[data-name="id"] .acf-input input').val();
						if(typeof(id)!=='undefined') {
							if(id.trim().length>0) {
								options.push({
									text: id.trim(),
									value: id.trim()
								});
							}
						}
					});
					editor.windowManager.open({
						width: 500,
						title: 'Слайдер',
						body: [
							{
								type: 'listbox',
								name: 'id',
								label: 'Идентификатор слайдера',
								values: options
							},
						],
						onsubmit: function(e) {
							editor.insertContent('[slider id="'+e.data.id+'"]');
						}
					});
				}
			});
		});
	});
})();