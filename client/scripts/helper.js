export class Pen {
    constructor(context, { x, y }) {
        this.context = context;
        this.point = { x, y };
        context.moveTo(x, y);
    }

    drawTo({ x = 0, y = 0 }) {
        this.point.x += x;
        this.point.y += y;
        this.context.lineTo(this.point.x, this.point.y);
    }
}

export function clone(arg) {
    const result = {};
    Object.keys(arg).forEach(key => result[key] = arg[key]);
    return result;
}