import CheckerPiece from './checker_piece'
import NormalAudioBoard from './normal_audio_board'
import Position from '../models/position'

class NormalCheckerPiece extends CheckerPiece
{
    // current_space: a CheckerboardSpace, the starting location for this CheckerPiece
    constructor(canvas_manager, state, checkerboard) {
	super(canvas_manager, "normal", state, checkerboard);
	this.circleRadius = state.configurationControls.spaceSize * 0.50 / 2;
	this.audioBoard = new NormalAudioBoard();
    }

    // animate the move of the CheckerPiece to CheckerboardSpace given, playing appropriate audio
    // to_space: CheckboardSpace to move to
    move(to_location) {
	this.audioBoard.play_move_sound();
	let to_position_center = new Position(
	    to_location.column * this.state.configurationControls.spaceSize + this.state.configurationControls.spaceSize / 2,
	    to_location.row * this.state.configurationControls.spaceSize + this.state.configurationControls.spaceSize / 2
	)
	NormalCheckerPiece.animate_move(this, this.currentPositionCenter, to_position_center, (new Date()).getTime());
	this.currentLocation = to_location;
    }

    draw() {
	console.log("NormalCheckerPiece.draw(): column=" + this.currentLocation.column + ", row=" + this.currentLocation.row);
	let center_x = this.currentLocation.column * this.state.configurationControls.spaceSize + (this.state.configurationControls.spaceSize / 2);
	let center_y = this.currentLocation.row * this.state.configurationControls.spaceSize + (this.state.configurationControls.spaceSize / 2);
	this.draw_circle(center_x, center_y, 'black');
    }

    remove() {
	console.log("remove: " + this.currentLocation.column + ", " + this.currentLocation.row);
	let center_x = this.currentLocation.column * this.state.configurationControls.spaceSize + (this.state.configurationControls.spaceSize / 2);
	let center_y = this.currentLocation.row * this.state.configurationControls.spaceSize + (this.state.configurationControls.spaceSize / 2);
	this.clear_circle(center_x, center_y);
    }

    draw_circle(center_x, center_y, color) {
	// console.log("draw_circle(" + center_x + ", " + center_y + ", " + this.circleRadius + ", ...) color: " + color);
	let context = this.context
	context.beginPath();
	context.arc(center_x, center_y, this.circleRadius, 0, 2 * Math.PI, false);
	context.fillStyle = color;
	context.fill();
    }

    clear_circle(center_x, center_y) {
	let context = this.context
	context.beginPath();
	context.clearRect(center_x - this.circleRadius - 1, center_y - this.circleRadius - 1, this.circleRadius * 2 + 2, this.circleRadius * 2 + 2);
    }

    static animate_move(checker_piece, current_position, to_position, last_time) {
	let current_time = (new Date()).getTime();
        let time = current_time - last_time;

	let destination_x = to_position.x;
	let destination_y = to_position.y;

	// linear_speed: 500 should be the length of the move sound in milliseconds
        let linear_speed = 500 * time / 1000;
        // pixels / second
        let new_x = 0;
	let new_y = 0;

	if (current_position.x < destination_x) {
	    new_x = Math.min(current_position.x + linear_speed, destination_x);
	} else if (current_position.x > destination_x) {
	    new_x = Math.max(current_position.x - linear_speed, destination_x);
	} else {
	    new_x = destination_x;
	}

	if (current_position.y < destination_y) {
	    new_y = Math.min(current_position.y + linear_speed, destination_y);
	} else if (current_position.y > destination_y) {
	    new_y = Math.max(current_position.y - linear_speed, destination_y);
	} else {
	    new_y = destination_y;
	}

        // redraw
        checker_piece.clear_circle(current_position.x, current_position.y);
        checker_piece.draw_circle(new_x, new_y, 'black');

	if (new_x != destination_x || new_y != destination_y) {
	    window.requestAnimationFrame(function() {
		NormalCheckerPiece.animate_move(checker_piece, new Position(new_x, new_y), to_position, current_time);
            });
	}
    }
}
export default NormalCheckerPiece;
