package com.example.mutantorchidplatform.controller;

import com.example.mutantorchidplatform.dto.ResponseDTO;
import com.example.mutantorchidplatform.dto.TopSellerDTO;
import com.example.mutantorchidplatform.repository.OrderDetailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/order-detail")
public class OrderDetailController  {

    @Autowired
    OrderDetailService orderDetailService;

    @GetMapping("/top-sellers")
    public ResponseDTO<List<TopSellerDTO>> getTopSellers() {
        List<TopSellerDTO> topSellers = orderDetailService.getTopSellers();
        return  ResponseDTO.<List<TopSellerDTO>>builder()
                .status(200)
                .data(topSellers)
                .build();
    }
}
