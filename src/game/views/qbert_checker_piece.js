import CheckerPiece from './checker_piece';
import QBertAudioBoard from './qbert_audio_board';
import Position from '../models/position';

class QBertCheckerPiece extends CheckerPiece
{
    constructor(canvas_manager, state, checkerboard) {
	super(canvas_manager, "qbert", state, checkerboard);
	this.imageObj = new Image();
	this.imageObj.src = 'img/qbert.png';
	this.imageOriginalSize = 48;
	this.spaceOriginalSize = 64;
	this.audioBoard = new QBertAudioBoard();
    }

    // animate the move of the CheckerPiece to CheckerboardSpace given, playing appropriate audio
    // to_space: CheckboardSpace to move to
    move(to_location) {
	this.audioBoard.play_move_sound();
	let to_position_center = new Position(
	    to_location.column * this.state.configurationControls.spaceSize + this.state.configurationControls.spaceSize / 2,
	    to_location.row * this.state.configurationControls.spaceSize + this.state.configurationControls.spaceSize / 2
	)
	QBertCheckerPiece.animate_move(this, this.currentPositionCenter, to_position_center, (new Date()).getTime());
	this.currentLocation = to_location;
    }

    image_size() {
	return this.imageOriginalSize * this.state.configurationControls.spaceSize / this.spaceOriginalSize ;
    }

    draw() {
	let center_x = this.currentLocation.column * this.state.configurationControls.spaceSize + (this.state.configurationControls.spaceSize / 2);
	let center_y = this.currentLocation.row * this.state.configurationControls.spaceSize + (this.state.configurationControls.spaceSize / 2);
	let context = this.context;
	let image = this.imageObj;
	let image_size = this.image_size();
        image.onload = function() {
	    context.drawImage(image, center_x - image_size/2, center_y - image_size/2, image_size, image_size);
        };
    }

    remove() {
	let center_x = this.currentLocation.column * this.state.configurationControls.spaceSize + (this.state.configurationControls.spaceSize / 2);
	let center_y = this.currentLocation.row * this.state.configurationControls.spaceSize + (this.state.configurationControls.spaceSize / 2);
	let context = this.context;
	let image_size = this.image_size();
	context.beginPath();
	context.clearRect(center_x - image_size/2, center_y - image_size/2, image_size, image_size);
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
	let context = checker_piece.context
	let image_size = checker_piece.image_size();
	context.beginPath();
	context.clearRect(current_position.x - image_size/2, current_position.y - image_size/2, image_size, image_size);
	context.drawImage(checker_piece.imageObj, new_x - image_size/2, new_y - image_size/2, image_size, image_size);

	if (new_x != destination_x || new_y != destination_y) {
	    window.requestAnimationFrame(function() {
		QBertCheckerPiece.animate_move(checker_piece, new Position(new_x, new_y), to_position, current_time);
            });
	}
    }
}

export default QBertCheckerPiece;
