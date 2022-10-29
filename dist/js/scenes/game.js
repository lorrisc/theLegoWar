class Game extends Phaser.Scene {
    constructor() {
        super("Game");
    }

    preload() {
        this.load.image("sky_23x23", "dist/assets/img/sky.png");
        this.load.image("grass_23x23", "dist/assets/img/grass.png");
        this.load.image("piece", "dist/assets/img/piece.png");
        this.load.image("cloud_300x159", "dist/assets/img/cloud.png");
        this.load.image("coin", "dist/assets/img/ai-coin.png");
        this.load.image("fire", "dist/assets/img/fire.png");
        this.load.image("munitionPlayer", "dist/assets/img/munition.png");

        this.load.image("tree", "dist/assets/img/tree.png");
        this.load.image("rock", "dist/assets/img/rock.png");

        this.grass;
        this.load.image("grass", "dist/assets/img/grass.png");

        this.sky;
        this.load.image("sky_23x23", "dist/assets/img/sky.png");
        this.load.image("danger", "dist/assets/img/danger.png");

        this.clouds = [];

        this.load.spritesheet("thePlayer", "dist/assets/img/spritesheet.png", { frameWidth: 300, frameHeight: 300 });
        this.load.spritesheet("missile", "dist/assets/img/missile.png", { frameWidth: 178, frameHeight: 363 });
        this.load.spritesheet("rafale", "dist/assets/img/rafale2.png", { frameWidth: 444 / 7, frameHeight: 47 });
        this.load.spritesheet("wario", "dist/assets/img/warioQuiVoleSansBg.png", { frameWidth: 37.3, frameHeight: 39 });

        this.particles;

        this.load.audio("jump", "dist/assets/sounds/boots_jump.wav");
        this.load.audio("land", "dist/assets/sounds/boots_land.wav");
        this.load.audio("step_left_1", "dist/assets/sounds/boots_step_left_1.wav");
        this.load.audio("step_left_2", "dist/assets/sounds/boots_step_left_2.wav");
        this.load.audio("step_left_3", "dist/assets/sounds/boots_step_left_3.wav");
        this.load.audio("step_right_1", "dist/assets/sounds/boots_step_right_1.wav");
        this.load.audio("step_right_2", "dist/assets/sounds/boots_step_right_2.wav");
        this.load.audio("step_right_3", "dist/assets/sounds/boots_step_right_3.wav");
        this.load.audio("flying", "dist/assets/sounds/flying.wav");
        this.load.audio("music", "dist/assets/sounds/music.mp3");
        this.load.audio("briquet", "dist/assets/sounds/briquet.mp3");
        this.load.audio("gun", "dist/assets/sounds/gun.mp3");
        this.load.audio("missile", "dist/assets/sounds/missile.mp3");
        this.load.audio("avion", "dist/assets/sounds/avion.mp3");
    }
    create() {
        window.score = 0;

        this.sky = this.add
            .tileSprite(0, 0, window.config.width / 2, window.config.height / 2, "sky_23x23")
            .setOrigin(0, 0)
            .setScale(2);

        this.grass = this.add
            .tileSprite(0, window.config.height - 50, window.config.width, 30, "grass")
            .setOrigin(0, 0)
            .setScale(2);
        // Première boucle qui itère 3 fois, car il y a 3 couches de nuages
        for (let couche = 1; couche <= 3; couche++) {
            // Deuxième boucle qui itère 5 fois, car il y a 5 nuages par couche
            for (let t = 0; t < 5; t++) {
                let cloud = this.add
                    .image(
                        Math.random() * window.config.width - 300 * 0.2 * couche, // Position x aléatoire sur la map
                        (Math.random() * window.config.height - 159 * 0.2 * couche) / 3, // Position y aléatoire sur la map
                        "cloud_300x159" // Texture du nuage
                    )
                    .setOrigin(0, 0) // On défini l'origine des transformations au coin en haut à gauche
                    .setScale((Math.random() * 0.05 + 0.05) * couche);
                // on redimensionne le nuage aléatoirement par rapport à sa couche, plus la couche est grande plus le nuage sera aussi grand
                cloud.alpha = 0.9; // on met le nuage à 90% d'opacité
                this.clouds.push(cloud); // on ajoute le nuage au tableau précédemment créé
            }
        }

        this.score = this.add.text(0, 0, "Score : " + window.score, { fill: "#000000", font: "800 25px Poppins", backgroundColor: "#01B661" }).setPadding(30, 15);
        this.player = this.physics.add.sprite(200, 500, "thePlayer");
        this.player.setBounce(0.1);
        this.player.setScale(0.4);

        this.physics.add.existing(this.grass, true);
        this.physics.add.collider(this.player, this.grass);

        this.anims.create({
            key: "running",
            frames: this.anims.generateFrameNumbers("thePlayer", { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1,
        });

        this.anims.create({
            key: "falling",
            frames: this.anims.generateFrameNumbers("thePlayer", { start: 4, end: 5 }),
            frameRate: 5,
            repeat: -1,
        });

        this.anims.create({
            key: "jumping",
            frames: this.anims.generateFrameNumbers("thePlayer", { start: 7 }),
            frameRate: 10,
            repeat: 0,
        });
        this.cursors = this.input.keyboard.createCursorKeys();

        this.particles = this.add.particles("piece").createEmitter({
            speed: 1000,
            scale: { start: 0.05, end: 0.05 },
            lifespan: 1000,
            angle: { min: 110, max: 120 },
            quantity: { min: 10, max: 50 },
            tint: [0xcc0000, 0xcc5a00, 0xccab00],
            on: false,
        });

        this.particles.startFollow(this.player, -20, 15);

        this.sounds = {
            step_left: [this.sound.add("step_left_1"), this.sound.add("step_left_2"), this.sound.add("step_left_3")],
            step_right: [this.sound.add("step_right_1"), this.sound.add("step_right_2"), this.sound.add("step_right_3")],

            land: this.sound.add("land", { volume: 0.5 }),
            jump: this.sound.add("jump", { volume: 0.3 }),
            flying: this.sound.add("flying", { volume: 0.3 }),
            briquet: this.sound.add("briquet", { volume: 0.3 }),
            gun: this.sound.add("gun", { volume: 0.3 }),
            missile: this.sound.add("missile", { volume: 0.3 }),
            avion: this.sound.add("avion", { volume: 0.3 }),
            music: this.sound.add("music", { volume: 0.3 }),
        };
        this.sounds.music.play();

        function collectStar(player, coin) {
            // var collectSong = new Audio('Ressources/ding.mp3');
            // collectSong.play();

            coin.disableBody(true, true);

            window.score++;

            let newCoin = this.physics.add
                .sprite(Math.random() * window.config.width + window.config.width, Math.random() * (window.config.height - 130), "coin")
                .setOrigin(0, 0)
                .setScale(0.27);
            newCoin.body.allowGravity = false;
            newCoin.setVelocityX(-300);
            this.coins.push(newCoin);
        }

        this.coins = [];
        for (let p = 0; p <= 4; p++) {
            // let coin = this.physics.add
            let coin = this.physics.add
                // .staticImage(
                .sprite(
                    Math.random() * window.config.width, // Position x aléatoire sur la map
                    Math.random() * (window.config.height - 130), // Position y aléatoire sur la map
                    "coin" // Texture du nuage
                )
                .setOrigin(0, 0) // On défini l'origine des transformations au coin en haut à gauche
                .setScale(0.27);
            // .setImmovable(true)
            // .setGravityY(0)
            // .setGravityX(0);
            // on redimensionne le nuage aléatoirement par rapport à sa couche, plus la couche est grande plus le nuage sera aussi grand
            // coin.body.setGravityY(0);
            // coin.body.setGravityX(0);
            coin.body.allowGravity = false;
            coin.setVelocityX(-300);

            this.coins.push(coin); // on ajoute le nuage au tableau précédemment créé
        }

        this.physics.add.overlap(this.player, this.coins, collectStar, null, this);
        // this.coins.setGravitX(0);

        this.score = this.add.text(0, 0, "Score : " + window.score, { fill: "#000000", font: "800 25px Poppins", backgroundColor: "#01B661" }).setPadding(30, 15);

        this.tree = this.physics.add.sprite(700, window.config.height - 50 - 137.25, "tree");
        this.tree.setScale(0.75);
        // this.physics.moveTo(this.tree,0,this.tree.y,1)
        this.tree.setVelocityX(-200);
        this.tree.setVelocityY(-20);
        this.physics.add.collider(this.tree, this.grass);

        console.log(this.tree.body);

        this.rock = this.physics.add.sprite(1100, window.config.height - 50 - 90.5 / 2, "rock");
        this.rock.setScale(0.5);
        this.rock.setVelocityX(-51);
        this.rock.setVelocityY(-20);
        this.physics.add.collider(this.rock, this.grass);

        function deadColision() {
            this.game.sound.stopAll();
            this.scene.start("End");
        }
        //https://phaser.io/examples/v2/arcade-physics/gravity
        this.physics.add.overlap(this.player, this.tree, deadColision, null, this);
        this.physics.add.overlap(this.player, this.rock, deadColision, null, this);

        this.missile = this.physics.add.sprite(5000, Math.random() * (window.config.height - 330), "missile");
        this.missile.body.allowGravity = false;
        this.missile.rotation = 11;
        this.missile.setScale(0.5);
        this.physics.add.overlap(this.player, this.missile, deadColision, null, this);
        this.missile.setVelocityX(-700);

        this.anims.create({
            key: "missileMovement",
            frames: this.anims.generateFrameNumbers("missile", { start: 0, end: 2 }),
            frameRate: 7,
            repeat: -1,
        });

        this.rafale = this.physics.add.sprite(5000, Math.random() * (window.config.height - 530), "rafale");
        this.rafale.body.allowGravity = false;
        this.rafale.setScale(5);
        this.rafale.rotation = 3.14;
        this.physics.add.overlap(this.player, this.rafale, deadColision, null, this);
        this.rafale.setVelocityX(-1300);

        this.anims.create({
            key: "rafaleMovement",
            frames: this.anims.generateFrameNumbers("rafale", { start: 0, end: 4 }),
            frameRate: 6,
            repeat: -1,
        });

        this.danger = this.add.image(window.config.width + 500, window.config.height + 500, "danger");
        this.danger.setScale(0.5);

        this.wario = this.physics.add.sprite(window.innerWidth / 1.5 - 100, 800, "wario");
        this.wario.body.allowGravity = false;
        this.wario.setScale(-3, 3);

        window.chrono = 0;
        window.posWario = 750;
        window.actualMove = 0;
        window.timerWario = 0;

        this.anims.create({
            key: "warioQuiVole",
            frames: this.anims.generateFrameNumbers("wario", { start: 0, end: 3 }),
            frameRate: 8,
            repeat: -1,
        });

        window.warioEstMort = 0;
        function colisionWarioBalle() {
            warioEstMort = 1;
            console.log("bgh");
            this.wario.y = window.config.height + 500;
        }
        this.ballePlayer = this.physics.add.sprite(110, 800, "munitionPlayer");
        this.ballePlayer.y = window.config.height + 500;
        this.ballePlayer.x = window.config.width + 500;
        this.ballePlayer.setScale(0.25);
        this.ballePlayer.rotation = 1.57;
        this.ballePlayer.body.allowGravity = false;
        this.ballePlayer.setVelocityX(800);

        this.physics.add.overlap(this.wario, this.ballePlayer, colisionWarioBalle, null, this);

        window.target = new Phaser.Math.Vector2();
        target.x = window.innerWidth / 1.5 - 100;
        target.y = 800;

        window.fly = 0;

        window.soundsFly = this.sounds.flying;
        window.soundsFly.loop = true;
        window.soundsFly.play();
        window.soundsFly.pause();
    }

    update(time, delta) {
        if (warioEstMort == 1) {
            timerWario++;
        }
        if (timerWario >= 400) {
            timerWario = 0;
            warioEstMort = 0;
            this.physics.moveToObject(this.wario, target, 200);
        }
        if (this.input.activePointer.isDown && this.ballePlayer.x > window.config.width) {
            this.ballePlayer.y = this.player.y;
            this.ballePlayer.x = this.player.x + 45;
            this.sounds.gun.play();
        }

        if (posWario >= 250 && actualMove == 0 && warioEstMort != 1) {
            posWario = posWario - 0.65;
            this.wario.y = posWario;
            if (posWario <= 250) {
                actualMove = 1;
            }
        } else if (warioEstMort != 1) {
            posWario = posWario + 0.65;
            this.wario.y = posWario;
            if (posWario >= 800) {
                actualMove = 0;
            }
        }
        function deadColision() {
            this.scene.start("End");
            this.sounds.music.pause();
        }
        if (window.chrono == 300) {
            this.fire = this.physics.add.sprite(window.innerWidth / 1.5 - 200, this.wario.y, "fire");
            this.fire.body.allowGravity = false;
            this.fire.setScale(0.07);
            this.physics.add.overlap(this.player, this.fire, deadColision, null, this);
            this.fire.setVelocityX(-420);
            window.chrono = 0;
            this.sounds.briquet.play();
        } else {
            window.chrono++;
        }

        this.score.text = "Score : " + window.score;

        this.sky.tilePositionX = time / 20;
        this.grass.tilePositionX = time / 10;

        // this.tree.x -= (delta * 30) / 100 * this.tree.scale;
        // this.tree.setVelocityX(-10)
        // moveTo(this.tree,-10,0,[10])
        // this.tree.setVelocityY(0)
        if (this.rafale.x > 6 * window.config.width && this.rafale.x < 7 * window.config.width) {
            this.sounds.avion.play();
        } else if (this.rafale.x < 4 * window.config.width) {
            this.danger.x = window.config.width - 80;
            this.danger.y = this.rafale.y;
        } else if (this.rafale.x > 4 * window.config.width) {
            this.danger.x = window.config.width + 500;
            this.danger.y = window.config.height + 500;
        }

        if (this.rafale.x < 0 - this.rafale.width) {
            this.rafale.x = 15 * window.config.width + 100;
            this.rafale.y = Math.random() * (window.config.height - 530);
        }

        if (this.missile.x > 1.2 * window.config.width && this.missile.x < 2 * window.config.width) {
            this.sounds.missile.play();
        }
        if (this.missile.x < 0 - this.missile.width) {
            this.missile.x = 3 * window.config.width + 100;
            this.missile.y = Math.random() * (window.config.height - 330);
        }

        if (this.tree.x < 0 - this.tree.width) {
            // this.tree.setVelocityX(window.config.width+Math.random() * window.config.width)
            // this.tree.setVelocityX()
            this.tree.x = window.config.width + Math.random() * window.config.width;
            this.tree.y = window.config.height - 50 - 137.25 - 10;
        }
        this.rock.x -= ((delta * 30) / 100) * this.rock.scale;
        if (this.rock.x < 0 - this.rock.width) {
            // this.rock.setVelocityX(window.config.width+Math.random() * window.config.width)
            this.rock.x = window.config.width + Math.random() * window.config.width;
            this.rock.y = window.config.height - 50 - 137.25 - 10;
        }

        this.clouds.forEach((cloud) => {
            cloud.x -= ((delta * 30) / 100) * cloud.scale;

            // si le nuage se retrouve en dehors de la fenêtre,
            // on le téléporte à droite, pour donner l'impression
            // qu'un autre nuage arrive, alors que c'est le même
            if (cloud.x < 0 - cloud.width) {
                cloud.x = window.config.width;
            }
        });
        this.coins.forEach((coin) => {
            // coin.x -= ((delta * 30) / 100) * coin.scale;
            // si le nuage se retrouve en dehors de la fenêtre,
            // on le téléporte à droite, pour donner l'impression
            // qu'un autre nuage arrive, alors que c'est le même
            if (coin.x < 0 - coin.width) {
                coin.x = window.config.width;
            }
        });

        if (this.cursors.space.isDown) {
            this.player.setVelocityY(-450);
            this.player.anims.play("jumping", true);
            if (window.fly == 0) {
                window.soundsFly.play();
                window.fly = 1;
            }
        } else if (this.player.body.touching.down) {
            this.player.anims.play("running", true);
        } else {
            this.sounds.flying.pause();
            window.fly = 0;
        }

        // Si on appuie sur "espace"
        if (this.cursors.space.isDown) {
            // || this.input.activePointer.isDown
            this.player.setVelocityY(-420);
            this.player.anims.play("jumping", false);
            this.particles.start();
        } else if (this.player.body.touching.down) {
            if (this.player.flipX === true) {
                this.player.x -= 0.5 * delta;
            }
            this.player.anims.play("running", true);
            this.particles.stop();
        } else {
            this.particles.stop();
            if (this.player.body.velocity.y > 10) {
                this.player.anims.play("falling", true);
            } else {
                this.player.anims.play("jumping", false);
            }
        }
        // Si on clique sur 'gauche' ou 'droite'
        if (this.cursors.left.isDown || this.input.keyboard.addKey("Q").isDown) {
            this.player.flipX = true;

            this.player.setVelocityX(-200);
            // this.player.x -= 0.3 * delta;
            this.particles.setAngle({ min: 30, max: 40 });
            this.particles.startFollow(this.player, 20, 15);
        } else if (this.cursors.right.isDown || this.input.keyboard.addKey("D").isDown) {
            this.player.flipX = false;
            this.player.setVelocityX(200);
            // this.player.x += 0.3 * delta;
            this.particles.setAngle({ min: 110, max: 120 });
            this.particles.startFollow(this.player, -20, 15);
        } else {
            this.player.setVelocityX(0);
        }

        this.missile.anims.play("missileMovement", true);
        this.rafale.anims.play("rafaleMovement", true);
        this.wario.anims.play("warioQuiVole", true);
    }
}

export default Game;
