package com.example.mutantorchidplatform.service;

import com.example.mutantorchidplatform.dto.PageDTO;
import com.example.mutantorchidplatform.dto.SearchDTO;
import com.example.mutantorchidplatform.dto.ShipmentDTO;
import com.example.mutantorchidplatform.entity.Shipment;
import com.example.mutantorchidplatform.repository.ShipmentRepository;
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

public interface ShipmentService {

    void create(ShipmentDTO shipmentDTO);

    ShipmentDTO getById(int id);

    void update(ShipmentDTO shipmentDTO);

    void delete(int id);

    PageDTO<ShipmentDTO> search(SearchDTO searchDTO);
}
@Service
class ShipmentServiceImpl implements ShipmentService {


    @Autowired
    ModelMapper modelMapper;

    @Autowired
    ShipmentRepository shipmentRepository;


    @Override
    @Transactional
    public void create(ShipmentDTO shipmentDTO) {

        shipmentRepository.save(modelMapper.map(shipmentDTO, Shipment.class));
    }

    @Override
    public ShipmentDTO getById(int id) {

        Shipment shipment = shipmentRepository.findById(id).orElseThrow(NoResultException::new);
        return modelMapper.map(shipment, ShipmentDTO.class);
    }

    @Override
    @Transactional
    public void update(ShipmentDTO shipmentDTO) {
        shipmentRepository.findById(shipmentDTO.getId()).orElseThrow(NoResultException::new);
        shipmentRepository.save(modelMapper.map(shipmentDTO, Shipment.class));
    }

    @Override
    @Transactional
    public void delete(int id) {
        shipmentRepository.deleteById(id);
    }

    @Override
    public PageDTO<ShipmentDTO> search(SearchDTO searchDTO) {

        Sort sortBy = Sort.by("date").descending();

        if (StringUtils.hasText(searchDTO.getSortedField()))
            sortBy = Sort.by(searchDTO.getSortedField()).ascending();

        if (searchDTO.getCurrentPage() == null)
            searchDTO.setCurrentPage(0);

        if (searchDTO.getSize() == null)
            searchDTO.setSize(5);

        if (searchDTO.getKeyword() == null)
            searchDTO.setKeyword("");

        PageRequest pageRequest = PageRequest.of(searchDTO.getCurrentPage(), searchDTO.getSize(), sortBy);
        Page<Shipment> orderPage = shipmentRepository.findAll(pageRequest);
        return PageDTO.<ShipmentDTO>builder()
                .totalPages(orderPage.getTotalPages())
                .totalElements(orderPage.getTotalElements())
                .contents(orderPage.get().map(this::convert).collect(Collectors.toList()))
                .build();
    }

    private ShipmentDTO convert(Shipment shipment) {

        return modelMapper.map(shipment, ShipmentDTO.class);
    }
}

