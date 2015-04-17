// manages the canvases for the machine parts
// there are currently two canvases:
// layer0 (the background) is used for the checkerboard and the markers, it is named "checkerboard"
// layer1 (the foreground) is used for the checker piece animation

class CanvasManager
{
    // canvas_id: string the base of the canvas element
    constructor(canvas_id) {
	this.canvasId = canvas_id;
	this.canvasMap = new Map()
	this.canvasMap.set("checkerboard", document.getElementById(canvas_id + "_layer0"));
	this.canvasMap.set("piece", document.getElementById(canvas_id + "_layer1"));
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
