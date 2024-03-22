package com.example.mutantorchidplatform.schedule;

import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class JobSchedule {

    @Scheduled(fixedDelay = 500000)
    public void hello() {
        log.info("hello anh duc");
    }
}
