import { Camera } from "./camera";
import { CanvasEngine } from "./canvas";
import { HexagonGrid } from "./drawable/hexagonGrid";
import { Input } from "./input";
import controls from "../controls";

const UPDATE_INT = 1;
const COLOR_BACKGROUND = "#FFF";
const COLOR_GRID = "#444";

export class GameEngine {
    constructor(dom) {

        this.components = [];

        this.canvasEngine = new CanvasEngine(dom.canvas);

        this.canvasEngine.backgroundColor = COLOR_BACKGROUND;

        const input = this.createComponent(new Input(canvas, controls));
        const camera = this.createComponent(new Camera(dom.canvas, input));
        const grid = this.createComponent(new HexagonGrid(dom.canvas, camera));
        grid.lineColor = COLOR_GRID;

        this.gameLoop = setInterval(() => this.loop(), UPDATE_INT);
    }

    createComponent(component) {
        this.components.push(component);
        return component;
    }

    loop() {
        this.components.forEach(component => {
            if(typeof(component.update) === "function") {
                component.update();
            }
        });
        this.canvasEngine.update();
        this.canvasEngine.draw(this.components);
    }
}