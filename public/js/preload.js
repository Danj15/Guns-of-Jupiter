var Preload = function(game){};

Preload.prototype = {

	preload: function(){ 
		this.game.load.image("Test_Hull", "Test_Hull.png");
		this.game.load.physics("Test_Hull_Physics", "Test_Hull_Physics.json");
	},

	create: function(){
		this.game.state.start("Main");
	}
}