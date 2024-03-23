package com.example.mutantorchidplatform.controller;

import com.example.mutantorchidplatform.dto.*;
import com.example.mutantorchidplatform.service.BidService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/bid")
public class BidController {

    @Autowired
    BidService bidService;

    @PostMapping
    public ResponseDTO<Void> create(@RequestBody @Valid BidCreateDTO dto) {
        bidService.create(dto);
        return ResponseDTO.<Void>builder()
                .status(200)
                .msg("ok")
                .build();
    }

    @GetMapping("/{id}")
    public ResponseDTO<List<BidLooseDTO>> getAllByAuctionId(@PathVariable int id) {
        return ResponseDTO.<List<BidLooseDTO>>builder()
                .status(200)
                .data(bidService.getAllByAuctionId(id))
                .build();
    }

    @PostMapping("/search")
    public ResponseDTO<PageDTO<BidDTO>> search(@RequestBody @Valid SearchDTO searchDTO) {
        return ResponseDTO.<PageDTO<BidDTO>>builder()
                .status(200)
                .data(bidService.search(searchDTO))
                .build();
    }


}
