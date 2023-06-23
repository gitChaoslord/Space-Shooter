class Player {
  x = 0;
  y = 0;
  level = 1;
  texture = null;
  speed = 20;
  size = {
    width: 64,
    height: 96
  };
  weapon = {
    level: 1,
    texture: null,
    projectile: {
      speed: 1,
      texture: null
    },
    damage: 1,
    fireRate: 25,
    type: 'laser'
  };
  isMovingUp = false;
  isMovingLeft = false;
  isMovingRight = false;
  isMovingDown = false;
  isFiring = false;


  // TODO: maybe define more
  constructor({ x, y, projectileController }) {
    this.x = x;
    this.y = y;
    this.projectileController = projectileController;

    const shipImage = new Image();
    shipImage.src = "./assets/images/Ships/Medium/body_01.png";
    this.texture = shipImage

    const weaponImage = new Image();
    weaponImage.src = "./assets/images/Weapons/Medium/Laser/turret_02_mk1.png";
    this.weapon.texture = weaponImage;


    document.addEventListener('keydown', this.keydown);
    document.addEventListener('keyup', this.keyup);
  }

  move() {
    if (this.isMovingUp) {
      if (!(this.y <= this.size.height / 2)) {
        this.y -= this.speed;
      }
    }

    if (this.isMovingLeft) {
      if (!(this.x <= this.size.width / 2)) {
        this.x -= this.speed;
      }
    }

    if (this.isMovingRight) {
      if (!(this.x > canvas.width - this.size.width - 25)) {
        this.x += this.speed;
      }
    }

    if (this.isMovingDown) {
      if (!(this.y > canvas.height - this.size.height - 25)) {
        this.y += this.speed;
      }
    }

  };

  draw(context) {
    this.move();
    this.shoot();
    context.imageSmoothingEnabled = true;
    context.strokeStyle = "red";

    if (isDebugging) {
      context.strokeRect(this.x, this.y, this.size.width, this.size.height);
    }

    context.drawImage(this.texture, this.x, this.y, this.size.width, this.size.height); // Draw Ship
    context.drawImage(this.weapon.texture, this.x, this.y + 30, this.size.width, this.size.height / 2); // Draw Weapon
  };

  shoot() {
    if (this.isFiring) {
      const projPos = {
        x: this.x + this.size.width / 2,
        y: this.y
      };
      const projSize = {
        width: 32,
        height: 32
      }
      const speed = 30;
      const damage = 1;
      const damageType = 'laser';
      const direction = 'upwards'; // could do degrees or smth else

      this.projectileController.shoot({
        x: projPos.x,
        y: projPos.y,
        speed: speed,
        damage: damage
      })

    }
  };

  keydown = (e) => {
    const code = e.keyCode;
    e.preventDefault();
    if (code === 38 || code === 87) this.isMovingUp = true;
    if (code === 37 || code === 65) this.isMovingLeft = true;
    if (code === 39 || code === 68) this.isMovingRight = true;
    if (code === 40 || code === 83) this.isMovingDown = true;
    if (code === 32) this.isFiring = true;
  };

  keyup = (e) => {
    const code = e.keyCode;
    e.preventDefault();
    if (code === 38 || code === 87) this.isMovingUp = false;
    if (code === 37 || code === 65) this.isMovingLeft = false;
    if (code === 39 || code === 68) this.isMovingRight = false;
    if (code === 40 || code === 83) this.isMovingDown = false;
    if (code === 32) this.isFiring = false;
  };
}