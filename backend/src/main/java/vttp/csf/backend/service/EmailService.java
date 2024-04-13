package vttp.csf.backend.service;

import java.io.UnsupportedEncodingException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {
    
    @Autowired
    JavaMailSender javaMailSender;

    public void sendEmail(String toMail, String body, String subject){
        // SimpleMailMessage message = new SimpleMailMessage();

        try {
            MimeMessage mimeMessage = javaMailSender.createMimeMessage();
            MimeMessageHelper message = new MimeMessageHelper(mimeMessage, true,"UTF-8");
            
            message.setSubject(subject);
            message.setText(body, true);
            message.setTo(toMail);
            message.setFrom(new InternetAddress("playpal0409@gmail.com", "PlayPal"));
            javaMailSender.send(mimeMessage);
    
    
            System.out.println("Email Sent");
        } catch (Exception e) {
            // TODO: handle exception
            System.out.println("error sending email: " + e);
        }


    }
}
