package com.example.mutantorchidplatform.service;

import com.example.mutantorchidplatform.dto.OrderDetailDTO;

public interface OrderDetailService {
//????
    void addProductToOrder(OrderDetailDTO orderDetailDTO);
    void updateProductQuantityInOrder(OrderDetailDTO orderDetailDTO);
    void removeProductFromOrder(int id);


}
