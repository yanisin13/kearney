import { Pen } from "../helper";

export class HexagonGrid {

    lineColor;
    lineSize = 50;

    constructor(canvas, camera) {
        this.canvas = canvas;
        this.camera = camera;
    }

    draw(context) {
        context.strokeStyle = this.lineColor;
        const dist = this.lineSize / this.camera.scale;
        this.getHexLocations().forEach(point => {
            context.beginPath();
            const pen = new Pen(context, {
                x: point.x - dist/2,
                y: point.y - dist
            });
            pen.drawTo({x: dist});
            pen.drawTo({x: dist/2, y: dist});
            pen.drawTo({x: -dist/2, y: dist});
            pen.drawTo({x: -dist});
            pen.drawTo({x: -dist/2, y: -dist});
            pen.drawTo({x: dist/2, y: -dist});
            context.fillStyle = `#000`;
            context.fill();
            context.stroke();
        });
    }

    getHexLocations() {
        const results = [];
        const dist = this.lineSize / this.camera.scale;

        const widthDistance = dist * 1.5;
        const heightDistance = dist * 2;

        const camX = this.camera.x % (widthDistance * 2);
        const camY = this.camera.y % (heightDistance * 2);

        const width = (Math.ceil(this.canvas.width / dist) * dist)  + camX;
        const height = (Math.ceil(this.canvas.height / dist) * dist) + camY;

        const widthLimit = Math.ceil(width / widthDistance) + 4;
        const heightLimit = Math.ceil(height/ heightDistance) + 4;
        for(let i = 0; i < widthLimit * heightLimit; i++) {
            const xPos = i % widthLimit;
            results.push({
                x: -widthDistance*2 + xPos * widthDistance - camX,
                y: -heightDistance*2 +  Math.floor(i / widthLimit) * heightDistance - (xPos % 2 * dist) - camY
            });
        }

        return results;
    }
}