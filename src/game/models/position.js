import GameObject from '../game_object';

class Position extends GameObject
{
    getClassName() {
        return Position.name;
    }

    get toStringParameters() {
	return new Map([
	    ["x", this.x],
	    ["y", this.y],
	]);
    }

    isEqualTo(that) {
	return this.x == that.x && this.y == that.y;
    }

    constructor(x, y) {
	super();
	this.x = x;
	this.y = y;
    }
}

export default Position;
