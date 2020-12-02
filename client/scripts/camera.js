import { clone } from "./helper";

export class Camera {

    constructor(canvas, input) {
        this.canvas = canvas;
        this.input = input;
        this.x = 0;
        this.y = 0;
        this.accX = 0;
        this.accY = 0;
        this.scaleAcc = 0;
        this.scale = 1;

        this.setupInput();
    }

    setupInput() {

        const controls = this.input.controls;
        const mouse = controls.mouse;

        mouse.onDownInit((location) => {
            this.clickLocation = clone(location);
            this.accX = 0;
            this.accY = 0;
            this.origLocation = {
                x: this.x,
                y: this.y
            }
        });

        mouse.onDown((location) => {
            if(this.clickLocation && this.origLocation) {
                this.x = this.origLocation.x - (location.x - this.clickLocation.x);
                this.y = this.origLocation.y - (location.y - this.clickLocation.y);

                this.lastLocation = clone(location);
            }
        });

        mouse.onRelease((location) => {
            if (this.lastLocation) {
                this.accX = this.lastLocation.x - location.x;
                this.accY = this.lastLocation.y - location.y;
            }
        });

        mouse.onScrollDown((location) => {
            this.scaleAcc += 0.001
            this.scrollLocation = clone(location);
        });
        mouse.onScrollUp((location) => {
            this.scaleAcc -= 0.001
            this.scrollLocation = clone(location);
        });

        controls.cameraUp.onDown(() => this.accY -= 0.1);
        controls.cameraDown.onDown(() => this.accY += 0.1);
        controls.cameraLeft.onDown(() => this.accX -= 0.1);
        controls.cameraRight.onDown(() => this.accX += 0.1);
    }

    adjustCamOnScaleChange(location) {
        this.x += location.x * this.scale - location.x;
        this.y += location.y * this.scale - location.y;
    }

    getCamLocation(point) {
        return {
            x: (point.x - this.x) * this.scale + this.canvas.width/2,
            y: (point.y - this.y) * this.scale + this.canvas.height/2 
        }
    }

    update() {

        this.accX = Math.max(Math.min(this.accX, 10), -10);
        this.accY = Math.max(Math.min(this.accY, 10), -10);

        this.x += this.accX;
        this.y += this.accY;

        const oldScale = this.scale;
        this.scale += this.scaleAcc;

        if(this.scale < 0.2 || this.scale > 2) {
            this.scale = Math.max(Math.min(this.scale, 2), 0.2);
            this.scaleAcc = 0;
        }

        this.accX *= 0.99;
        this.accY *= 0.99;
        this.scaleAcc *= 0.99
    }
}