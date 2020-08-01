(function() {
	tinymce.PluginManager.add('office_open_mce_button', function(editor, url) {
		editor.addButton('office_open_mce_button', {
			text: 'Город офиса',
			icon: false,
			onclick: function() {
				editor.windowManager.open( {
					title: 'Город офиса',
					body: [
						{
							type: 'textbox',
							name: 'time_zone',
							label: 'Временная зона города',
							value: 'Europe/Moscow'
						},
						{
							type: 'textbox',
							name: 'time_open',
							label: 'Время открытия офиса',
							value: '09:00'
						},
						{
							type: 'textbox',
							name: 'time_close',
							label: 'Время закрытия офиса',
							value: '18:00'
						},
						{
							type: 'textbox',
							name: 'time_days',
							label: 'Рабочие дни',
							value: '1,2,3,4,5,6,7'
						}
					],
					onsubmit: function(e) {
						editor.insertContent('[office_open time_zone="'+e.data.time_zone+'" time_open="'+e.data.time_open+'" time_close="'+e.data.time_close+'" time_days="'+e.data.time_days+'"]');
					}
				});
			}
		});
	});
})();