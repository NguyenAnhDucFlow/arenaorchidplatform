package com.example.mutantorchidplatform.controller;

import com.example.mutantorchidplatform.dto.*;
import com.example.mutantorchidplatform.service.AuctionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/auction")
public class AuctionController {

    @Autowired
    AuctionService auctionService;

    @PostMapping
    public ResponseDTO<Void> create(@RequestBody @Valid AuctionCreateDTO auctionDTO) {
        auctionService.create(auctionDTO);
        return ResponseDTO.<Void>builder()
                .status(200)
                .msg("ok")
                .build();
    }

    @GetMapping("/{id}")
    public ResponseDTO<AuctionLooseWithBidsDTO> getProduct(@PathVariable int id) {
        return ResponseDTO.<AuctionLooseWithBidsDTO>builder()
                .status(200)
                .data(auctionService.getById(id))
                .build();
    }

    @PutMapping("/{id}")
    public ResponseDTO<Void> update(@PathVariable int id, @RequestBody @Valid AuctionCreateDTO auctionDTO) {
        auctionService.update(id, auctionDTO);
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

    @DeleteMapping
    public ResponseDTO<Void> delete(@RequestBody @Valid idsDTO dto) {
        auctionService.delete(dto.getIds());
        return ResponseDTO.<Void>builder()
                .status(200)
                .msg("ok")
                .build();
    }

    @GetMapping("/search")
    public ResponseDTO<PageDTO<AuctionMetadata>> search(@ModelAttribute @Valid SearchDTO searchDTO) {
        return ResponseDTO.<PageDTO<AuctionMetadata>>builder()
                .status(200)
                .data(auctionService.search(searchDTO))
                .build();
    }

    @GetMapping
    public ResponseDTO<List<AuctionMetadata>> getLatestAuctions() {
        return ResponseDTO.<List<AuctionMetadata>>builder()
                .status(200)
                .data(auctionService.getLatestAuctions())
                .build();
    }

    @GetMapping("/getAllAction")
    public ResponseDTO<List<AuctionMetadata>> getLatestAuctions2() {
        return ResponseDTO.<List<AuctionMetadata>>builder()
                .status(200)
                .data(auctionService.listAuction())
                .build();
    }

    @PutMapping("end/{id}")
    public ResponseDTO<Void> endAuctionByPayout(@PathVariable int id, @RequestBody @Valid BidCreateDTO dto) {
        auctionService.endAuction(id, dto);
        return ResponseDTO.<Void>builder()
                .status(200)
                .msg("ok")
                .build();
    }
}
