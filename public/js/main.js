var Main = function(game){

};

var cursors;

var debug = false;



var gunOffsets = [-32,-14,14,32];

var fireRate = 500;
var nextFire = 0;

Main.prototype = {


	create: function() {
		var me = this;

		this.wasd = {
			up: this.game.input.keyboard.addKey(Phaser.Keyboard.W),
			down: this.game.input.keyboard.addKey(Phaser.Keyboard.S),
			left: this.game.input.keyboard.addKey(Phaser.Keyboard.A),
			right: this.game.input.keyboard.addKey(Phaser.Keyboard.D),
		  };
		
		// Set the background colour to blue
		me.game.stage.backgroundColor = '#010103';
	
		// Start the P2 Physics Engine
		me.game.physics.startSystem(Phaser.Physics.P2JS);
	
		// Set the gravity
		me.game.physics.p2.gravity.y = 0;
	
		// Create a random generator
		var seed = Date.now();
		me.random = new Phaser.RandomDataGenerator([seed]);

		me.playerCollisionGroup = game.physics.p2.createCollisionGroup();
		me.bulletCollisionGroup = game.physics.p2.createCollisionGroup();
		me.enemyCollisionGroup = game.physics.p2.createCollisionGroup();
		game.physics.p2.updateBoundsCollisionGroup();
		


		me.createEnemy();
		me.createPlayer();
		me.createTurrets();

		cursors = game.input.keyboard.createCursorKeys();
		bullets = game.add.group();
		bullets.setAll('checkWorldBounds', true);
		bullets.setAll('outOfBoundsKill', true);

		
	},

	createTurrets: function() {
		var me = this;
		
	
	},

	createEnemy: function() {
		var me = this;

		me.enemy = me.game.add.sprite(600, 400, 'Test_Hull_2');
	
		// Enable P2 Physics
		me.game.physics.p2.enable(me.enemy, debug);

		//damping
		me.enemy.body.angularDamping = 0.3;
		me.enemy.body.damping = 0.1;

		// Get rid of current bounding box
		me.enemy.body.clearShapes();
		
		// Add our PhysicsEditor bounding shape
		me.enemy.body.loadPolygon("Test_Hull_2_Physics", "Test_Hull_2");

		me.enemy.body.setCollisionGroup(me.enemyCollisionGroup);

		me.enemy.body.collides([me.playerCollisionGroup, me.bulletCollisionGroup]);
		
	},

	createPlayer: function() {
		var me = this;
	
		// Add the player to the game
		me.player = me.game.add.sprite(200, 400, 'Test_Hull_2');
	
		// Enable physics, use "true" to enable debug drawing
		me.game.physics.p2.enable([me.player], debug);

		//damping
		me.player.body.angularDamping = 0.3;
		me.player.body.damping = 0.1;
	
		// Get rid of current bounding box
		me.player.body.clearShapes();
	
		// Add our PhysicsEditor bounding shape
		me.player.body.loadPolygon("Test_Hull_2_Physics", "Test_Hull_2");

		me.player.body.setCollisionGroup(me.playerCollisionGroup);
		me.player.body.collides([me.playerCollisionGroup, me.enemyCollisionGroup]);

		

		//add turrets
		me.turrets = me.game.add.group();
		me.turret1 = me.game.add.sprite(0, gunOffsets[0], "Turret");
		me.turret1.anchor.setTo(0.5,0.5);
		me.turret2 = me.game.add.sprite(0, gunOffsets[1], "Turret");
		me.turret2.anchor.setTo(0.5,0.5);
		me.turret3 = me.game.add.sprite(0, gunOffsets[2], "Turret");
		me.turret3.anchor.setTo(0.5,0.5);
		me.turret4 = me.game.add.sprite(0, gunOffsets[3], "Turret");
		me.turret4.anchor.setTo(0.5,0.5);
		me.player.addChild(me.turret1);
		me.player.addChild(me.turret2);
		me.player.addChild(me.turret3);
		me.player.addChild(me.turret4);
	},

	update: function() {

		var aimAngle = Math.atan((game.input.mousePointer.y-this.player.y)/(game.input.mousePointer.x-this.player.x));
		aimAngle = 180*aimAngle/Math.PI + 90 - this.player.angle;
		if ((game.input.mousePointer.x-this.player.x) < 0){
			aimAngle += 180;
		}


		this.turret1.angle = aimAngle;
		this.turret2.angle = aimAngle;
		this.turret3.angle = aimAngle;
		this.turret4.angle = aimAngle;
		

		if (cursors.up.isDown || this.wasd.up.isDown){
			this.player.body.thrust(70);
			this.player.loadTexture("Test_Hull_2_FWD",0,false);
		} else if (cursors.down.isDown || this.wasd.down.isDown){
			this.player.body.reverse(40);
			this.player.loadTexture("Test_Hull_2_BWD",0,false);
		} else{
			this.player.loadTexture("Test_Hull_2",0,false);
		}

		if (cursors.left.isDown || this.wasd.left.isDown){
			this.player.body.angularForce = -2;
			this.player.loadTexture("Test_Hull_2_Anticlockwise",0,false);
		}
		else if (cursors.right.isDown || this.wasd.right.isDown){
			this.player.body.angularForce = 2;
			this.player.loadTexture("Test_Hull_2_Clockwise",0,false);
		} else{
			this.player.angularForce = 0;
		}

		if (game.input.activePointer.isDown)
		{
			this.fire(aimAngle + this.player.angle);
		}

	},

	fire: function(angle){
		if (game.time.now > nextFire){
			nextFire = game.time.now + fireRate;
			console.log('BANG');
			console.log('player x: '+this.player.body.x);
			console.log('player y: '+this.player.body.y);
			console.log('fire angle: '+angle);
			for(i=0;i<4;i++){
				this.fireGunNumber(i, angle);
			}
			
			
		}
		
	},

	fireGunNumber: function(gunNumber, angle){
		var fireAngle = angle - this.player.angle;
		if (fireAngle < 0){
			fireAngle += 360;
		} else if (fireAngle > 360){
			fireAngle -= 360;
		}
		var cantFire = ((fireAngle < 30 || fireAngle > 330) && (gunNumber != 0)) || ((fireAngle > 150 && fireAngle < 210) && (gunNumber != 3));
		if (!cantFire){
			var xPosition = this.player.body.x + 10*Math.sin(angle*Math.PI/180) - gunOffsets[gunNumber]*Math.sin(this.player.angle*Math.PI/180);
			var yPosition = this.player.body.y - 10*Math.cos(angle*Math.PI/180) + gunOffsets[gunNumber]*Math.cos(this.player.angle*Math.PI/180);
			var bullet = game.add.sprite(xPosition,yPosition, 'Bullet');
			this.game.physics.p2.enable([bullet], false);
			bullet.body.setCollisionGroup(this.bulletCollisionGroup);
			bullet.body.collides([this.bulletCollisionGroup, this.enemyCollisionGroup]);
			bullet.body.angle = angle;
			bullet.body.thrust(20000); 
			bullet.body.damping = 0;
			bullet.lifespan = 5000;
			bullets.add(bullet);

			//recoil
			console.log(this.player.body.x);
			console.log(this.player.body.y);
			var force = [10*Math.sin(angle*Math.PI/180), -10*Math.cos(angle*Math.PI/180)];
			this.player.body.applyForce(force, 0, gunOffsets[gunNumber]);
		}

	},

	gameOver: function(){
		this.game.state.start('GameOver');
	}

};