package com.example.mutantorchidplatform.service;

import com.example.mutantorchidplatform.request.PaymentRequest;
import com.paypal.api.payments.*;
import com.paypal.base.rest.APIContext;
import com.paypal.base.rest.PayPalRESTException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

public interface PayPalService {
        Payment createPayment(PaymentRequest paymentRequest) throws PayPalRESTException;
        Payment executePayment(String paymentId, String payerId) throws PayPalRESTException;
}
@Service
class PayPalServiceImpl implements PayPalService{

    @Autowired
    private APIContext apiContext;

    // Phương thức để tạo một thanh toán
    public Payment createPayment(PaymentRequest paymentRequest) throws PayPalRESTException {
        Amount amount = new Amount();
        amount.setCurrency(paymentRequest.getCurrency());
        amount.setTotal(String.format("%.2f", paymentRequest.getTotal()));

        Transaction transaction = new Transaction();
        transaction.setDescription(paymentRequest.getDescription());
        transaction.setAmount(amount);

        List<Transaction> transactions = new ArrayList<>();
        transactions.add(transaction);

        Payer payer = new Payer();
        payer.setPaymentMethod(paymentRequest.getMethod());

        Payment payment = new Payment();
        payment.setIntent(paymentRequest.getIntent());
        payment.setPayer(payer);
        payment.setTransactions(transactions);

        RedirectUrls redirectUrls = new RedirectUrls();
        redirectUrls.setCancelUrl(paymentRequest.getCancelUrl());
        redirectUrls.setReturnUrl(paymentRequest.getSuccessUrl());
        payment.setRedirectUrls(redirectUrls);

        return payment.create(apiContext);
    }



    // Phương thức để thực hiện thanh toán
    public Payment executePayment(String paymentId, String payerId) throws PayPalRESTException {
        Payment payment = new Payment();
        payment.setId(paymentId);

        PaymentExecution paymentExecution = new PaymentExecution();
        paymentExecution.setPayerId(payerId);

        return payment.execute(apiContext, paymentExecution);
    }
}

