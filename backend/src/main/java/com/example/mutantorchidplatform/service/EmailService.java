package com.example.mutantorchidplatform.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

public interface EmailService {
}

@Service
class EmailServiceImpl implements EmailService {

    @Autowired
    JavaMailSender javaMailSender;

}
