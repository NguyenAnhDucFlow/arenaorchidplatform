package com.example.mutantorchidplatform.controller;

import com.example.mutantorchidplatform.dto.*;
import com.example.mutantorchidplatform.entity.Product;
import com.example.mutantorchidplatform.service.ProductService;
import com.example.mutantorchidplatform.service.S3StorageService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.data.repository.query.Param;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.services.s3.model.S3Exception;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/product")
public class ProductController {

    @Autowired
    ProductService productService;


    @Autowired
    S3StorageService s3StorageService;

    @PostMapping("/")
    public ResponseDTO<Void> create(@ModelAttribute @Valid ProductDTO productDTO) throws IllegalStateException, IOException, S3Exception {

        List<String> images = new ArrayList<>();

        if (productDTO.getFiles() != null && !productDTO.getFiles().isEmpty()) {
            for (MultipartFile file : productDTO.getFiles()) {
                String filename = file.getOriginalFilename();
                // lay dinh dang file
                String extension = filename.substring(filename.lastIndexOf("."));
                // tao ten moi
                String newFilename = UUID.randomUUID().toString() + extension;

                // Upload file to S3 and get the URL
                String fileUrl = s3StorageService.uploadFile(newFilename, file);
                images.add(fileUrl);

                // Set the first fileUrl as the cover
                if (productDTO.getCover() == null) {
                    productDTO.setCover(fileUrl);
                }
            }

            productDTO.setImages(images); // save to db
        }

        productService.create(productDTO);
        return ResponseDTO.<Void>builder()
                .status(200)
                .msg("ok")
                .build();
    }






    @GetMapping("/{id}")
    public ResponseDTO<ProductDTO> getProduct(@PathVariable long id) {
        return ResponseDTO.<ProductDTO>builder()
                .status(200)
                .data(productService.getById(id))
                .build();
    }

    @GetMapping("/name")
    public ResponseDTO<ProductDTO> getProductByName(@RequestParam("name") String name) {

        String productName = name.replace("-", " ");

        return ResponseDTO.<ProductDTO>builder()
                .status(200)
                .data(productService.getByName(productName))
                .build();
    }

    @GetMapping("/")
    public ResponseDTO<List<ProductDTO>> getAllProduct() {
        return ResponseDTO.<List<ProductDTO>>builder()
                .status(200)
                .data(productService.getAllProduct())
                .build();
    }

    @GetMapping("/owner/{id}")
    public ResponseDTO<List<ProductDTO>> getAllProductByOwner(@PathVariable long id) {
        return ResponseDTO.<List<ProductDTO>>builder()
                .status(200)
                .data(productService.getAllProductByOwnerId(id))
                .build();
    }


    @PutMapping("/{id}")
    public ResponseDTO<Void> update(@PathVariable long id, @ModelAttribute @Valid ProductDTO productDTO) throws IllegalStateException, IOException, S3Exception {

        productDTO.setId(id);

        List<String> images = new ArrayList<>();

        ProductDTO product = productService.getById(id);


        if (productDTO.getFiles() != null && !productDTO.getFiles().isEmpty()) {


            for (MultipartFile file : productDTO.getFiles()) {
                String filename = file.getOriginalFilename();
                // lay dinh dang file
                String extension = filename.substring(filename.lastIndexOf("."));
                // tao ten moi
                String newFilename = UUID.randomUUID().toString() + extension;

                // Upload file to S3 and get the URL
                String fileUrl = s3StorageService.uploadFile(newFilename, file);
                images.add(fileUrl);

                // Set the first fileUrl as the cover
                if (productDTO.getCover() == null) {
                    productDTO.setCover(fileUrl);
                }
            }
            productDTO.setImages(images); // save to db
        } else {
            productDTO.setCover(product.getCover());
            productDTO.setImages(product.getImages());
        }
        productService.update(productDTO);
        return ResponseDTO.<Void>builder()
                .status(200)
                .msg("ok")
                .build();
    }


    @DeleteMapping("/{id}")
    public ResponseDTO<Void> delete(@PathVariable long id) {
        productService.delete(id);
        return ResponseDTO.<Void>builder()
                .status(200)
                .msg("ok")
                .build();
    }

    @PostMapping("/search")
    public ResponseDTO<PageDTO<ProductDTO>> search(@RequestBody @Valid SearchDTO searchDTO) {
        return ResponseDTO.<PageDTO<ProductDTO>>builder()
                .status(200)
                .data(productService.search(searchDTO))
                .build();
    }

//    @GetMapping("/download/{filenamed}")
//    public void download(@PathVariable("filename") String filename, HttpServletResponse response) throws IOException {
//        File file = new File(UPLOAD_FOLDER + filename);
//        Files.copy(file.toPath(), response.getOutputStream());
//    }

    @GetMapping("/download/{filename}")
    public ResponseDTO<Resource> download(@PathVariable("filename") String filename) throws IOException {
        InputStream inputStream = s3StorageService.downloadFile(filename);
        InputStreamResource resource = new InputStreamResource(inputStream);
        return ResponseDTO.<Resource>builder()
                .status(200)
                .data(resource)
                .build();
    }
}
