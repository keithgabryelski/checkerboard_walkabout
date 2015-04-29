import GameObject from '../game_object';

class WalkaboutStatus extends GameObject
{
    getClassName() {
        return WalkaboutStatus.name;
    }

    get toStringParameters() {
	return new Map([
	    ["status", this.status],
	    ["sL", this.startingLocation],
	    ["eL", this.endingLocation]
	]);
    }
    constructor(starting_location, ending_location, status) {
	super();
	this.status = status;
	this.startingLocation = starting_location;
	this.endingLocation = ending_location;
    }

    get locations() {
	// implement
	return [];
    }
};

export default WalkaboutStatus;
