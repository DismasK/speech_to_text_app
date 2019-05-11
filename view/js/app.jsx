class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            response: '',
            accept: false,
            clicked: false
        };
        this.gumStream;
        this.rec;
        this.input;
        this.audioContext;
    }
    componentWillMount() {
        if (this.isIos()) {
            document.getElementById("manifest").href = "./manifests/ios-manifest.json";
        }
        navigator.mediaDevices.enumerateDevices()
            .then(devices => {
                devices.forEach(device => {
                    if (device.kind === 'audioinput') {
                        this.setState({
                            accept: true
                        })
                    }
                });
            })
    }

    isIos = () => {
        const userAgent = window.navigator.userAgent.toLowerCase();
        return /iphone|ipad|ipod/.test(userAgent);
    }

    startRecording = () => {
        URL = window.URL || window.webkitURL
        var AudioContext = window.AudioContext || window.webkitAudioContext;
        var constraints = { audio: true, video: false }
        this.setState({
            clicked: true
        })
        navigator.mediaDevices.getUserMedia(constraints)
            .then(stream => {
                this.audioContext = new AudioContext();
                this.gumStream = stream;
                this.input = this.audioContext.createMediaStreamSource(stream);
                this.rec = new Recorder(this.input, { numChannels: 1 })
                this.rec.record()
            })
            .catch(err => {
                alert(err);
                this.setState({
                    clicked: false
                })
            });
    }

    stopRecording = () => {
        this.setState({
            clicked: false
        })
        this.rec.stop();
        this.gumStream.getAudioTracks()[0].stop();
        this.rec.exportWAV(this.uploadFile);
    }

    uploadFile = blob => {
        let formData = new FormData();
        formData.append('speech', blob)
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

    submitFile = e => {
        e.preventDefault();
        let files = document.querySelector('[type=file]').files;
        let formData = new FormData();
        formData.append('speech', files[0])
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
                            <i onClick={this.state.clicked ? this.stopRecording : this.startRecording} class="fas fa-microphone fa-5x"></i>

                            :
                            [<label htmlFor="sp" id="lbl"><i class="fas fa-cloud-upload-alt fa-5x"></i></label>,
                            <input type="file" name="speech" id="sp" onChange={this.submitFile} />]
                    }
                    {this.state.clicked ? <h3>Click to stop</h3> : ''}
                </div>
                <h2>{this.state.response}</h2>
            </div>
        )
    }
}
ReactDOM.render(<App />, document.getElementById('root'));