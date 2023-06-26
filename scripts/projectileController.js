class ProjectileController {
  projectiles = [];
  canvas = null;

  constructor(canvas) {
    this.canvas = canvas;
  };

  shoot(proj) {
    this.projectiles.push(new Projectile(proj.x, proj.y, proj.speed, 1))
  };

  draw(context) {
    this.projectiles.forEach((proj) => {

      if (this.isProjOffScreen(proj)) {
        const index = this.projectiles.indexOf(proj);
        this.projectiles.splice(index, 1);
      }
      proj.draw(context);
    })
  };

  isProjOffScreen(projectile) {
    // TODO: check direction aswell
    return projectile.y <= projectile.height;
  };
}

class Projectile {
  constructor(x, y, speed, damage) {
    this.x = x - 16;
    this.y = y;
    this.speed = speed;
    this.damage = damage;

    this.width = 32;
    this.height = 32;
    this.color = "red";
    this.direction = "upwards";
  }

  draw(context) {
    context.fillStyle = this.color;
    this.y -= this.speed;
    context.fillRect(this.x, this.y, this.width, this.height);

    // 		if (isDebugging) {
    // 			context.strokeStyle = "red";
    // 			context.strokeRect(this.x, this.y, this.width, this.height);
    // 		}
  }
}