import GameObject from './game_object';
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
import TortoiseAndHareWalkabout from './models/tortoise_and_hare_walkabout';

// game controller
class Game extends GameObject {
    getClassName() {
	return Game.name;
    }

    constructor(configuration) {
	super();
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
	console.log("changing state from: " + this.stateMachine + ", to: " + new_state)
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
	console.log("state: " + this.stateMachine + ", method: " + method);
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
		state.heading = "Checkerboard Walkabout: Naive";
		break;
	    case 'tortoise and hare':
		state.walkabout = new TortoiseAndHareWalkabout(state);
		state.heading = "Checkerboard Walkabout: Tortoise and Hare";
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
	    this.checkerPiece.walkaboutStatus = state.walkaboutStatus;
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

	if (state.heading) {
	    console.log("setting heading: " + state.heading);
	    let headingField = document.getElementById("headingField");
	    headingField.innerHTML = state.heading;
	    state.heading = null;
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
		console.log("step: status=" + walkabout_status);
		state.status = "on board";
		break;

	    case "off board":
		console.log("step: status=" + walkabout_status);
		state.status = "off board";
		break;

	    case "looped":
		console.log("step: status=" + walkabout_status);
		state.status = "looped";
		break;

	    default:
		console.log("unexpected walkabout status=" + walkabout_status);
		break;
	    }
	}
	
	this.checkerboard.render(state);

	if (!this.checkerPiece) {
	    switch (state.configurationControls.checkerPieceStyle) {
	    case "normal":
		console.log("making normal checkerpiece: " + state.walkabout.starting_location);
		this.checkerPiece = new NormalCheckerPiece(this.canvasManager, state, this.checkerboard, state.walkabout.starting_location);
		break;
	    case "qbert":
		this.checkerPiece = new QBertCheckerPiece(this.canvasManager, state, this.checkerboard, state.walkabout.starting_location);
		break;
	    default:
		console.log("unknown CheckerPieceStyle: '" + state.configurationControls.checkerPieceStyle + "'");
		break;
	    }
	    state.status = "on board";
	}
	
	this.checkerPiece.render(state);
    }
}

export default Game;
