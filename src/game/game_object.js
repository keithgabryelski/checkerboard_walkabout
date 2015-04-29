class GameObject {
    constructor() {
    }
    
    getClassName() {
        return GameObject.name;
    }

    get parametersToString() {
	let values = Array();
	for (let [key, value] of this.toStringParameters) {
	    values.push(key + "=" + value);
	}
	return values;
    }

    get toStringParameters() {
	return new Map();
    }

    toString() {
	return "#" + this.getClassName() + "<" + this.parametersToString.join(', ') + ">";
    }
}

export default GameObject;
