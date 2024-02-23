package com.example.mutantorchidplatform.controller;

import com.example.mutantorchidplatform.dto.CategoryDTO;
import com.example.mutantorchidplatform.dto.PageDTO;
import com.example.mutantorchidplatform.dto.ResponseDTO;
import com.example.mutantorchidplatform.dto.SearchDTO;
import com.example.mutantorchidplatform.service.CategoryService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/category")
public class CategoryController {

    @Autowired
    CategoryService categoryService;

    @PostMapping("/")
    public ResponseDTO<Void> create(@RequestBody @Valid CategoryDTO categoryDTO) {
        categoryService.create(categoryDTO);
        return ResponseDTO.<Void>builder()
                .status(200)
                .msg("ok")
                .build();
    }

    @GetMapping("/{id}")
    public ResponseDTO<CategoryDTO> getById(@PathVariable int id) {
        return ResponseDTO.<CategoryDTO>builder()
                .status(200)
                .data(categoryService.getById(id))
                .build();
    }

    @PutMapping("/")
    public ResponseDTO<Void> update(@RequestBody @Valid CategoryDTO categoryDTO) {
        categoryService.update(categoryDTO);
        return ResponseDTO.<Void>builder()
                .status(200)
                .msg("ok")
                .build();
    }

    @DeleteMapping("/{id}")
    public ResponseDTO<Void> delete(@PathVariable int id) {
        categoryService.delete(id);
        return ResponseDTO.<Void>builder()
                .status(200)
                .msg("ok")
                .build();
    }

    @PostMapping("/search")
    public ResponseDTO<PageDTO<CategoryDTO>> search(@RequestBody @Valid SearchDTO searchDTO) {
        return ResponseDTO.<PageDTO<CategoryDTO>>builder()
                .status(200)
                .data(categoryService.search(searchDTO))
                .build();
    }
}
