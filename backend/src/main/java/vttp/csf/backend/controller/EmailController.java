package vttp.csf.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import vttp.csf.backend.service.EmailService;
import vttp.csf.backend.utils.EmailMessage;

@RestController
@RequestMapping("/api")
public class EmailController {

    @Autowired
    private EmailService emailSvc;
    
    @PostMapping("/mail/{toMail}")
    public String sendEmail(@PathVariable String toMail, @RequestBody String payload){

        String body = """
            Hello Fellow Gamer!
                
            Thank you for registering an account with us. Have fun browsing!

            Sincerely,
            PlayPal Team
        """;

        emailSvc.sendEmail(toMail, EmailMessage.body, "PlayPal Registration Success");

        return "Success email sent";
    }
}
