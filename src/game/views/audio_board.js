// manages audio for the checker piece

import GameObject from '../game_object';

class AudioBoard extends GameObject
{
    getClassName() {
        return AudioBoard.name;
    }

    constructor() {
	super();
	this.audio_start = null;
	this.audio_move = null;
	this.audio_loop = null;
	this.audio_offboard = null;
    }

    // played when the checker piece is placed on the table
    play_start_sound() {
	this.audio_start.play();
    }

    // played when the checker piece moves
    play_move_sound() {
	this.audio_move.play();
    }

    // played when we discover the checker piece is in a loop
    play_loop_sound() {
	this.audio_loop.play();
    }

    // played when the checker piece moves off the board
    play_offboard_sound() {
	this.audio_offboard.play();
    }
}

export default AudioBoard;
