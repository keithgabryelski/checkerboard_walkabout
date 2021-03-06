import GameObject from '../game_object';
import StateMachine from './state_machine';
import StateMachineReset from './state_machine_reset';

class StateMachineEnd extends StateMachine
{
    getClassName() {
        return StateMachineEnd.name;
    }

    enter_state(previous_state) {
	this.setup_ui();
	clearInterval(this.state.intervalId);
	return null;
    }

    setup_ui() {
	super.setup_ui();
	this.mainControls.resetButtonEnabled = true;
    }

    reset() {
	return new StateMachineReset(this.state);
    }
}

export default StateMachineEnd;
