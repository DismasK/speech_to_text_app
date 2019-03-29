# Stage I
FROM golang:alpine as builder
RUN apk update && apk add --no-cache git ca-certificates
COPY . $GOPATH/src/speech_to_text_app/speech
WORKDIR $GOPATH/src/speech_to_text_app/speech
RUN go get -u github.com/wit-ai/wit-go && go get -u golang.org/x/crypto/acme/autocert
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -a -installsuffix cgo -ldflags="-w -s" -o /go/bin/speech
# Stage II
FROM scratch
COPY ./view view
COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/
COPY --from=builder /go/bin/speech .
EXPOSE 80
ENTRYPOINT [ "./speech" ]