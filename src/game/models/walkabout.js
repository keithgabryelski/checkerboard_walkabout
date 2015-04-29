import GameObject from '../game_object';
import Location from './location';

class Walkabout extends GameObject
{
    getClassName() {
        return Walkabout.name;
    }

    constructor(state) {
	super();
	this.status = "on board";
	let row = Math.floor(Math.random() * state.configurationControls.boardSize);
	let column = Math.floor(Math.random() * state.configurationControls.boardSize);
	this.startingLocation = new Location(column, row);
	this.state = state;
    }

    get starting_location() {
	return [this.startingLocation];
    }

    has_looped() {
	return this.status == "looped";
    }

    has_fallen_off_board() {
	return this.status == "off board";
    }

    next_location(from_location) {
	let next_row = from_location.row;
	let next_column = from_location.column;
	let index = from_location.row * this.state.configurationControls.boardSize + from_location.column;

	console.log("next_location: from=(" + from_location.column + ", " + from_location.row + "), index=" + index + ", direction=" + this.state.checkerboardSpaceDirections[index]);
	switch (this.state.checkerboardSpaceDirections[index]) {
	case 0:
	    next_row -= 1;
	    break;
	    
	case 1:
	    next_row += 1;
	    break;
	    
	case 2:
	    next_column -= 1;
	    break;

	case 3:
	    next_column += 1;
	    break;

	default:
	    return null;
	}

	if (next_row >= 0 &&
	    next_row < this.state.configurationControls.boardSize &&
	    next_column >= 0 &&
	    next_column < this.state.configurationControls.boardSize) {
	    return new Location(next_column, next_row);
	}

	return null;
    }

    move_piece(state) {
	//!! Fill in here.
	return null;
    }

}

export default Walkabout;
