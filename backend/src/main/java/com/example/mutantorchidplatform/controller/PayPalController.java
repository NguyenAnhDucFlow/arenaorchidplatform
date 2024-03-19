//package com.example.mutantorchidplatform.controller;
//
//import com.example.backend.dto.PackagePurchasedDTO;
//import com.example.backend.dto.ResponseDTO;
//import com.example.backend.request.PaymentRequest;
//import com.example.backend.service.PackagePurchasedService;
//import com.example.backend.service.PayPalService;
//import com.paypal.api.payments.Links;
//import com.paypal.api.payments.Payment;
//import com.paypal.base.rest.PayPalRESTException;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.HttpStatus;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.HashMap;
//import java.util.Map;
//
//@RestController
//@RequestMapping("/paypal")
//public class PayPalController {
//
//    @Autowired
//    PayPalService payPalService;
//
//    @Autowired
//    PackagePurchasedService packagePurchasedService;
//
//    @PostMapping("/pay")
//    public ResponseDTO<?> pay(@RequestBody PaymentRequest paymentRequest) {
//        try {
//            Payment payment = payPalService.createPayment(
//                    paymentRequest.getTotal(),
//                    paymentRequest.getCurrency(),
//                    paymentRequest.getMethod(),
//                    paymentRequest.getIntent(),
//                    paymentRequest.getDescription(),
//                    paymentRequest.getCancelUrl(),
//                    paymentRequest.getSuccessUrl());
//
//            for (Links link : payment.getLinks()) {
//                if (link.getRel().equals("approval_url")) {
//                    return ResponseDTO.builder()
//                            .status(HttpStatus.OK)
//                            .msg("Redirect URL for payment approval")
//                            .data(link.getHref())
//                            .build();
//                }
//            }
//            return ResponseDTO.builder()
//                    .status(HttpStatus.BAD_REQUEST)
//                    .msg("Unable to find approval URL")
//                    .build();
//        } catch (PayPalRESTException e) {
//            return ResponseDTO.builder()
//                    .status(HttpStatus.BAD_REQUEST)
//                    .msg(e.getMessage())
//                    .build();
//        }
//    }
//
//    @GetMapping("/execute")
//    public ResponseDTO<?> execute(@RequestParam("paymentId") String paymentId,
//                                  @RequestParam("PayerID") String payerId,
//                                  @RequestParam("userId") int userId){
//        try {
//            Payment payment = payPalService.executePayment(paymentId, payerId);
//            if (payment.getState().equals("approved")) {
//                String total = payment.getTransactions().get(0).getAmount().getTotal();
//                String description = payment.getTransactions().get(0).getDescription();
//
//                Map<String, String> response = new HashMap<>();
//                response.put("total", total);
//                response.put("description", description);
//
//                PackagePurchasedDTO dto = new PackagePurchasedDTO();
//                dto.setPrice(Double.parseDouble(total));
//                dto.setPackageName(description);
//
//                packagePurchasedService.create(userId, dto);
//
//                return ResponseDTO.builder()
//                        .status(HttpStatus.OK)
//                        .msg("200")
//                        .data(response)
//                        .build();
//            } else {
//                return ResponseDTO.builder()
//                        .status(HttpStatus.OK)
//                        .msg("Payment successfully completed")
//                        .data(payment)
//                        .build();
//            }
//        } catch (Exception e) {
//            return ResponseDTO.builder()
//                    .status(HttpStatus.OK)
//                    .msg("Payment successfully completed")
//                    .build();
//        }
//    }
//}
