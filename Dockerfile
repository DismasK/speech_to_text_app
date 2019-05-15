# Stage I | Golang back-end
FROM golang:alpine as back
RUN apk update && apk add --no-cache git ca-certificates
ENV GO111MODULE=on
WORKDIR /speech_to_text_app
COPY ./back-end/go.mod .
COPY ./back-end/main.go .
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -a -installsuffix cgo -ldflags="-w -s" -o converter
# Stage II | React front-end
FROM node:alpine as front
RUN apk update
WORKDIR /front-end
COPY ./front-end/package.json .
COPY ./front-end/src ./src
COPY ./front-end/public ./public
RUN npm install --silent && npm run build
# Stage III | final image from scratch
FROM scratch
COPY --from=front ./front-end/build view
COPY --from=back /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/
COPY --from=back /speech_to_text_app/converter .
ENTRYPOINT [ "./converter" ]