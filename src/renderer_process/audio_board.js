// manages audio for the checker piece

class AudioBoard
{
    constructor() {
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

class NormalAudioBoard extends AudioBoard
{
    constructor() {
	super();
	this.audio_start = new Audio('audio/start.mp3');
	this.audio_move = new Audio('audio/move.mp3');
	this.audio_loop = new Audio('audio/loop.mp3');
	this.audio_offboard = new Audio('audio/offboard.mp3');
    }
}

class QBertAudioBoard extends AudioBoard
{
    constructor() {
	super();
	this.audio_start = new Audio('audio/qbert_start.wav');
	this.audio_move = new Audio('audio/qbert_hop.wav');
	this.audio_loop = new Audio('audio/qbert_curse.wav');
	this.audio_offboard = new Audio('audio/qbert_over_the_edge.wav');
    }
}
