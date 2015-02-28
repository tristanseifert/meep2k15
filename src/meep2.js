var UI = require('ui');

var card = new UI.card({
	title: 'MEPEPE',
	subtitle: 'This is a meep',
	body : 'memememememep'
});

card.show();

card.on('click', function(e){
	card.subtitle = 'You clicked'+ e.button;
});
