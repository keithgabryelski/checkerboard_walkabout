import GameObject from '../game_object';
import StateMachine from './state_machine';
import StateMachineStopped from './state_machine_stopped';
import StateMachineGo from './state_machine_go';
import StateMachineReset from './state_machine_reset';

class StateMachineReady extends StateMachine
{
    getClassName() {
        return StateMachineReady.name;
    }

    enter_state(previous_state) {
	this.setup_ui();
	return null;
    }

    setup_ui() {
	super.setup_ui()
	this.mainControls.goButtonEnabled = true;
	this.mainControls.stepButtonEnabled = true;
	this.mainControls.resetButtonEnabled = true;
	this.configurationControls.controlsEnabled = true;
    }

    validate() {
	console.log("validate called");
	let board_size = this.boardSize;
	let space_size = this.spaceSize;
	if (board_size == null || space_size == null) {
	    this.mainControls.goButtonEnabled = false;
	    this.mainControls.stepButtonEnabled = false;
	    this.mainControls.resetButtonEnabled = false;
	    return false;
	}

	this.mainControls.goButtonEnabled = true;
	this.mainControls.stepButtonEnabled = true;
	this.mainControls.resetButtonEnabled = true;
	return true;
    }

    configure() {
	if (this.validate() == false) {
	    return null;
	}
	this.state.shouldReset = true;
	return null;
    }

    step() {
	if (this.validate() == false) {
	    return null;
	}
	this.state.shouldStep = true;
	return new StateMachineStopped(this.state);
    }

    go() {
	if (this.validate() == false) {
	    return null;
	}
	this.state.shouldWalk = true;
	return new StateMachineGo(this.state);
    }

    reset() {
	console.log("reset called: this=" + this + ", this.validate=" + this.validate);
	if (this.validate() == false) {
	    return null;
	}
	console.log("reset called 2");
	return new StateMachineReset(this.state);
    }
}

export default StateMachineReady;
