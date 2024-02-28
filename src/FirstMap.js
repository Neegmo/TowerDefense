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
  populatedTowerPlaces = [];

  startWaveButton;

  state = 0;

  ammountOfMinnions = 10;

  balance = 1000;
  balanceText;

  towerCost = 15;
  towerCostText;

  minnionReward = 5;

  bet = 10;
  betText;
  totalBetText;
  IncreaseBetBtn;
  DecreaseBetBtn;

  winChanceSequence = [
    "0%",
    "5.88%",
    "11.76%",
    "17.65%",
    "23.53%",
    "29.41%",
    "35.29%",
    "41.18%",
    "47.06%",
    "52.94%",
    "58.82%",
    "64.71%",
    "70.59%",
    "76.47%",
    "82.35%",
    "88.24%",
  ];

  aditionalCoinsSequence = [
    0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
    3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3,
    3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5,
    5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 6, 6,
    6, 6, 6, 6, 6, 6, 6, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 8, 8, 8, 8, 8,
    8, 8, 8, 8, 8, 8, 9, 10, 12, 13, 14, 15, 15, 15, 15, 15, 15, 15, 16, 16, 16,
    16, 16, 17, 18, 19, 20, 30, 50, 60, 100, 160,
  ];

  totalWinText;
  chanceToWinText;

  chest;

  numberOfTowers = 0;

  preload() {
    this.loadFont("troika", "assets/troika.otf");

    this.load.baseURL = "assets/";

    this.load.image("map", "BGV2.png");
    this.load.image("StartWaveButton", "StartWaveButtonV2.png");
    this.load.image("ElectricTowerBase", "TowerPlace.png");
    this.load.image("TowerElectric", "TowerElectricV2.png");
    this.load.image("UIBG", "UIPanelV2.png");
    this.load.image("Zombie", "Zombie.png");
    this.load.image("Projectile", "Lighter.png");
    this.load.image("Chest", "Chest.png");
    this.load.image("IncreaseBetBtn", "IncreaseBetBtn.png");
    this.load.image("DecreaseBetBtn", "DecreaseBetBtn.png");
    this.load.image("Panel", "Panel.png");
    this.load.image("ZombieHead", "ZombieHead.png");
    this.load.image("Coin", "Coin.png");
    this.load.image("Heart", "Heart.png");

    // this.load.atlas(
    //   "ATowerElectric",
    //   "TowerElectricAtlas.png",
    //   "TowerElectricAtlas.json"
    // );
  }

  create() {
    this.resetVariables();

    this.add.image(0, 0, "map").setOrigin(0, 0);

    this.createTowerPlaces();

    this.createPath();

    this.add.image(540, 1944, "UIBG");

    this.createStartWaveButton();

    this.handleInputs();

    this.createChest();

    this.createBetText();
    this.createChangeBetButtons();

    this.createTotalBetText();

    this.createHUD();

    this.createBalanceText();

    this.resetWaveButton = this.add.image(980, 1600, "Coin").setScale(0.8, 0.8);
    this.resetWaveButton.setInteractive();
    this.resetWaveButton.on("pointerup", () => {
      for (let i = 0; i < this.populatedTowerPlaces.length; i++) {
        if (this.populatedTowerPlaces[i] === 1) this.towerPlaces[i].addTower();
      }
    });
  }

  update(time, delta) {
    this.towers.forEach((element) => {
      element.update(time, delta, this.startWaveButton);
    });

    console.log(this.minnionCount.length);
  }

  createBalanceText() {
    this.balanceText = this.add.text(250, 2050, `${this.balance}`, {
      fontSize: "60px",
      strokeThickness: 7,
    });
  }

  createHUD() {
    this.add
      .text(190, 40, "Wave length", {
        fontSize: "45px",
        strokeThickness: 4,
        stroke: "#000000",
      })
      .setDepth(91)
      .setOrigin(0.5, 0.5)
      .setColor("#000000");
    this.add.image(200, 150, "Panel").setDepth(90);
    this.add
      .text(190, 125, "1-85", {
        fontSize: "40px",
        strokeThickness: 5,
      })
      .setDepth(91);
    this.add.image(90, 150, "ZombieHead").setScale(0.8, 0.8).setDepth(92);

    this.add.image(550, 150, "Panel").setDepth(90);
    this.chanceToWinText = this.add
      .text(515, 125, `${this.winChanceSequence[0]}`, {
        fontSize: "40px",
        strokeThickness: 5,
      })
      .setDepth(91);
    this.add.image(440, 150, "Heart").setScale(0.7, 0.7).setDepth(92);

    this.add.image(900, 150, "Panel").setDepth(90);
    this.totalWinText = this.add
      .text(890, 125, "160", {
        fontSize: "40px",
        strokeThickness: 5,
      })
      .setDepth(91);
    this.add.image(790, 150, "Coin").setScale(0.8, 0.8).setDepth(92);
  }

  createTotalBetText() {
    this.totalBetText = this.add.text(
      750,
      1885,
      `${this.bet * this.numberOfTowers}`,
      {
        fontSize: "60px",
        strokeThickness: 7,
      }
    );
  }

  createBetText() {
    this.betText = this.add.text(285, 1885, `${this.bet}`, {
      fontSize: "60px",
      strokeThickness: 7,
    });
  }

  createChangeBetButtons() {
    this.IncreaseBetBtn = this.add
      .image(440, 1920, "IncreaseBetBtn")
      .setInteractive();
    this.IncreaseBetBtn.on("pointerdown", () => {
      this.bet += 10;
      this.betText.text = `${this.bet}`;
      this.totalBetText.text = `${this.bet * this.numberOfTowers}`;
      this.totalWinText.text = `${this.bet * 16}`;
    });

    this.DecreaseBetBtn = this.add
      .image(190, 1920, "DecreaseBetBtn")
      .setInteractive();
    this.DecreaseBetBtn.on("pointerdown", () => {
      this.bet -= 10;
      this.betText.text = `${this.bet}`;
      this.totalBetText.text = `${this.bet * this.numberOfTowers}`;
      this.totalWinText.text = `${this.bet * 16}`;
    });
  }

  createChest() {
    this.chest = this.add.sprite(980, 1400, "Chest").setScale(0.6, 0.6);
  }

  populateTowersArray() {
    this.towerPlaces.forEach((element) => {
      if (element.tower === undefined) return;

      this.towers.push(element.tower);
    });

    for (let i = 0; i < this.towerPlaces.length; i++) {
      if (this.towerPlaces[i].tower === undefined)
        this.populatedTowerPlaces[i] = 0;
      else this.populatedTowerPlaces[i] = 1;
    }

    console.log(this.populatedTowerPlaces);
  }

  finishWave(succesful) {
    this.state = 0;
    this.startWaveButton.setAlpha(1);
    this.resetMinnionArray();
    this.resetTowerArray();
    this.numberOfTowers = 0;

    if (succesful) {
      this.balance += this.bet * 16;
      this.balanceText.text = `${this.balance}`;
    }

    this.scene.restart();
  }

  resetMinnionArray() {
    for (let i = 0; i < this.minnions.length; i++) {
      if (this.minnions[i] !== undefined) {
        this.minnions[i].stopFollow();
        this.minnions[i].destroy();
        this.minnions[i].isDead = true;
      }
    }
    this.minnions = [];
    this.minnionCount = [];
  }

  resetTowerArray() {
    for (let i = 0; i < this.towers.length; i++) {
      if (this.towers[i] !== undefined) {
        this.towers[i].projectiles = [];
        this.towers[i].destroy();
        this.towers[i].ammoText.destroy();
        this.towers[i].isDestroyed = true;
      }
    }
    this.towers = [];
  }

  createTowerPlaces() {
    this.createTowerPlace(588, 315);

    this.createTowerPlace(955, 430);

    this.createTowerPlace(935, 675);

    this.createTowerPlace(740, 800);

    this.createTowerPlace(445, 465);

    this.createTowerPlace(250, 600);

    this.createTowerPlace(245, 870);

    this.createTowerPlace(600, 965);

    this.createTowerPlace(175, 1125);

    this.createTowerPlace(645, 1230);

    this.createTowerPlace(225, 1385);

    this.createTowerPlace(415, 1565);

    this.createTowerPlace(615, 1565);

    this.createTowerPlace(815, 1565);

    this.createTowerPlace(900, 1230);
  }

  createTowerPlace(x, y) {
    this.towerPlace = new TowerPlace(this, x, y, "ElectricTowerBase");
    this.add.existing(this.towerPlace);
    this.towerPlaces.push(this.towerPlace);
  }

  createStartWaveButton() {
    this.startWaveButton = this.add.image(780, 2070, "StartWaveButton");
    this.startWaveButton.setInteractive();

    this.startWaveButton.on("pointerdown", () => {
      this.randomizeAmountOfMinnions();
      this.startWaveButtonClicked();
    });
  }

  startWaveButtonClicked() {
    if (this.numberOfTowers === 0) return;
    this.spawnMinnions(this.ammountOfMinnions);

    this.startWaveButton.setAlpha(0);

    this.populateTowersArray();

    this.setMinnionTargetsToTowers();

    this.state = 1;
    this.balance -= this.bet * this.numberOfTowers;
    this.balanceText.text = `${this.balance}`;
  }

  randomizeAmountOfMinnions() {
    this.ammountOfMinnions = Phaser.Math.Between(1, 85);
  }

  handleInputs() {
    this.input.on("pointerup", (pointer, gameObject) => {});

    this.input.on("pointerdown", (pointer) => {});

    this.input.on("pointermove", () => {});
  }

  createPath() {
    this.graphics = this.add.graphics();
    this.graphics.lineStyle(10, 0xffffff, 1);

    this.path = new Phaser.Curves.Path(762, -64);
    this.path.lineTo(762, 650);
    this.path.lineTo(425, 650);
    this.path.lineTo(425, 1400);
    this.path.lineTo(950, 1400);

    // this.path.draw(this.graphics);
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
      this.towers[i].shootMinnion(this.minnions, i, this);
    }
  }

  resetVariables() {
    this.towers = [];
    this.minnions = [];
    this.minnionCount = [];
    this.towerPlaces = [];
    this.state = 0;
    this.ammountOfMinnions = 10;
    this.towerCost = 15;
  }

  loadFont(name, url) {
    var newFont = new FontFace(name, `url(${url})`);
    newFont
      .load()
      .then(function (loaded) {
        document.fonts.add(loaded);
      })
      .catch(function (error) {
        return error;
      });
  }
}
