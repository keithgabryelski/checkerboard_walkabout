let ipc = require("ipc");

class Machine
{
    constructor(canvas_id) {
	this.checkerBoard = null;
	this.theCheckerPiece = null; // accessed as checkerPiece
	this.walkabout = null;
	this.canvasManager = new CanvasManager(canvas_id);
	this.uiState = null;
	this.setup();
    }

    get checkerPiece() {
	return this.theCheckerPiece;
    }

    set checkerPiece(checker_piece) {
	this.theCheckerPiece = checker_piece;
	this.walker = null;
    }

    setup() {
	ipc.on("place piece", function() {
	    the_machine.place_piece_handler();
	})
	ipc.on("walk", function() {
	    the_machine.walk_handler();
	})
	ipc.on("cleanup", function() {
	    the_machine.cleanup_handler();
	})
	ipc.on("stopped", function() {
	    the_machine.stopped_handler();
	})
	this.change_ui_state(new UIStateReset(this))
    }

    change_ui_state(new_state) {
	if (this.uiState) {
	    this.uiState.leave_state(new_state);
	}
	let old_state = this.uiState;
	this.uiState = new_state;
	this.uiState.enter_state(old_state);
    }

    setup_checkerboard(board_size, space_size) {
	this.checkerBoard = new CheckerBoard(this.canvasManager, board_size, space_size);
	this.checkerBoard.render_board();
	this.checkerPiece = null;
    }

    setup_walkabout() {
	this.walkabout = new NaiveWalkabout(this.checkerPiece);
    }

    set_status(message) {
	let statusField = document.getElementById("statusField");
	statusField.innerHTML = message;
    }

    place_piece_handler() {
	this.place_piece();
	this.set_status("ready");
    }

    walk_handler() {
	this.walk();
    }

    cleanup_handler() {
	this.change_ui_state(new UIStateEnd(this))
    }

    stopped_handler() {
	this.set_status("stopped");
    }

    place_piece() {
	let x = Math.floor(Math.random() * this.checkerBoard.boardSize);
	let y = Math.floor(Math.random() * this.checkerBoard.boardSize);
	let random_space = this.checkerBoard.get_space(x, y);
	this.place_piece_at_space(random_space);
    }

    place_piece_at_space(checkerboard_space) {
	let checker_piece_style = document.getElementById("checker_piece_style").value;
	if (checker_piece_style == "qbert") {
	    this.checkerPiece = new QBertCheckerPiece(checkerboard_space);
	} else {
	    this.checkerPiece = new NormalCheckerPiece(checkerboard_space);
	}
	this.checkerPiece.draw_starting_piece();
	checkerboard_space.draw_start_arrow();
    }

    step() {
	let result = this.walkabout.move_piece();
	if (result == "moving") {
	    this.set_status("stepped");
	} else {
	    this.set_status(result);
	}
	ipc.send("stepped", result);
    }

    walk() {
	let result = this.walkabout.move_piece();
	this.set_status(result);
	ipc.send("walk", result);
    }

    change_checker_piece_style() {
	let checker_piece_style_element = document.getElementById("checker_piece_style");
	if (checker_piece_style_element.value == "normal") {
	    checker_piece_style_element.value = "qbert";
	} else {
	    checker_piece_style_element.value = "normal";
	}
	if (this.checkerPiece.originalSpace == this.checkerPiece.currentSpace) {
	    console.log("new checker piece style: " + checker_piece_style_element.value);
	    this.checkerPiece.remove();
	    this.place_piece_at_space(this.checkerPiece.originalSpace);
	}
    }
}
