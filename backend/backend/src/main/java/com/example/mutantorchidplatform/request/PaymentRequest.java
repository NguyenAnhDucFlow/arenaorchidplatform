package com.example.mutantorchidplatform.request;

import lombok.Data;

@Data
public class PaymentRequest {
    private Double total;
    private String currency;
    private String method = "paypal";
    private String intent = "sale";
    private String description;
    private String cancelUrl;
    private String successUrl;
}
