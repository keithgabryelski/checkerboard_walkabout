import View from './view'
import Position from '../models/position'

class CheckerPiece extends View
{
    constructor(canvas_manager, name, state) {
	super(canvas_manager, "piece");
	console.log("CheckerPiece.constructor: name=" + name);
	this.name = name;
	this.state = state;
	this.audioBoard = null;
	this.currentLocation = null;
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

    render() {
	console.log("checkerpiece render: " + this.name);
    }
}

export default CheckerPiece;
