// globals
var isDebugging = false;

// constants
const canvas = document.getElementById('gamecanvas');
const context = canvas.getContext('2d');
const menuRef = document.getElementById('gameinfopanel');
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

onResize();
const projectileController = new ProjectileController(canvas);
const player = new Player({ x: canvas.width / 2, y: canvas.height - 150, projectileController: projectileController });

// variables
let CurrentEnemies = [];
let PlayerIsAlive = true;

function loadAssets() {

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

function InstantiateEnemyWaves(enemyWaves) {
	for (let i = 0; i < enemyWaves; i++) {
		setTimeout(function sleep() {
			var b = new Enemy(i, -50, 2);
			CurrentEnemies.push(b);
		}, i * 1000);
	}
};

function Enemy(x, y, s) {
	this.x = x * 70 + canvas.width / 2;
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

		this.y = this.y + this.s;
		if (this.y <= -50) {
			this.state = false;
		}

		if (isDebugging) {
			context.strokeStyle = "red";
			context.strokeRect(this.x, this.y, this.w, this.h);
		}

		context.drawImage(this.ShipImg, this.x, this.y, this.w, this.h);
		//weapon if any
		context.drawImage(this.ShipWep1Img, this.x, this.y, this.w, this.h);
		context.drawImage(this.ShipWep2Img, this.x, this.y, this.w, this.h);
	}
};


// updates positions on canvas and runs collision function
function UpdatePositions() {
	CurrentEnemies.forEach(function (Enemy) {
		if (Enemy.state == true) {
			if (ShipCollision(player, Enemy)) {
				PlayerIsAlive = false; // game pause/over
			}
		}
	});


	projectileController.projectiles.forEach((proj) => {
		CurrentEnemies.forEach((Enemy) => {
			if (ProjectileCollision(proj, Enemy)) {
				Enemy.state = false;
				//aferei apo tin lista
				const index = CurrentEnemies.indexOf(Enemy);
				CurrentEnemies.splice(index, 1);
			};
		});

	});
};

function ShipCollision(s1, s2) {
	//real hero https://stackoverflow.com/questions/17737587/2d-html5-canvas-collision-howto
	return !(s1.x > s2.x + s2.w || s1.x + s1.size.width < s2.x || s1.y > s2.y + s2.h || s1.y + s1.size.height < s2.y);
};

function ProjectileCollision(proj, Ship) {
	return !(proj.x > Ship.x + Ship.w || proj.x + proj.width < Ship.x || proj.y > Ship.y + Ship.h || proj.y + proj.height < Ship.y);
};

function Renderer() {
	context.clearRect(0, 0, canvas.width, canvas.height);
	UpdatePositions();

	projectileController.draw(context);
	player.draw(context);

	CurrentEnemies.forEach(function (Enemy) {
		Enemy.draw();
	});
	if (PlayerIsAlive === true) window.requestAnimationFrame(Renderer);
};

function onResize() {
	canvas.height = window.innerHeight;
	canvas.width = window.innerWidth;
};

window.addEventListener('resize', onResize);

window.onload = function () {
	onResize();
	loadAssets();
	InstantiateEnemyWaves(stages[1].enemies);
	Renderer();
}

