package com.example.mutantorchidplatform.service;

import com.example.mutantorchidplatform.dto.AuctionDTO;
import com.example.mutantorchidplatform.dto.PageDTO;
import com.example.mutantorchidplatform.dto.SearchDTO;
import com.example.mutantorchidplatform.entity.Auction;
import com.example.mutantorchidplatform.repository.AuctionRepository;
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

public interface AuctionService {

    void create(AuctionDTO auctionDTO);

    AuctionDTO getById(int id);

    void update(AuctionDTO auctionDTO);

    void delete(int id);

    PageDTO<AuctionDTO> search(SearchDTO searchDTO);
}
@Service
class AuctionServiceImpl implements AuctionService {


    @Autowired
    ModelMapper modelMapper;

    @Autowired
    AuctionRepository auctionRepository;

    @Override
    @Transactional
    public void create(AuctionDTO auctionDTO) {
        auctionRepository.save(modelMapper.map(auctionDTO, Auction.class));
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
    public PageDTO<AuctionDTO> search(SearchDTO searchDTO) {

        Sort sortBy = Sort.by("startDate").ascending();

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
        return PageDTO.<AuctionDTO>builder()
                .totalPages(auctionPage.getTotalPages())
                .totalElements(auctionPage.getTotalElements())
                .contents(auctionPage.get().map(this::convertToAuctionDTO).collect(Collectors.toList()))
                .build();
    }

    private AuctionDTO convertToAuctionDTO(Auction auction) {

        return modelMapper.map(auction, AuctionDTO.class);
    }
}

