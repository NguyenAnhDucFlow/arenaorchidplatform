package com.example.mutantorchidplatform.controller;

import com.example.mutantorchidplatform.dto.*;
import com.example.mutantorchidplatform.service.OrderService;
import com.example.mutantorchidplatform.service.ShipmentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/shipment")
public class ShipmentController {

    @Autowired
    ShipmentService shipmentService;

    @PostMapping("/")
    public ResponseDTO<Void> create(@RequestBody @Valid ShipmentDTO shipmentDTO) {
        shipmentService.create(shipmentDTO);
        return ResponseDTO.<Void>builder()
                .status(200)
                .msg("ok")
                .build();
    }

    @GetMapping("/{id}")
    public ResponseDTO<ShipmentDTO> getProduct(@PathVariable int id) {
        return ResponseDTO.<ShipmentDTO>builder()
                .status(200)
                .data(shipmentService.getById(id))
                .build();
    }

    @PutMapping("/")
    public ResponseDTO<Void> update(@RequestBody @Valid ShipmentDTO shipmentDTO) {
        shipmentService.update(shipmentDTO);
        return ResponseDTO.<Void>builder()
                .status(200)
                .msg("ok")
                .build();
    }

    @DeleteMapping("/{id}")
    public ResponseDTO<Void> delete(@PathVariable int id) {
        shipmentService.delete(id);
        return ResponseDTO.<Void>builder()
                .status(200)
                .msg("ok")
                .build();
    }

    @PostMapping("/search")
    public ResponseDTO<PageDTO<ShipmentDTO>> search(@RequestBody @Valid SearchDTO searchDTO) {
        return ResponseDTO.<PageDTO<ShipmentDTO>>builder()
                .status(200)
                .data(shipmentService.search(searchDTO))
                .build();
    }
}
