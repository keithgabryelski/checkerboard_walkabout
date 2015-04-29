import GameObject from '../game_object';

// manages the canvases for the machine parts
// there are currently two canvases:
// layer0 (the background) is used for the checkerboard and the markers, it is named "board"
// layer1 (the foreground) is used for the checker piece animation

class CanvasManager extends GameObject
{
    getClassName() {
        return CanvasManager.name;
    }

    constructor(configuration) {
	super();
	this.configuration = configuration;
	this.canvasId = "checkerboard";
	this.canvasMap = new Map()
	this.canvasMap.set("board", document.getElementById(this.canvasId + "_layer0"));
	this.canvasMap.set("piece", document.getElementById(this.canvasId + "_layer1"));
	for (let [name, canvas] of this.canvasMap) {
	    console.log("has canvas: '" + name + "', value: " + canvas);
	}
    }

    // retrieve the canvas for the named layer
    // which: the named layer
    canvas_for(which) {
	return this.canvasMap.get(which);
    }

    // retrieve the context for the named layer
    // which: the named layer
    context_for(which) {
	return this.canvas_for(which).getContext("2d");
    }

    wipe_canvases() {
	for (let [name, canvas] of this.canvasMap) {
	    console.log("wiping canvas: '" + name + "', value: " + canvas);
	    let context = canvas.getContext("2d");
	    context.clearRect(0, 0, canvas.width, canvas.height);
	}
    }

    resize_canvases(size) {
	for (let [name, canvas] of this.canvasMap) {
	    console.log("resizing canvas: '" + name + "' to size " + size);
	    canvas.width = size;
	    canvas.height = size;
	}
    }
}

export default CanvasManager;
