[![Go Report Card](https://goreportcard.com/badge/github.com/trigun117/speech_to_text_app)](https://goreportcard.com/report/github.com/trigun117/speech_to_text_app)
# speech_to_text_app
WEB application for converting speech into text. Builded with React.js and Golang.

Speech to text converting povered by *wit.ai*

# Examples

![app example](https://github.com/trigun117/speech_to_text_app/blob/master/image.JPG)

# Get Started
Clone repository `git clone https://github.com/trigun117/speech_to_text_app.git`

Run main.go file `go run main.go`

And open `http://localhost/`

# Docker
Clone repository `git clone https://github.com/trigun117/speech_to_text_app.git`

Build image `docker build --rm --no-cache -t image_name .`

Run container `docker run -d -p 80:80 -e TOKEN="YOUR_TOKEN" image_name`

And open `http://localhost/`

## OR
Use `docker run -d -p 80:80 -e TOKEN="YOUR_TOKEN" trigun117/speech`

# License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
