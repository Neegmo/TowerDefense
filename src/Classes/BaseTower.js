import TowerParent from "./TowerParent";

export default class BaseTower extends TowerParent {
  projectile;
  projectiles = [];
  scene;

  canShoot = false;
  constructor(scene, x, y, texture) {
    super(scene, x, y, texture, 5);
    this.scene = scene;
    scene.input.on("pointerdown", () => {});

    this.graphics = scene.add.graphics();
  }

  update(time, delta, target) {
    // console.log();
    // this.projectiles.forEach((element) => {
    //   if (element === undefined) return;

    //   this.moveProjectileTwordsTarget(element);

    //   element.lerpStep += delta / 500;
    // });
    this.shootMinnionV3();
  }

  enableShootingAfterDelay() {
    this.scene.time.delayedCall(1000, () => {
      this.canShoot = true;
    });
  }

  shootMinnion(target, iteration) {
    for (let i = 0; i < this.amountOfBullets; i++) {
      var delay = i * 1000 + iteration * 3000;
      this.scene.time.delayedCall(1000 + delay, () => {
        var index = i + iteration * this.amountOfBullets;
        if (target[index] !== undefined) {
          this.shootBeam(target[index]);

          this.killMinnion(target[index]);
        }
      });
    }
  }

  shootMinnionV2(target, iteration, towerCount) {
    for (let i = 0; i < this.amountOfBullets; i++) {
      var delay = iteration * 500 + i * 1800;
      if (this.scene.time === undefined) return;
      this.scene.time.delayedCall(1800 + delay, () => {
        var index = iteration + i * towerCount;
        if (target[index] !== undefined) {
          this.shootBeam(target[index]);

          this.killMinnion(target[index]);
        }
      });
    }
  }

  shootMinnionV3() {
    if (this.scene === undefined) return;
    if (this.scene.minnions.length < 1) {
      this.scene.finishWave(true);
      return;
    }

    if (
      Phaser.Math.Distance.Between(
        this.x,
        this.y,
        this.scene.minnions[0].x,
        this.scene.minnions[0].y
      ) < 400 &&
      this.canShoot &&
      this.ammo > 0
    ) {
      this.shootBeam(this.scene.minnions[0]);
      this.killMinnion(this.scene.minnions[0]);
      this.canShoot = false;
      if (this.scene.time === undefined) return;
      this.scene.time.delayedCall(700, () => {
        if (this === undefined) return;
        this.canShoot = true;
        if (this.scene.minnionCount.length < 1) this.scene.finishWave(true);
      });
    }
  }

  shootBeam(minnion) {
    this.graphics.lineStyle(10, 0x27aae1, 1);
    this.graphics.setDepth(30);
    this.path = new Phaser.Curves.Path(this.x, this.y - 110);
    this.path.lineTo(minnion.x, minnion.y);
    this.path.draw(this.graphics);
    this.updateAmmoText();

    this.scene.time.delayedCall(100, () => {
      this.graphics.clear();
    });
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
    if (this.scene.minnionCount.length < 1) this.scene.finishWave(true);
  }

  killMinnion(minnion) {
    var deadAnim = this.scene.add.sprite(
      this.scene.minnions[0].x,
      this.scene.minnions[0].y,
      "DeadAnimation"
    );
    deadAnim.setDepth(1);
    deadAnim.play("ZombieDead");
    deadAnim.on("animationcomplete", () => {
      deadAnim.destroy();
    });
    this.scene.minnions[0].stopFollow();
    this.scene.minnions[0].destroy();
    this.scene.minnions[0].isDead = true;
    this.scene.minnions.shift();
    this.scene.minnionCount.pop();
    // if (this.scene.minnionCount.length < 1) this.scene.finishWave(true);
  }

  lerp(start, end, amt) {
    return (1 - amt) * start + amt * end;
  }
}
