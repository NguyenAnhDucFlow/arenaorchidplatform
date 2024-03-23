package com.example.mutantorchidplatform.service;

import com.example.mutantorchidplatform.dto.*;
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

import java.util.Date;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

public interface BidService {

    void create(BidCreateDTO bidDTO);

    BidDTO getById(int id);

    PageDTO<BidDTO> search(SearchDTO searchDTO);

    List<BidLooseDTO> getAllByAuctionId(int id);
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
        Optional<Bid> existedBid = auction.getBids().stream().filter(b -> Objects.equals(b.getUser().getId(), user.getId())).findFirst();
        Bid bid;

        if (existedBid.isPresent()) {
            bid = existedBid.get();
            bid.setAmount(bidDTO.getAmount());
            bid.setStatus(bidDTO.getStatus());
        } else {
            bid = modelMapper.map(bidDTO, Bid.class);
            bid.setUser(user);
            bid.setAuction(auction);
        }

        if (auction.getCurrentPrice().isEmpty())
            auction.setCurrentPrice(String.valueOf(bidDTO.getAmount()));
        else if (bidDTO.getAmount() > Double.parseDouble(auction.getCurrentPrice())) {
            auction.setCurrentPrice(String.valueOf(bidDTO.getAmount()));
        }

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

    @Override
    public List<BidLooseDTO> getAllByAuctionId(int id) {
        List<Bid> bids = bidRepository.findAllByAuctionId(id);
        return bids.stream().map(this::convertToBidLooseDTO).collect(Collectors.toList());
    }

    private BidDTO convertToBidDTO(Bid bid) {
        return modelMapper.map(bid, BidDTO.class);
    }

    private BidLooseDTO convertToBidLooseDTO(Bid bid) {
        return modelMapper.map(bid, BidLooseDTO.class);
    }
}
