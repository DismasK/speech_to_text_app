import React, { Component } from 'react'
import RecorderJS from 'recorder-js'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudDownloadAlt, faMicrophone } from '@fortawesome/free-solid-svg-icons';

export default class Application extends Component {
    constructor(props) {
        super(props);
        this.state = {
            response: '',
            accept: true,
            stream: null,
            recording: false,
            recorder: null
        };
        this.startRecord = this.startRecord.bind(this)
        this.stopRecord = this.stopRecord.bind(this)
    }

    componentDidMount = async () => {
        if (/iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase())) {
            document.getElementById("manifest").href = "./manifests/ios-manifest.json";
        }

        let stream;
        try {
            stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        } catch (error) {
            this.setState({
                accept: false
            })
        }
        this.setState({ stream });
    }

    startRecord = () => {
        const { stream } = this.state;
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const recorder = new RecorderJS(audioContext);
        recorder.init(stream);
        this.setState(
            {
                recorder,
                recording: true
            },
            () => {
                recorder.start();
            }
        );
    }

    stopRecord = () => {
        const { recorder } = this.state;
        recorder.stop().then(({ blob }) => {
            this.uploadFile(blob);
        })
        this.setState({
            recording: false
        });
    }

    uploadFile = file => {
        let formData = new FormData();
        formData.append('file', file);
        const HOST = window.location.origin;
        fetch(HOST + "/data", {
            method: 'POST',
            body: formData
        })
            .then(r => {
                if (!r.ok) {
                    throw Error(r.statusText)
                }
                return r.json()
            })
            .then(response => {
                this.setState({
                    response: response.text
                })
            })
            .catch(err => { alert(err) });
    }

    render() {
        return (
            <div>
                <header>Speech to Text</header>
                <div id="content">
                    <h1>{this.state.accept ? 'Click to record your speech via microphone' : 'Click to upload your speech here. *Only WAV Files'}</h1>
                    {
                        this.state.accept

                            ?

                            <FontAwesomeIcon onClick={this.state.recording ? this.stopRecord : this.startRecord} icon={faMicrophone} size={'5x'} />

                            :

                            [
                                <label key={'icon'} htmlFor="sp" id="lbl">
                                    <FontAwesomeIcon icon={faCloudDownloadAlt} size={'5x'} />
                                </label>
                                ,
                                <input key={'field'} type="file" id="sp" onChange={e => this.uploadFile(e.target.files[0])} />
                            ]
                    }
                    {this.state.recording ? <h3>Click to stop</h3> : ''}
                </div>
                <h2>{this.state.response}</h2>
            </div>
        )
    }
}