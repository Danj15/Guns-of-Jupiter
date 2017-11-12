var Preload = function(game){};

Preload.prototype = {

	preload: function(){ 
		this.game.load.image("Test_Hull_2", "Test_Hull_2.png");
		this.game.load.image("Test_Hull_2_FWD", "Test_Hull_2_FWD.png");
		this.game.load.physics("Test_Hull_2_Physics", "Test_Hull_2_Physics.json");
	},

	create: function(){
		this.game.state.start("Main");
	}
}