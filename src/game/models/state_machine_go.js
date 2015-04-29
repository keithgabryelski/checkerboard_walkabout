import GameObject from '../game_object';
import StateMachine from './state_machine';
import StateMachineStopped from './state_machine_stopped';

class StateMachineGo extends StateMachine
{
    getClassName() {
        return StateMachineGo.name;
    }

    enter_state(previous_state) {
	this.setup_ui();
	let state = this.state;
	this.state.intervalId = setInterval(function() {
	    console.log("fire walk_event: state.intervalId=" + state.intervalId);
	    state.game.walk_event();
	}, state.configurationControls.walkDelay * 1000);
	return null;
    }

    setup_ui() {
	super.setup_ui();
	this.mainControls.stopButtonEnabled = true;
    }

    walk() {
	this.state.shouldWalk = true;
    }

    stop() {
	this.state.shouldStop = true;
	clearInterval(this.state.intervalId);
	return new StateMachineStopped(this.state);
    }
}

export default StateMachineGo;
