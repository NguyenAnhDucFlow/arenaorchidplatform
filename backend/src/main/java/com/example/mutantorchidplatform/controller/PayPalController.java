package com.example.mutantorchidplatform.controller;

import com.example.mutantorchidplatform.dto.PaymentDTO;
import com.example.mutantorchidplatform.dto.ResponseDTO;
import com.example.mutantorchidplatform.request.PaymentRequest;
import com.example.mutantorchidplatform.service.PayPalService;
import com.example.mutantorchidplatform.service.PaymentService;
import com.paypal.api.payments.Links;
import com.paypal.api.payments.Payment;
import com.paypal.base.rest.PayPalRESTException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/paypal")
public class PayPalController {

    @Autowired
    PayPalService payPalService;

    @Autowired
    PaymentService paymentService;

    @PostMapping("/pay")
    public ResponseDTO<?> pay(@RequestBody PaymentRequest paymentRequest) {
        try {
            Payment payment = payPalService.createPayment(
                    paymentRequest.getTotal(),
                    paymentRequest.getCurrency(),
                    paymentRequest.getMethod(),
                    paymentRequest.getIntent(),
                    paymentRequest.getDescription(),
                    paymentRequest.getCancelUrl(),
                    paymentRequest.getSuccessUrl());

            for (Links link : payment.getLinks()) {
                if (link.getRel().equals("approval_url")) {
                    return ResponseDTO.builder()
                            .status(200)
                            .msg("Redirect URL for payment approval")
                            .data(link.getHref())
                            .build();
                }
            }
            return ResponseDTO.builder()
                    .status(404)
                    .msg("Unable to find approval URL")
                    .build();
        } catch (PayPalRESTException e) {
            return ResponseDTO.builder()
                    .status(404)
                    .msg(e.getMessage())
                    .build();
        }
    }

    @GetMapping("/execute")
    public ResponseDTO<?> execute(@RequestParam("paymentId") String paymentId,
                                  @RequestParam("PayerID") String payerId,
                                  @RequestParam("userId") int userId){
        try {
            Payment payment = payPalService.executePayment(paymentId, payerId);
            if (payment.getState().equals("approved")) {
                String total = payment.getTransactions().get(0).getAmount().getTotal();
                String description = payment.getTransactions().get(0).getDescription();

                Map<String, String> response = new HashMap<>();
                response.put("total", total);
                response.put("description", description);

                PaymentDTO paymentDTO = new PaymentDTO();
                paymentDTO.setAmount(Double.parseDouble(total));
                paymentDTO.setType(description);

                paymentService.create(userId, paymentDTO);

                return ResponseDTO.builder()
                        .msg("200")
                        .data(response)
                        .build();
            } else {
                return ResponseDTO.builder()
                        .msg("Payment successfully completed")
                        .data(payment)
                        .build();
            }
        } catch (Exception e) {
            return ResponseDTO.builder()
                    .msg("Payment successfully completed")
                    .build();
        }
    }
}
