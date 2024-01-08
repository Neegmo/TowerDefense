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

    this.on("pointerup", () => {
      this.destroy();
      this.ammoText.destroy();
    })
  }


  

  generateAmmoText() {
    this.ammoText = this.scene.add.text(
      this.x - 50,
      this.y - 150,
      `${this.ammo}`,
      {
        fontSize: "70px",
        strokeThickness: 7,
      }
    );
  }

  updateAmmoText() {
    this.ammo--;
    this.ammoText.text = `${this.ammo}`;
  }
}
