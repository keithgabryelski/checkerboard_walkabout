import GameObject from '../game_object';

class MainControls extends GameObject
{
    getClassName() {
        return MainControls.name;
    }

    constructor() {
	super();
	this.disable_all();
    }

    disable_all() {
	this.goButtonEnabled = false;
	this.stepButtonEnabled = false;
	this.stopButtonEnabled = false;
	this.resetButtonEnabled = false;
    }
}

export default MainControls;
