import React, { Component } from 'react';
import axios from 'axios';
import './Audioplayer.css';


class Audioplayer extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

  componentDidMount() {
    let audioCtx = new(window.AudioContext || window.webkitAudioContext)();
    const NUMBER_OF_BUCKETS = 300; // number of "bars" the waveform should have
    const SPACE_BETWEEN_BARS = 0.2; // from 0 (no gaps between bars) to 1 (only gaps - bars won't be visible)

    document.getElementById('audio-source').src = `http://10.0.0.229:3000/public/files/${this.props.song}`;
    document.getElementById('audio-element').load();

    axios({url: document.getElementById('audio-source').src, responseType: "arraybuffer"}).then(response => {
      let audioData = response.data;

      audioCtx.decodeAudioData(audioData, buffer => {
        let decodedAudioData = buffer.getChannelData(0);
        let bucketDataSize = Math.floor(decodedAudioData.length / NUMBER_OF_BUCKETS);
        let buckets = [];
        for (var i = 0; i < NUMBER_OF_BUCKETS; i++) {
          let startingPoint = i * bucketDataSize;
          let endingPoint = i * bucketDataSize + bucketDataSize;
          let max = 0;
          for (var j = startingPoint; j < endingPoint; j++) {
            if (decodedAudioData[j] > max) {
              max = decodedAudioData[j];
            }
          }
          let size = Math.abs(max);
          buckets.push(size / 2);
        }

        document.getElementById('waveform-mask').innerHTML = buckets.map((bucket, i) => {
          let bucketSVGWidth = 100.0 / buckets.length;
          let bucketSVGHeight = bucket * 150.0;

          return `<rect
            x=${bucketSVGWidth * i + SPACE_BETWEEN_BARS / 2.0}
            y=${ (100 - bucketSVGHeight) / 2.0}
            width=${bucketSVGWidth - SPACE_BETWEEN_BARS}
            height=${bucketSVGHeight} />`;
        }).join('');
        // every 100 milliseconds, update the waveform-progress SVG with a new width - the percentage of time elapsed on the audio file
        this.waveformUpdater = setInterval(() => {
          let audioElement = document.getElementById('audio-element');
          let waveformProgress = document.getElementById('waveform-progress');
          waveformProgress.setAttribute('width', audioElement.currentTime / audioElement.duration * 100);
          let timeDisplay = Math.round(audioElement.currentTime - .6);
          let minutes = Math.floor(timeDisplay / 60);
          let seconds = timeDisplay % 60;
          if (seconds < 10) {
            seconds = "0" + seconds;
          }
          if (seconds === "0-1") {
            minutes = "0";
            seconds = "00";
          }
          document.getElementById('current-time').innerHTML = minutes + ":" + seconds;
        }, 100);
        this.audioTimer = setInterval(() => {
          let audioElement = document.getElementById('audio-element');
          let timeDisplay = Math.round(audioElement.currentTime - .6);
          let minutes = Math.floor(timeDisplay / 60);
          let seconds = timeDisplay % 60;
          if (seconds < 10) {
            seconds = "0" + seconds;
          }
          if (seconds === "0-1") {
            minutes = "0";
            seconds = "00";
          }
          this.props.updateTime(minutes + ":" + seconds);
        }, 100);
      }, e => {
        // callback for any errors with decoding audio data
        console.log('Error with decoding audio data' + e.err);
      },);
    }).catch(err => {
      // catch any errors with fetching the audio
      console.log(err);
    });
  }

  componentWillUnmount() {
    clearInterval(this.waveformUpdater);
    clearInterval(this.audioTimer);
  }

	render() {
    return (
    	<div className="audio-player">
    		<audio id="audio-element" className="audio-element"controls="controls">
          <source src="" id="audio-source" />
        </audio>
      </div>
    );
  }
}

export default Audioplayer;