//canvas detection,size and 2d thing
var canvas = document.getElementById('gamecanvas');

//document.addEventListener('keydown', PlayerMovement); -- caused the acceleration effect on movement, guess too much key logging
var TimerText = document.getElementById('Timer');
TimerText.textContent = "Time: 0s";
var ScoreText = document.getElementById('Score');
ScoreText.textContent = "Score : 0";
var GameScore = 0;
var TimerSeconds = 0;
var W = canvas.clientWidth;
var H = canvas.clientHeight;

var cntx = canvas.getContext('2d');

var gamemenu = document.getElementById('gameinfopanel');
canvas.height = window.innerHeight-gamemenu.clientHeight;
canvas.width = window.innerWidth;


var DisplayColBox = false;


// ###################################### 
// #######  Game Initialization   ####### 
// ###################################### 
var PlayerProjectiles = [];
var EnemyProjectiles = [];

// ena array gia ola ta enemy types

//ena array gia tous enemies pou exei to current level
var CurrentEnemies = [];


function Initialize(){
    

    //%%%%%%%% IMAGE LOADING %%%%%%%%
    //Player Ship images
    ShipLvl1 = new Image(); 
    ShipLvl1.src = "Images/Ships/medium/body_01.png";
    ShipLvl2 = new Image();
    ShipLvl2.src = "Images/Ships/medium/body_02.png";
    ShipLvl3 = new Image();
    ShipLvl3.src = "Images/Ships/medium/body_03.png";
    // normal enemies
    EnemyTypeNorm1 = new Image();
    EnemyTypeNorm1.src = "Images/Others/Mechs/torso_01.png";
    EnemyTypeNorm1wep1 =new Image();
    EnemyTypeNorm1wep2 = new Image();
    EnemyTypeNorm1wep1.src = "Images/Others/Mechs/weapon_left.png";
    EnemyTypeNorm1wep2.src = "Images/Others/Mechs/weapon_right.png";
    // bosses
    
    

    // WEAPON - CANNONS
    WepCannon1 = new Image();
    WepCannon1.src = "Images/Weapons/medium/cannon/turret_01_mk1.png";
    WepCannon2 = new Image();
    WepCannon2.src = "Images/Weapons/medium/cannon/turret_01_mk2.png";
    WepCannon3 = new Image();
    WepCannon3.src = "Images/Weapons/medium/cannon/turret_01_mk3.png";
    // WEAPON - LASERS
    WepLaser1 = new Image();
    WepLaser1.src = "Images/Weapons/medium/laser/turret_02_mk1.png";
    WepLaser2 = new Image();
    WepLaser2.src = "Images/Weapons/medium/laser/turret_02_mk2.png";
    WepLaser3 = new Image();
    WepLaser3.src = "Images/Weapons/medium/laser/turret_02_mk3.png";
    // WEAPON - MISSILES
    // WEAPON - PLASMA

    // PROJECTILES
    CannonProjectile = new Image();
    CannonProjectile.src = "Images/Projectiles/turret_01_bullet_01.png";

    //Start Game at first map
    MapLoad(1);
};
function MapLoad(MapLvl){
    InstantiatePlayer();
    //analogos to map na kanei generate allo ammount of enemies & types sto mellon
    var enemyWaves = 0 ;
    if(MapLvl==1){
        //na to kanw me waves???
        enemyWaves=5;
    }
    
    InstantiateEnemyWaves(enemyWaves);
};
function InstantiatePlayer(){
    PlayerShip = { 
        //location and size variables
        x : canvas.width/2,  // prin to eixa W/2 alla einai sto canvas prin to scale down (to -32 einai apo to miso width gia na bgenei pio kentro)
        y : canvas.height-150, //prin htan H-50, >>
        w : 64,
        h : 96,
        // Equippment Variables
        speed : 20,
        Ship : ShipLvl1,
        hp : 1,
        Weapon : WepCannon1,
        WepDmg : 1,
        WepFirerate : 250,
        //ftiaxnete prwth fora otan patithei to play, na balw kapoio animation gia na pigene sto spot anti apla na ksekinaei ekei
        draw : function(){
            // de kserw an kanei ontws kati
            cntx.imageSmoothingEnabled = true;
             //kapoio provlima exei an valw W/ H anti canvas.width/canvas.height, einai san na ksekinaei apo tin arxh tou page kai afinei katw parts tou canvas uncleared;
            //to metefera sto render function
            //cntx.clearRect(0,0,canvas.width,canvas.height);
            cntx.strokeStyle = "red";
            if(DisplayColBox == true){
                cntx.strokeRect(this.x,this.y,this.w,this.h);
            }
            
            //draw ship
            cntx.drawImage(PlayerShip.Ship,PlayerShip.x,PlayerShip.y,PlayerShip.w,PlayerShip.h)
            //save giati allios kindineuoume me puriniki katastrofh
            //cntx.save();
            //draw cannon on ship, some numerical adjustments to fit perfectly on the weapon base
            cntx.drawImage(PlayerShip.Weapon,PlayerShip.x,PlayerShip.y+30,PlayerShip.w,PlayerShip.h/2)
            
        },
        fire : function(){
                var b = new Projectile(PlayerShip.x,PlayerShip.y,30);
                PlayerProjectiles.push(b) // ebgala to this.
        }
    };
};
function InstantiateEnemyWaves(enemyWaves){
    
    
    for (let i=0; i<enemyWaves; i++) {
        setTimeout( function sleep(){
          var b = new  Enemy(i,-50,2);
          this.CurrentEnemies.push(b);
        }, i*1000 );
    }
}
function Enemy(x,y,s){
    //x : -canvas.width/2 - 64, // (to +64 einai to miso width, gia na bgenei pio kentro )
    
    this.x = x*70+canvas.width/2,
    this.y = y;
    this.s = s;
    this.w = 96;
    this.h = 96;
    this.state = true;
    this.hp = 1;
    this.ShipImg = EnemyTypeNorm1;
    this.ShipWep1Img = EnemyTypeNorm1wep1;
    this.ShipWep2Img = EnemyTypeNorm1wep2;
    this.draw = function(){
        //ship
        if(DisplayColBox == true){
            cntx.strokeStyle = "red";
            cntx.strokeRect(this.x,this.y,this.w,this.h);
        }
        cntx.drawImage(this.ShipImg,this.x,this.y,this.w,this.h);
        //weapon if anys
        cntx.drawImage(this.ShipWep1Img,this.x,this.y,this.w,this.h);
        cntx.drawImage(this.ShipWep2Img,this.x,this.y,this.w,this.h);
    }
    this.update = function(){
        this.y = this.y + this.s;
        if(this.y<=-50){
			this.state = false;
        }
    }           
}
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
window.onkeydown = function(e){
    var kc = e.keyCode;
    e.preventDefault();
    if(kc === 37) Keys.left = true;
    if(kc === 38) Keys.up = true;
    if(kc === 39) Keys.right = true;
    if(kc === 40) Keys.down = true;
    //firing button
    //if( kc=== 32) Keys.fire = true;
    if( kc === 32) {
        
        if(event.repeat){
            if(Keys.fire == false){
                Keys.fire = true;
                PlayerShip.fire();
                autofire = setInterval(function(){PlayerShip.fire();if(Keys.fire == false ){clearInterval(autofire)}}, PlayerShip.WepFirerate);
            }
        }
        else{
            PlayerShip.fire();
        }
    }
};
window.onkeyup = function(e){
    var kc = e.keyCode;
    e.preventDefault();
    if(kc===37) Keys.left = false;
    if(kc===38) Keys.up = false;
    if(kc===39) Keys.right = false;
    if(kc===40) Keys.down = false;
     //firing button
    if(kc=== 32 ) Keys.fire = false;
};
function PlayerMovement(){
    if(Keys.left){
        // an to location (x) pou einai to ship einai katw apo to paxos tou ploiou, valto sto x = paxos tou ploiou, kanonika tha ekana check me x <= 0 alla to miso ploio bgenei ektos canva
        if(!(PlayerShip.x <= PlayerShip.w/2)){
            PlayerShip.x -= PlayerShip.speed;
        }
    }
    if(Keys.right){
        //evala to 25 gia na einai omiomorfa, bakalistikos tropos mexri na vrethei kati reliable
        if(!(PlayerShip.x > canvas.width-PlayerShip.w-25)){
            PlayerShip.x += PlayerShip.speed;
        }
    }
    if(Keys.up){
        if(!(PlayerShip.y <= PlayerShip.h/2)){
            PlayerShip.y -= PlayerShip.speed;
        }
    }
    if(Keys.down){
        //evala to 25 gia na einai omiomorfa, bakalistikos tropos mexri na vrethei kati reliable
        if(!(PlayerShip.y > canvas.height-PlayerShip.h-25)){
            PlayerShip.y += PlayerShip.speed;
        }
    }    
};
// ###################################### 
// ######### PLAYER FIRING  ############# 
// ######################################

//x = location of ship , y = location of ship plus something higher , s = speed of projectile
function Projectile(x,y,s){
    this.x = x+16; // bakalistikos tropos na kanw center to projectile sto ship allios den einai aligned, de kserw akoma giati
    this.y = y;
    this.s = s;

    //to eixa this.state alla mallon to SetState douleuei
    this.state = true;
    this.w = 32; // projectile width;
    this.h = 32; // projectile height; na ta valw panw pali
    this.draw = function(){
        if(DisplayColBox == true){
            cntx.strokeStyle = "red";
            cntx.strokeRect(this.x,this.y,this.w,this.h);
        }
        cntx.drawImage(CannonProjectile,this.x,this.y,this.w,this.h);
        
    }
    this.update = function(){
        this.y -= this.s;
        if(this.y<=-50){
			this.state = false;
        }
    }
}
// ###################################### 
// ############    UPDATE    ############ 
// ######################################
var mincount=0;
function TimerUpdate(){
    TimerSeconds++;
    if(TimerSeconds>59){
        mincount++;
        TimerSeconds=0;
    }
    if(mincount==0){
        TimerText.textContent = "Time: " + TimerSeconds+"s";
    }else
    {
        TimerText.textContent ="Time: " + mincount+ "m " +TimerSeconds+"s";
    }
    
}
// updates positions on canvas and runs collision function

function UpdatePositions(){
    CurrentEnemies.forEach(function(Enemy){
        if(Enemy.state == true){
            Enemy.update(); 
            if(ShipCollision(PlayerShip,Enemy)){
               // game pause/over
               PlayerIsAlive=0;
            } 
        } 
    });

    
    PlayerProjectiles.forEach(function(Projectile){
        if(Projectile.state == true){    
        Projectile.update();
        CurrentEnemies.forEach(function(Enemy){
            if(ProjectileCollision(Projectile,Enemy)){

                //allo ana enemy type
                GameScore += 100;
                ScoreText.textContent = "Score : " + GameScore;
                
                //allagi state
                Projectile.state = false;
                Enemy.state = false;
                //aferei apo tin lista
                var index1 = CurrentEnemies.indexOf(Enemy);
                CurrentEnemies.splice(index1,1);
                var index2 = PlayerProjectiles.indexOf(Projectile);
                PlayerProjectiles.splice(index2,1);
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
}
function ShipCollision(s1,s2){
    //real hero https://stackoverflow.com/questions/17737587/2d-html5-canvas-collision-howto
    return !(s1.x>s2.x+s2.w || s1.x+s1.w<s2.x || s1.y>s2.y+s2.h || s1.y+s1.h<s2.y);
}
function ProjectileCollision(Proj,Ship){
    //console.log(Proj.w,Ship.w);
    return !(Proj.x>Ship.x+Ship.w || Proj.x+Proj.w<Ship.x || Proj.y>Ship.y+Ship.h || Proj.y+Proj.h<Ship.y);
} 

// ###################################### 
// ############  RENDERING   ############
// ######################################

var PlayerIsAlive = 1;
function Renderer(){
    cntx.clearRect(0,0,canvas.width,canvas.height);
    PlayerMovement();
    UpdatePositions();
    PlayerShip.draw();
    
    CurrentEnemies.forEach(function(Enemy){
        //if(Enemy.state == true){
            Enemy.draw();
        //}
    });
    PlayerProjectiles.forEach(function(Projectile){
      // if(Projectile.state == true){
            Projectile.draw();
        //}
    });
    //recalls itself if some PlayerIsAlive is met(game is not over), (player is alive or smth will do it later) ---- used setinterval on window.onload before, seems bad practise
    if( PlayerIsAlive == 1){
       window.requestAnimationFrame(Renderer);
    }
}
// ###################################### 
// ###########    UTILITY    ############ 
// ######################################

function DisplayCollisionBoxes(){
    DisplayColBox = true;
}

window.onload = function ()
    {
        Initialize();
        //start rendering process
        Renderer();
        
        //setInterval(PlayerShip.fire, PlayerShip.WepFirerate);
        //setInterval(Renderer,25);
        setInterval(TimerUpdate, 1000);
    }