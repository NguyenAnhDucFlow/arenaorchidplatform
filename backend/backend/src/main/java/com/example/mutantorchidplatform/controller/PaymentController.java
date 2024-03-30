package com.example.mutantorchidplatform.controller;

import com.example.mutantorchidplatform.dto.*;
import com.example.mutantorchidplatform.service.PaymentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/payment")
public class PaymentController {

    @Autowired
    PaymentService paymentService;

    @GetMapping("/{id}")
    public ResponseDTO<PaymentDTO> getProduct(@PathVariable int id) {
        return ResponseDTO.<PaymentDTO>builder()
                .status(200)
                .data(paymentService.getById(id))
                .build();
    }

    @PostMapping("/search")
    public ResponseDTO<PageDTO<PaymentDTO>> search(@RequestBody @Valid SearchDTO searchDTO) {
        return ResponseDTO.<PageDTO<PaymentDTO>>builder()
                .status(200)
                .data(paymentService.search(searchDTO))
                .build();
    }
}
