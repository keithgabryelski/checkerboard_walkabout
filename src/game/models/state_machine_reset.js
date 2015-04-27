import StateMachine from './state_machine';
import StateMachineReady from './state_machine_ready';

class StateMachineReset extends StateMachine
{
    constructor(state) {
	super(state, "StateMachineReset");
    }

    enter_state(previous_state) {
	this.setup_ui();
	this.state.shouldReset = true;
	return new StateMachineReady(this.state);
    }
}

export default StateMachineReset;
