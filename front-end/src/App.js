import React, { Component } from 'react'
import RecorderJS from 'recorder-js'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudDownloadAlt, faMicrophone } from '@fortawesome/free-solid-svg-icons';
import ReactLoading from 'react-loading';

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            response: '',
            loading: false,
            accept: true,
            stream: null,
            audioContext: null,
            recording: false,
            recorder: null
        };
        this.startRecord = this.startRecord.bind(this)
        this.stopRecord = this.stopRecord.bind(this)
    }

    isIOS = () => {
        return /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase())
    }

    componentDidMount = async () => {
        if (this.isIOS()) {
            document.getElementById("manifest").href = "./manifests/ios-manifest.json";
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            this.setState({ stream });
        } catch (error) {
            this.setState({
                accept: false
            })
        }
    }

    startRecord = async () => {
        if (this.isIOS()) {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            this.setState({ stream })
        }
        const { stream } = this.state;
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const recorder = new RecorderJS(audioContext);
        recorder.init(stream)
            .then(
                this.setState(
                    {
                        audioContext,
                        recorder,
                        recording: true
                    },
                    () => {
                        recorder.start();
                    }
                )
            );
    }

    stopRecord = () => {
        if (this.isIOS()) {
            const { stream, audioContext } = this.state;
            stream.getTracks().forEach(track => track.stop());
            audioContext.close();
        }
        const { recorder } = this.state;
        this.setState({
            recording: false
        },
            () => {
                recorder.stop().then(({ blob }) => {
                    this.uploadFile(blob);
                })
            }
        );
    }

    uploadFile = file => {
        this.setState({
            loading: true
        },
            () => {
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
                            loading: false,
                            response: response.text
                        })
                    })
                    .catch(err => {
                        this.setState({
                            loading: false
                        })
                        alert(err)
                    });
            });
    }

    render() {
        return (
            <div>
                <header>Speech to Text</header>
                <div id="content">
                    {
                        this.state.loading
                            ?
                            <ReactLoading id='load' type={'bars'} color={'white'} />
                            :
                            [
                                <h1 key={'message'} >{this.state.accept ? 'Click to record your speech via microphone' : 'Click to upload your speech here. *Only WAV Files'}</h1>
                                ,
                                this.state.accept
                                    ?
                                    <FontAwesomeIcon key={'microphone'} onClick={this.state.recording ? this.stopRecord : this.startRecord} icon={faMicrophone} size={'5x'} />
                                    :
                                    [
                                        <label key={'icon'} htmlFor="inp">
                                            <FontAwesomeIcon key={'cloud'} icon={faCloudDownloadAlt} size={'5x'} />
                                        </label>
                                        ,
                                        <input key={'field'} type="file" id="inp" onChange={e => this.uploadFile(e.target.files[0])} />
                                    ]
                            ]
                    }
                    {this.state.recording ? <h3>Click to stop</h3> : ''}
                </div>
                {this.state.response !== '' && this.state.loading === false ? <h2>{this.state.response}</h2> : null}
            </div>
        )
    }
}