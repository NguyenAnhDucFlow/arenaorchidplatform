package com.example.mutantorchidplatform.controller;

import com.example.mutantorchidplatform.dto.*;
import com.example.mutantorchidplatform.service.AuctionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auction")
public class AuctionController {

    @Autowired
    AuctionService auctionService;

    @PostMapping("/")
    public ResponseDTO<Void> create(@RequestBody @Valid AuctionDTO auctionDTO) {
        auctionService.create(auctionDTO);
        return ResponseDTO.<Void>builder()
                .status(200)
                .msg("ok")
                .build();
    }

    @GetMapping("/{id}")
    public ResponseDTO<AuctionDTO> getProduct(@PathVariable int id) {
        return ResponseDTO.<AuctionDTO>builder()
                .status(200)
                .data(auctionService.getById(id))
                .build();
    }

    @PutMapping("/")
    public ResponseDTO<Void> update(@RequestBody @Valid AuctionDTO auctionDTO) {
        auctionService.update(auctionDTO);
        return ResponseDTO.<Void>builder()
                .status(200)
                .msg("ok")
                .build();
    }

    @DeleteMapping("/{id}")
    public ResponseDTO<Void> delete(@PathVariable int id) {
        auctionService.delete(id);
        return ResponseDTO.<Void>builder()
                .status(200)
                .msg("ok")
                .build();
    }

    @PostMapping("/search")
    public ResponseDTO<PageDTO<AuctionDTO>> search(@RequestBody @Valid SearchDTO searchDTO) {
        return ResponseDTO.<PageDTO<AuctionDTO>>builder()
                .status(200)
                .data(auctionService.search(searchDTO))
                .build();
    }
}
