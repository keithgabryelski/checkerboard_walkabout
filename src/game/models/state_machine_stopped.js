import GameObject from '../game_object';
import StateMachine from './state_machine';
import StateMachineGo from './state_machine_go';
import StateMachineReset from './state_machine_reset';

class StateMachineStopped extends StateMachine
{
    getClassName() {
        return StateMachineStopped.name;
    }

    enter_state(previous_state) {
	this.setup_ui();
	return null;
    }

    setup_ui() {
	super.setup_ui();
	this.mainControls.goButtonEnabled = true;
	this.mainControls.stepButtonEnabled = true;
	this.mainControls.resetButtonEnabled = true;
    }

    step() {
	this.state.shouldStep = true;
	return null;
    }

    go() {
	this.state.shouldWalk = true;
	return new StateMachineGo(this.state);
    }

    reset() {
	return new StateMachineReset(this.state);
    }
}

export default StateMachineStopped;
