export default class MinnionParent extends Phaser.GameObjects.PathFollower {
  walkingSpeed;
  isDead;
  isWalking;
  scene;

  constructor(scene, path, x, y, texture, speed) {
    super(scene, path, x, y, texture);
    this.setScale(2, 2);
    this.walkingSpeed = speed * 1000;
    this.isDead = false;
    this.isWalking = false;
    this.scene = scene;
    this.coins = 0;

    this.setDepth(5);
    
  }

  startWalking(iteration) {
    this.scene.time.delayedCall(iteration * 400, () => {
      if (!this.isDead) {
        this.startFollow({
          duration: this.walkingSpeed,
          rotateToPath: false,
          repeat: 0,
          onComplete: () => {
            if(!this.isDead) this.scene.finishWave(false);
          },
        });
        this.isWalking = true;
      }
    });
  }
}
