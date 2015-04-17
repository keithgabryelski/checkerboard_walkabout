class CheckerboardSpace
{
    constructor(checker_board, x, y, direction) {
	this.checkerBoard = checker_board;
	this.x = x;
	this.y = y;
	this.direction = direction;
	this.marked = false;
	let space_size = this.checkerBoard.spaceSize;
	this.triangleSize = space_size * 0.20;
    }

    get center_x() {
	return this.x * this.checkerBoard.spaceSize + this.checkerBoard.spaceSize/2;
    }
    get center_y() {
	return this.y * this.checkerBoard.spaceSize + this.checkerBoard.spaceSize/2;
    }

    render_space() {
	// console.log("rendering space: x=" + this.x + ", y=" + this.y + ", direction=" + this.direction);
	let position_x = this.x * this.checkerBoard.spaceSize;
	let position_y = this.y * this.checkerBoard.spaceSize;
	let color_index = (this.x + this.y) % 2;
	let context = this.context;
	context.fillStyle = this.checkerBoard.colors[color_index];
	context.fillRect(position_x, position_y, this.checkerBoard.spaceSize, this.checkerBoard.spaceSize);
	this.draw_guide_arrow();
    }

    next_space() {
	if (this.direction == 0) {
	    // up
	    return this.checkerBoard.get_space(this.x, this.y - 1);
	} else if (this.direction == 1) {
	    // down
	    return this.checkerBoard.get_space(this.x, this.y + 1);
	} else if (this.direction == 2) {
	    // left
	    return this.checkerBoard.get_space(this.x - 1, this.y);
	} else if (this.direction == 3) {
	    // right
	    return this.checkerBoard.get_space(this.x + 1, this.y);
	}
	// XXX
	console.log("!! NO DIRECTION TO MOVE");
	return null;
    }
	
    draw_guide_arrow() {
	this.draw_directed_arrow("silver");
    }

    draw_offboard_arrow() {
	this.draw_directed_arrow("red");
    }

    draw_startoffboard_arrow() {
	this.draw_directed_arrow("yellow");
    }

    draw_end_arrow() {
	this.draw_directed_arrow("red");
    }

    draw_start_arrow() {
	this.draw_directed_arrow("green");
    }

    draw_directed_arrow(color) {
	if (this.direction == 0) {
	    this.draw_up_arrow(color);
	} else if (this.direction == 1) {
	    this.draw_down_arrow(color);
	} else if (this.direction == 2) {
	    this.draw_left_arrow(color);
	} else if (this.direction == 3) {
	    this.draw_right_arrow(color);
	} else {
	    // XXX
	    console.log("!! NO DIRECTION TO DRAW ARROW");
	}
    }

    draw_up_arrow(color) {
	let space_size = this.checkerBoard.spaceSize;
	let position_x = this.x * space_size + (space_size / 2);
	let position_y = this.y * space_size;
	this.draw_arrow(
	    position_x, position_y,
	    position_x + this.triangleSize/2, position_y + this.triangleSize,
	    position_x - this.triangleSize/2, position_y + this.triangleSize,
	    color
	);
    }

    draw_down_arrow(color) {
	let space_size = this.checkerBoard.spaceSize;
	let triangle_size = (space_size / 4)
	let position_x = this.x * space_size + (space_size / 2);
	let position_y = this.y * space_size + space_size;
	this.draw_arrow(
	    position_x, position_y,
	    position_x + this.triangleSize/2, position_y - this.triangleSize,
	    position_x - this.triangleSize/2, position_y - this.triangleSize,
	    color
	);
    }

    draw_left_arrow(color) {
	let space_size = this.checkerBoard.spaceSize;
	let triangle_size = (space_size / 4)
	let position_x = this.x * space_size;
	let position_y = this.y * space_size + (space_size / 2);
	this.draw_arrow(
	    position_x, position_y,
	    position_x + this.triangleSize, position_y - this.triangleSize/2,
	    position_x + this.triangleSize, position_y + this.triangleSize/2,
	    color
	);
    }

    draw_right_arrow(color) {
	let space_size = this.checkerBoard.spaceSize;
	let triangle_size = (space_size / 4)
	let position_x = this.x * space_size + space_size;
	let position_y = this.y * space_size + (space_size / 2);
	this.draw_arrow(
	    position_x, position_y,
	    position_x - this.triangleSize, position_y - this.triangleSize/2,
	    position_x - this.triangleSize, position_y + this.triangleSize/2,
	    color
	);
    }

    draw_arrow(x1, y1, x2, y2, x3, y3, color) {
	let context = this.context;
	context.fillStyle = color;
	context.beginPath();
	context.moveTo(x1, y1);
	context.lineTo(x2, y2);
	context.lineTo(x3, y3);
	context.fill();
    }

    get context() {
	return this.checkerBoard.canvasManager.context_for("checkerboard");
    }
}
