class CheckerBoard
{
    constructor(canvas_manager, board_size, space_size) {
	this.boardSize = board_size;
	this.spaceSize = space_size;
	this.colors = ["grey", "white"]
	this.checkerBoardSpaces = Array(board_size * board_size);
	this.canvasManager = canvas_manager;
	this.canvas = this.canvasManager.canvas_for('checkerboard');
    }

    get_space(x, y) {
	if (x < 0 || y < 0 || x >= this.boardSize || y >= this.boardSize) {
	    return null;
	}
	return this.checkerBoardSpaces[this.space_location(x, y)];
    }

    space_location(x, y) {
	return y * this.boardSize + x;
    }

    create_space(x, y, direction) {
	let space = new CheckerboardSpace(this, x, y, direction);
	let index = this.space_location(x, y)
	this.checkerBoardSpaces[index] = space;
	space.render_space();
	return space;
    }

    render_board() {
	this.canvasManager.wipe_canvases();
	this.canvasManager.resize_canvases(this.boardSize * this.spaceSize);
	this.canvas.style.border = "1px solid black";
	for (let row = 0; row < this.boardSize; ++row) {
	    for (let column = 0; column < this.boardSize; ++column) {
		let direction = Math.floor(Math.random() * 4);
		this.create_space(row, column, direction);
	    }
	}
    }
}
