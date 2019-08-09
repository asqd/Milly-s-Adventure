// Game scene runs the main game loop
Crafty.scene('Game', function() {
    // 2D array to keep position of all occupied tiles
    this.occupied = new Array(Game.map_grid.width);
    for (var x = 0; x < Game.map_grid.width; x++) {
        this.occupied[x] = new Array(Game.map_grid.height);
        for (var y = 0; y < Game.map_grid.height; y++) {
            this.occupied[x][y] = false;
        }
    }

    // Player character
    this.player = Crafty.e('PlayerCharacter').at(5, 5);
    this.occupied[this.player.at().x][this.player.at().y] = true;

    // Place a tree at every edge square on our grid
	var obstacles_total = 0;

    for (var x = 0; x < Game.map_grid.width; x++) {
        for (var y = 0; y < Game.map_grid.height; y++) {
            var at_edge = x == 0 || x == Game.map_grid.width - 1 || y == 0 || y == Game.map_grid.height - 1;

			if (this.occupied[x][y]) {
				continue;
			}
            if (at_edge) {
                // Place a tree entity at the current tile
                Crafty.e('Tree').at(x, y);
                this.occupied[x][y] = true;
            } else if (Math.random() < 0.07) {
                // Place a bush or rock entity at the current tile
                var bush_or_rock = (Math.random() > 0.3) ? 'Bush' : 'Rock'
                Crafty.e(bush_or_rock).at(x, y);
                this.occupied[x][y] = true;
				obstacles_total++;
            }
        }
    }

    // Generate villages on hte map in random locations
    var max_villages = Math.ceil(Math.sqrt(((Math.random() % 100) / 30) * obstacles_total * obstacles_total));
	var x = 0, y = 0, attempts = 0;
	var prob = 3e-2, max_attempts = 1e+2; // TODO: related?
	while (Crafty('Village').length < max_villages && attempts < max_attempts) {
		x = ++x % Game.map_grid.width;
		y = ++y % Game.map_grid.height;
		if (x == 0 || y == 0) {
			attempts++;
		}
		if (this.occupied[x][y]) {
			continue;
		}
		if (Math.random() < prob) {
			Crafty.e('Village').at(x, y);
		}
	}

    // Play a ringing sound to indicate start of the game
    Crafty.audio.play('ring');
    console.log(this.occupied)
    // Show the victory screen once all villages are visited
    this.show_victory = this.bind('VillageVisited', function() {
        if (!Crafty('Village').length) {
            Crafty.scene('Victory');
        }
    });
}, function() {
    // Remove our event building
    this.unbind('VillageVisited', this.show_victory);
});

// Victory scene
Crafty.scene('Victory', function() {
    Crafty.e('2D, DOM, Text')
        .attr({
            x: 0,
            y: Game.height() / 2 - 24,
            w: Game.width()
        })
        .text('All villages visited!')
        .css($text_css);
    Crafty.audio.play('applause');
    // After a short delay watch for the player to press a key and restart the game when it pressed
    var delay = true;
    setTimeout(function() {
        delay = false;
    }, 5000);
    this.restart_game = Crafty.bind('KeyDown', function() {
        if (!delay) {
            Crafty.scene('Game');
        }
    });

}, function() {
    // Remove our event building
    this.unbind('KeyDown', this.restart_game);
});

// Loading scene
Crafty.scene('Loading', function() {
    // Draw some text for the player while scene is load
    Crafty.e('2D, DOM, Text')
        .text('Loading...')
        .attr({
            x: 0,
            y: Game.height() / 2 - 24,
            w: Game.width()
        })
        .css($text_css);

    // Load our sprites and audio assets
    Crafty.load(['assets/16x16_forest_2.gif',
        'assets/hunter.png',
        'assets/door_knock_3x.mp3',
        'assets/door_knock_3x.ogg',
        'assets/door_knock_3x.aac',
        'assets/board_room_applause.mp3',
        'assets/board_room_applause.ogg',
        'assets/board_room_applause.aac',
        'assets/candy_dish_lid.mp3',
        'assets/candy_dish_lid.ogg',
        'assets/candy_dish_lid.aac'
    ], function() {
        // Define the individual sprites in the image
        Crafty.sprite(16, 'assets/16x16_forest_2.gif', {
            spr_tree: [0, 0],
            spr_bush: [1, 0],
            spr_rock: [1, 1],
            spr_village: [0, 1]
        });

        Crafty.sprite(16, 'assets/hunter.png', {
            spr_player: [0, 2],
        }, 0, 2);

        // Define a sounds
        Crafty.audio.add({
            knock: ['assets/door_knock_3x.mp3',
                'assets/door_knock_3x.ogg',
                'assets/door_knock_3x.aac'
            ],
            applause: ['assets/board_room_applause.mp3',
                'assets/board_room_applause.ogg',
                'assets/board_room_applause.aac'
            ],
            ring: ['assets/candy_dish_lid.mp3',
                'assets/candy_dish_lid.ogg',
                'assets/candy_dish_lid.aac'
            ]
        });

        // Our sprites and sounds are ready and we start the game
        Crafty.scene('Game');
    })
});