export class CanvasEngine {

    running = false;
    backgroundColor;

    constructor(canvas) {
        this.canvas = canvas;
        this.context = canvas.getContext("2d");
    }

    update() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    draw(components) {
        this.context.fillStyle = this.backgroundColor;
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        components.sort((a,b) => {
            const aOrder = a.order || 0;
            const bOrder = b.order || 0;
            return aOrder >= bOrder ? -1 : 1;
        }).forEach((component) => {
            if(typeof(component.draw) === "function") {
                component.draw(this.context);
            }
        });
    }
}