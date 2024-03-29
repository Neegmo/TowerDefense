export default class TowerParent extends Phaser.GameObjects.Image {
  amountOfBullets;
  isDestroyed;
  ammo;
  ammoText;
  constructor(scene, x, y, texture, amountOfBullets) {
    super(scene, x, y, texture);
    this.amountOfBullets = amountOfBullets;
    this.isDestroyed = false;
    this.ammo = amountOfBullets;

    this.setInteractive();

    this.setDepth(10)

    this.on("pointerup", () => {
      this.destroy();
      this.ammoText.destroy();
      scene.numberOfTowers--;
      scene.totalBetText.text = `${scene.bet*scene.numberOfTowers}`
      scene.chanceToWinText.text = `${scene.winChanceSequence[scene.numberOfTowers]}`
    })

  }
  

  generateAmmoText() {
    this.ammoText = this.scene.add.text(
      this.x - 52,
      this.y + 15,
      `${this.ammo}`,
      {
        fontSize: "45px",
        fontFamily: "troika",
        strokeThickness: 4,
        stroke: "#000000",
      }
    );
    this.ammoText.setDepth(11)
  }

  updateAmmoText() {
    this.ammo--;
    this.ammoText.text = `${this.ammo}`;

    if(this.ammo <= 0) {
      this.setTexture("DrainedTower")
    }
  }
}
