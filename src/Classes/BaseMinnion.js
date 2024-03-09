import MinnionParent from "./MinnionParent";

export default class BaseMinnion extends MinnionParent {
  constructor(scene, path, x, y, texture, speed) {
    super(scene, path, x, y, texture, speed);

    this.play("ZombieWalkingForward")
  }
}
