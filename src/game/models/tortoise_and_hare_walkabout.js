import Location from './location';
import WalkaboutStatus from './walkabout_status';
import Walkabout from './walkabout';

class TortoiseAndHareWalkabout extends Walkabout
{
    constructor(state) {
	super(state);
	this.tortoiseCurrentLocation = this.hareCurrentLocation = this.startingLocation;
    }

    move_piece(state) {
	this.currentLocation = this.next_location(this.currentLocation);
	if (this.currentLocation == null) {
	    this.status = "off board";
	} else if (this.is_space_marked(this.currentLocation)) {
	    console.log("looping to: column=" + this.currentLocation.column + ", row=" + this.currentLocation.row)
	    this.status = "looped";
	} else {
	    console.log("on board to: column=" + this.currentLocation.column + ", row=" + this.currentLocation.row)
	    this.status = "on board";
	    this.mark_your_territory();
	}
	return new WalkaboutStatus(this.currentLocation, this.status);
    }

}

export default TortoiseAndHareWalkabout;
