package com.example.mutantorchidplatform.service;

import com.example.mutantorchidplatform.dto.BidDTO;
import com.example.mutantorchidplatform.dto.PageDTO;
import com.example.mutantorchidplatform.dto.SearchDTO;
import com.example.mutantorchidplatform.entity.Bid;
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

    void create(BidDTO bidDTO);

    BidDTO getById(int id);

    PageDTO<BidDTO> search(SearchDTO searchDTO);
}

@Service
class BidServiceImpl implements BidService {


    @Autowired
    ModelMapper modelMapper;

    @Autowired
    BidRepository bidRepository;

    @Override
    @Transactional
    public void create(BidDTO bidDTO) {
        bidRepository.save(modelMapper.map(bidDTO, Bid.class));
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
