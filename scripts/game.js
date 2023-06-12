// constants
const collBoxVisible = false;
const canvas = document.getElementById('gamecanvas');
const context = canvas.getContext('2d');
const menuRef = document.getElementById('gameinfopanel');

// TODO: create a better stage schema and enemy schema
const stages = [
	{
		id: "1",
		name: "Bolek",
		enemies: 5,
		backgroundImage: "",
		audioTrack: ""

	},
	{
		id: "2",
		name: "Lolek",
		enemies: 10,
		backgroundImage: "",
		audioTrack: ""
	}
];


// variables
// let gamescore = 0;
// let timer = 0;
let PlayerProjectiles = [];
let EnemyProjectiles = [];
let CurrentEnemies = [];
let minutesPassed = 0;
let PlayerIsAlive = true;

function Initialize() {

	//Player Ship images
	ShipLvl1 = new Image();
	ShipLvl1.src = "./assets/images/Ships/Medium/body_01.png";
	ShipLvl2 = new Image();
	ShipLvl2.src = "./assets/images/Ships/Medium/body_02.png";
	ShipLvl3 = new Image();
	ShipLvl3.src = "./assets/images/Ships/Medium/body_03.png";
	// normal enemies
	EnemyTypeNorm1 = new Image();
	EnemyTypeNorm1.src = "./assets/images/Others/Mechs/torso_01.png";
	EnemyTypeNorm1wep1 = new Image();
	EnemyTypeNorm1wep2 = new Image();
	EnemyTypeNorm1wep1.src = "./assets/images/Others/Mechs/weapon_left.png";
	EnemyTypeNorm1wep2.src = "./assets/images/Others/Mechs/weapon_right.png";
	// bosses



	// WEAPON - CANNONS
	WepCannon1 = new Image();
	WepCannon1.src = "./assets/images/Weapons/Medium/Cannon/turret_01_mk1.png";
	WepCannon2 = new Image();
	WepCannon2.src = "./assets/images/Weapons/Medium/Cannon/turret_01_mk2.png";
	WepCannon3 = new Image();
	WepCannon3.src = "./assets/images/Weapons/Medium/Cannon/turret_01_mk3.png";
	// WEAPON - LASERS
	WepLaser1 = new Image();
	WepLaser1.src = "./assets/images/Weapons/Medium/Laser/turret_02_mk1.png";
	WepLaser2 = new Image();
	WepLaser2.src = "./assets/images/Weapons/Medium/Laser/turret_02_mk2.png";
	WepLaser3 = new Image();
	WepLaser3.src = "./assets/images/Weapons/Medium/Laser/turret_02_mk3.png";
	// WEAPON - MISSILES
	// WEAPON - PLASMA

	// PROJECTILES
	CannonProjectile = new Image();
	CannonProjectile.src = "./assets/images/Projectiles/turret_01_bullet_01.png";


};

function InstantiatePlayer() {
	PlayerShip = {
		//location and size variables
		x: canvas.width / 2,  // prin to eixa W/2 alla einai sto canvas prin to scale down (to -32 einai apo to miso width gia na bgenei pio kentro)
		y: canvas.height - 150, //prin htan H-50, >>
		w: 64,
		h: 96,
		// Equippment Variables
		speed: 20,
		Ship: ShipLvl1,
		hp: 1,
		Weapon: WepCannon1,
		WepDmg: 1,
		WepFirerate: 250,
		//ftiaxnete prwth fora otan patithei to play, na balw kapoio animation gia na pigene sto spot anti apla na ksekinaei ekei
		draw: function () {
			// de kserw an kanei ontws kati
			context.imageSmoothingEnabled = true;
			//kapoio provlima exei an valw W/ H anti canvas.width/canvas.height, einai san na ksekinaei apo tin arxh tou page kai afinei katw parts tou canvas uncleared;
			//to metefera sto render function
			//context.clearRect(0,0,canvas.width,canvas.height);
			context.strokeStyle = "red";
			if (collBoxVisible == true) {
				context.strokeRect(this.x, this.y, this.w, this.h);
			}

			//draw ship
			context.drawImage(PlayerShip.Ship, PlayerShip.x, PlayerShip.y, PlayerShip.w, PlayerShip.h)
			//save giati allios kindineuoume me puriniki katastrofh
			//context.save();
			//draw cannon on ship, some numerical adjustments to fit perfectly on the weapon base
			context.drawImage(PlayerShip.Weapon, PlayerShip.x, PlayerShip.y + 30, PlayerShip.w, PlayerShip.h / 2)

		},
		fire: function () {
			var b = new Projectile(PlayerShip.x, PlayerShip.y, 30);
			PlayerProjectiles.push(b) // ebgala to this.
		}
	};
};

function InstantiateEnemyWaves(enemyWaves) {
	for (let i = 0; i < enemyWaves; i++) {
		setTimeout(function sleep() {
			var b = new Enemy(i, -50, 2);
			CurrentEnemies.push(b);
		}, i * 1000);
	}
};

function Enemy(x, y, s) {
	//x : -canvas.width/2 - 64, // (to +64 einai to miso width, gia na bgenei pio kentro )

	this.x = x * 70 + canvas.width / 2,
		this.y = y;
	this.s = s;
	this.w = 96;
	this.h = 96;
	this.state = true;
	this.hp = 1;
	this.ShipImg = EnemyTypeNorm1;
	this.ShipWep1Img = EnemyTypeNorm1wep1;
	this.ShipWep2Img = EnemyTypeNorm1wep2;
	this.draw = function () {
		//ship
		if (collBoxVisible === true) {
			context.strokeStyle = "red";
			context.strokeRect(this.x, this.y, this.w, this.h);
		}
		context.drawImage(this.ShipImg, this.x, this.y, this.w, this.h);
		//weapon if anys
		context.drawImage(this.ShipWep1Img, this.x, this.y, this.w, this.h);
		context.drawImage(this.ShipWep2Img, this.x, this.y, this.w, this.h);
	}
	this.update = function () {
		this.y = this.y + this.s;
		if (this.y <= -50) {
			this.state = false;
		}
	}
};
// ###############################################  
// #########  PLAYER MOVEMENT & FIRING   ######### 
// ###############################################  

//Movement keys array, needed for diagonial movement
var Keys = {
	up: false,
	down: false,
	right: false,
	left: false,
	fire: false
};

function PlayerMovement() {
	if (Keys.left) {
		// an to location (x) pou einai to ship einai katw apo to paxos tou ploiou, valto sto x = paxos tou ploiou, kanonika tha ekana check me x <= 0 alla to miso ploio bgenei ektos canva
		if (!(PlayerShip.x <= PlayerShip.w / 2)) {
			PlayerShip.x -= PlayerShip.speed;
		}
	}
	if (Keys.right) {
		//evala to 25 gia na einai omiomorfa, bakalistikos tropos mexri na vrethei kati reliable
		if (!(PlayerShip.x > canvas.width - PlayerShip.w - 25)) {
			PlayerShip.x += PlayerShip.speed;
		}
	}
	if (Keys.up) {
		if (!(PlayerShip.y <= PlayerShip.h / 2)) {
			PlayerShip.y -= PlayerShip.speed;
		}
	}
	if (Keys.down) {
		//evala to 25 gia na einai omiomorfa, bakalistikos tropos mexri na vrethei kati reliable
		if (!(PlayerShip.y > canvas.height - PlayerShip.h - 25)) {
			PlayerShip.y += PlayerShip.speed;
		}
	}
};
// ###################################### 
// ######### PLAYER FIRING  ############# 
// ######################################

//x = location of ship , y = location of ship plus something higher , s = speed of projectile
function Projectile(x, y, s) {
	this.x = x + 16; // bakalistikos tropos na kanw center to projectile sto ship allios den einai aligned, de kserw akoma giati
	this.y = y;
	this.s = s;

	//to eixa this.state alla mallon to SetState douleuei
	this.state = true;
	this.w = 32; // projectile width;
	this.h = 32; // projectile height; na ta valw panw pali
	this.draw = function () {
		if (collBoxVisible == true) {
			context.strokeStyle = "red";
			context.strokeRect(this.x, this.y, this.w, this.h);
		}
		context.drawImage(CannonProjectile, this.x, this.y, this.w, this.h);

	}
	this.update = function () {
		this.y -= this.s;
		if (this.y <= -50) {
			this.state = false;
		}
	}
};

// updates positions on canvas and runs collision function

function UpdatePositions() {
	CurrentEnemies.forEach(function (Enemy) {
		if (Enemy.state == true) {
			Enemy.update();
			if (ShipCollision(PlayerShip, Enemy)) {
				// game pause/over
				PlayerIsAlive = false;
			}
		}
	});


	PlayerProjectiles.forEach(function (Projectile) {
		if (Projectile.state == true) {
			Projectile.update();
			CurrentEnemies.forEach(function (Enemy) {
				if (ProjectileCollision(Projectile, Enemy)) {

					//allo ana enemy type
					// gamescore += 100;

					//allagi state
					Projectile.state = false;
					Enemy.state = false;
					//aferei apo tin lista
					var index1 = CurrentEnemies.indexOf(Enemy);
					CurrentEnemies.splice(index1, 1);
					var index2 = PlayerProjectiles.indexOf(Projectile);
					PlayerProjectiles.splice(index2, 1);
					//xanei ti mpala, proxoraei to Index gia enemy/projectile kai kanei alla nta lon
					//thelei splice oxi pop
					// if(Enemy.state == false){
					//     var arrPos = Enemy.indexOf();
					//     
					//     
					//     CurrentEnemies.splice();
					// }
					// if(Projectile.state == false){
					//     PlayerProjectiles.splice(Projectile);
					// }

				};
			});
		}

	});
};

function ShipCollision(s1, s2) {
	//real hero https://stackoverflow.com/questions/17737587/2d-html5-canvas-collision-howto
	return !(s1.x > s2.x + s2.w || s1.x + s1.w < s2.x || s1.y > s2.y + s2.h || s1.y + s1.h < s2.y);
};

function ProjectileCollision(Proj, Ship) {
	//console.log(Proj.w,Ship.w);
	return !(Proj.x > Ship.x + Ship.w || Proj.x + Proj.w < Ship.x || Proj.y > Ship.y + Ship.h || Proj.y + Proj.h < Ship.y);
};

function Renderer() {
	context.clearRect(0, 0, canvas.width, canvas.height);
	PlayerMovement();
	UpdatePositions();
	PlayerShip.draw();

	CurrentEnemies.forEach(function (Enemy) {
		//if(Enemy.state == true){
		Enemy.draw();
		//}
	});

	PlayerProjectiles.forEach(function (Projectile) {
		// if(Projectile.state == true){
		Projectile.draw();
		//}
	});
	if (PlayerIsAlive === true) window.requestAnimationFrame(Renderer);
};

function onResize() {
	canvas.height = window.innerHeight;
	canvas.width = window.innerWidth;
};

window.addEventListener('resize', onResize);

window.onkeydown = function (e) {
	var kc = e.keyCode;
	e.preventDefault();
	if (kc === 37) Keys.left = true;
	if (kc === 38) Keys.up = true;
	if (kc === 39) Keys.right = true;
	if (kc === 40) Keys.down = true;
	//firing button
	//if( kc=== 32) Keys.fire = true;
	if (kc === 32) {

		if (event.repeat) {
			if (Keys.fire == false) {
				Keys.fire = true;
				PlayerShip.fire();
				autofire = setInterval(function () { PlayerShip.fire(); if (Keys.fire == false) { clearInterval(autofire) } }, PlayerShip.WepFirerate);
			}
		}
		else {
			PlayerShip.fire();
		}
	}
};

window.onkeyup = function (e) {
	var kc = e.keyCode;
	e.preventDefault();
	if (kc === 37) Keys.left = false;
	if (kc === 38) Keys.up = false;
	if (kc === 39) Keys.right = false;
	if (kc === 40) Keys.down = false;
	//firing button
	if (kc === 32) Keys.fire = false;
};

window.onload = function () {
	onResize();
	Initialize();
	InstantiatePlayer();
	InstantiateEnemyWaves(stages[1].enemies);
	Renderer();
}

