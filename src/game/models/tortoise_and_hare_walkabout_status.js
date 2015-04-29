import GameObject from '../game_object';
import WalkaboutStatus from './walkabout_status';

class TortoiseAndHareWalkaboutStatus extends WalkaboutStatus
{
    getClassName() {
        return TortoiseAndHareWalkaboutStatus.name;
    }

    get toStringParameters() {
	return new Map([
	    ["status", this.status],
	    ["sL", this.startingLocation],
	    ["eL", this.endingLocation],
	    ["tL", this.tortoiseLocation],
	    ["hL", this.hareLocation],
	]);
    }
    constructor(starting_location, ending_location, status, tortoise_location, hare_location) {
	super(starting_location, ending_location, status);
	this.tortoiseLocation = tortoise_location;
	this.hareLocation = hare_location;
    }

    get locations() {
	return [this.tortoiseLocation, this.hareLocation];
    }
}

export default TortoiseAndHareWalkaboutStatus;
