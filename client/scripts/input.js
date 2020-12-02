export class Input {

    constructor(canvas, controls) {
        this.canvas = canvas;
        if (controls) {
            this.loadKeyControls(controls);
        }
        this.initEvents();
    }

    loadKeyControls(controls) {
        this.mappings = [];
        this.controls = {
            mouse: this.createMouseControl()
        };
        Object.keys(controls).forEach(controlName => {
            this.controls[controlName] = this.createKeyControl();
            this.mappings.push({
                key: controls[controlName],
                control: this.controls[controlName]
            });
        });
    }

    initEvents() {
        const mouse = this.controls.mouse;
        document.addEventListener("keydown", keyEvent => this.mappings.filter(mapping => mapping.key === keyEvent.key).forEach(mapping => 
            mapping.control.keyDown = true
        ));

        document.addEventListener("keyup", keyEvent => this.mappings.filter(mapping => mapping.key === keyEvent.key).forEach(mapping => {
            this.triggerActions("keyRelease", mapping.control.actions);
            mapping.control.keyDown = false;
            mapping.control.toggled = !mapping.control.toggled;
        }));

        this.canvas.addEventListener("mousedown", mouseEvent => {
            mouse.location = this.getMouseLocation(mouseEvent);
            this.triggerActions("mouseDownInit", mouse.actions, mouse.location);
            mouse.keyDown = true;
        });

        this.canvas.addEventListener("mouseup", mouseEvent => {
            mouse.location = this.getMouseLocation(mouseEvent);
            this.triggerActions("mouseRelease", mouse.actions, mouse.location);
            mouse.keyDown = false;
            mouse.toggled = !mouse.toggled;
        });

        this.canvas.addEventListener("mousemove", mouseEvent => {
            mouse.location = this.getMouseLocation(mouseEvent);
            this.triggerActions("mouseMove", mouse.actions, mouse.location);
            mouse.toggled = !mouse.toggled;
        });

        this.canvas.addEventListener("wheel", scrollEvent => {
            mouse.location = this.getMouseLocation(scrollEvent);
            if(scrollEvent.deltaX === 0) {
                this.triggerActions(scrollEvent.deltaY > 0 ? "scrollDown" : "scrollUp", mouse.actions, mouse.location);
            }
        });
    }

    update() {
        this.mappings.filter(mapping => mapping.control.toggled).forEach(mapping => this.triggerActions("keyToggle", mapping.control.actions));
        this.mappings.filter(mapping => mapping.control.keyDown).forEach(mapping => this.triggerActions("keyDown", mapping.control.actions));

        if (this.controls.mouse.toggled) {
            this.triggerActions("mouseToggle", this.controls.mouse.actions, this.controls.mouse.location);
        }

        if(this.controls.mouse.keyDown) {
            this.triggerActions("mouseDown", this.controls.mouse.actions, this.controls.mouse.location);
        }
    }

    triggerActions(type, actions, ...args) {
        actions.filter(action => action.type === type).forEach(action => action.handler(...args));
    }

    getMouseLocation(mouseEvent) {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: mouseEvent.clientX - rect.left,
            y: mouseEvent.clientY - rect.top
        };
    }

    addAction(control, handler, type) {
        const actionId = control.id;
        control.id++;
        control.actions.push({
            type: type,
            id: actionId,
            handler
        });
        return actionId;
    }

    createControl() {
        const control = {
            id: 0,
            keyDown: false,
            toggled: false,
            actions: []
        };

        control.removeAction = (id) => control.actions = control.actions.filter(action => action.id !== id);

        return control;
    }

    createMouseControl() {
        const control = this.createControl();

        control.onToggle = (handler) => this.addAction(control, handler, "mouseToggle");
        control.onRelease = (handler) => this.addAction(control, handler, "mouseRelease");
        control.onDownInit = (handler) => this.addAction(control, handler, "mouseDownInit");
        control.onDown = (handler) => this.addAction(control, handler, "mouseDown");
        control.onMove = (handler) => this.addAction(control, handler, "mouseMove");
        control.onScrollDown = (handler) => this.addAction(control, handler, "scrollDown");
        control.onScrollUp = (handler) => this.addAction(control, handler, "scrollUp");

        return control;
    }

    createKeyControl() {
        const control = this.createControl();

        control.onToggle = (handler) => this.addAction(control, handler, "keyToggle");
        control.onRelease = (handler) => this.addAction(control, handler, "keyRelease");
        control.onDown = (handler) => this.addAction(control, handler, "keyDown");

        return control;
    }
}