import GameObject from '../game_object';
import WalkaboutStatus from './walkabout_status';

class NaiveWalkaboutStatus extends WalkaboutStatus
{
    getClassName() {
        return NaiveWalkaboutStatus.name;
    }

    get toStringParameters() {
	return new Map([
	    ["status", this.status],
	    ["sL", this.startingLocation],
	    ["eL", this.endingLocation],
	    ["cL", this.currentLocation],
	]);
    }

    constructor(starting_location, ending_location, status, location) {
	super(starting_location, ending_location, status);
	this.location = location;
    }

    get locations() {
	return [this.location];
    }
}

export default NaiveWalkaboutStatus;

