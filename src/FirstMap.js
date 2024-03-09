import Phaser from "phaser";

import BaseMinnion from "./Classes/BaseMinnion";
import BaseTower from "./Classes/BaseTower";
import TowerPlace from "./Classes/TowerPlace";

import TestClass from "./Classes/TestClass";

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

  totalWin = 160;
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
    this.load.image("ResetTowersButton", "ResetTowersButton.png");

    this.load.spritesheet("DeadAnimation", "DeadAnimation.png", {
      frameWidth: 164,
      frameHeight: 155,
    });

    this.load.spritesheet(
      "ZombieWalkingForwardSpritesheet",
      "ZombieWalkingForwardSpritesheet.png",
      {
        frameWidth: 160,
        frameHeight: 162,
      }
    );

    this.load.spritesheet("WinSpritesheet1", "WinSpritesheet1.png", {
      frameWidth: 805,
      frameHeight: 572,
    });

    this.load.spritesheet("WinSpritesheet2", "WinSpritesheet2.png", {
      frameWidth: 805,
      frameHeight: 572,
    });

    this.load.spritesheet("WinSpritesheet3", "WinSpritesheet3.png", {
      frameWidth: 805,
      frameHeight: 572,
    });

    this.load.spritesheet("WinSpritesheet4", "WinSpritesheet4.png", {
      frameWidth: 805,
      frameHeight: 572,
    });

    this.load.spritesheet("LoseSpritesheet1", "LoseSpritesheet1.png", {
      frameWidth: 662,
      frameHeight: 770,
    });

    this.load.spritesheet("LoseSpritesheet2", "LoseSpritesheet2.png", {
      frameWidth: 662,
      frameHeight: 770,
    });

    // this.load.atlas(
    //   "ATowerElectric",
    //   "TowerElectricAtlas.png",
    //   "TowerElectricAtlas.json"
    // );
  }

  create() {
    this.waveFinished = false;

    console.log(this.aditionalCoinsSequence.length);

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

    this.createResetWaveButton();

    this.createBonusWinText();

    // this.physics.add.image(500, 500, "TowerElectric")

    this.anims.create({
      key: "ZombieDead",
      frames: "DeadAnimation",
      repeat: 0,
    });

    this.anims.create({
      key: "ZombieWalkingForward",
      frames: "ZombieWalkingForwardSpritesheet",
      repeat: -1,
    });

    this.anims.create({
      key: "WinAnimation",
      frames: [
        ...this.anims.generateFrameNames("WinSpritesheet1", {
          start: 0,
          end: 19,
        }),
        ...this.anims.generateFrameNames("WinSpritesheet2", {
          start: 0,
          end: 19,
        }),
        ...this.anims.generateFrameNames("WinSpritesheet3", {
          start: 0,
          end: 19,
        }),
        ...this.anims.generateFrameNames("WinSpritesheet4", {
          start: 0,
          end: 19,
        }),
      ],
      repeat: 0,
    });

    this.anims.create({
      key: "LoseAnimation",
      frames: [
        ...this.anims.generateFrameNames("LoseSpritesheet1", {
          start: 0,
          end: 24,
        }),
        ...this.anims.generateFrameNames("LoseSpritesheet2", {
          start: 0,
          end: 24,
        }),
      ],
      repeat: 0,
    });

    // this.add.sprite(540, 900, "WinSpritesheet1").setScale(1.7, 1.7).play("WinAnimation")
    // this.add.sprite(540, 800, "LoseSpritesheet1").setScale(1.7, 1.7).play("LoseAnimation")
  }

  update(time, delta) {
    if (
      this.towers === undefined ||
      this.towers === null ||
      this.towers.length === 0
    )
      return;
    this.towers.forEach((element) => {
      element.shootMinnionV3();
    });

    console.log(this.minnions.length);
  }

  createBonusWinText() {
    this.bounsWinText = this.add
      .text(540, 1080, "BONUS\nWIN!", {
        fontSize: "150px",
        fontFamily: "troika",
        strokeThickness: 20,
        stroke: "#000000",
        align: "center",
      })
      .setOrigin(0.5, 0.5)
      .setAlpha(0)
      .setDepth(110);
  }

  createResetWaveButton() {
    this.resetWaveButton = this.add
      .image(980, 1600, "ResetTowersButton")
      .setScale(3, 3);
    this.resetWaveButton.setInteractive();
    this.resetWaveButton.on("pointerup", () => {
      for (let i = 0; i < this.populatedTowerPlaces.length; i++) {
        if (
          this.populatedTowerPlaces[i] === 1 &&
          this.towerPlaces[i].tower === undefined
        )
          this.towerPlaces[i].addTower();
      }
    });
  }

  createBalanceText() {
    this.balanceText = this.add.text(250, 2050, `${this.balance}`, {
      fontSize: "60px",
      fontFamily: "troika",
      strokeThickness: 4,
      stroke: "#000000",
    });
  }

  createHUD() {
    // this.add
    //   .text(190, 40, "Wave length", {
    //     fontSize: "45px",
    //     fontFamily: "troika",
    //     strokeThickness: 4,
    //     stroke: "#000000",
    //   })
    //   .setDepth(91)
    //   .setOrigin(0.5, 0.5)
    //   .setColor("#000000");
    this.add.image(200, 150, "Panel").setDepth(90);
    this.add
      .text(190, 125, "1-85", {
        fontSize: "40px",
        fontFamily: "troika",
        strokeThickness: 4,
        stroke: "#000000",
      })
      .setDepth(91);
    this.add.image(90, 150, "ZombieHead").setScale(0.8, 0.8).setDepth(92);

    this.add.image(550, 150, "Panel").setDepth(90);
    this.chanceToWinText = this.add
      .text(515, 125, `${this.winChanceSequence[0]}`, {
        fontSize: "40px",
        fontFamily: "troika",
        strokeThickness: 4,
        stroke: "#000000",
      })
      .setDepth(91);
    this.add.image(440, 150, "Heart").setScale(0.7, 0.7).setDepth(92);

    this.add.image(900, 150, "Panel").setDepth(90);
    this.totalWinText = this.add
      .text(890, 125, `${this.totalWin}`, {
        fontSize: "40px",
        fontFamily: "troika",
        strokeThickness: 4,
        stroke: "#000000",
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
        fontFamily: "troika",
        strokeThickness: 4,
        stroke: "#000000",
      }
    );
  }

  createBetText() {
    this.betText = this.add.text(285, 1885, `${this.bet}`, {
      fontSize: "60px",
      fontFamily: "troika",
      strokeThickness: 4,
      stroke: "#000000",
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
      this.totalWin = this.bet * 16;
      this.totalWinText.text = `${this.totalWin}`;
    });

    this.DecreaseBetBtn = this.add
      .image(190, 1920, "DecreaseBetBtn")
      .setInteractive();
    this.DecreaseBetBtn.on("pointerdown", () => {
      this.bet -= 10;
      this.betText.text = `${this.bet}`;
      this.totalBetText.text = `${this.bet * this.numberOfTowers}`;
      this.totalWin = this.bet * 16;
      this.totalWinText.text = `${this.totalWin}`;
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
  }

  finishWave(succesful) {
    if (this.state === 0) return;
    this.state = 0;

    if (succesful) {
      this.add
        .sprite(540, 900, "WinSpritesheet1")
        .setScale(1.7, 1.7)
        .setDepth(20)
        .play("WinAnimation");
      this.balance += this.totalWin;
      this.balanceText.text = `${this.balance}`;
    } else {
      this.add
        .sprite(540, 800, "LoseSpritesheet1")
        .setScale(1.7, 1.7)
        .setDepth(20)
        .play("LoseAnimation");
    }

    this.time.delayedCall(3000, () => {
      this.startWaveButton.setAlpha(1);
      this.resetMinnionArray();
      this.resetTowerArray();
      this.numberOfTowers = 0;
      this.scene.restart();
    });
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

    // this.setMinnionTargetsToTowers();

    this.state = 1;
    this.balance -= this.bet * this.numberOfTowers;
    this.balanceText.text = `${this.balance}`;

    this.towers.forEach((element) => {
      element.enableShootingAfterDelay();
    });

    this.cheackForBonusWin();
  }

  cheackForBonusWin() {
    var aditionalGoldPerRound = this.randomizeAditionalGold();
    if (aditionalGoldPerRound > 0) {
      this.bounsWinText.setAlpha(1);
      this.time.delayedCall(1000, () => {
        this.bounsWinText.setAlpha(0);
      });

      this.totalWin += aditionalGoldPerRound;
      this.totalWinText.text = `${this.totalWin}`;

      console.log(`Bonus win: ${aditionalGoldPerRound}`);
    }
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

  randomizeAditionalGold() {
    var randomGoldAmmountIndex = Phaser.Math.Between(
      0,
      this.aditionalCoinsSequence.length - 1
    );
    var randomGoldAmmountValue =
      this.aditionalCoinsSequence[randomGoldAmmountIndex];

    return (randomGoldAmmountValue * this.bet) / 10;
  }

  spawnMinnions(minnionCount) {
    for (let i = 0; i < minnionCount; i++) {
      this.minnionCount.push(1);
      this.minnion = new BaseMinnion(this, this.path, 756, -64, "Zombie", 7);

      this.add.existing(this.minnion);
      this.minnions.push(this.minnion);
      if (this.minnions[i] !== undefined) {
        this.minnions[i].startWalking(i);
      }
    }
  }

  setMinnionTargetsToTowers() {
    for (let i = 0; i < this.towers.length; i++) {
      this.towers[i].shootMinnionV2(this.minnions, i, this.towers.length);
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
