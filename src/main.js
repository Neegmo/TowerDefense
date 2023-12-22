import Phaser from 'phaser'

import HelloWorldScene from './HelloWorldScene'
import FirstMap from './FirstMap'

var minnionCount

const config = {
	type: Phaser.AUTO,
	parent: 'app',
	scale: {
        mode: Phaser.Scale.FIT,
		autoCenter: Phaser.Scale.CENTER_HORIZONTALLY,
        width: 1408,
        height: 2816
    },
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 0 },
		},
	},
	scene: [FirstMap],
}

export default new Phaser.Game(config)
