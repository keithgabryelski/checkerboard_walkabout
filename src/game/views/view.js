class View
{
    constructor(canvas_manager, which_canvas) {
	this.canvasManager = canvas_manager;
	this.canvas = this.canvasManager.canvas_for(which_canvas);
	this.context = this.canvasManager.context_for(which_canvas);
	this.needsRendering = false;
    }

    update(state) {
	return null;
    }

    render(state) {
    }
}

export default View;
