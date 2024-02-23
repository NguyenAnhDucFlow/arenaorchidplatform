package com.example.mutantorchidplatform.service;

import com.example.mutantorchidplatform.dto.PageDTO;
import com.example.mutantorchidplatform.dto.PaymentDTO;
import com.example.mutantorchidplatform.dto.SearchDTO;
import com.example.mutantorchidplatform.entity.Payment;
import com.example.mutantorchidplatform.repository.PaymentRepository;
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

public interface PaymentService {

    void create(PaymentDTO paymentDTO);

    PaymentDTO getById(int id);

    PageDTO<PaymentDTO> search(SearchDTO searchDTO);

}
@Service
class PaymentServiceImpl implements PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private ModelMapper modelMapper;


    @Override
    @Transactional
    public void create(PaymentDTO paymentDTO) {
        Payment payment = modelMapper.map(paymentDTO, Payment.class);
        paymentRepository.save(payment);
    }

    @Override
    public PaymentDTO getById(int id) {
        Payment payment = paymentRepository.findById(id).orElseThrow(NoResultException::new);
        return modelMapper.map(payment, PaymentDTO.class);
    }





    @Override
    public PageDTO<PaymentDTO> search(SearchDTO searchDTO) {

        Sort sortBy = Sort.by("id").ascending();

        if (StringUtils.hasText(searchDTO.getSortedField())) {
            sortBy = Sort.by(searchDTO.getSortedField()).ascending();
        }

        if (searchDTO.getCurrentPage() == null)
            searchDTO.setCurrentPage(0);

        if (searchDTO.getSize() == null)
            searchDTO.setSize(5);

        if (searchDTO.getKeyword() == null)
            searchDTO.setKeyword("");

        PageRequest pageRequest = PageRequest.of(searchDTO.getCurrentPage(), searchDTO.getSize(), sortBy);
        Page<Payment> paymentPage = paymentRepository.findAll(pageRequest);
        return PageDTO.<PaymentDTO>builder()
                .totalPages(paymentPage.getTotalPages())
                .totalElements(paymentPage.getTotalElements())
                .contents(paymentPage.get().map(this::convertToPaymentDTO).collect(Collectors.toList()))
                .build();
    }

    private PaymentDTO convertToPaymentDTO(Payment payment) {

        return modelMapper.map(payment, PaymentDTO.class);
    }
}

