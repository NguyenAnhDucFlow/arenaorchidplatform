package com.example.mutantorchidplatform.entity;

import com.example.mutantorchidplatform.entity.enums.InventoryType;
import com.example.mutantorchidplatform.entity.enums.ProductStatus;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.List;

@EqualsAndHashCode(callSuper = true)
@Entity
@Data
public class Product extends TimeAuditable{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long  id;

    private int available; // số lượng

    @ManyToOne
    private Category category;

    private String cover;

    @Column(length = 5000)
    private String description;


    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "product_images", joinColumns = @JoinColumn(name = "product_id"))
    @Column(name = "image_url")
    private List<String> images;

    @Enumerated(EnumType.STRING)
    private InventoryType inventoryType;

    private String name;

    private String price;

    private String priceSale;

    @OneToMany(mappedBy = "product")
    private List<Feedback> feedbacks;

    private int sold;

    private String status;

    private float totalRating;

    private double totalReview;

    @ManyToOne
    private User owner;


}
