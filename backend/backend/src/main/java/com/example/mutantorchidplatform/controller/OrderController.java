package com.example.mutantorchidplatform.controller;

import com.example.mutantorchidplatform.dto.*;
import com.example.mutantorchidplatform.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/order")
public class OrderController {

    @Autowired
    OrderService orderService;

    @PostMapping("/")
    public ResponseDTO<Void> create(@RequestBody @Valid OrderDTO orderDTO) {
        orderService.create(orderDTO);
        return ResponseDTO.<Void>builder()
                .status(200)
                .msg("ok")
                .build();
    }

    @GetMapping("/")
    public ResponseDTO<List<OrderDTO>> getAll() {
        return ResponseDTO.<List<OrderDTO>>builder()
                .status(200)
                .data(orderService.getAllUser())
                .build();
    }

    @GetMapping("/{id}")
    public ResponseDTO<OrderDTO> getProduct(@PathVariable int id) {
        return ResponseDTO.<OrderDTO>builder()
                .status(200)
                .data(orderService.getById(id))
                .build();
    }

    @PutMapping("/")
    public ResponseDTO<Void> update(@RequestBody @Valid OrderDTO orderDTO) {
        orderService.update(orderDTO);
        return ResponseDTO.<Void>builder()
                .status(200)
                .msg("ok")
                .build();
    }

    @DeleteMapping("/{id}")
    public ResponseDTO<Void> delete(@PathVariable int id) {
        orderService.delete(id);
        return ResponseDTO.<Void>builder()
                .status(200)
                .msg("ok")
                .build();
    }

    @PostMapping("/search")
    public ResponseDTO<PageDTO<OrderDTO>> search(@RequestBody @Valid SearchDTO searchDTO) {
        return ResponseDTO.<PageDTO<OrderDTO>>builder()
                .status(200)
                .data(orderService.search(searchDTO))
                .build();
    }
}
