import MainControls from './main_controls';

class State
{
    constructor(game, configuration_controls) {
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
	this.shouldChangeCheckerPiece = false;
	this.spaceColors = ["grey", "white"];
	this.walkaboutStatus = null;
    }
}

export default State;
