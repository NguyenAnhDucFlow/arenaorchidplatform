package com.example.mutantorchidplatform.controller;

import com.example.mutantorchidplatform.dto.BidDTO;
import com.example.mutantorchidplatform.dto.PageDTO;
import com.example.mutantorchidplatform.dto.ResponseDTO;
import com.example.mutantorchidplatform.dto.SearchDTO;
import com.example.mutantorchidplatform.service.BidService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/bid")
public class BidController {

    @Autowired
    BidService bidService;

    @PostMapping("/")
    public ResponseDTO<Void> create(@RequestBody @Valid BidDTO bidDTO) {
        bidService.create(bidDTO);
        return ResponseDTO.<Void>builder()
                .status(200)
                .msg("ok")
                .build();
    }

    @GetMapping("/{id}")
    public ResponseDTO<BidDTO> getById(@PathVariable int id) {
        return ResponseDTO.<BidDTO>builder()
                .status(200)
                .data(bidService.getById(id))
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
