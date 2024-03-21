package com.example.mutantorchidplatform.entity.enums;

import lombok.Getter;

@Getter
public enum RatingName {
    
        ONE_STAR("1 Star"),
        TWO_STAR("2 Star"),
        THREE_STAR("3 Star"),
        FOUR_STAR("4 Star"),
        FIVE_STAR("5 Star");

    private final String value;
    RatingName(String value) {
        this.value = value;
    }

}
