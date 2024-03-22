package com.example.mutantorchidplatform.service;

import com.example.mutantorchidplatform.dto.*;
import com.example.mutantorchidplatform.entity.Auction;
import com.example.mutantorchidplatform.entity.Product;
import com.example.mutantorchidplatform.entity.enums.AuctionStatus;
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

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

public interface AuctionService {

    void create(AuctionCreateDTO auctionDTO);

    AuctionDTO getById(int id);

    void update(AuctionDTO auctionDTO);

    void delete(int id);

    PageDTO<AuctionMetadata> search(SearchDTO searchDTO);

    List<AuctionMetadata> getLatestAuctions();
}

@Service
class AuctionServiceImpl implements AuctionService {


    @Autowired
    ModelMapper modelMapper;

    @Autowired
    AuctionRepository auctionRepository;

    @Autowired
    ProductRepository productRepository;

    @Override
    @Transactional
    public void create(AuctionCreateDTO dto) {
        Product product = productRepository.findById(dto.getProductId()).orElseThrow(NoResultException::new);

        if (product.getAuction() != null)
            throw new AlreadyExistedException("Product already has an auction");

        Auction auction = modelMapper.map(dto, Auction.class);
        auction.setProduct(product);
        auction.setStatus(AuctionStatus.PENDING);

        auctionRepository.save(auction);
    }

    @Override
    public AuctionDTO getById(int id) {

        Auction auction = auctionRepository.findById(id).orElseThrow(NoResultException::new);
        return modelMapper.map(auction, AuctionDTO.class);
    }

    @Override
    @Transactional
    public void update(AuctionDTO auctionDTO) {
        auctionRepository.findById(auctionDTO.getId()).orElseThrow(NoResultException::new);
        auctionRepository.save(modelMapper.map(auctionDTO, Auction.class));
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
        return auctionRepository.findTop10ByOrderByStartDateDesc(new Date()).stream().map(this::convertToAuctionMetadata).collect(Collectors.toList());
    }


    private AuctionDTO convertToAuctionDTO(Auction auction) {
        return modelMapper.map(auction, AuctionDTO.class);
    }

    private AuctionMetadata convertToAuctionMetadata(Auction auction) {
        return modelMapper.map(auction, AuctionMetadata.class);
    }
}

