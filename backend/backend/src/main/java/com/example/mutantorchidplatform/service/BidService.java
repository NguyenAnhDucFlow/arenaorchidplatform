package com.example.mutantorchidplatform.service;

import com.example.mutantorchidplatform.dto.*;
import com.example.mutantorchidplatform.entity.Auction;
import com.example.mutantorchidplatform.entity.Bid;
import com.example.mutantorchidplatform.entity.User;
import com.example.mutantorchidplatform.entity.enums.BidStatus;
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

import java.util.*;
import java.util.stream.Collectors;

public interface BidService {

    void create(BidCreateDTO bidDTO);

    BidDTO getById(int id);

    PageDTO<BidDTO> search(SearchDTO searchDTO);

    List<BidLooseDTO> getAllByAuctionId(int id);

    Map<String, List<BidDetailDTO>> getAllByUserId(int userId);

    void cancelBid(int id);
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
        existedBid.ifPresent(value -> value.setStatus(BidStatus.CANCELLED));

        Bid bid = modelMapper.map(bidDTO, Bid.class);
        bid.setUser(user);
        bid.setAuction(auction);

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

    @Override
    public Map<String, List<BidDetailDTO>> getAllByUserId(int userId) {
        // Bid, Auction, Product
        List<Bid> bids = bidRepository.findAllByUserId(userId).stream().sorted(
                (b1, b2) -> Date.from(b2.getCreatedAt().toInstant()).compareTo(Date.from(b1.getCreatedAt().toInstant()))
        ).toList();

        // Get all the auctions that the user has bidded on
        List<Auction> auctions = bids.stream().map(Bid::getAuction).toList();

        // Get all the auctions that the user has bidded on and the highest bid with the earliest updated time. Also, only
        // bid with status "PENDING" and "DONE" are considered.
        List<Bid> highestBids = auctions.stream()
                .map(auction -> auction.getBids().stream()
                        .min((b1, b2) -> {
                            if (b1.getAmount() == b2.getAmount())
                                return Date.from(b1.getCreatedAt().toInstant()).compareTo(Date.from(b2.getCreatedAt().toInstant()));
                            return Double.compare(b2.getAmount(), b1.getAmount());
                        }).orElse(null))
                .toList();

        Map<String, List<BidDetailDTO>> map = new HashMap<>();
        map.put("bids", bids.stream().map(this::convertToBidDetailDTO).collect(Collectors.toList()));
        map.put("highestBids", highestBids.stream().map(this::convertToBidDetailDTO).collect(Collectors.toList()));

        return map;
    }

    @Override
    public void cancelBid(int id) {
        Bid bid = bidRepository.findById(id).orElseThrow(NoResultException::new);
        bid.setStatus(BidStatus.CANCELLED);
        bidRepository.save(bid);
    }

    private BidDTO convertToBidDTO(Bid bid) {
        return modelMapper.map(bid, BidDTO.class);
    }

    private BidLooseDTO convertToBidLooseDTO(Bid bid) {
        return modelMapper.map(bid, BidLooseDTO.class);
    }

    private BidDetailDTO convertToBidDetailDTO(Bid bid) {
        return modelMapper.map(bid, BidDetailDTO.class);
    }
}
