import View from './view'
import Position from '../models/position'

class CheckerPiece extends View
{
    constructor(canvas_manager, name, state, checkerboard) {
	super(canvas_manager, "piece");
	console.log("CheckerPiece.constructor: name=" + name);
	this.name = name;
	this.state = state;
	this.audioBoard = null;
	this.currentLocation = null;
	this.walkaboutStatus = null;
	this.drawStartingLocation = true;
	this.checkerboard = checkerboard;
    }

    get currentPositionCenter() {
	return new Position(
	    this.currentLocation.column * this.state.configurationControls.spaceSize + this.state.configurationControls.spaceSize / 2,
	    this.currentLocation.row * this.state.configurationControls.spaceSize + this.state.configurationControls.spaceSize / 2
	)
    }

    move_off_board() {
	this.draw_offboard_piece();
    }

    remove_due_to_loop() {
	this.draw_loop_piece()
    }

    draw_starting_piece() {
	console.log("draw starting piece")
	this.audioBoard.play_start_sound();
	this.draw();
    }

    draw_offboard_piece() {
	this.audioBoard.play_offboard_sound();
	this.remove();
    }

    draw_loop_piece() {
	this.audioBoard.play_loop_sound();
	this.remove();
    }

    render(state) {
	console.log("checkerpiece render: " + this.name);
	if (this.drawStartingLocation) {
	    this.drawStartingLocation = false;
	    this.currentLocation = state.walkabout.currentLocation;
	    this.draw_starting_piece();
	    this.checkerboard.draw_start_arrow(this.currentLocation, state);
	}

	if (this.walkaboutStatus) {
	    let walkabout_status = this.walkaboutStatus;
	    this.walkaboutStatus = null;
	    switch (walkabout_status.status) {
	    case "on board":
		console.log("step: on board location=(" + walkabout_status.location.column + ", " + walkabout_status.location.row + ")");
		this.move(walkabout_status.location);
		state.status = "on board";
		break;

	    case "off board":
		console.log("step: status=" + walkabout_status.status);
		if (this.currentLocation.column == state.walkabout.startingLocation.column &&
		    this.currentLocation.row == state.walkabout.startingLocation.row) {
		    this.checkerboard.draw_startoffboard_arrow(this.currentLocation, state);
		} else {
		    this.checkerboard.draw_offboard_arrow(this.currentLocation, state);
		}
		this.move_off_board();
		state.status = "off board";
		break;

	    case "looped":
		console.log("step: status=" + walkabout_status.status);
		console.log("currentLocation: " + this.currentLocation.column + ", " + this.currentLocation.row);
		this.checkerboard.draw_end_arrow(this.currentLocation, state);
		this.remove_due_to_loop();
		console.log("looping -- clearing interval: " + state.intervalId);
		state.status = "looped";
		break;

	    default:
		console.log("unexpected walkabout status: '" + walkabout_status.status + "'");
		break;
	    }
	}
    }
}

export default CheckerPiece;
