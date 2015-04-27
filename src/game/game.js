import StateMachineReset from './models/state_machine_reset';
import StateMachineEnd from './models/state_machine_end';
import State from './models/state';
import CanvasManager from './views/canvas_manager';
import ConfigurationControls from './models/configuration_controls';
import Checkerboard from './views/checkerboard';
import NormalCheckerPiece from './views/normal_checker_piece';
import QBertCheckerPiece from './views/qbert_checker_piece';
import Location from './models/location';
import NaiveWalkabout from './models/naive_walkabout';

// game controller
class Game {
    constructor(configuration) {
	// game models
	this.stateMachine = null;

	let board_size = parseInt(document.getElementById("board_size").value);
	let space_size = parseInt(document.getElementById("space_size").value);
	let checker_piece_style = document.getElementById("checker_piece_style").value;
	let walkabout_style = document.getElementById("walkabout_style").value;

	console.log("configuration: board_size=" + board_size + ", space_size=" + space_size + ", styles: (" + checker_piece_style + ", " + walkabout_style + ")");
	
	this.state = new State(this, new ConfigurationControls(board_size, space_size, checker_piece_style, walkabout_style));

	// the views
	this.canvasManager = new CanvasManager(this.state.configurationControls);
	this.checkerboard = null;
	this.checkerPiece = null;

	this.change_state(new StateMachineReset(this.state));
    }

    // ui
    change_state(new_state) {
	console.log("changing state from: " + (this.stateMachine && this.stateMachine.name) + ", to: " + (new_state.name))
	let old_state = this.stateMachine;
	this.stateMachine = new_state;
	new_state = this.stateMachine.enter_state(old_state);
	if (new_state) {
	    this.change_state(new_state);
	}
	let next_state = this.update(this.state);
	if (next_state) {
	    this.change_state(next_state);
	}
	this.render(this.state);
    }

    invoke(method, ...args) {
	console.log("state: " + this.stateMachine.name + ", method: " + method);
	let new_state = method.apply(this.stateMachine, args)
	if (new_state) {
	    this.change_state(new_state);
	}
	let next_state = this.update(this.state);
	if (next_state) {
	    this.change_state(next_state);
	}
	this.render(this.state);
    }

    go_button_press() {
	this.invoke(this.stateMachine.go);
    }

    stop_button_press() {
	this.invoke(this.stateMachine.stop);
    }

    step_button_press() {
	this.invoke(this.stateMachine.step);
    }

    reset_button_press() {
	this.invoke(this.stateMachine.reset);
    }

    change_button_press() {
	this.invoke(this.stateMachine.change_piece_style);
    }

    other_change_request() {
	this.invoke(this.stateMachine.change_walkabout_style);
    }

    configure_button_press() {
	this.invoke(this.stateMachine.configure);
    }

    board_size_change() {
	this.invoke(this.stateMachine.board_size, new_size);
    }

    space_size_change() {
	this.invoke(this.stateMachine.space_size, space_size);
    }

    walk_event() {
	this.invoke(this.stateMachine.walk);
    }

    checkerboard_location(location) {
	return location.row * this.state.configurationControls.boardSize + location.column;
    }

    update(state) {
	state.configurationControls.boardSize = parseInt(document.getElementById("board_size").value);
	state.configurationControls.spaceSize = parseInt(document.getElementById("space_size").value);
	if (state.shouldReset) {
	    state.shouldReset = false;
	    this.canvasManager = new CanvasManager(state.configurationControls);
	    state.walkabout = null;
	    this.checkerboard = null;
	    this.checkerPiece = null;
	}
	if (!state.walkabout) {
	    switch (state.configurationControls.walkaboutStyle) {
	    case 'naive':
		state.walkabout = new NaiveWalkabout(state);
		break;
	    default:
		console.log("!! OH NOES! unknown walkabout style '" + state.configurationControls.walkabout_style + "'");
		break;
	    }
	}
	if (state.shouldWalk) {
	    if (state.shouldStop) {
		console.log("we should stop");
		state.shouldStop = false;
		state.shouldWalk = false;
	    } else {
		console.log("we should walk");
		state.shouldStep = true;
		state.shouldWalk = false;
	    }
	}
	if (state.shouldStep) {
	    console.log("we should step");
	    state.shouldStep = false;
	    state.walkaboutStatus = state.walkabout.move_piece(state);
	    switch (state.walkaboutStatus.status) {
	    case "on board":
		break;
	    case "off board":
	    case "looped":
		state.shouldWalk = false;
		clearInterval(state.intervalId);
		return new StateMachineEnd(state);
	    default:
		console.log("!!! OH NOES! bad walkabout status: '" + state.walkaboutStatus.status + "' -- runaway!");
		state.walkaboutStatus = null;
		break;
	    }
	}
	if (!this.checkerboard) {
	    console.log("resetting checkerboard");
	    state.checkerboardSpaceDirections = Array(state.configurationControls.boardSize * state.configurationControls.boardSize);
	    for (let row = 0; row < state.configurationControls.boardSize; ++row) {
		for (let column = 0; column < state.configurationControls.boardSize; ++column) {
		    let direction = Math.floor(Math.random() * 4);
		    console.log("(" + column + ", " + row + ")=" + direction);
		    let index = this.checkerboard_location(new Location(column, row))
		    state.checkerboardSpaceDirections[index] = direction;
		}
	    }
	    this.checkerboard = new Checkerboard(this.canvasManager, state);
	}
	return null;
    }

    render(state) {
	if (state.status) {
	    console.log("setting status: " + state.status);
	    let statusField = document.getElementById("statusField");
	    statusField.innerHTML = state.status;
	    state.status = null;
	}

	document.getElementById("go").disabled = !state.mainControls.goButtonEnabled;
	document.getElementById("step").disabled = !state.mainControls.stepButtonEnabled;
	document.getElementById("stop").disabled = !state.mainControls.stopButtonEnabled;
	document.getElementById("reset").disabled = !state.mainControls.resetButtonEnabled;

	document.getElementById("board_size").disabled = !state.configurationControls.controlsEnabled;
	document.getElementById("space_size").disabled = !state.configurationControls.controlsEnabled;
	document.getElementById("configure").disabled = !state.configurationControls.controlsEnabled;

	if (state.walkaboutStatus) {
	    let walkabout_status = state.walkaboutStatus;
	    state.walkaboutStatus = null;
	    switch (walkabout_status.status) {
	    case "on board":
		console.log("step: on board location=(" + walkabout_status.location.column + ", " + walkabout_status.location.row + ")");
		this.checkerPiece.move(walkabout_status.location);
		state.status = "on board";
		break;

	    case "off board":
		console.log("step: status=" + walkabout_status.status);
		if (this.checkerPiece.currentLocation.column == state.walkabout.startingLocation.column &&
		    this.checkerPiece.currentLocation.row == state.walkabout.startingLocation.row) {
		    this.checkerboard.draw_startoffboard_arrow(this.checkerPiece.currentLocation, state);
		} else {
		    this.checkerboard.draw_offboard_arrow(this.checkerPiece.currentLocation, state);
		}
		this.checkerPiece.move_off_board();
		state.status = "off board";
		break;

	    case "looped":
		console.log("step: status=" + walkabout_status.status);
		console.log("currentLocation: " + this.checkerPiece.currentLocation.column + ", " + this.checkerPiece.currentLocation.row);
		this.checkerboard.draw_end_arrow(this.checkerPiece.currentLocation, state);
		this.checkerPiece.remove_due_to_loop();
		console.log("looping -- clearing interval: " + state.intervalId);
		state.status = "looped";
		break;

	    default:
		console.log("unexpected walkabout status: '" + walkabout_status.status + "'");
		break;
	    }
	}
	
	this.checkerboard.render(state);

	if (state.shouldChangeCheckerPiece) {
	    state.shouldChangeCheckerPiece = false;
	    console.log("should change checkerpiece to: " + state.configurationControls.checkerPieceStyle);
	    if (this.checkerPiece) {
		this.checkerPiece.remove();
	    }
	    this.checkerPiece = null;
	}

	if (!this.checkerPiece) {
	    switch (state.configurationControls.checkerPieceStyle) {
	    case "normal":
		this.checkerPiece = new NormalCheckerPiece(this.canvasManager, state);
		break;
	    case "qbert":
		this.checkerPiece = new QBertCheckerPiece(this.canvasManager, state);
		break;
	    default:
		console.log("unknown CheckerPieceStyle: '" + state.configurationControls.checkerPieceStyle + "'");
		break;
	    }
	    this.checkerPiece.currentLocation = state.walkabout.currentLocation;
	    this.checkerPiece.draw_starting_piece();
	    this.checkerboard.draw_start_arrow(this.checkerPiece.currentLocation, state)
	    state.status = "on board";
	}
	
	this.checkerPiece.render();
    }
}

export default Game;
