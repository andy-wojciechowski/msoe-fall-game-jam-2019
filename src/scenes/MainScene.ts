export default class MainScene extends Phaser.Scene {
    private circleThing: Phaser.Physics.Arcade.Sprite;
    private player: Phaser.Physics.Arcade.Sprite;
    private crates: Array<Phaser.Physics.Arcade.Sprite>
    private livesText: Phaser.GameObjects.Text;
    private gameOverText: Phaser.GameObjects.Text;
    private youWinText: Phaser.GameObjects.Text;
    private cursors: any;
    private lives: number = 3;
    private gameOver: boolean = false;
    private youWin: boolean = false;

    preload() {
        this.load.image('player', '/assets/mov_platform.png');
        this.load.image('crate', '/assets/2.png');
        this.load.image('circleThing', '/assets/11.png');
    }

    create() {
        this.crates = [];

        this.physics.world.setBounds(0, 0, 1000, 900);

        this.player = this.physics.add.sprite(100, 800, 'player');
        this.cursors = this.input.keyboard.createCursorKeys();
        this.player.setCollideWorldBounds(true);
        this.player.body.enable = true;
        this.player.body.allowGravity = false;
        this.player.body.immovable = true;
        this.player.body.bounce.set(0.5);

        let cratePositions = [[100, 100], [200, 100], [300, 100], [400, 100], [500, 100], [600, 100], [700, 100], [800, 100], [900, 100],
                              [200, 200], [300, 200], [400, 200], [500, 200], [600, 200], [700, 200], [800, 200],
                              [300, 300], [400, 300], [500, 300], [600, 300], [700, 300]];

        cratePositions.forEach((point) => {
            let crateSprite = this.physics.add.sprite(point[0], point[1], 'crate');
            crateSprite.body.allowGravity = false;
            this.crates.push(crateSprite);
        });

        this.circleThing = this.physics.add.sprite(100, 400, 'circleThing');
        this.circleThing.setCollideWorldBounds(true);
        this.circleThing.body.enable = true;
        this.circleThing.body.velocity.y = 300;
        this.circleThing.body.bounce.set(0.5);

        const textStyle = { fill: '#000000' };
        this.livesText = this.add.text(900, 25, `Lives: ${this.lives}`, textStyle);

        const centerTextStyle = { font: 'bold 60px Arial', fill: '#000000'};
        this.gameOverText = this.add.text(350, 450, 'Game Over!', centerTextStyle);
        this.gameOverText.visible = false;

        this.youWinText = this.add.text(350, 450, 'You Win!', centerTextStyle);
        this.youWinText.visible =false;
    }

    update(time: number, delta: number) {
        if(!this.gameOver && !this.youWin) {
            this.physics.collide(this.player, this.circleThing, this.playerCircleThingCollision);
            this.crates.forEach((crate) => {
                if(crate !== null) {
                    this.physics.collide(this.circleThing, crate, this.circleThingCrateCollision);
                }
            });
    
            if(this.cursors.right.isDown)
                this.player.x += 5;
    
            if(this.cursors.left.isDown) 
                this.player.x -= 5;
            
            if(this.circleThing.y > this.player.y) {
                this.lives -= 1;
                this.circleThing.y = 400;

                if(this.lives == 0)
                    this.gameOver = true;
            }
    
            this.livesText.setText(`Lives: ${this.lives}`);

            this.crates = this.crates.filter(x => x.active === true);
            this.youWin = this.crates.length === 0;
        } else if(this.gameOver) {
            this.gameOverText.visible = true;
        } else if(this.youWin) {
            this.youWinText.visible = true;
        }
    }

    private playerCircleThingCollision(player: Phaser.Physics.Arcade.Sprite, circleThing: Phaser.Physics.Arcade.Sprite): void {
        const angle: number = Phaser.Math.Angle.Between(player.x, player.y, circleThing.x, circleThing.y);
        const velX: number = Math.cos(angle) * 1.4 * circleThing.body.speed;
        const velY: number = Math.sin(angle) * 1.4 * circleThing.body.speed;
        circleThing.setVelocity(velX, velY);
    }

    private circleThingCrateCollision(circleThing: Phaser.Physics.Arcade.Sprite, crate: Phaser.Physics.Arcade.Sprite): void {
        const angle: number = Phaser.Math.Angle.Between(circleThing.x, circleThing.y, crate.x, crate.y);
        const velX: number = Math.cos(angle) * 1.1 * circleThing.body.speed;
        const velY: number = Math.sin(angle) * 1.1 * circleThing.body.speed;
        circleThing.setVelocity(velX, velY);
        crate.destroy();
    }
}