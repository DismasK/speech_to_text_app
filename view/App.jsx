class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            device: false,
            response: ''
        }
    }
    componentWillMount() {
        var userAgent = navigator.userAgent || navigator.vendor || window.opera;
        if (/android/i.test(userAgent)) {
            this.setState({
                device: true
            });
        }
    }
    submitFile = (e) => {
        e.preventDefault();
        let files = document.querySelector('[type=file]').files;
        let formData = new FormData();
        formData.append('speech', files[0])
        fetch("/data", {
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
                    response: response.Text
                })
            })
            .catch(err => { alert(err) });
    }
    render() {
        return (
            <div>
                <header>Speech to Text</header>
                <div id="content">
                    <h1>{this.state.device ? 'Record your speech via microphone. *Only WAV Files' : 'Upload your speech here. *Only WAV Files'}</h1>
                    <form encType="multipart/form-data" method="POST" onSubmit={this.submitFile}>
                        <input type="file" name="speech" id="sp" accept={this.state.device ? 'audio/*' : null} capture={this.state.device ? 'capture' : null} />
                        <input type="submit" value="Send" />
                    </form>
                </div>
                <h2>{this.state.response}</h2>
            </div>
        )
    }
}
ReactDOM.render(<App />, document.getElementById('root'))