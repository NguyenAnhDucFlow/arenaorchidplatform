package com.example.mutantorchidplatform;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class MutantOrchidPlatformApplication {

    public static void main(String[] args) {
        SpringApplication.run(MutantOrchidPlatformApplication.class, args);
    }

}
