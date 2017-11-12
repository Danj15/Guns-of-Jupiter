var Main = function(game){

};

var cursors;

Main.prototype = {


	create: function() {
		var me = this;
		
		// Set the background colour to blue
		me.game.stage.backgroundColor = '#000';
	
		// Start the P2 Physics Engine
		me.game.physics.startSystem(Phaser.Physics.P2JS);
	
		// Set the gravity
		me.game.physics.p2.gravity.y = 0;
	
		// Create a random generator
		var seed = Date.now();
		me.random = new Phaser.RandomDataGenerator([seed]);

		me.createBlock();
		me.createPlayer();

		cursors = game.input.keyboard.createCursorKeys();

		
	},

	createBlock: function() {
		var me = this;
	
		// Define a block using bitmap data rather than an image sprite
		var blockShape = me.game.add.bitmapData(me.game.world.width, 100);
	
		// Fill the block with black color
		blockShape.ctx.rect(0, 0, me.game.world.width, 500);
		blockShape.ctx.fillStyle = '#ccc';
		blockShape.ctx.fill();
	
		// Create a new sprite using the bitmap data
		me.block = me.game.add.sprite(0, 0, blockShape);
	
		// Enable P2 Physics and set the block not to move
		me.game.physics.p2.enable(me.block);
		me.block.body.static = true;
		me.block.anchor.setTo(0, 0);
	},

	createPlayer: function() {
		var me = this;
	
		// Add the player to the game
		me.player = me.game.add.sprite(200, 400, 'Test_Hull_2');
	
		// Enable physics, use "true" to enable debug drawing
		me.game.physics.p2.enable([me.player], false);

		//damping
		me.player.body.angularDamping = 0.3;
		me.player.body.damping = 0;
	
		// Get rid of current bounding box
		me.player.body.clearShapes();
	
		// Add our PhysicsEditor bounding shape
		me.player.body.loadPolygon("Test_Hull_2_Physics", "Test_Hull_2");
	},

	update: function() {

		if (cursors.up.isDown){
			this.player.body.thrust(70);
			this.player.loadTexture("Test_Hull_2_FWD",0,false);
		} else if (cursors.down.isDown){
			this.player.body.reverse(40);
		} else{
			this.player.loadTexture("Test_Hull_2",0,false);
		}

		if (cursors.left.isDown){
			this.player.body.angularForce = -2;
		}
		else if (cursors.right.isDown){
			this.player.body.angularForce = 2;
		} else{
			this.player.angularForce = 0;
		}
	},

	gameOver: function(){
		this.game.state.start('GameOver');
	}

};