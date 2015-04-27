import Location from './location';
import WalkaboutStatus from './walkabout_status';
import Walkabout from './walkabout';

class NaiveWalkabout extends Walkabout
{
    constructor(state) {
	super(state);
	this.currentLocation = this.startingLocation;
	this.walkaboutArea = Array(state.configurationControls.boardSize * state.configurationControls.boardSize);
	for (let row = 0; row < state.configurationControls.boardSize; ++row) {
	    for (let column = 0; column < state.configurationControls.boardSize; ++column) {
		let index = row * state.configurationControls.boardSize + column;
		this.walkaboutArea[index] = false;
	    }
	}
	this.mark_your_territory();
    }

    mark_your_territory() {
	let index = this.currentLocation.row * this.state.configurationControls.boardSize + this.currentLocation.column;
	this.walkaboutArea[index] = true;
    }

    is_space_marked(location) {
	let index = location.row * this.state.configurationControls.boardSize + location.column;
	return this.walkaboutArea[index];
    }

    move_piece() {
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

export default NaiveWalkabout;
