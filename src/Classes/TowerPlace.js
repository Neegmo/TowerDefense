import BaseTower from "./BaseTower";

export default class TowerPlace extends Phaser.GameObjects.Image {

    tower = undefined;

    constructor(scene, x, y, texture) {
      super(scene, x, y, texture);

      this.setInteractive();
      this.scene = scene

      this.on("pointerup", (pointer, gameobject) => {
        this.addTower()
      })

      
    }

    addTower() {
      this.tower = new BaseTower(this.scene, this.x, this.y - 64, "TowerElectric");
      this.scene.add.existing(this.tower)
      this.tower.generateAmmoText();
      this.scene.numberOfTowers++;
      this.scene.totalBetText.text = `${this.scene.bet*this.scene.numberOfTowers}`
      this.scene.chanceToWinText.text = `${this.scene.winChanceSequence[this.scene.numberOfTowers]}`
    }
  
    
  }
  