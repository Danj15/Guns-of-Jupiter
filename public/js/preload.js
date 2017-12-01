var Preload = function(game){};

Preload.prototype = {

	preload: function(){ 
		this.game.load.image("Test_Hull_2", "Test_Hull_2.png");
		this.game.load.image("Test_Hull_2_FWD", "Test_Hull_2_FWD.png");
		this.game.load.image("Test_Hull_2_BWD", "Test_Hull_2_BWD.png");
		this.game.load.image("Test_Hull_2_Clockwise", "Test_Hull_2_Clockwise.png");
		this.game.load.image("Test_Hull_2_Anticlockwise", "Test_Hull_2_Anticlockwise.png");
		this.game.load.image("Turret", "Turret.png");
		this.game.load.image("Bullet", "Bullet.png");
		this.game.load.image("Boom", "Boom.png");

		this.game.load.audio('gunFire','sounds/base-beat.mp3');
		this.game.load.audio('boom','sounds/boom.mp3');


		this.game.load.physics("Test_Hull_2_Physics", "Test_Hull_2_Physics.json");
	},

	create: function(){
		this.game.state.start("Main");
	}
}