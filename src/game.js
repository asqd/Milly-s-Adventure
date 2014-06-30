Game = {
    // Defines our grid size and the size of each tile
    map_grid: {
        width: 24,
        height: 16,
        tile: {
            width: 16,
            height: 16
        }
    },

    // The total width and height of the game screen
    width: function() {
        return this.map_grid.width * this.map_grid.tile.width;
    },

    height: function() {
        return this.map_grid.height * this.map_grid.tile.height;
    },

    // Initialize and start our game
    start: function() {
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