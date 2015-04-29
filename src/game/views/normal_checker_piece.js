import CheckerPiece from './checker_piece'
import NormalAudioBoard from './normal_audio_board'
import Position from '../models/position'

class NormalCheckerPiece extends CheckerPiece
{
    getClassName() {
        return NormalCheckerPiece.name;
    }

    constructor(canvas_manager, state, checkerboard, starting_location) {
	super(canvas_manager, state, checkerboard, starting_location);
	this.circleRadius = state.configurationControls.spaceSize * 0.50 / 2;
	this.audioBoard = new NormalAudioBoard();
    }

    move(to_locations) {
	this.audioBoard.play_move_sound();
	console.log("moving: " + to_locations.length);
	for (let i = 0; i < to_locations.length; ++i) {
	    let from_location = this.currentLocation[i];
	    let to_location = to_locations[i];
	    console.log("moving from: " + from_location + ", to: " + to_location);
	    let from_position_center = this.positionCenter(from_location);
	    let to_position_center = this.positionCenter(to_location);
	    //let scale = 1.0 / (i+1);
	    let scale = 1.0;
	    NormalCheckerPiece.animate_move(this, from_position_center, to_position_center, scale, (new Date()).getTime());
	}
	this.currentLocation = to_locations;
    }

    draw() {
	for (let i = 0; i < this.currentLocation.length; ++i) {
	    let location = this.currentLocation[i];
	    let position = this.positionCenter(location);
	    //let scale = 1.0 / (i+1);
	    let scale = 1.0;
	    this.draw_circle(position, scale, 'black');
	}
    }

    remove() {
	for (let i = 0; i < this.currentLocation.length; ++i) {
	    let location = this.currentLocation[i];
	    let position = this.positionCenter(location);
	    //let scale = 1.0 / (i+1);
	    let scale = 1.0;
	    this.clear_circle(position, scale);
	}
    }

    draw_circle(position, scale, color) {
	let context = this.context
	context.beginPath();
	context.arc(position.x, position.y, this.circleRadius * scale, 0, 2 * Math.PI, false);
	context.fillStyle = color;
	context.fill();
    }

    clear_circle(position, scale) {
	let context = this.context
	context.beginPath();
	context.clearRect(position.x - (this.circleRadius * scale) - 1, position.y - (this.circleRadius * scale) - 1, (this.circleRadius * scale) * 2 + 2, (this.circleRadius * scale) * 2 + 2);
    }

    static animate_move(checker_piece, current_position, to_position, scale, last_time) {
	console.log("antimate move: " + checker_piece + ", current: " + current_position + ", to: " + to_position + ", scale: " + scale);
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

	let new_position = new Position(new_x, new_y);

        // redraw
        checker_piece.clear_circle(current_position, scale);
        checker_piece.draw_circle(new_position, scale, 'black');

	if (!new_position.isEqualTo(to_position)) {
	    window.requestAnimationFrame(function() {
		NormalCheckerPiece.animate_move(checker_piece, new_position, to_position, scale, current_time);
            });
	}
    }
}
export default NormalCheckerPiece;
