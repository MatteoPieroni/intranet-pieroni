var palette = {
  	grey: {
  		bg: 'bg-001',
      n500:'616161',
  		n700: '455a64'
  	},
  	deepOrange: {
  		bg: 'bg-016',
      n500:'FF5722',
  		n700: 'e64a19'
  	},
  	amber: {
  		bg: 'bg-041',
      n500:'FFC107',
  		n700: 'ffa000'
  	},
  	green: {
  		bg: 'bg-046',
      n500:'4CAF50',
  		n700: '388e3c'
  	},
  	teal: {
  		bg: 'bg-043',
      n500:'009688',
  		n700: '00796b'
  	},
  	lightBlue: {
  		bg: 'bg-012',
      n500:'03A9F4',
  		n700: '0288d1'
  	},
  	indigo: {
  		bg: 'bg-031',
      n500:'3F51B5',
  		n700: '303f9f'
  	},
  	red: {
  		bg: 'bg-005',
      n500:'F44336',
  		n700: 'd32f2f'
  	}
};

var getColor = (function() {
	return {
		normalColor: function(chosenColor) {
			return palette[chosenColor].n500;
		},
		darkColor: function(chosenColor) {
			return palette[chosenColor].n700;
		}
	}
})();