export default class MinnionParent extends Phaser.GameObjects.PathFollower {
  walkingSpeed;
  isDead;
  isWalking;
  scene

  constructor(scene, path, x, y, texture, speed) {
    super(scene, path, x, y, texture);
    this.setScale(2, 2);
    this.walkingSpeed = speed;
    this.isDead = false;
    this.isWalking = false;
    this.scene = scene
  }

  startWalking(iteration) {
    this.scene.time.delayedCall(iteration * 700, () => {
      if(!this.isDead){

        this.startFollow({
          duration: this.walkingSpeed,
          rotateToPath: false,
          repeat: 0,
          onComplete: () => {
            this.scene.finishWave(false);
          },
        });
        this.isWalking = true;
      }
    });
  }
}
