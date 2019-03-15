import React, { Component } from 'react';
import axios from 'axios';
import './Waveform.css';

const NUMBER_OF_BUCKETS = 300; // number of "bars" the waveform should have
const SPACE_BETWEEN_BARS = 0.2; // from 0 (no gaps between bars) to 1 (only gaps - bars won't be visible)

let audioCtx = new(window.AudioContext || window.webkitAudioContext)();

const inputAudio = (event) => {
    var input = event.target.files;
    document.getElementById('audio-source').src = URL.createObjectURL(input[0]);
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

            let audioElement = document.getElementById('audio-element');
            let waveformProgress = document.getElementById('waveform-progress');

            // every 100 milliseconds, update the waveform-progress SVG with a new width - the percentage of time elapsed on the audio file
            setInterval(() => {
                waveformProgress.setAttribute('width', audioElement.currentTime / audioElement.duration * 100);
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



class Waveform extends Component {
  render() {
    return (
      <div className="Waveform">

        {/* our audio element */}
        <input onChange={inputAudio} type="file" id="input"/>
        <audio id="audio-element" controls="controls">
            <source src="" id="audio-source" />
        </audio>

        {/* this SVG is the "background" and progress bar */}
        <svg viewBox="0 0 100 100" className="waveform-container" preserveAspectRatio="none">
            <rect className="waveform-bg" x="0" y="0" height="100" width="100"/>
            <rect id="waveform-progress" className="waveform-progress" x="0" y="0" height="100" width="0"/>
        </svg>

        {/* this SVG is the "clipping mask" - the waveform bars */}
        <svg height="0" width="0">
            <defs>
                <clipPath id="waveform-mask"></clipPath>
            </defs>
        </svg>

      </div>
    );
  }
}

export default Waveform;