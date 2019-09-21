import 'phaser';

import MainScene from './scenes/MainScene';

const config:GameConfig = {
    type: Phaser.AUTO,
    parent: 'content',
    width: 1000,
    height: 900,
    resolution: 1, 
    backgroundColor: "#EDEEC9",
    scene: [
      MainScene
    ],
    physics: {
      default: 'arcade',
      arcade: {
        gravity: {y: 50}
      }
    }
};

new Phaser.Game(config);
