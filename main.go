package main

import (
	"encoding/json"
	"github.com/wit-ai/wit-go"
	"io"
	"log"
	"net/http"
	"os"
)

type Response struct {
	Text string
}

const token = "YOUR_TOKEN"

func dataProcess(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodPost {
		userFile, header, err := r.FormFile("speech")
		if err != nil {
			log.Println(err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		defer userFile.Close()

		fileCreating, err := os.OpenFile(header.Filename, os.O_WRONLY|os.O_CREATE, 0644)
		if err != nil {
			log.Println(err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		defer os.Remove(header.Filename)
		defer fileCreating.Close()

		_, err = io.Copy(fileCreating, userFile)
		if err != nil {
			log.Println(err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		fileForSend, err := os.Open(header.Filename)
		if err != nil {
			log.Println(err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		defer fileForSend.Close()

		client := witai.NewClient(token)
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
	http.ListenAndServe(":80", nil)
}
