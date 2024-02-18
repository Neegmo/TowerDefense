import TowerParent from "./TowerParent";

export default class BaseTower extends TowerParent {
  projectile;
  projectiles = [];
  scene;
  constructor(scene, x, y, texture) {
    super(scene, x, y, texture, 5);
    this.scene = scene;
    scene.input.on("pointerdown", () => {});
  }

  update(time, delta, target) {
    console.log();
    this.projectiles.forEach((element) => {
      if (element === undefined) return;

      this.moveProjectileTwordsTarget(element);

      element.lerpStep += delta / 500;
    });
  }

  shootMinnion(target, iteration, scene) {
    for (let i = 0; i < this.amountOfBullets; i++) {
      var delay = i * 1000 + iteration * 3000;
      scene.time.delayedCall(1000 + delay, () => {
        var index = i + iteration * this.amountOfBullets;
        if (target[index] !== undefined) {
          this.createProjectile(target[index]);


          this.updateAmmoText();
        }
      });
    }
  }

  createProjectile(target) {
    this.projectile = {
      gameObject: this.scene.add.sprite(this.x, this.y - 100, "Projectile"),

      startX: this.x,
      startY: this.y - 100,
      target: target,
      lerpStep: 0,
      isFinished: false,
    };

    this.projectiles.push(this.projectile);
  }

  moveProjectileTwordsTarget(projectile) {
    if (projectile.isFinished) return;
    if (projectile.lerpStep >= 1) {
      this.projectileReachedTheTarget(projectile);
    }
    projectile.gameObject.x = this.lerp(
      projectile.startX,
      projectile.target.x,
      projectile.lerpStep
    );
    projectile.gameObject.y = this.lerp(
      projectile.startY,
      projectile.target.y,
      projectile.lerpStep
    );
  }

  projectileReachedTheTarget(projectile) {
    projectile.gameObject.destroy();
    projectile.target.stopFollow();
    projectile.target.destroy();
    projectile.target.isDead = true;
    this.scene.minnionCount.pop();
    projectile.isFinished = true;
    if(this.scene.minnionCount.length < 1) this.scene.finishWave(true);
  }

  lerp(start, end, amt) {
    return (1 - amt) * start + amt * end;
  }
}
