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

		me.game.physics.p2.setImpactEvents(true);

		me.playerCollisionGroup = game.physics.p2.createCollisionGroup();
		me.bulletCollisionGroup = game.physics.p2.createCollisionGroup();
		me.enemyCollisionGroup = game.physics.p2.createCollisionGroup();
		me.asteroidCollisionGroup = game.physics.p2.createCollisionGroup();
		game.physics.p2.updateBoundsCollisionGroup();
		
		explosionSound = this.game.add.audio('boom');
		fireSound = this.game.add.audio('gunFire');

		game.world.setBounds(0, 0, 2000, 2000);

		me.createEnemy();
		me.createPlayer();
		me.createAsteroid();

		cursors = game.input.keyboard.createCursorKeys();
		bullets = game.add.group();
		bullets.setAll('checkWorldBounds', false);
		bullets.setAll('outOfBoundsKill', true);

		game.camera.follow(me.player);

		var graphics = game.add.graphics(0, 0);

		graphics.lineStyle(8, 0xffffff, 0.1);
		graphics.arc(1000, 1000, 1000, 0, game.math.degToRad(360), false);
		graphics.lineStyle(4, 0xffffff, 0.1);
		graphics.arc(1000, 1000, 800, 0, game.math.degToRad(360), false);




		
	},

	createAsteroid: function() {
		var me = this;
		me.asteroid = me.game.add.sprite(1000, 800, 'Asteroid');
		me.game.physics.p2.enable(me.asteroid, debug);
		me.asteroid.body.angularDamping = 0;
		me.asteroid.body.damping = 0;

		me.asteroid.body.setCollisionGroup(me.asteroidCollisionGroup);
		
		me.asteroid.body.collides([me.playerCollisionGroup, me.bulletCollisionGroup, me.enemyCollisionGroup]);
		
	
	},

	createEnemy: function() {
		var me = this;

		me.enemy = me.game.add.sprite(1200, 1000, 'Test_Hull_2');
	
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

		me.enemy.body.collides([me.playerCollisionGroup, me.bulletCollisionGroup,me.asteroidCollisionGroup]);
		
	},

	createPlayer: function() {
		var me = this;
	
		// Add the player to the game
		me.player = me.game.add.sprite(800, 1000, 'Test_Hull_2');
	
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
		me.player.body.collides([me.playerCollisionGroup, me.enemyCollisionGroup,me.asteroidCollisionGroup]);

		

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
		var aimAngle = Math.atan((game.input.mousePointer.y -this.player.y + game.camera.y)/(game.input.mousePointer.x -this.player.x + game.camera.x));
		aimAngle = 180*aimAngle/Math.PI + 90 - this.player.angle;
		if ((game.input.mousePointer.x-this.player.x + game.camera.x) < 0){
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

		this.constrainVelocity(this.player, 5);

		this.pushBackIn(this.player);

		this.pushBackIn(this.enemy);

	},

	pushBackIn: function(leaver){
		if(this.game.math.distance(1000,1000, leaver.body.x,leaver.body.y) > 800){
			var pushAngle = this.game.math.angleBetween(1000,1000, leaver.body.x,leaver.body.y);

			//TODO: find component of velocity of ship in direction of push angle

			var playerVelocityAngle =  Math.atan(leaver.body.velocity.y/leaver.body.velocity.x);

			if(leaver.body.velocity.x < 0 && leaver.body.velocity.y >0){
				playerVelocityAngle += Math.PI;
			}else if(leaver.body.velocity.x < 0 && leaver.body.velocity.y <0){
				playerVelocityAngle -= Math.PI;
			}
	
			if(Math.abs(playerVelocityAngle-pushAngle) < Math.PI/2 || this.game.math.distance(1000,1000, leaver.body.x,leaver.body.y) > 950){
				var force = [10*Math.cos(pushAngle), 10*Math.sin(pushAngle)];
				leaver.body.applyForce(force, 0, 0);
			} else{
				var force = [2*Math.cos(pushAngle), 2*Math.sin(pushAngle)];
				leaver.body.applyForce(force, 0, 0);
			}

			

		}
	},

	render: function() {
		if(debug){
			game.debug.cameraInfo(game.camera, 32, 32);	
			game.debug.spriteCoords(this.player, 32, 120);
		}		
				
	},

	fire: function(angle){
		if (game.time.now > nextFire){
			nextFire = game.time.now + fireRate;
			for(i=0;i<4;i++){
				this.fireGunNumber(i, angle);
			}
			fireSound.play('',0,0.3);
			
			
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
			bullet.body.collides([this.bulletCollisionGroup, this.enemyCollisionGroup,this.asteroidCollisionGroup], this.impact, this);
			bullet.body.angle = angle;
			bullet.body.mass = 0.01;
			bullet.body.thrust(200); 
			bullet.body.damping = 0;
			bullet.lifespan = 5000;
			bullets.add(bullet);

			//recoil
			var force = [10*Math.sin(angle*Math.PI/180), -10*Math.cos(angle*Math.PI/180)];
			this.player.body.applyForce(force, 0, gunOffsets[gunNumber]);
		}

	},

	impact: function(bullet,target){
		var explosion = this.game.add.sprite(bullet.x,bullet.y,'Boom');
		explosionSound.play('',0,0.8);
		explosion.lifespan = 100;
		bullet.sprite.kill();
	},

	gameOver: function(){
		this.game.state.start('GameOver');
	},

	constrainVelocity: function(sprite, maxVelocity) {
		var body = sprite.body
		var angle, currVelocitySqr, vx, vy;
		vx = body.data.velocity[0];
		vy = body.data.velocity[1];
		currVelocitySqr = vx * vx + vy * vy;
		if (currVelocitySqr > maxVelocity * maxVelocity) {
			angle = Math.atan2(vy, vx);
			vx = Math.cos(angle) * maxVelocity;
			vy = Math.sin(angle) * maxVelocity;
			body.data.velocity[0] = vx;
			body.data.velocity[1] = vy;
		}
	}

};