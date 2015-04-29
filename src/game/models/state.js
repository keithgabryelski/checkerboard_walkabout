import GameObject from '../game_object';
import MainControls from './main_controls';

class State extends GameObject
{
    getClassName() {
        return State.name;
    }
    
    get toStringParameters() {
	return new Map([
	    ['walkabout', this.walkabout],
	    ['status', this.status],
	])
    }

    constructor(game, configuration_controls) {
	super();
	this.game = game;
	this.mainControls = new MainControls();
	this.configurationControls = configuration_controls;
	this.statusColor = "black";
	this.status = "booting";
	this.checkerboardSpaceDirections = null;
	this.walkabout = null;
	this.shouldReset = false;
	this.shouldStep = false;
	this.shouldWalk = false;
	this.shouldStop = false;
	this.spaceColors = ["grey", "white"];
	this.walkaboutStatus = null;
	this.heading = null;
    }
}

export default State;
