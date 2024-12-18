package com.example.mutantorchidplatform.entity;
import com.example.mutantorchidplatform.entity.enums.InventoryType;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@EqualsAndHashCode(callSuper = true)
@Entity
@Getter
@Setter
public class Product extends TimeAuditable{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long  id;

    private int available; // số lượng

    private String category;

    private String code;

    @ElementCollection
    @CollectionTable(name = "product_colors", joinColumns = @JoinColumn(name = "product_id"))
    @Column(name = "color")
    private List<String> colors;


    private String cover;

    @Column(length = 5000)
    private String description;

    private String gender;

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
    private List<Rating> ratings;

    @OneToMany(mappedBy = "product")
    private List<Review> reviews;

    @ElementCollection
    @CollectionTable(name = "product_sizes", joinColumns = @JoinColumn(name = "product_id"))
    @Column(name = "size")
    private List<String> sizes;

    private String sku;

    private int sold;

    private String status;

    @ElementCollection
    @CollectionTable(name = "product_tags", joinColumns = @JoinColumn(name = "product_id"))
    @Column(name = "tag")
    private List<String> tags;

    private double totalRating;

    private double totalReview;

    @ManyToOne
    private User owner;

    @OneToOne(mappedBy = "product")
    private Auction auction;



}
