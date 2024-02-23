package com.example.mutantorchidplatform.service;

import com.example.mutantorchidplatform.dto.FeedbackDTO;
import com.example.mutantorchidplatform.dto.PageDTO;
import com.example.mutantorchidplatform.dto.SearchDTO;
import com.example.mutantorchidplatform.entity.Feedback;
import com.example.mutantorchidplatform.repository.FeedbackRepository;
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

public interface FeedbackService {

    void create(FeedbackDTO feedbackDTO);

    FeedbackDTO getById(int id);

    void update(FeedbackDTO feedbackDTO);

    void delete(int id);

    PageDTO<FeedbackDTO> search(SearchDTO searchDTO);

}

@Service
class FeedbackServiceImpl implements FeedbackService{

    @Autowired
    ModelMapper modelMapper;

    @Autowired
    FeedbackRepository feedbackRepository;

    @Override
    @Transactional
    public void create(FeedbackDTO feedbackDTO) {
        feedbackRepository.save(modelMapper.map(feedbackDTO, Feedback.class));
    }

    @Override
    public FeedbackDTO getById(int id) {
        Feedback feedback = feedbackRepository.findById(id).orElseThrow(NoResultException::new);
        return modelMapper.map(feedback, FeedbackDTO.class);
    }

    @Override
    @Transactional
    public void update(FeedbackDTO feedbackDTO) {
        feedbackRepository.findById(feedbackDTO.getId()).orElseThrow(NoResultException::new);
        feedbackRepository.save(modelMapper.map(feedbackDTO, Feedback.class));

    }

    @Override
    @Transactional
    public void delete(int id) {
        feedbackRepository.deleteById(id);
    }


    @Override
    public PageDTO<FeedbackDTO> search(SearchDTO searchDTO) {
        Sort sortBy = Sort.by("createdAt").descending();

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
        Page<Feedback> feedbackPage = feedbackRepository.findAll(pageRequest);
        return PageDTO.<FeedbackDTO>builder()
                .totalPages(feedbackPage.getTotalPages())
                .totalElements(feedbackPage.getTotalElements())
                .contents(feedbackPage.get().map(this::convertToFeedbackDTO).collect(Collectors.toList()))
                .build();
    }

    private FeedbackDTO convertToFeedbackDTO(Feedback feedback) {
        return modelMapper.map(feedback, FeedbackDTO.class);
    }
}
