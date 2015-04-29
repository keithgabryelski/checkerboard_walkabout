import View from './view'
import Location from '../models/location'
import Position from '../models/position'

class Checkerboard extends View
{
    getClassName() {
        return Checkerboard.name;
    }

    constructor(canvas_manager, state) {
	super(canvas_manager, "board");
	this.boardSize = state.configurationControls.boardSize;
	this.spaceSize = state.configurationControls.spaceSize;
	this.triangleSize = this.spaceSize * 0.20;
	this.needsRendering = true;
    }

    render(state) {
	console.log("Checkerboard.render(" + state + ")");
	if (this.needsRendering) {
	    this.canvasManager.wipe_canvases();
	    this.canvasManager.resize_canvases(this.boardSize * this.spaceSize);
	    this.canvas.style.border = "1px solid black";
	    for (let row = 0; row < this.boardSize; ++row) {
		for (let column = 0; column < this.boardSize; ++column) {
		    let position_x = column * this.spaceSize;
		    let position_y = row * this.spaceSize;
		    let color_index = (row + column) % 2;
		    let context = this.context;
		    context.fillStyle = state.spaceColors[color_index];
		    context.fillRect(position_x, position_y, this.spaceSize, this.spaceSize);
		    this.draw_guide_arrow(new Location(column, row), state);
		}
	    }
	    this.needsRendering = false;
	}
    }
	
    draw_guide_arrow(location, state) {
	this.draw_directed_arrow(location, state, "silver");
    }

    draw_offboard_arrow(location, state) {
	this.draw_directed_arrow(location, state, "red");
    }

    draw_startoffboard_arrow(location, state) {
	this.draw_directed_arrow(location, state, "yellow");
    }

    draw_end_arrow(location, state) {
	this.draw_directed_arrow(location, state, "red");
    }

    draw_start_arrow(location, state) {
	this.draw_directed_arrow(location, state, "green");
    }

    draw_directed_arrow(location, state, color) {
	let direction = state.checkerboardSpaceDirections[location.row * this.boardSize + location.column];
	if (direction == 0) {
	    this.draw_up_arrow(location, color);
	} else if (direction == 1) {
	    this.draw_down_arrow(location, color);
	} else if (direction == 2) {
	    this.draw_left_arrow(location, color);
	} else if (direction == 3) {
	    this.draw_right_arrow(location, color);
	} else {
	    // XXX
	    console.log("!! NO DIRECTION TO DRAW ARROW: direction=" + direction);
	}
    }

    draw_up_arrow(location, color) {
	let space_size = this.spaceSize;
	let position_x = location.column * space_size + (space_size / 2);
	let position_y = location.row * space_size;
	this.draw_arrow(
	    new Position(position_x, position_y),
	    new Position(position_x + this.triangleSize/2, position_y + this.triangleSize),
	    new Position(position_x - this.triangleSize/2, position_y + this.triangleSize),
	    color
	);
    }

    draw_down_arrow(location, color) {
	let space_size = this.spaceSize;
	let triangle_size = (space_size / 4)
	let position_x = location.column * space_size + (space_size / 2);
	let position_y = location.row * space_size + space_size;
	this.draw_arrow(
	    new Position(position_x, position_y),
	    new Position(position_x + this.triangleSize/2, position_y - this.triangleSize),
	    new Position(position_x - this.triangleSize/2, position_y - this.triangleSize),
	    color
	);
    }

    draw_left_arrow(location, color) {
	let space_size = this.spaceSize;
	let triangle_size = (space_size / 4)
	let position_x = location.column * space_size;
	let position_y = location.row * space_size + (space_size / 2);
	this.draw_arrow(
	    new Position(position_x, position_y),
	    new Position(position_x + this.triangleSize, position_y - this.triangleSize/2),
	    new Position(position_x + this.triangleSize, position_y + this.triangleSize/2),
	    color
	);
    }

    draw_right_arrow(location, color) {
	let space_size = this.spaceSize;
	let triangle_size = (space_size / 4)
	let position_x = location.column * space_size + space_size;
	let position_y = location.row * space_size + (space_size / 2);
	this.draw_arrow(
	    new Position(position_x, position_y),
	    new Position(position_x - this.triangleSize, position_y - this.triangleSize/2),
	    new Position(position_x - this.triangleSize, position_y + this.triangleSize/2),
	    color
	);
    }

    draw_arrow(corner_position1, corner_position2, corner_position3, color) {
	let context = this.context;
	context.fillStyle = color;
	context.beginPath();
	context.moveTo(corner_position1.x, corner_position1.y);
	context.lineTo(corner_position2.x, corner_position2.y);
	context.lineTo(corner_position3.x, corner_position3.y);
	context.fill();
    }
}

export default Checkerboard;
