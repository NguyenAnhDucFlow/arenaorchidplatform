package com.example.mutantorchidplatform.service;

import com.example.mutantorchidplatform.dto.*;
import com.example.mutantorchidplatform.entity.Auction;
import com.example.mutantorchidplatform.entity.Bid;
import com.example.mutantorchidplatform.entity.Product;
import com.example.mutantorchidplatform.entity.User;
import com.example.mutantorchidplatform.entity.enums.AuctionStatus;
import com.example.mutantorchidplatform.entity.enums.BidStatus;
import com.example.mutantorchidplatform.exception.AlreadyExistedException;
import com.example.mutantorchidplatform.repository.AuctionRepository;
import com.example.mutantorchidplatform.repository.ProductRepository;
import jakarta.persistence.NoResultException;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

public interface AuctionService {

    void create(AuctionCreateDTO auctionDTO);

    AuctionLooseWithBidsDTO getById(int id);
    Auction getAuctionById(int id);

    void update(int id, AuctionCreateDTO auctionDTO);

    void delete(int id);

    PageDTO<AuctionMetadata> search(SearchDTO searchDTO);

    List<AuctionMetadata> getLatestAuctions();

    void delete(List<Integer> ids);

    void endAuction(int id, BidCreateDTO dto);

    List<AuctionMetadata> listAuction();

    List<Auction> getAllByProductOwnerId(int ownerId);
}

@Service
class AuctionServiceImpl implements AuctionService {


    @Autowired
    ModelMapper modelMapper;

    @Autowired
    AuctionRepository auctionRepository;

    @Autowired
    ProductRepository productRepository;

    @Autowired
    UserService userService;

    @Override
    @Transactional
    public void create(AuctionCreateDTO dto) {
        Product product = productRepository.findById(dto.getProductId()).orElseThrow(NoResultException::new);

        if (product.getAuction() != null)
            throw new AlreadyExistedException("Product already has an auction");

        if (product.getAvailable() < 1)
            throw new AlreadyExistedException("Product is out of stock");

        Auction auction = modelMapper.map(dto, Auction.class);
        auction.setProduct(product);
        auction.setStatus(AuctionStatus.PENDING);
        product.setAvailable(product.getAvailable() - 1);

        auctionRepository.save(auction);
    }

    @Override
    public AuctionLooseWithBidsDTO getById(int id) {
        Auction auction = auctionRepository.findById(id).orElseThrow(NoResultException::new);
        return modelMapper.map(auction, AuctionLooseWithBidsDTO.class);
    }

    @Override
    public Auction getAuctionById(int id) {
        return auctionRepository.findById(id).orElseThrow(NoResultException::new);
    }

    @Override
    @Transactional
    public void update(int id, AuctionCreateDTO dto) {
        Auction auction = auctionRepository.findById(id).orElseThrow(NoResultException::new);
        auction.setStatus(dto.getStatus());
        auction.setStartDate(dto.getStartDate());
        auction.setEndDate(dto.getEndDate());
        auction.setCurrentPrice(dto.getCurrentPrice());
        auction.setStartPrice(dto.getStartPrice());
        auction.setStepPrice(dto.getStepPrice());

        auctionRepository.save(auction);
    }

    @Override
    @Transactional
    public void delete(int id) {
        auctionRepository.deleteById(id);
    }

    @Override
    public PageDTO<AuctionMetadata> search(SearchDTO searchDTO) {

        Sort sortBy = Sort.by("startDate").descending();

        if (StringUtils.hasText(searchDTO.getSortedField()))
            sortBy = Sort.by(searchDTO.getSortedField()).ascending();

        if (searchDTO.getCurrentPage() == null)
            searchDTO.setCurrentPage(0);

        if (searchDTO.getSize() == null)
            searchDTO.setSize(5);

        if (searchDTO.getKeyword() == null)
            searchDTO.setKeyword("");

        PageRequest pageRequest = PageRequest.of(searchDTO.getCurrentPage(), searchDTO.getSize(), sortBy);
        Page<Auction> auctionPage = auctionRepository.searchByProductName("%" + searchDTO.getKeyword() + "%", pageRequest);
        return PageDTO.<AuctionMetadata>builder()
                .totalPages(auctionPage.getTotalPages())
                .totalElements(auctionPage.getTotalElements())
                .contents(auctionPage.get().map(this::convertToAuctionMetadata).collect(Collectors.toList()))
                .build();
    }

    @Override
    public List<AuctionMetadata> getLatestAuctions() {
        return auctionRepository.findTop10ByOrderByStartDateDesc(AuctionStatus.APPROVED).stream().map(this::convertToAuctionMetadata).collect(Collectors.toList());
    }

    @Override
    public void delete(List<Integer> ids) {
        auctionRepository.deleteAllById(ids);
    }

    @Override
    public void endAuction(int id, BidCreateDTO dto) {
        Auction auction = auctionRepository.findById(id).orElseThrow(NoResultException::new);
        User user = userService.getUserById(dto.getUserId());

        auction.getBids().stream().filter(b -> Objects.equals(b.getUser().getId(), user.getId())).forEach(
                b -> {
                    if (!b.getStatus().equals(BidStatus.CANCELLED))
                        b.setStatus(BidStatus.CANCELLED);
                }
        );

        Bid bid = modelMapper.map(dto, Bid.class);
        bid.setUser(user);
        bid.setAuction(auction);
        bid.setStatus(BidStatus.DONE);
        auction.getBids().add(bid);
        auction.setStatus(AuctionStatus.CLOSED);
        auction.setCurrentPrice(String.valueOf(dto.getAmount()));

        if (dto.getAuctionEndDate() != null)
            auction.setEndDate(dto.getAuctionEndDate());

        auctionRepository.save(auction);
    }

    @Override
    public List<AuctionMetadata> listAuction() {
        return auctionRepository.findByOrderByStartDateDesc(AuctionStatus.APPROVED)
                .stream().map(this::convertToAuctionMetadata)
                .collect(Collectors.toList());
    }

    @Override
    public List<Auction> getAllByProductOwnerId(int ownerId) {
        return auctionRepository.findAllByProduct_Owner_Id(ownerId);
    }


    private AuctionDTO convertToAuctionDTO(Auction auction) {
        return modelMapper.map(auction, AuctionDTO.class);
    }

    private AuctionMetadata convertToAuctionMetadata(Auction auction) {
        return modelMapper.map(auction, AuctionMetadata.class);
    }
}

