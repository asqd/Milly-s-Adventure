Game = {
	// abstract rectangular cell ideally, concrete image tile practically
	MAP_TILE_SIZE: {
		width: 16,
		height: 16
	},

	// map adjusts to the browser viewport
    map_grid: {
        width: 0,
        height: 0,
		vp: null
    },

	viewport: function() {
		return {
			width: window.innerWidth,
			height: window.innerHeight
		}
	},

	viewport_aligned: function(alignment) {
		var vp = this.viewport()
		vp.width -= vp.width % alignment.width
		vp.height -= vp.height % alignment.height
		return vp
	},

	init_map_grid: function() {
		var vp = this.viewport_aligned(this.MAP_TILE_SIZE)
		/////
		this.map_grid.vp = vp
		this.map_grid.width = vp.width / this.MAP_TILE_SIZE.width
		this.map_grid.height = vp.height / this.MAP_TILE_SIZE.height
		/////
		this.map_grid.tile = this.MAP_TILE_SIZE
	},

	width: function() {
        return this.map_grid.vp.width
    },

    height: function() {
        return this.map_grid.vp.height
    },

    // Initialize and start our game
    start: function() {
		Game.init_map_grid();

        // Start crafty and set background
        Crafty.init(Game.width(), Game.height());
        Crafty.background('rgb(87, 129, 20)');

        Crafty.scene('Loading');
    }
}

$text_css = {
    'font-size': '32px',
    'font-family': 'Arial',
    'color': 'white',
    'text-align': 'center'
};