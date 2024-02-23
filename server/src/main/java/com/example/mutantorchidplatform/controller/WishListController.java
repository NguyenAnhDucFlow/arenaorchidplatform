package com.example.mutantorchidplatform.controller;

import com.example.mutantorchidplatform.dto.ResponseDTO;
import com.example.mutantorchidplatform.dto.WishListDTO;
import com.example.mutantorchidplatform.service.WishlistService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/wishlist")
public class WishListController {

    @Autowired
    WishlistService wishlistService;

    @PostMapping("/")
    public ResponseDTO<Void> create(@RequestBody @Valid WishListDTO wishListDTO) {
        wishlistService.addToWishlist(wishListDTO);
        return ResponseDTO.<Void>builder()
                .status(200)
                .msg("ok")
                .build();
    }

    @GetMapping("/{id}")
    public ResponseDTO<WishListDTO> getById(@PathVariable int id) {
        return ResponseDTO.<WishListDTO>builder()
                .status(200)
                .data(wishlistService.getWishlist(id))
                .build();
    }


    @DeleteMapping("/{id}")
    public ResponseDTO<Void> delete(@PathVariable int id) {
        wishlistService.removeFromWishlist(id);
        return ResponseDTO.<Void>builder()
                .status(200)
                .msg("ok")
                .build();
    }


}
