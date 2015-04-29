import GameObject from '../game_object';

class View extends GameObject
{
    getClassName() {
        return View.name;
    }

    constructor(canvas_manager, which_canvas) {
	super();
	this.canvasManager = canvas_manager;
	this.canvas = this.canvasManager.canvas_for(which_canvas);
	this.context = this.canvasManager.context_for(which_canvas);
	this.needsRendering = false;
    }

    render(state) {
    }
}

export default View;
