import Phaser from "phaser";

export default class HelloWorldScene extends Phaser.Scene {
  dropzone1;
  towerButton;

  draggableTower;
  tower;
  towers = [];

  Minnion;
  Minnions = [];

  canDragTower = false;

  waveStarted = false;

  waveEnded = false;

  path;

  graphics;

  startWaveButton;

  nextTargetableTowerIndex = 0;

  constructor() {
    super("hello-world");
  }

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

    this.createDraggableTowerButton();

    this.createPath();

    // this.spawnMinnions(5);

    this.handleInputs();

    this.createStartWaveButton();
  }

  update(time, delta) {
    if (this.canDragTower) {
      // console.log(this.input.x, this.input.y)
      this.draggableTower.x = this.input.x;
      this.draggableTower.y = this.input.y;
    }


    
    if (this.Minnions.length <= 0) {
      this.waveEnded = true;
    }
    for (let i = 0; i < this.towers.length; i++) {
      this.towers[i].rotation = Phaser.Math.Angle.BetweenPoints(
        this.towers[i],
        this.Minnions[0]
      );
    }
  }

  createDraggableTowerButton() {
    this.towerButton = this.add.image(704, 2700, "TowerPicker").setScale(2, 2);
    this.towerButton.setInteractive();
    this.towerButton.on("pointerdown", (pointer, gameObject) => {
      this.draggableTower = this.add
        .image(pointer.x, pointer.y, "TowerDraggable")
        .setScale(2, 2);
      this.draggableTower.setAlpha(0.7);
      this.canDragTower = true;
    });
  }

  createStartWaveButton() {
    this.startWaveButton = this.add.image(1000, 2500, "StartWaveButton");
    this.startWaveButton.setInteractive();

    this.startWaveButton.on("pointerdown", () => {
      this.spawnMinnions(7);
      this.startWaveButton.setAlpha(0);

      this.setMinnionTargetsToTowers();
    });
  }

  setMinnionTargetsToTowers() {
    for (let i = 0; i < this.towers.length; i++) {
      for (let j = 0; j < 5; j++) {
        this.time.delayedCall(800 + j * 1000, () => {

          if(this.Minnions[i] !== undefined){

            this.Minnions[i].destroy();
            this.Minnions.splice(i, 1);
            this.towers[i].setTexture("TowerDraggableShooting");
          }
          this.nextTargetableTowerIndex++;
        });
        this.time.delayedCall(1000 + j * 1000, () => {
          this.towers[i].setTexture("TowerDraggable");
        });
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
      this.time.delayedCall(i * 700, () => {
        this.Minnion = this.add.follower(this.path, -40, 400, "Minnion");
        this.Minnion.setScale(3, 3);

        this.Minnion.startFollow({
          duration: 8000,
          rotateToPath: true,
          repeat: 0,
        });

        this.Minnions.push(this.Minnion);
      });
    }
  }

  handleInputs() {
    this.input.on("pointerup", (pointer, gameObject) => {
      if (!this.canDragTower) return;

      this.canDragTower = false;
      this.draggableTower.destroy();
      this.tower = this.add
        .image(pointer.x, pointer.y, "TowerDraggable")
        .setScale(2, 2);
      this.towers.push(this.tower);
    });

    this.input.on("pointerdown", (pointer) => {
      // console.log(pointer.x, pointer.y);
    });

    this.input.on("pointermove", () => {});
  }

  createDropzones() {
    this.dropzone1 = this.add.zone(190, 190, 128, 128);
    this.dropzone1.setRectangleDropZone(96, 96);
    let dropZoneOutline = this.add.graphics();
    dropZoneOutline.lineStyle(4, 0x00ff00);
    dropZoneOutline.strokeRect(
      this.dropzone1.x - this.dropzone1.input.hitArea.width / 2,
      this.dropzone1.y - this.dropzone1.input.hitArea.height / 2,
      this.dropzone1.input.hitArea.width,
      this.dropzone1.input.hitArea.height
    );
  }

  createDraggableTower() {}
}

// this.load.image("map_tilesheet", "assets/map_tilesheet.png");
// this.load.tilemapTiledJSON("map", "assets/map.tmj");

// const map = this.make.tilemap({ key: "map" });
// const tileset = map.addTilesetImage("towerDefense_tilesheet@2", "map_tilesheet");
// map.createLayer("Background", tileset);
// map.createLayer("Path", tileset);
// map.createLayer("TowerPlaces", tileset);
