import GameObject from '../game_object';
import StateMachineReset from './state_machine_reset';

class StateMachine extends GameObject
{
    getClassName() {
        return StateMachine.name;
    }

    constructor(state) {
	super();
	this.state = state;
	console.log("constructing: " + this);
    }

    get mainControls() {
	return this.state.mainControls;
    }

    get configurationControls() {
	return this.state.configurationControls;
    }

    enter_state(previous_state) {
	return null;
    }

    change_piece_style() {
	if (this.state.configurationControls.checkerPieceStyle == "normal") {
	    this.state.configurationControls.checkerPieceStyle = "qbert";
	} else {
	    this.state.configurationControls.checkerPieceStyle = "normal";
	}
	console.log("new piece style is now: " + this.state.configurationControls.checkerPieceStyle);
	return new StateMachineReset(this.state);
    }

    change_walkabout_style() {
	if (this.state.configurationControls.walkaboutStyle == "naive") {
	    this.state.configurationControls.walkaboutStyle = "tortoise and hare";
	} else {
	    this.state.configurationControls.walkaboutStyle = "naive";
	}
	console.log("new walkabout style is now: " + this.state.configurationControls.walkaboutStyle);
	return new StateMachineReset(this.state);
    }

    setup_ui() {
	this.mainControls.disable_all();
	this.configurationControls.disable();
    }

    set_status(message) {
	this.state.statusColor = "black";
	this.state.status = message;
    }

    set_error_status(message) {
	this.state.statusColor = "red";
	this.state.status = message;
    }

    get boardSize() {
	let board_size = parseInt(document.getElementById("board_size").value);
	if (board_size > 0) {
	    return board_size;
	}
	this.set_error_status("board size must be a number greater than zero");
	return null;
    }

    get spaceSize() {
	let space_size = parseInt(document.getElementById("space_size").value);
	if (space_size > 0) {
	    return space_size;
	}
	this.set_error_status("space size must be a number greater than zero");
	return null;
    }
}

export default StateMachine;
