import GameObject from '../game_object';

class Location extends GameObject
{
    getClassName() {
        return Location.name;
    }

    get toStringParameters() {
	return new Map([
	    ["row", this.row],
	    ["column", this.column],
	]);
    }

    isEqualTo(that) {
	return this.row == that.row && this.column == that.column;
    }

    constructor(column, row) {
	super();
	this.column = column;
	this.row = row;
    }
}

export default Location;
