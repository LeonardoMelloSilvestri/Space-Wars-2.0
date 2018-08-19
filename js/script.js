$(document).ready(function(){
	var canvas = $("canvas");
	var ctx = canvas[0].getContext("2d");	

	images = new LoadImages();	
	pause = new Pause();
	intro = new Intro();
	gameOver = new GameOver();
	player = new Player();
	explosion = new GlobalExplosions();
	bullet = new GlobalBullets();
	enemy = new GlobalEnemies();
	item = new GlobalItens();

	bullets = [];
	enemies = [];
	explosions = [];
	itens = [];

	var themeSound = $("#themeSound");

	function LoadImages() {
		this.imgPlayer = new Image();
		this.imgPlayer.src = "./img/player.png";
		this.imgSimpleEnemy = new Image();
		this.imgSimpleEnemy.src = "./img/simpleEnemy.png";
		this.imgSimpleBullet = new Image();
		this.imgSimpleBullet.src = "./img/simpleBullet.png";
		this.imgFastEnemy = new Image();
		this.imgFastEnemy.src = "./img/fastEnemy.png";
		this.imgFiagEnemy = new Image();
		this.imgFiagEnemy.src = "./img/diagEnemy.png";
		this.imgTankEnemy = new Image();
		this.imgTankEnemy.src = "./img/tankEnemy.png";
		this.imgDiagEnemy = new Image();
		this.imgDiagEnemy.src = "./img/diagEnemy.png";
		this.imgExplosion = new Image();
		this.imgExplosion.src = "./img/explosion.png";
		this.imgHealingItem = new Image();
		this.imgHealingItem.src = "./img/healingItem.png";			
	}

	function init() {
		loop();
	}

	function update() {
		if(intro.isOn == false && pause.isPaused == false) {
			player.move();
			player.shootBullet();
			player.colideItens();
			gameOver.gameOver();
			bullet.colideEnemy();			
		}
	}

	function draw() {
		ctx.clearRect(0, 0, canvas.width(), canvas.height());
		intro.draw();
		if(intro.isOn == false) {
			ctx.fillStyle = "White";
			ctx.font = "35px Cursive";
			ctx.shadowColor = "Red";
			ctx.shadowBlur = 5;	
			ctx.fillText("Durabilidade: " + player.hp, 200, 30);
			ctx.fillText("Pontos: " + player.score, 130, 595);
			ctx.shadowBlur = 0;
			player.draw();
			bullet.drawBullets();
			enemy.drawEnemies();
			explosion.drawExplosions();
			item.drawItens();
			if(explosion.isOn == true) {
				explosion.draw();
			}		
			themeSound.get(0).play();
			if(pause.isPaused == true && intro.isOn == false) {
				pause.draw();
			}
		}
	}

	function loop() {
		window.requestAnimationFrame(loop, canvas);
		update();
		draw();
	}

	$(document).keydown(function(e) {
		switch(e.which) {
			case 13:
				if(pause.isPaused == false && intro.isOn == false) {
					pause.isPaused = true
				} else {
					pause.isPaused = false;
				}
			case 27:
				intro.isOn = false;
				break;
			case 37:
				player.moveLeft = true;
				break;
			case 38:
				player.moveUp = true;
				break;
			case 39:
				player.moveRight = true;
				break;
			case 40:
				player.moveDown = true;
				break;
			case 90:
				if(player.isShooting == false && pause.isPaused == false) {
					player.shoot = true;
					player.isShooting = true;
				}
				break;	
		}
	})

	$(document).keyup(function(e) {
		switch(e.which) {
			case 37:
				player.moveLeft = false;
				break;
			case 38:
				player.moveUp = false;
				break;
			case 39:
				player.moveRight = false;
				break;
			case 40:
				player.moveDown = false;
				break;	
			case 90:
				player.isShooting = false;
				break;
		}
	})	

	function Intro() {
		this.height = 500;
		this.width = 500;
		this.x = canvas.width() / 2 - this.width / 2;
		this.y = canvas.height() / 2 - this.height / 2;
		this.bgColor = "white";
		this.color = "black";		
		this.isOn = true;

		this.draw = function() {
			if(this.isOn == true) {
				ctx.fillStyle = this.bgColor;
				ctx.fillRect(this.x, this.y, this.width, this.height);
				ctx.fillStyle = this.color;
				ctx.font = "30px Cursive";
				ctx.textAlign = "center";
				ctx.fillText("Seja bem vindo!", canvas.width() / 2, 100);
				ctx.fillText("Aperte ESC ou ENTER para iniciar", canvas.width() / 2, 150);
			}
		}
	}

	function Pause() {
		this.x = canvas.width() / 2 - this.width / 2;
		this.y = canvas.height() / 2 - this.height / 2;
		this.messageColor = "white";		
		this.isPaused = false;

		this.draw = function() {						
			ctx.fillStyle = this.messageColor;
			ctx.font = "50px Cursive";
			ctx.textAlign = "center";
			ctx.fillText("Pause", canvas.width() / 2, 100);			
		}		
	}

	function GameOver() {
		this.gameOver = function() {
			if(player.hp <= 0) {
				alert("Você perdeu! Pontuação: " + player.score);
				player = new Player();
				enemies = [];
				bullets = [];
			}
		}
	}

	function Explosion(posX, posY) {
		this.height = 110;
		this.width = 110;
		this.x = posX;
		this.y = posY;
		this.img = images.imgExplosion;			

		this.draw = function() {			
			ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
		}
	}

	function GlobalExplosions() {
		this.drawExplosions = function() {
			for(var i = 0; i < explosions.length; i++) {
				var currentExplosion = explosions[i];
				currentExplosion.draw();
			}
		}

		this.removeExplosions = function() {
			for (var i = 0; i < explosions.length; i++) {
				var currentExplosion = explosions[i];
				setTimeout(function(){
					explosions.splice(explosions.indexOf(currentExplosion), 1);
				}, 600)
			}
		}
	}

	function Player() {
		this.height = 100;
		this.width = 100;
		this.x = 10;
		this.y = canvas.height() / 2 - this.height / 2;		
		this.moveUp = this.moveDown = this.moveLeft = this.moveRight = false;
		this.speed = 9;
		this.img = images.imgPlayer;
		this.shoot = false;
		this.isShooting = false;
		this.hp = 100;
		this.score = 0;

		this.draw = function() {		
			ctx.drawImage(this.img, this.x, this.y, this.height, this.width);			
		}

		this.move = function() {
			if(this.moveLeft == true && this.x >= 20) {
				this.x -= this.speed;
			} if(this.moveUp == true && this.y >= 10) {
				this.y -= this.speed;
			} if(this.moveRight == true && this.x + this.width <= canvas.width() - 30) {
				this.x += this.speed;
			} if(this.moveDown == true && this.y + this.height <= canvas.height() - 10) {
				this.y += this.speed;
			} 
		}

		this.shootBullet = function() {
			if(this.shoot == true) {				
				bullets.push(new SimpleBullet());		
				bullets[0].sound.get(0).play();			
			}
			this.shoot = false;
		}

		this.colideItens = function() {
			for(var i = 0; i < itens.length; i++) {
				var currentItem = itens[i];

				if(player.x + player.width >= currentItem.x &&
				   player.x <= currentItem.x + currentItem.width &&
				   player.y + player.height >= currentItem.y &&
				   player.y <= currentItem.y + currentItem.height) {
					if(currentItem.type == "Heal") {
						player.hp += currentItem.heal;
						itens.splice(itens.indexOf(currentItem), 1);
					}
				}
			}
		}
	}

	function SimpleBullet() {
		this.height = 30;
		this.width = 40;
		this.x = player.x + player.width - 15;
		this.y = player.y + player.height / 2 - this.height / 2;
		this.speed = 15;			
		this.img = images.imgSimpleBullet;
		this.sound = $("#simpleBulletSound");
		this.damage = 1;
		this.pass = false;

		this.draw = function() {			
			ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
		}

		this.move = function() {
			this.x += this.speed;
		}
	}

	function GlobalBullets() {
		this.drawBullets = function() {
			for(var i = 0; i < bullets.length; i++) {
				var currentBullet = bullets[i];
				currentBullet.draw();
				if(pause.isPaused == false) {
					currentBullet.move();
				}

				if(currentBullet.x >= canvas.width()) {
					bullets.splice(bullets.indexOf(currentBullet), 1);
				}
			}
		}

		this.colideEnemy = function() {
			for (var i = 0; i < bullets.length; i++) {
				var currentBullet = bullets[i];

				for (var j = 0; j < enemies.length; j++) {
					var currentEnemy = enemies[j];

					if(currentBullet.x + currentBullet.width >= currentEnemy.x &&
					   currentBullet.x <= currentEnemy.x + currentEnemy.width &&
					   currentBullet.y + currentBullet.height >= currentEnemy.y &&
					   currentBullet.y <= currentEnemy.y + currentEnemy.height) {
						currentEnemy.hp -= currentBullet.damage;
						bullets.splice(bullets.indexOf(currentBullet), 1);
						if(currentEnemy.hp <= 0) {					
							enemies.splice(enemies.indexOf(currentEnemy), 1);							
							player.score += currentEnemy.score;	
							explosions.push(new Explosion(currentEnemy.x, currentEnemy.y));
							explosion.removeExplosions();
							item.spawnItens();																	
						}
					}
				}
			}
		}
	}

	function SimpleEnemy() {
		this.height = 100;
		this.width = 100;
		this.x = canvas.width() - 10		
		this.y = Math.floor((Math.random() * 500));
		this.speed = 6;
		this.hp = 2;
		this.damage = 10;
		this.score = 10;
		this.img = images.imgSimpleEnemy;

		this.draw = function() {
			ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
		}

		this.move = function() {
			this.x -= this.speed;
		}
	}

	function FastEnemy() {
		this.height = 100;
		this.width = 100;
		this.x = canvas.width() - 10		
		this.y = Math.floor((Math.random() * 500));
		this.speed = 9;
		this.hp = 1;
		this.damage = 20;
		this.score = 20;
		this.img = images.imgFastEnemy;

		this.draw = function() {
			ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
		}

		this.move = function() {
			this.x -= this.speed;
		}
	}

	function TankEnemy() {
		this.height = 100;
		this.width = 100;
		this.x = canvas.width() - 10		
		this.y = Math.floor((Math.random() * 500));
		this.speed = 6;
		this.hp = 5;
		this.damage = 30;
		this.score = 50;
		this.img = images.imgTankEnemy;

		this.draw = function() {
			ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
		}

		this.move = function() {
			this.x -= this.speed;
		}
	}

	function DiagEnemy() {
		this.height = 100;
		this.width = 100;
		this.x = canvas.width() - 10		
		this.y = Math.floor((Math.random() * 500));
		this.directionY = Math.floor((Math.random() * 2));
		this.speed = 4;
		this.hp = 2;
		this.damage = 20;
		this.score = 40;
		this.img = images.imgDiagEnemy;

		this.draw = function() {
			ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
		}

		this.move = function() {
			this.x -= this.speed;
			if(this.directionY == 0) {
				this.y -= this.speed;
			} else {
				this.y += this.speed;
			}
			if(this.y <= 0) {
				this.directionY = 1;
			} else if(this.y + this.height >= canvas.height()) {
				this.directionY = 0;
			}
		}
	}			


	function GlobalEnemies() {
		this.drawEnemies = function() {
			for(var i = 0; i < enemies.length; i++){
				var currentEnemy = enemies[i];
				currentEnemy.draw();
				if(pause.isPaused == false) {
					currentEnemy.move();
				}

				if(currentEnemy.x + currentEnemy.width <= 0) {
					player.hp -= currentEnemy.damage;
					enemies.splice(enemies.indexOf(currentEnemy), 1);
				}
			}
		}

		this.spawnEnemies = function() {
			setInterval(function(){
				if(intro.isOn == false && pause.isPaused == false) {
					var random = Math.floor((Math.random() * 17));
					if(random >= 0 && random <= 7) {
						enemies.push(new SimpleEnemy);
					} else if(random >= 7 && random <= 10) {
						enemies.push(new FastEnemy());
					} else if(random >= 11 && random <= 13) {
						enemies.push(new TankEnemy());
					} else if(random >= 14 && random <= 16) {
						enemies.push(new DiagEnemy());
					}
				}
			}, 700)
		}
	}

	function HealingItem() {
		this.height = 50;
		this.width = 50;
		this.x = Math.floor((Math.random() * 800) + 30);
		this.y = Math.floor((Math.random() * 550));
		this.heal = 10;
		this.type = "Heal";
		this.img = images.imgHealingItem;

		this.draw = function() {
			ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
		}
	}

	function GlobalItens() {
		this.drawItens = function() {
			for(var i = 0; i < itens.length; i++) {
				var currentItem = itens[i];
				currentItem.draw();
			}
		}

		this.spawnItens = function() {
			var random = Math.floor((Math.random() * 10));
			if(random >= 0 && random <= 1) {
				itens.push(new HealingItem());
			}
		}
	}

	enemy.spawnEnemies();
	init();
});

