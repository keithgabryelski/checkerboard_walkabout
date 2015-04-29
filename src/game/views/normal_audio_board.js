import AudioBoard from './audio_board'

class NormalAudioBoard extends AudioBoard
{
    getClassName() {
        return NormalAudioBoard.name;
    }

    constructor() {
	super();
	this.audio_start = new Audio('audio/start.mp3');
	this.audio_move = new Audio('audio/move.mp3');
	this.audio_loop = new Audio('audio/loop.mp3');
	this.audio_offboard = new Audio('audio/offboard.mp3');
    }
}

export default NormalAudioBoard;
