package com.example.mutantorchidplatform.entity;
import com.example.mutantorchidplatform.entity.enums.InventoryType;
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

    private float totalRating;

    private double totalReview;

    @ManyToOne
    private User owner;

    @OneToOne(mappedBy = "product")
    private Auction auction;

    public void incrementReviewCount() {
        this.totalReview = this.reviews.size();  // Cập nhật totalReview dựa trên số lượng reviews
    }

    public void updateTotalRating() {
        double sum = 0;
        int totalReviews = 0; // Tổng số lượt đánh giá

        for (Rating rating : this.ratings) {
            sum += rating.getStarCount() * rating.getReviewCount();  // Nhân số sao với số lần đánh giá
            totalReviews += rating.getReviewCount(); // Tính tổng số lượt đánh giá
        }

        this.totalRating = totalReviews > 0 ? (float) sum / totalReviews : 0; // Tính trung bình
        this.totalReview = totalReviews; // Cập nhật tổng số lượt đánh giá
    }


}
