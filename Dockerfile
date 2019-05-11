# Stage I
FROM golang:alpine as builder
RUN apk update && apk add --no-cache git ca-certificates
ENV GO111MODULE=on
COPY . /speech_to_text_app/speech
WORKDIR /speech_to_text_app/speech
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -a -installsuffix cgo -ldflags="-w -s" -o converter
# Stage II
FROM scratch
COPY ./view view
COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/
COPY --from=builder /speech_to_text_app/speech/converter .
ENTRYPOINT [ "./converter" ]