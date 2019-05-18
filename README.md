[![Go Report Card](https://goreportcard.com/badge/github.com/trigun117/speech_to_text_app)](https://goreportcard.com/report/github.com/trigun117/speech_to_text_app)
# speech_to_text_app
PWA(Progressive Web Application) web application for converting speech into text. Builded with React.js and Golang.

Speech to text converting povered by [wit.ai](https://wit.ai/)

# Examples

![app example](/image.JPG)
![app example](/image1.JPG)

# Get Started
Clone repository `git clone https://github.com/trigun117/speech_to_text_app.git`.

Switch to front-end folder and run `npm install --silent && npm run build`.

Switch to back-end folder and run `go build -o converter`.

Then create `view` folder in back-end and copy all data from `build` to it.

Set your Token in environment variable `TOKEN` and run `converter` file.

Open `localhost`.

# Docker
Clone repository `git clone https://github.com/trigun117/speech_to_text_app.git`

Build image `docker build --rm --no-cache -t image_name .`

Run container `docker run -d -p 80:80 -e TOKEN=YOUR_TOKEN image_name` or `docker run -d -p 80:80 -p 443:443 -e TOKEN=YOUR_TOKEN -e PROD=true -e DOMAIN=YOUR_DOMAIN image_name` if you want use domain with https support

And open `localhost` or `YOUR_DOMAIN`

## OR
Use `docker run -d -p 80:80 -e TOKEN=YOUR_TOKEN trigun117/speech` or `docker run -d -p 80:80 -p 443:443 -e TOKEN=YOUR_TOKEN -e PROD=true -e DOMAIN=YOUR_DOMAIN trigun117/speech` if you want use domain with https support

# License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
