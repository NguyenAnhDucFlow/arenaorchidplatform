package com.example.mutantorchidplatform.service;

import com.example.mutantorchidplatform.dto.CategoryDTO;
import com.example.mutantorchidplatform.dto.PageDTO;
import com.example.mutantorchidplatform.dto.SearchDTO;
import com.example.mutantorchidplatform.entity.Category;
import com.example.mutantorchidplatform.repository.CategoryRepository;
import jakarta.persistence.NoResultException;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.stream.Collectors;

public interface CategoryService {

    void create(CategoryDTO categoryDTO);
    CategoryDTO getById(int id);
    void update(CategoryDTO categoryDTO);
    void delete(int id);
    PageDTO<CategoryDTO> search(SearchDTO searchDTO);
}

@Service
class CategoryServiceImpl implements CategoryService {

    @Autowired
    CategoryRepository categoryRepository;

    @Autowired
    ModelMapper modelMapper;



    @Override
    @Transactional
    public void create(CategoryDTO categoryDTO) {
        Category category = modelMapper.map(categoryDTO, Category.class);
        categoryRepository.save(category);
    }

    @Override
    public CategoryDTO getById(int id) {
        Category category = categoryRepository.findById(id).orElseThrow(NoResultException::new);
        return modelMapper.map(category, CategoryDTO.class);
    }

    @Override
    @Transactional
    public void update(CategoryDTO categoryDTO) {
        Category category = categoryRepository.findById(categoryDTO.getId()).orElseThrow(NoResultException::new);
        category.setName(categoryDTO.getName());
        categoryRepository.save(category);
    }

    @Override
    public void delete(int id) {
        categoryRepository.deleteById(id);
    }

    @Override
    public PageDTO<CategoryDTO> search(SearchDTO searchDTO) {

        Pageable pageable = PageRequest.of(searchDTO.getCurrentPage(), searchDTO.getSize());
        Page<Category> categoryPage = categoryRepository.searchByName("%" + searchDTO.getKeyword() + "%", pageable);
        return PageDTO.<CategoryDTO>builder()
                .totalPages(categoryPage.getTotalPages())
                .totalElements(categoryPage.getTotalElements())
                .contents(categoryPage.get().map(this::convertToRoleDTO).collect(Collectors.toList()))
                .build();
    }

    private CategoryDTO convertToRoleDTO(Category category) {
        return modelMapper.map(category, CategoryDTO.class);
    }
}