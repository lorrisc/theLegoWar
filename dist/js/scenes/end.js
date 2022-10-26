class End extends Phaser.Scene {
    constructor() {
        super("End");
    }

    preload() {}

    create() {
        // this.deadRecap = this.add.text(0, 0, "Score : " + window.score, { fill: "#FF0000", font: "900 40px Poppins", backgroundColor: "#fffff" }).setPadding(30, 15);

        // this.restart = this.add
        //     .text(0, 150, "Restart", { fill: "#0f0", font: "900 40px Poppins", backgroundColor: "#fffff" })
        //     .setPadding(30, 15)
        //     .setInteractive()
        //     .on("pointerdown", () => {
        //         this.scene.start("Game");
        //     });

        const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
        const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;
        const restartText = this.add
            .text(screenCenterX, screenCenterY + 55, "Restart", { fill: "#0f0", font: "900 40px Poppins", backgroundColor: "#fffff" })
            .setOrigin(0.5)
            .setPadding(30, 15)
            .setInteractive()
            .on("pointerdown", () => {
                this.scene.start("Game");
            });

        const deadRecap = this.add
            .text(screenCenterX, screenCenterY - 55, "Score : " + window.score, { fill: "#FF0000", font: "900 40px Poppins", backgroundColor: "#fffff" })
            .setOrigin(0.5)
            .setPadding(30, 15);
    }

    update(time, delta) {}
}

export default End;
