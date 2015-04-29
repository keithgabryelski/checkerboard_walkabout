import Location from './location';
import NaiveWalkaboutStatus from './naive_walkabout_status';
import Walkabout from './walkabout';

import GameObject from '../game_object';

class NaiveWalkabout extends Walkabout
{
    getClassName() {
        return NaiveWalkabout.name;
    }

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

    move_piece(state) {
	console.log("move_piece(): " + this.currentLocation);
	let last_location = this.currentLocation;
	this.currentLocation = this.next_location(this.currentLocation);
	if (this.currentLocation == null) {
	    this.status = "off board";
	    console.log("off board: " + last_location);
	    return new NaiveWalkaboutStatus(this.startingLocation, last_location, this.status, this.currentLocation);
	} else if (this.is_space_marked(this.currentLocation)) {
	    console.log("looping to: " + last_location)
	    this.status = "looped";
	    return new NaiveWalkaboutStatus(this.startingLocation, last_location, this.status, this.currentLocation);
	} else {
	    console.log("on board to: " + this.currentLocation)
	    this.status = "on board";
	    this.mark_your_territory();
	    return new NaiveWalkaboutStatus(this.startingLocation, null, this.status, this.currentLocation);
	}
    }

}

export default NaiveWalkabout;
