class UIState
{
    constructor(the_machine) {
	this.machine = the_machine;
    }

    enter_state(previous_state) {
    }

    leave_state(next_state_class) {
    }
	
    handle_event(event) {
	switch (event) {
	case "change":
	    this.machine.change_checker_piece_style();
	    return true;

	default:
	    return false;
	}
    }

    setup_ui() {
	document.getElementById("go").disabled = true;
	document.getElementById("step").disabled = true;
	document.getElementById("stop").disabled = true;
	document.getElementById("reset").disabled = true;
	document.getElementById("board_size").disabled = true;
	document.getElementById("space_size").disabled = true;
	document.getElementById("configure").disabled = true;
    }

    clear_status() {
	this.machine.set_status("")
    }

    set_status(message) {
	this.machine.set_status(message)
    }

    set_error_status(message) {
	//XXX this should be in red or something
	this.machine.set_status(message)
    }

    change_ui_state(next_state) {
	this.machine.change_ui_state(next_state)
    }

    get boardSize() {
	let board_size = parseInt(document.getElementById("board_size").value);
	if (board_size > 0) {
	    return board_size;
	}
	this.set_error_status("board size must be a number greater than zero");
	return null;
    }

    get spaceSize() {
	let space_size = parseInt(document.getElementById("space_size").value);
	if (space_size > 0) {
	    return space_size;
	}
	this.set_error_status("space size must be a number greater than zero");
	return null;
    }
}

class UIStateReset extends UIState
{
    enter_state(previous_state) {
	console.log("UIStateReset");
	this.setup_ui();
	let board_size = this.boardSize;
	let space_size = this.spaceSize;
	if (board_size != null && space_size != null) {
	    this.machine.setup_checkerboard(board_size, space_size);
	}
	ipc.send("reset");
	this.change_ui_state(new UIStateReady(this.machine))
    }
}

class UIStateEnd extends UIState
{
    enter_state(previous_state) {
	console.log("UIStateEnd");
	this.setup_ui();
    }

    setup_ui() {
	super.setup_ui();
	document.getElementById("reset").disabled = false;
    }

    handle_event(event) {
	switch (event) {
	case "reset":
	    this.change_ui_state(new UIStateReset(this.machine));
	    return true;

	default:
	    return super.handle_event(event);
	}
    }
}

class UIStateReady extends UIState
{
    enter_state(previous_state) {
	console.log("UIStateReady");
	this.setup_ui();
    }

    setup_ui() {
	super.setup_ui()
	document.getElementById("go").disabled = false;
	document.getElementById("step").disabled = false;
	document.getElementById("reset").disabled = false;
	document.getElementById("board_size").disabled = false;
	document.getElementById("space_size").disabled = false;
	document.getElementById("configure").disabled = false;
    }

    validate() {
	let board_size = this.boardSize;
	let space_size = this.spaceSize;
	if (board_size == null || space_size == null) {
	    document.getElementById("go").disabled = true;
	    document.getElementById("step").disabled = true;
	    document.getElementById("reset").disabled = true;
	    return false;
	}

	document.getElementById("go").disabled = false;
	document.getElementById("step").disabled = false;
	document.getElementById("reset").disabled = false;
	return true;
    }

    handle_event(event) {
	switch (event) {
	case "configure":
	    if (this.validate() == false) {
		return true;
	    }
	    this.set_status("configured");

	    let board_size = this.boardSize;
	    let space_size = this.spaceSize;
	    if (board_size != this.machine.checkerBoard.boardSize || space_size !=  this.machine.checkerBoard.spaceSize) {
		this.machine.setup_checkerboard(board_size, space_size);
	    }

	    let checker_piece_style = document.getElementById("checker_piece_style").value;
	    if (this.machine.checkerPiece == null || checker_piece_style !=  this.machine.checkerPiece.name) {
		console.log("placing piece");
		this.machine.place_piece();
	    }
	    return true;

	case "step":
	    if (this.validate() == false) {
		return true;
	    }
	    this.machine.setup_walkabout();
	    this.machine.step();
	    this.change_ui_state(new UIStateStopped(this.machine))
	    return true;

	case "go":
	    if (this.validate() == false) {
		return true;
	    }
	    this.machine.setup_walkabout();
	    this.machine.walk();
	    this.change_ui_state(new UIStateGo(this.machine))
	    return true;

	case "reset":
	    if (this.validate() == false) {
		return true;
	    }
	    this.change_ui_state(new UIStateReset(this.machine))
	    return true;

	default:
	    return super.handle_event(event);
	}
    }
}

class UIStateStopped extends UIState
{
    enter_state(previous_state) {
	console.log("UIStateStopped");
	this.setup_ui();
    }

    setup_ui() {
	super.setup_ui();
	document.getElementById("go").disabled = false;
	document.getElementById("step").disabled = false;
	document.getElementById("reset").disabled = false;
    }

    handle_event(event) {
	switch (event) {
	case "step":
	    this.machine.step();
	    return true;

	case "go":
	    this.machine.walk();
	    this.change_ui_state(new UIStateGo(this.machine))
	    return true;

	case "reset":
	    this.change_ui_state(new UIStateReset(this.machine))
	    return true;

	default:
	    return super.handle_event(event);
	}
    }
}

class UIStateGo extends UIState
{
    enter_state(previous_state) {
	console.log("UIStateGo");
	this.setup_ui();
    }

    setup_ui() {
	super.setup_ui();
	document.getElementById("stop").disabled = false;
    }

    handle_event(event) {
	switch (event) {
	case "stop":
	    ipc.send("stop");
	    this.change_ui_state(new UIStateStopped(this.machine))
	    return true;

	default:
	    return super.handle_event(event);
	}
    }
}
