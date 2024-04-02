package com.example.mutantorchidplatform.service;

import com.example.mutantorchidplatform.dto.TopSellerDTO;
import com.example.mutantorchidplatform.repository.OrderDetailRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

public interface OrderDetailService {

    List<TopSellerDTO> getTopSellers();
}

@Service
class OrderDetailServiceImpl implements OrderDetailService {

    @Autowired
    OrderDetailRepository orderDetailRepository;
    @Override
    public List<TopSellerDTO> getTopSellers() {
        return orderDetailRepository.findTopSellers();
    }
}
