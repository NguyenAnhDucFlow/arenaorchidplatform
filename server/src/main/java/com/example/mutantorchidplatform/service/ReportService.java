package com.example.mutantorchidplatform.service;

import com.example.mutantorchidplatform.dto.PageDTO;
import com.example.mutantorchidplatform.dto.ReportDTO;
import com.example.mutantorchidplatform.dto.SearchDTO;
import com.example.mutantorchidplatform.entity.Report;
import com.example.mutantorchidplatform.repository.ReportRepository;
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

public interface ReportService {

    void create(ReportDTO reportDTO);

    ReportDTO getById(int id);

    void update(ReportDTO reportDTO);

    void delete(int id);

    PageDTO<ReportDTO> search(SearchDTO searchDTO);

}

@Service
class ReportServiceImpl implements ReportService{

    @Autowired
    ModelMapper modelMapper;

    @Autowired
    ReportRepository reportRepository;

    @Override
    @Transactional
    public void create(ReportDTO reportDTO) {
        reportRepository.save(modelMapper.map(reportDTO, Report.class));
    }

    @Override
    public ReportDTO getById(int id) {
        Report report = reportRepository.findById(id).orElseThrow(NoResultException::new);
        return modelMapper.map(report, ReportDTO.class);
    }

    @Override
    @Transactional
    public void update(ReportDTO reportDTO) {
        reportRepository.findById(reportDTO.getId()).orElseThrow(NoResultException::new);
        reportRepository.save(modelMapper.map(reportDTO, Report.class));

    }

    @Override
    @Transactional
    public void delete(int id) {
        reportRepository.deleteById(id);
    }


    @Override
    public PageDTO<ReportDTO> search(SearchDTO searchDTO) {
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
        Page<Report> reportPage = reportRepository.findAll(pageRequest);
        return PageDTO.<ReportDTO>builder()
                .totalPages(reportPage.getTotalPages())
                .totalElements(reportPage.getTotalElements())
                .contents(reportPage.get().map(this::convertToReportDTO).collect(Collectors.toList()))
                .build();
    }

    private ReportDTO convertToReportDTO(Report report) {
        return modelMapper.map( report, ReportDTO.class);
    }
}
