// The Grid component allows to Located elements on a grid of tiles
Crafty.c('Grid', {
    init: function() {
        this.attr({
            w: Game.map_grid.tile.width,
            h: Game.map_grid.tile.height
        })
    },

    // Locate this entity at the given position on the grid
    at: function(x, y) {
        if (x === undefined && y === undefined) {
            return {
                x: this.x / Game.map_grid.tile.width,
                y: this.y / Game.map_grid.height
            }
        } else {
            this.attr({
                x: x * Game.map_grid.tile.width,
                y: y * Game.map_grid.tile.height
            });
            return this;
        }
    }
});

Crafty.c('Actor', {
    init: function() {
        this.requires('2D, Canvas, Grid');
    },
});

// This is the player-controlled character
Crafty.c('PlayerCharacter', {
    init: function() {
        this.requires('Actor, Fourway, Collision, spr_player, SpriteAnimation')
            .fourway(2)
            .stopOnSolids()
            .onHit('Village', this.visitVillage)
        // Animations for caracter
        .reel('PlayerMovingUp', 600, 0, 0, 3)
            .reel('PlayerMovingRight', 600, 0, 1, 3)
            .reel('PlayerMovingDown', 600, 0, 2, 3)
            .reel('PlayerMovingLeft', 600, 0, 3, 3);

        var animation_speed = 4;
        this.bind('NewDirection', function(data) {
            if (data.x > 0) {
                this.animate('PlayerMovingRight', animation_speed, -1);
            } else if (data.x < 0) {
                this.animate('PlayerMovingLeft', animation_speed, -1);
            } else if (data.y > 0) {
                this.animate('PlayerMovingDown', animation_speed, -1);
            } else if (data.y < 0) {
                this.animate('PlayerMovingUp', animation_speed, -1);
            } else {
                this.pauseAnimation();
            }
        })
    },

    // Register a stop-movement function to called it every time when Player hits the Solid entity
    stopOnSolids: function() {
        this.onHit('Solid', this.stopMovement);
        return this;
    },

    stopMovement: function() {
        this._speed = 0;
        if (this._movement) {
            this.x -= this._movement.x;
            this.y -= this._movement.y;
        }
    },

    visitVillage: function(data) {
        village = data[0].obj;
        village.collect();
    }
});

// Non-Player enteties
Crafty.c('Village', {
    init: function() {
        this.requires('Actor, spr_village')
    },

    collect: function() {
        this.destroy();
        Crafty.audio.play('knock');
        Crafty.trigger('VillageVisited', this);
    }
});


Crafty.c('Tree', {
    init: function() {
        this.requires('Actor, Solid, spr_tree')
    },
});

Crafty.c('Bush', {
    init: function() {
        this.requires('Actor, Solid, spr_bush')
    },
});

Crafty.c('Rock', {
    init: function() {
        this.requires('Actor, Solid, spr_rock')
    }
});