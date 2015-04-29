import GameObject from '../game_object';
import Location from './location';
import TortoiseAndHareWalkaboutStatus from './tortoise_and_hare_walkabout_status';
import Walkabout from './walkabout';

class TortoiseAndHareWalkabout extends Walkabout
{
    getClassName() {
        return TortoiseAndHareWalkabout.name;
    }

    constructor(state) {
	super(state);
	this.tortoiseLocation = this.hareLocation = this.startingLocation;
	this.stepsToTake = 2;
	this.whoIsWalking = "hare";
	this.stepsTaken = 0;
    }

    get starting_location() {
	return [this.tortoiseLocation, this.hareLocation];
    }

    move_piece(state) {
	let last_hare_location = this.hareLocation;
	this.hareLocation = this.next_location(this.hareLocation);
	if (this.hareLocation == null) {
	    this.status = "off board";
	    return new TortoiseAndHareWalkaboutStatus(this.startingLocation, last_hare_location, this.status, this.tortoiseLocation, this.hareLocation);
	}
	if (this.hareLocation.isEqualTo(this.tortoiseLocation)) {
	    // looped!
	    this.status = "looped";
	    return new TortoiseAndHareWalkaboutStatus(this.startingLocation, this.hareLocation, this.status, this.tortoiseLocation, this.hareLocation);
	}

	this.status = "on board";
	if (++this.stepsTaken >= this.stepsToTake) {
	    this.stepsTaken = 0;
	    this.tortoiseLocation = this.next_location(this.tortoiseLocation);
	    if (this.hareLocation.isEqualTo(this.tortoiseLocation)) {
		// looped!
		this.status = "looped";
		return new TortoiseAndHareWalkaboutStatus(this.startingLocation, this.hareLocation, this.status, this.tortoiseLocation, this.hareLocation);
	    }
	    return new TortoiseAndHareWalkaboutStatus(this.startingLocation, null, this.status, this.tortoiseLocation, this.hareLocation);
	}

	return new TortoiseAndHareWalkaboutStatus(this.startingLocation, null, this.status, this.tortoiseLocation, this.hareLocation);
    }

}

export default TortoiseAndHareWalkabout;
