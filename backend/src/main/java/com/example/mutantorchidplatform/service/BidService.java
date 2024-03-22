package com.example.mutantorchidplatform.service;

import com.example.mutantorchidplatform.dto.BidCreateDTO;
import com.example.mutantorchidplatform.dto.BidDTO;
import com.example.mutantorchidplatform.dto.PageDTO;
import com.example.mutantorchidplatform.dto.SearchDTO;
import com.example.mutantorchidplatform.entity.Auction;
import com.example.mutantorchidplatform.entity.Bid;
import com.example.mutantorchidplatform.entity.User;
import com.example.mutantorchidplatform.repository.BidRepository;
import jakarta.persistence.NoResultException;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.stream.Collectors;

public interface BidService {

    void create(BidCreateDTO bidDTO);

    BidDTO getById(int id);

    PageDTO<BidDTO> search(SearchDTO searchDTO);
}

@Service
class BidServiceImpl implements BidService {


    @Autowired
    ModelMapper modelMapper;

    @Autowired
    BidRepository bidRepository;

    @Autowired
    UserService userService;

    @Autowired
    AuctionService auctionService;

    @Override
    @Transactional
    public void create(BidCreateDTO bidDTO) {
        User user = userService.getUserById(bidDTO.getUserId());
        Auction auction = auctionService.getAuctionById(bidDTO.getAuctionId());

        Bid bid = modelMapper.map(bidDTO, Bid.class);
        bid.setUser(user);
        bid.setAuction(auction);

        bidRepository.save(bid);
    }

    @Override
    public BidDTO getById(int id) {

        Bid bid = bidRepository.findById(id).orElseThrow(NoResultException::new);
        return modelMapper.map(bid, BidDTO.class);
    }


    @Override
    public PageDTO<BidDTO> search(SearchDTO searchDTO) {

        Sort sortBy = Sort.by("id").descending();

        if (StringUtils.hasText(searchDTO.getSortedField()))
            sortBy = Sort.by(searchDTO.getSortedField()).ascending();

        if (searchDTO.getCurrentPage() == null)
            searchDTO.setCurrentPage(0);

        if (searchDTO.getSize() == null)
            searchDTO.setSize(5);

        if (searchDTO.getKeyword() == null)
            searchDTO.setKeyword("");

        PageRequest pageRequest = PageRequest.of(searchDTO.getCurrentPage(), searchDTO.getSize(), sortBy);
        Page<Bid> bidPage = bidRepository.findAll(pageRequest);
        return PageDTO.<BidDTO>builder()
                .totalPages(bidPage.getTotalPages())
                .totalElements(bidPage.getTotalElements())
                .contents(bidPage.get().map(this::convertToBidDTO).collect(Collectors.toList()))
                .build();
    }

    private BidDTO convertToBidDTO(Bid bid) {

        return modelMapper.map(bid, BidDTO.class);
    }

}
