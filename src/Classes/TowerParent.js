export default class TowerParent extends Phaser.GameObjects.Image {
  amountOfBullets;
  isDestroyed;
  constructor(scene, x, y, texture, amountOfBullets) {
    super(scene, x, y, texture);
    this.setScale(2, 2);
    this.amountOfBullets = amountOfBullets;
    this.isDestroyed = false;
  }

  rotateTower(target) {
    this.rotation = Phaser.Math.Angle.BetweenPoints(this, target);
  }

  shootMinnion(target, iteration, minnionCount, scene) {
    for (let i = 0; i < this.amountOfBullets; i++) {
      var delay = +i * 1000 + iteration * 3000;
      scene.time.delayedCall(1800 + delay, () => {
        var index = i + iteration * this.amountOfBullets;
        if (target[index] !== undefined) {
          target[index].destroy();
          target[index].isDead = true;
          this.setTexture("TowerDraggableShooting");
          minnionCount.shift();
        }
      });
      scene.time.delayedCall(2000 + delay, () => {
        if(!this.isDestroyed)
        this.setTexture("TowerDraggable");
      });
    }
  }
}
