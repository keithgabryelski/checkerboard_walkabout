class Walkabout
{
    constructor(checker_piece) {
	this.checkerPiece = checker_piece;
    }

    get context() {
	return this.checkerBoard.canvasManager.context_for("piece");
    }

    get checkerBoard() {
	return this.checkerPiece.originalSpace.checkerBoard;
    }
}

class NaiveWalkabout extends Walkabout
{
    constructor(checker_piece) {
	super(checker_piece);
	this.checkerPiece.mark_your_territory();
    }

    move_piece() {
	let next_space = this.checkerPiece.next_space();
	if (next_space == null) {
	    console.log("moving off board")
	    if (this.checkerPiece.currentSpace == this.checkerPiece.originalSpace) {
		this.checkerPiece.currentSpace.draw_startoffboard_arrow();
	    } else {
		this.checkerPiece.currentSpace.draw_offboard_arrow();
	    }
	    this.checkerPiece.move_off_board();
	    return "off board";
	} else if (next_space.marked) {
	    console.log("looping to: x=" + next_space.x + ", y=" + next_space.y + ", direction=" + next_space.direction)
	    this.checkerPiece.remove_due_to_loop();
	    this.checkerPiece.currentSpace.draw_end_arrow();
	    return "looped";
	} else {
	    console.log("moving to: x=" + next_space.x + ", y=" + next_space.y + ", direction=" + next_space.direction + ", marked=" + next_space.marked)
	    this.checkerPiece.move(next_space);
	    this.checkerPiece.mark_your_territory();
	    return "moving"
	}
    }

}
