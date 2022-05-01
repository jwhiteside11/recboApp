package main

import (
	"bytes"
	"fmt"
	"html/template"
	"net/smtp"
)

const (
	RECBO_DEV_URL  = "http://localhost:3000"
	EMAIL_ADDRESS  = "recbo.noreply@gmail.com"
	EMAIL_PASSWORD = "Mymfux-vykzes-6babxa"
	SMTP_HOST      = "smtp.gmail.com"
	SMTP_PORT      = "587"
	SMTP_ADDRESS   = SMTP_HOST + ":" + SMTP_PORT
)

func SendVerificationEmail(toEmail, token string) error {
	to := []string{toEmail}
	verificationLink := RECBO_DEV_URL + "/complete-sign-up?token=" + token

	mime := "MIME-version: 1.0;\nContent-Type: text/html; charset=\"UTF-8\";\n\n"
	subject := "Subject: Verify your Recbo account now!\n"
	templateData := struct{ VerificationLink string }{verificationLink}
	body, err := ParseTemplate("verificationTemplate.html", templateData)
	if err != nil {
		fmt.Println(err)
		return err
	}

	msg := []byte(subject + mime + "\n" + body)

	auth := smtp.PlainAuth("", EMAIL_ADDRESS, EMAIL_PASSWORD, SMTP_HOST)

	err = smtp.SendMail(SMTP_ADDRESS, auth, EMAIL_ADDRESS, to, msg)

	if err != nil {
		fmt.Println(err)
		return err
	}
	return nil
}

func ParseTemplate(templateFileName string, data interface{}) (string, error) {
	t, err := template.ParseFiles(templateFileName)
	if err != nil {
		return "", err
	}
	buf := new(bytes.Buffer)
	if err = t.Execute(buf, data); err != nil {
		return "", err
	}
	return buf.String(), nil
}
