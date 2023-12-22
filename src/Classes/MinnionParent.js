export default class MinnionParent extends Phaser.GameObjects.PathFollower {
  walkingSpeed;
  isDead;
  isWalking;

  constructor(scene, path, x, y, texture, speed) {
    super(scene, path, x, y, texture);
    this.setScale(3, 3);

    this.walkingSpeed = speed;
    this.isDead = false;
    this.isWalking = false;
  }

  startWalking(iteration) {
    this.scene.time.delayedCall(iteration * 700, () => {
      if(!this.isDead){

        this.startFollow({
          duration: this.walkingSpeed,
          rotateToPath: true,
          repeat: 0,
        });
        this.isWalking = true;
      }
    });
  }
}
