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
        Payment createPayment(Double total,
                              String currency,
                              String method,
                              String intent,
                              String description,
                              String cancelUrl,
                              String successUrl) throws PayPalRESTException;
        Payment executePayment(String paymentId, String payerId) throws PayPalRESTException;
}
@Service
class PayPalServiceImpl implements PayPalService{

    @Autowired
    private APIContext apiContext;

    // Phương thức để tạo một thanh toán
    public Payment createPayment(Double total,
                                 String currency,
                                 String method,
                                 String intent,
                                 String description,
                                 String cancelUrl,
                                 String successUrl) throws PayPalRESTException {
        Amount amount = new Amount();
        amount.setCurrency(currency);
        amount.setTotal(total.toString());

        Transaction transaction = new Transaction();
        transaction.setDescription(description);
        transaction.setAmount(amount);

        List<Transaction> transactions = new ArrayList<>();
        transactions.add(transaction);

        Payer payer = new Payer();
        payer.setPaymentMethod(method);

        Payment payment = new Payment();
        payment.setIntent(intent);
        payment.setPayer(payer);
        payment.setTransactions(transactions);

        RedirectUrls redirectUrls = new RedirectUrls();
        redirectUrls.setCancelUrl(cancelUrl);
        redirectUrls.setReturnUrl(successUrl);
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

