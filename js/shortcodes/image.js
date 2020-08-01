(function() {
	tinymce.PluginManager.add('image_mce_button', function(editor, url) {
		editor.addButton('image_mce_button', {
			text: 'Изображение',
			icon: false,
			onclick: function() {
				editor.windowManager.open( {
					title: 'Изображение с подписью',
					body: [
						{
                            type: 'textbox',
                            name: 'src',
                            label: 'Ссылка на изображение',
                            value: '',
                            classes: 'my_input_image-image',
							minWidth: 200,
                        },
                        {
                            type: 'button',
                            name: 'my_upload_button',
                            label: ' ',
                            text: 'Выбрать изображение',
                            classes: 'my_upload_button-image',
                        },
						{
							type: 'textbox',
							name: 'caption',
							label: 'Подпись',
							value: ''
						},
						{
							type: 'textbox',
							name: 'alt',
							label: 'Alt',
							value: ''
						},
					],
					onsubmit: function(e) {
						var attrs = {};
						if(e.data.caption.length>0) {
							attrs.caption = e.data.caption;
						}
						if(e.data.alt.length>0) {
							attrs.alt = e.data.alt;
						}
						var attrs_array = [];
						for(key in attrs) {
							attrs_array.push(key+'="'+attrs[key]+'"');
						}
						editor.insertContent('[image src="'+e.data.src+'" '+attrs_array.join(' ')+']');
					}
				});
			}
		});
	});
})();
jQuery(document).ready(function($){
	$(document).on('click', '.mce-my_upload_button-image', upload_image_tinymce);
	function upload_image_tinymce(e) {
		e.preventDefault();
		var $input_field = $('.mce-my_input_image-image');
		var custom_uploader = wp.media.frames.file_frame = wp.media({
			title: 'Выбрать изображение',
			button: {
				text: 'Вставить'
			},
			multiple: false
		});
		custom_uploader.on('select', function() {
			var attachment = custom_uploader.state().get('selection').first().toJSON();
			$input_field.val(attachment.url);
		});
		custom_uploader.open();
	}
});