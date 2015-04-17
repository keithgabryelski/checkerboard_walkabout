// The checker piece -- knows how to move a checker piece across the board
// 

class CheckerPiece
{
    // current_space: a CheckerboardSpace, the starting location for this CheckerPiece
    constructor(current_space, name) {
	this.name = name;
	this.originalSpace = this.currentSpace = current_space;
	this.circleRadius = this.checkerBoard.spaceSize * 0.50 / 2;
	this.audioBoard = null;
    }

    move_off_board() {
	this.draw_offboard_piece();
	this.currentSpace = null;
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

    mark_your_territory() {
	this.currentSpace.marked = true;
    }

    next_space() {
	return this.currentSpace.next_space()
    }

    get context() {
	return this.currentSpace.checkerBoard.canvasManager.context_for("piece");
    }

    get checkerBoard() {
	return this.currentSpace.checkerBoard;
    }
}

class NormalCheckerPiece extends CheckerPiece
{
    // current_space: a CheckerboardSpace, the starting location for this CheckerPiece
    constructor(current_space) {
	super(current_space, "normal");
	this.audioBoard = new NormalAudioBoard();
    }

    // animate the move of the CheckerPiece to CheckerboardSpace given, playing appropriate audio
    // to_space: CheckboardSpace to move to
    move(to_space) {
	this.audioBoard.play_move_sound();
	NormalCheckerPiece.animate_move(this, this.currentSpace.center_x, this.currentSpace.center_y, to_space, (new Date()).getTime());
	this.currentSpace = to_space;
    }

    draw() {
	let center_x = this.currentSpace.x * this.checkerBoard.spaceSize + (this.checkerBoard.spaceSize / 2);
	let center_y = this.currentSpace.y * this.checkerBoard.spaceSize + (this.checkerBoard.spaceSize / 2);
	this.draw_circle(center_x, center_y, 'black');
    }

    remove() {
	let center_x = this.currentSpace.x * this.checkerBoard.spaceSize + (this.checkerBoard.spaceSize / 2);
	let center_y = this.currentSpace.y * this.checkerBoard.spaceSize + (this.checkerBoard.spaceSize / 2);
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

    static animate_move(checker_piece, current_x, current_y, to_space, last_time) {
	let current_time = (new Date()).getTime();
        let time = current_time - last_time;

	let destination_x = to_space.center_x;
	let destination_y = to_space.center_y;

	// linear_speed: 500 should be the length of the move sound in milliseconds
        let linear_speed = 500 * time / 1000;
        // pixels / second
        let new_x = 0;
	let new_y = 0;

	if (current_x < destination_x) {
	    new_x = Math.min(current_x + linear_speed, destination_x);
	} else if (current_x > destination_x) {
	    new_x = Math.max(current_x - linear_speed, destination_x);
	} else {
	    new_x = destination_x;
	}

	if (current_y < destination_y) {
	    new_y = Math.min(current_y + linear_speed, destination_y);
	} else if (current_y > destination_y) {
	    new_y = Math.max(current_y - linear_speed, destination_y);
	} else {
	    new_y = destination_y;
	}

        // redraw
        checker_piece.clear_circle(current_x, current_y);
        checker_piece.draw_circle(new_x, new_y, 'black');

	if (new_x != destination_x || new_y != destination_y) {
	    window.requestAnimationFrame(function() {
		NormalCheckerPiece.animate_move(checker_piece, new_x, new_y, to_space, current_time);
            });
	}
    }
}

class QBertCheckerPiece extends CheckerPiece
{
    constructor(current_space) {
	super(current_space, "qbert");
	this.imageObj = new Image();
	this.imageObj.src = 'img/qbert.png';
	this.image_original_size = 48;
	this.space_original_size = 64;
	this.audioBoard = new QBertAudioBoard();
    }

    // animate the move of the CheckerPiece to CheckerboardSpace given, playing appropriate audio
    // to_space: CheckboardSpace to move to
    move(to_space) {
	this.audioBoard.play_move_sound();
	QBertCheckerPiece.animate_move(this, this.currentSpace.center_x, this.currentSpace.center_y, to_space, (new Date()).getTime());
	this.currentSpace = to_space;
    }

    image_size() {
	return this.image_original_size * this.checkerBoard.spaceSize / this.space_original_size ;
    }

    draw() {
	let center_x = this.currentSpace.x * this.checkerBoard.spaceSize + (this.checkerBoard.spaceSize / 2);
	let center_y = this.currentSpace.y * this.checkerBoard.spaceSize + (this.checkerBoard.spaceSize / 2);
	let context = this.context;
	let image = this.imageObj;
	let image_size = this.image_size();
        image.onload = function() {
	    context.drawImage(image, center_x - image_size/2, center_y - image_size/2, image_size, image_size);
        };
    }

    remove() {
	let center_x = this.currentSpace.x * this.checkerBoard.spaceSize + (this.checkerBoard.spaceSize / 2);
	let center_y = this.currentSpace.y * this.checkerBoard.spaceSize + (this.checkerBoard.spaceSize / 2);
	let context = this.context;
	let image_size = this.image_size();
	context.beginPath();
	context.clearRect(center_x - image_size/2, center_y - image_size/2, image_size, image_size);
    }

    static animate_move(checker_piece, current_x, current_y, to_space, last_time) {
	let current_time = (new Date()).getTime();
        let time = current_time - last_time;

	let destination_x = to_space.center_x;
	let destination_y = to_space.center_y;

	// linear_speed: 500 should be the length of the move sound in milliseconds
        let linear_speed = 500 * time / 1000;
        // pixels / second
        let new_x = 0;
	let new_y = 0;

	if (current_x < destination_x) {
	    new_x = Math.min(current_x + linear_speed, destination_x);
	} else if (current_x > destination_x) {
	    new_x = Math.max(current_x - linear_speed, destination_x);
	} else {
	    new_x = destination_x;
	}

	if (current_y < destination_y) {
	    new_y = Math.min(current_y + linear_speed, destination_y);
	} else if (current_y > destination_y) {
	    new_y = Math.max(current_y - linear_speed, destination_y);
	} else {
	    new_y = destination_y;
	}

        // redraw
	let context = checker_piece.context
	let image_size = checker_piece.image_size();
	context.beginPath();
	context.clearRect(current_x - image_size/2, current_y - image_size/2, image_size, image_size);
	context.drawImage(checker_piece.imageObj, new_x - image_size/2, new_y - image_size/2, image_size, image_size);

	if (new_x != destination_x || new_y != destination_y) {
	    window.requestAnimationFrame(function() {
		QBertCheckerPiece.animate_move(checker_piece, new_x, new_y, to_space, current_time);
            });
	}
    }
}
