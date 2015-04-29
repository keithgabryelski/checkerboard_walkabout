import View from './view'
import Position from '../models/position'

class CheckerPiece extends View
{
    getClassName() {
        return CheckerPiece.name;
    }

    constructor(canvas_manager, state, checkerboard, starting_location) {
	super(canvas_manager, "piece");
	console.log("CheckerPiece.constructor: " + this);
	this.state = state;
	this.audioBoard = null;
	this.walkaboutStatus = null;
	this.drawStartingLocation = true;
	this.checkerboard = checkerboard;
	this.currentLocation = starting_location;
    }

    positionCenter(location) {
	return new Position(
	    location.column * this.state.configurationControls.spaceSize + this.state.configurationControls.spaceSize / 2,
	    location.row * this.state.configurationControls.spaceSize + this.state.configurationControls.spaceSize / 2
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
	console.log("checkerpiece render: " + this);
	if (this.drawStartingLocation) {
	    this.drawStartingLocation = false;
	    for (let i = 0; i < this.currentLocation.length; ++i) {
		let location = this.currentLocation[i];
		let position = this.positionCenter(location);
		//let scale = 1.0 / (i+1);
		let scale = 1.0;
		this.draw_starting_piece(location, scale);
	    }
	    this.checkerboard.draw_start_arrow(this.currentLocation[0], state);
	}

	if (this.walkaboutStatus) {
	    let walkabout_status = this.walkaboutStatus;
	    this.walkaboutStatus = null;
	    console.log("rendering checkerpiece: " + walkabout_status);
	    switch (walkabout_status.status) {
	    case "on board":
		console.log("rendering walkabout status: " + walkabout_status.locations);
		this.move(walkabout_status.locations);
		state.status = "on board";
		break;

	    case "off board":
		if (walkabout_status.endingLocation.isEqualTo(walkabout_status.startingLocation)) {
		    this.checkerboard.draw_startoffboard_arrow(walkabout_status.endingLocation, state);
		} else {
		    this.checkerboard.draw_offboard_arrow(walkabout_status.endingLocation, state);
		}
		this.move_off_board();
		state.status = "off board";
		break;

	    case "looped":
		this.checkerboard.draw_end_arrow(walkabout_status.endingLocation, state);
		this.remove_due_to_loop();
		state.status = "looped";
		break;

	    default:
		console.log("unexpected walkabout status: " + walkabout_status);
		break;
	    }
	}
    }
}

export default CheckerPiece;
