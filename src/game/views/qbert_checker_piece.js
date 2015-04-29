import CheckerPiece from './checker_piece';
import QBertAudioBoard from './qbert_audio_board';
import Position from '../models/position';

class QBertCheckerPiece extends CheckerPiece
{
    getClassName() {
        return QBertCheckerPiece.name;
    }

    constructor(canvas_manager, state, checkerboard, starting_location) {
	super(canvas_manager, state, checkerboard, starting_location);
	this.imageObj = new Image();
	this.imageObj.src = 'img/qbert.png';
	this.imageOriginalSize = 48;
	this.spaceOriginalSize = 64;
	this.audioBoard = new QBertAudioBoard();
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
	    let scale = 1.0 / (i+1);
	    QBertCheckerPiece.animate_move(this, from_position_center, to_position_center, scale, i, (new Date()).getTime());
	}
	this.currentLocation = to_locations;
    }

    image_size() {
	return this.imageOriginalSize * this.state.configurationControls.spaceSize / this.spaceOriginalSize ;
    }

    draw() {
	for (let i = 0; i < this.currentLocation.length; ++i) {
	    let location = this.currentLocation[i];
	    let position = this.positionCenter(location);
	    let scale = 1.0 / (i+1);
	    let context = this.canvasManager.context_for("piece" + i);
	    let image = this.imageObj;
	    let image_size = this.image_size() * scale;
            image.onload = function() {
		context.drawImage(image, position.x - image_size/2, position.y - image_size/2, image_size, image_size);
            };
	}
    }

    remove() {
	for (let i = 0; i < this.currentLocation.length; ++i) {
	    let location = this.currentLocation[i];
	    let position = this.positionCenter(location);
	    let scale = 1.0 / (i+1);
	    let context = this.canvasManager.context_for("piece" + i);
	    let image = this.imageObj;
	    let image_size = this.image_size() * scale;
	    context.beginPath();
	    context.clearRect(position.x - image_size/2, position.y - image_size/2, image_size, image_size);
	}
    }

    static animate_move(checker_piece, current_position, to_position, scale, piece_index, last_time) {
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
	let context = checker_piece.canvasManager.context_for("piece" + piece_index);
	let image_size = checker_piece.image_size() * scale;
	context.beginPath();
	context.clearRect(current_position.x - image_size/2, current_position.y - image_size/2, image_size, image_size);
	context.drawImage(checker_piece.imageObj, new_x - image_size/2, new_y - image_size/2, image_size, image_size);

	if (new_x != destination_x || new_y != destination_y) {
	    window.requestAnimationFrame(function() {
		QBertCheckerPiece.animate_move(checker_piece, new_position, to_position, scale, piece_index, current_time);
            });
	}
    }
}

export default QBertCheckerPiece;
