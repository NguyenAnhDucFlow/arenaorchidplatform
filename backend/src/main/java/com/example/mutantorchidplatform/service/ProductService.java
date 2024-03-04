package com.example.mutantorchidplatform.service;

import com.example.mutantorchidplatform.dto.PageDTO;
import com.example.mutantorchidplatform.dto.ProductDTO;
import com.example.mutantorchidplatform.dto.SearchDTO;
import com.example.mutantorchidplatform.entity.Product;
import com.example.mutantorchidplatform.entity.enums.InventoryType;
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
import java.util.stream.Collectors;

public interface ProductService {

    void create(ProductDTO productDTO);
    ProductDTO getById(Long id);

    ProductDTO getByName(String name);
    void update(ProductDTO productDTO);
    void delete(Long id);
    PageDTO<ProductDTO> search(SearchDTO searchDTO);
    List<ProductDTO> getAllProduct();

    List<ProductDTO> getAllProductByOwnerId(long id);


}

@Service
class ProductServiceImpl implements ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ModelMapper modelMapper;


    @Override
    @Transactional
    public void create(ProductDTO productDTO) {
        Product product = modelMapper.map(productDTO, Product.class);

        if (product.getAvailable() == 0) {
            product.setInventoryType(InventoryType.out_of_stock);
        } else if (product.getAvailable() < 5) {
            product.setInventoryType(InventoryType.low_stock);
        } else {
            product.setInventoryType(InventoryType.in_stock);
        }

        productRepository.save(product);
    }

    @Override
    public ProductDTO getById(Long id) {
        Product product = productRepository.findById(id).orElseThrow(NoResultException::new);
        return modelMapper.map(product, ProductDTO.class);
    }

    @Override
    public ProductDTO getByName(String name) {
        Product product = productRepository.findByName(name).orElseThrow(NoResultException::new);
        return modelMapper.map(product, ProductDTO.class);
    }

    @Override
    @Transactional
    public void update(ProductDTO productDTO) {
        productRepository.findById(productDTO.getId()).orElseThrow(NoResultException::new);
        productRepository.save(modelMapper.map(productDTO, Product.class));
    }

    @Override
    @Transactional
    public void delete(Long id) {
        productRepository.deleteById(id);
    }

    @Override
    public PageDTO<ProductDTO> search(SearchDTO searchDTO) {

        Sort sortBy = Sort.by("name").ascending();

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
        Page<Product> productPage = productRepository.searchByName("%" + searchDTO.getKeyword() + "%", pageRequest);
        return PageDTO.<ProductDTO>builder()
                .totalPages(productPage.getTotalPages())
                .totalElements(productPage.getTotalElements())
                .contents(productPage.get().map(this::convertToProductDTO).collect(Collectors.toList()))
                .build();
    }

    @Override
    public List<ProductDTO> getAllProduct() {
        List<Product> products  = productRepository.findAll();
        return products.stream()
                .map(this::convertToProductDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<ProductDTO> getAllProductByOwnerId(long id) {
        List<Product> products  = productRepository.findByOwnerId(id);
        return products.stream()
                .map(this::convertToProductDTO)
                .collect(Collectors.toList());
    }

    private ProductDTO convertToProductDTO(Product product) {
        return modelMapper.map(product, ProductDTO.class);
    }
}
