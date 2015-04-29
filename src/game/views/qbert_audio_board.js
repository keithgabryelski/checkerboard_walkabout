import AudioBoard from './audio_board'

class QBertAudioBoard extends AudioBoard
{
    getClassName() {
        return QBertAudioBoard.name;
    }

    constructor() {
	super();
	this.audio_start = new Audio('audio/qbert_start.wav');
	this.audio_move = new Audio('audio/qbert_hop.wav');
	this.audio_loop = new Audio('audio/qbert_curse.wav');
	this.audio_offboard = new Audio('audio/qbert_over_the_edge.wav');
    }
}

export default QBertAudioBoard;
