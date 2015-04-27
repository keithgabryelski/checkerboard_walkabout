class MainControls
{
    constructor() {
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
