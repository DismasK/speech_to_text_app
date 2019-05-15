package main

import (
	"crypto/tls"
	"encoding/json"
	"io"
	"log"
	"net/http"
	"os"
	"strconv"
	"time"

	"github.com/wit-ai/wit-go"
	"golang.org/x/crypto/acme/autocert"
)

// Response struct contain response from wit.ai
type Response struct {
	Text string `json:"text"`
}

func dataProcess(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodPost {
		userFile, _, err := r.FormFile("file")
		if err != nil {
			log.Println(err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		defer userFile.Close()

		fileName := strconv.Itoa(int(time.Now().UnixNano()))

		fileCreating, err := os.OpenFile(fileName, os.O_WRONLY|os.O_CREATE, 0644)
		if err != nil {
			log.Println(err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		defer os.Remove(fileName)
		defer fileCreating.Close()

		_, err = io.Copy(fileCreating, userFile)
		if err != nil {
			log.Println(err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		fileForSend, err := os.Open(fileName)
		if err != nil {
			log.Println(err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		defer fileForSend.Close()

		client := witai.NewClient(os.Getenv("TOKEN"))
		msg, err := client.Speech(
			&witai.MessageRequest{
				Speech: &witai.Speech{
					File:        fileForSend,
					ContentType: "audio/wav",
				},
			},
		)
		if err != nil {
			log.Println(err)
			w.WriteHeader(http.StatusUnprocessableEntity)
			return
		}

		w.WriteHeader(http.StatusOK)
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(Response{Text: msg.Text})
	}
}

func main() {
	http.Handle("/", http.FileServer(http.Dir("view")))
	http.HandleFunc("/data", dataProcess)
	if os.Getenv("PROD") == "true" {
		certManager := autocert.Manager{
			Prompt:     autocert.AcceptTOS,
			HostPolicy: autocert.HostWhitelist(os.Getenv("DOMAIN")),
			Cache:      autocert.DirCache("/certs"),
		}
		server := &http.Server{
			Addr: ":https",
			TLSConfig: &tls.Config{
				GetCertificate: certManager.GetCertificate,
			},
		}
		go func() {
			log.Fatal(http.ListenAndServe(":http", certManager.HTTPHandler(nil)))
		}()
		log.Fatal(server.ListenAndServeTLS("", ""))
	} else {
		log.Fatal(http.ListenAndServe(":http", nil))
	}
}
