import GameObject from '../game_object';

class ConfigurationControls extends GameObject
{
    getClassName() {
        return ConfigurationControls.name;
    }

    constructor(board_size, space_size, checker_piece_style, walkabout_style) {
	super();
	this.boardSize = board_size;
	this.spaceSize = space_size;
	this.checkerPieceStyle = checker_piece_style;
	this.walkaboutStyle = walkabout_style;
	this.walkDelay = 1.0;
	this.disable();
    }

    disable() {
	this.controlsEnabled = false;
    }

    enable() {
	this.controlsEnabled = true;
    }
}

export default ConfigurationControls;
