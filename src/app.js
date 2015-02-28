var UI = require('ui');
var Vector2 = require('vector2');
var ajax = require('ajax');

var url = "http://api.openweathermap.org/data/2.5/weather?q=Dallas";

var main = new UI.Card({
	title: 'Pebble.js',
	icon: 'images/menu_icon.png',
	subtitle: 'Hello World!',
	body: 'You are a APPLES and should set your hair on fire.'
});

main.show();

/// clicking the up button
main.on('click', 'up', function(e) {
	var menu = new UI.Menu({
		sections: [{
			items: [{
				title: 'Pebble.js',
				icon: 'images/menu_icon.png',
				subtitle: 'This is an menu item!!!'
			}, {
				title: 'Second Item',
				subtitle: 'Subtitle Text'
			}]
		}]
	});
	menu.on('select', function(e) {
		console.log('Selected item #' + e.itemIndex + ' of section #' + e.sectionIndex);
		console.log('The item is titled "' + e.item.title + '"');
	});
	menu.show();
});

// middle button
main.on('click', 'select', function(e) {
	ajax({
			url: url,
			type: 'json'
		},

		function(data) {
			// Success!
			console.log('Successfully fetched weather data!');

			// Extract data
			var location = data.name;
			var temperature = Math.round(data.main.temp - 273.15) + 'C';

			// Always upper-case first letter of description
			var description = data.weather[0].description;
			description = description.charAt(0).toUpperCase() + description.substring(1);

			var wind = new UI.Window();
			var textfield = new UI.Text({
				position: new Vector2(0, 0),
				size: new Vector2(144, 168),
				font: 'gothic-28',
				text: location + '\n' + temperature + '\n' + description,
				textAlign: 'center'
			});
			wind.add(textfield);
			wind.show();
		},

		function(error) {
			console.log('Failed fetching weather data: ' + error);
		}
	);
});

// down button
main.on('click', 'down', function(e) {
	var card = new UI.Card();
	card.title('A Card');
	card.subtitle('Is a Window');
	card.body('The simplest window type in Pebble.js.');
	card.show();
});