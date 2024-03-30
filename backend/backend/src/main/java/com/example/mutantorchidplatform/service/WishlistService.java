package com.example.mutantorchidplatform.service;

import com.example.mutantorchidplatform.dto.WishListDTO;
import com.example.mutantorchidplatform.entity.WishList;
import com.example.mutantorchidplatform.repository.WishListRepository;
import jakarta.persistence.NoResultException;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

public interface WishlistService {

    void addToWishlist(WishListDTO wishListDTO);

    WishListDTO getWishlist(int id);

    void removeFromWishlist(int id);

}
@Service
class WishlistServiceImpl implements WishlistService{

    @Autowired
    WishListRepository wishListRepository;

    @Autowired
    ModelMapper modelMapper;

    @Override
    @Transactional
    public void addToWishlist(WishListDTO wishListDTO) {
        wishListRepository.save(modelMapper.map(wishListDTO, WishList.class));
    }

    @Override
    public WishListDTO getWishlist(int id) {
        WishList wishList = wishListRepository.findById(id).orElseThrow(NoResultException::new);
        return modelMapper.map(wishList, WishListDTO.class);
    }

    @Override
    @Transactional
    public void removeFromWishlist(int id) {
        wishListRepository.deleteById(id);
    }
}