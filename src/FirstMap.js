import Phaser from "phaser";

import BaseMinnion from "./Classes/BaseMinnion";
import BaseTower from "./Classes/BaseTower";

export default class HelloWorldScene extends Phaser.Scene {
  constructor() {
    super("hello-world");
  }

  tower;
  towers = [];

  minnion;
  minnions = [];
  minnionCount = [];

  startWaveButton;

  state = 0;

  ammountOfMinnions = 10;

  balance = 1000;
  balanceText;

  towerCost = 15;
  towerCostText;

  minnionReward = 5;

  preload() {
    this.load.image("map", "assets/map.png");
    this.load.image("TowerPicker", "assets/TowerPicker.png");
    this.load.image("TowerDraggable", "assets/TowerDraggable.png");
    this.load.image(
      "TowerDraggableShooting",
      "assets/TowerDraggableShooting.png"
    );
    this.load.image("Minnion", "assets/Minnion.png");
    this.load.image("StartWaveButton", "assets/StartWaveButton.png");
  }

  create() {
    this.add.image(0, 0, "map").setOrigin(0, 0);

    this.towerGroup = this.add.group();
    this.minnionGroup = this.add.group();

    this.createDraggableTowerButton();

    this.handleInputs();

    this.createPath();

    this.createStartWaveButton();

    this.balanceText = this.add.text(80, 2620, `BALANCE: \n${this.balance}`, {
      fontSize: "60px",
      strokeThickness: 5,
    });

    this.towerCostText = this.add.text(550, 2520, `Cost: ${this.towerCost}`, {
      fontSize: "60px",
      strokeThickness: 5,
    });
  }

  update(time, delta) {
    this.rotateTowers();

    if (this.state === 1) {
      this.checkIfMinnionsFinished();
      this.checkIfTowersFinished();
    }
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
    this.startWaveButton = this.add.image(1200, 2690, "StartWaveButton");
    this.startWaveButton.setInteractive();

    this.startWaveButton.on("pointerdown", () => {
      this.randomizeAmountOfMinnions();
      this.startWaveButtonClicked();
    });
  }

  startWaveButtonClicked() {
    this.spawnMinnions(this.ammountOfMinnions);

    this.startWaveButton.setAlpha(0);

    this.setMinnionTargetsToTowers();

    this.state = 1;
  }

  randomizeAmountOfMinnions() {
    this.ammountOfMinnions = Phaser.Math.Between(1, 30);
  }

  handleInputs() {
    this.input.on("pointerup", (pointer, gameObject) => {
      if (!this.canDragTower) return;

      this.canDragTower = false;
      this.draggableTower.destroy();

      this.createTower(pointer.x, pointer.y);
      this.balance -= this.towerCost;
      this.balanceText.text = `BALANCE: \n${this.balance}`;
    });

    this.input.on("pointerdown", (pointer) => {});

    this.input.on("pointermove", () => {
      if (this.canDragTower) {
        this.draggableTower.x = this.input.x;
        this.draggableTower.y = this.input.y;
      }
    });
  }

  createTower(x, y) {
    this.tower = new BaseTower(this, x, y, "TowerDraggable");
    this.add.existing(this.tower);
    this.towers.push(this.tower);
  }

  rotateTowers() {
    if (this.state === 1) {
      for (let i = 0; i < this.towers.length; i++) {
        this.towers[i].rotateTower(this.minnions[0]);
      }
    }
  }

  createPath() {
    this.graphics = this.add.graphics();
    this.graphics.lineStyle(10, 0xffffff, 1);

    this.path = new Phaser.Curves.Path(-40, 400);
    this.path.lineTo(500, 400);
    this.path.lineTo(500, 1000);
    this.path.lineTo(1000, 1000);
    this.path.lineTo(1000, 1660);
    this.path.lineTo(652, 1660);
    this.path.lineTo(652, 2000);
    this.path.lineTo(-40, 2000);

    this.path.draw(this.graphics);
  }

  spawnMinnions(minnionCount) {
    for (let i = 0; i < minnionCount; i++) {
      this.minnionCount.push(1);
      this.minnion = new BaseMinnion(
        this,
        this.path,
        -40,
        400,
        "Minnion",
        8000
      );

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
