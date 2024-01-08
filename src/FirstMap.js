import Phaser from "phaser";

import BaseMinnion from "./Classes/BaseMinnion";
import BaseTower from "./Classes/BaseTower";
import TowerPlace from "./Classes/TowerPlace";

export default class HelloWorldScene extends Phaser.Scene {
  constructor() {
    super("hello-world");
  }

  tower;
  towers = [];

  minnion;
  minnions = [];
  minnionCount = [];

  towerPlace;
  towerPlaces = [];

  startWaveButton;

  state = 0;

  ammountOfMinnions = 10;

  balance = 1000;
  balanceText;

  towerCost = 15;
  towerCostText;

  minnionReward = 5;

  preload() {
    this.load.baseURL = "assets/";

    this.load.image("map", "map.png");
    this.load.image("map2", "map2.png");
    this.load.image("map3", "map3.png");
    this.load.image("Minnion", "Minnion.png");
    this.load.image("StartWaveButton", "StartWaveButton.png");
    this.load.image("ElectricTowerBase", "ElectricTowerBase.png");
    this.load.image("TowerElectric", "TowerElectric.png");
    this.load.image("UIBG", "UIBG.png");
    this.load.image("Zombie", "Zombie.png");
    this.load.image("Projectile", "Lighter.png");

    this.load.atlas(
      "ATowerElectric",
      "TowerElectricAtlas.png",
      "TowerElectricAtlas.json"
    );
  }

  create() {
    this.add.image(0, 0, "map2").setOrigin(0, 0);

    this.createTowerPlaces();

    this.createPath();

    this.add.image(540, 1944, "UIBG");

    this.createStartWaveButton();

    this.handleInputs();
  }

  update(time, delta) {
    this.towers.forEach((element) => {
      element.update(time, delta, this.startWaveButton);
    });

  }

  populateTowersArray() {
    this.towerPlaces.forEach(element => {
      if (element.tower === undefined) return

      this.towers.push(element.tower);
    });
  }

  checkIfMinnionsFinished() {
    this.minnions.forEach((element) => {
      if (!element.isDead && element.isWalking) {
        if (element.pathTween.getValue() === 1) {
          this.finishWave(false);
        }
      }
    });
  }

  checkIfTowersFinished() {
    if (this.minnionCount.length === 0) {
      this.finishWave(true);
    }
  }

  finishWave(succesful) {
    this.state = 0;
    this.startWaveButton.setAlpha(1);
    this.resetMinnionArray();
    this.resetTowerArray();

    if (succesful) {
      this.balance += this.minnionReward * this.ammountOfMinnions;
      this.balanceText.text = `BALANCE: \n${this.balance}`;
    }
  }

  resetMinnionArray() {
    for (let i = 0; i < this.minnions.length; i++) {
      if (this.minnions[i] !== undefined) {
        this.minnions[i].destroy();
        this.minnions[i].isDead = true;
      }
    }
    this.minnions = [];
  }

  resetTowerArray() {
    for (let i = 0; i < this.towers.length; i++) {
      if (this.towers[i] !== undefined) {
        this.towers[i].destroy();
        this.towers[i].isDestroyed = true;
      }
    }
    this.towers = [];
  }

  createTowerPlaces() {
    this.createTowerPlace(972, 64);

    this.createTowerPlace(972, 280);

    this.createTowerPlace(972, 496);

    this.createTowerPlace(540, 280);

    this.createTowerPlace(324, 280);

    this.createTowerPlace(108, 496);

    this.createTowerPlace(108, 712);

    this.createTowerPlace(108, 1114);

    this.createTowerPlace(108, 1360);

    this.createTowerPlace(540, 712);

    this.createTowerPlace(540, 928);

    this.createTowerPlace(540, 1114);

    this.createTowerPlace(754, 1114);

    this.createTowerPlace(324, 1574);

    this.createTowerPlace(756, 1574);
  }

  createTowerPlace(x, y) {
    this.towerPlace = new TowerPlace(this, x, y, "ElectricTowerBase");
    this.add.existing(this.towerPlace);
    this.towerPlaces.push(this.towerPlace);
  }

  createDraggableTowerButton() {
    this.towerButton = this.add.image(704, 2700, "TowerPicker").setScale(2, 2);
    this.towerButton.setInteractive();
    this.towerButton.on("pointerdown", (pointer, gameObject) => {
      if (this.state === 0) {
        this.draggableTower = this.add
          .image(pointer.x, pointer.y, "TowerDraggable")
          .setScale(2, 2);
        this.draggableTower.setAlpha(0.7);
        this.canDragTower = true;
      }
    });
  }

  createStartWaveButton() {
    this.startWaveButton = this.add.image(900, 2000, "StartWaveButton");
    this.startWaveButton.setInteractive();

    this.startWaveButton.on("pointerdown", () => {
      this.randomizeAmountOfMinnions();
      this.startWaveButtonClicked();
    });
  }

  startWaveButtonClicked() {
    this.spawnMinnions(this.ammountOfMinnions);

    this.startWaveButton.setAlpha(0);

    this.populateTowersArray();

    this.setMinnionTargetsToTowers();

    this.state = 1;
  }

  randomizeAmountOfMinnions() {
    this.ammountOfMinnions = Phaser.Math.Between(1, 30);
  }

  handleInputs() {
    this.input.on("pointerup", (pointer, gameObject) => {});

    this.input.on("pointerdown", (pointer) => {});

    this.input.on("pointermove", () => {});
  }

  createPath() {
    this.graphics = this.add.graphics();
    this.graphics.lineStyle(10, 0xffffff, 1);

    this.path = new Phaser.Curves.Path(756, -64);
    this.path.lineTo(762, 550);
    this.path.lineTo(330, 550);
    this.path.lineTo(330, 1414);
    this.path.lineTo(1144, 1414);

    this.path.draw(this.graphics);
  }

  spawnMinnions(minnionCount) {
    for (let i = 0; i < minnionCount; i++) {
      this.minnionCount.push(1);
      this.minnion = new BaseMinnion(this, this.path, 756, -64, "Zombie", 8000);

      this.add.existing(this.minnion);
      this.minnions.push(this.minnion);
      if (this.minnions[i] !== undefined) {
        this.minnions[i].startWalking(i);
      }
    }
  }

  setMinnionTargetsToTowers() {
    for (let i = 0; i < this.towers.length; i++) {
      this.towers[i].shootMinnion(this.minnions, i, this.minnionCount, this);
    }
  }
}
