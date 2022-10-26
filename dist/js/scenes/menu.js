class Menu extends Phaser.Scene {
    constructor() {
        super("Menu");
    }

    preload() {
        this.load.image("backgroundMenu", "dist/assets/img/backgroundMenu.jpg");
    }

    create() {
        var background = this.add.image(480, 343, "backgroundMenu");
        background.setScale(1.8);

        const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
        const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;

        const title = this.add
            .text(screenCenterX, screenCenterY - 240, "LegoCollect", { fill: "#ffffff", font: "900 50px Poppins", backgroundColor: "#EE82EE" })
            .setOrigin(0.5)
            .setPadding(150, 15);

        const restartText = this.add
            .text(screenCenterX, screenCenterY, "Start Game", { fill: "#0f0", font: "900 40px Poppins", backgroundColor: "#fffff" })
            .setOrigin(0.5)
            .setPadding(30, 15)
            .setInteractive()
            .on("pointerdown", () => {
                this.scene.start("Game");
            });
    }

    update(time, delta) {}
}

export default Menu;
