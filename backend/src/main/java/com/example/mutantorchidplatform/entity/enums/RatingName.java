package com.example.mutantorchidplatform.entity.enums;

public enum RatingName {
    ONE_STAR("1 Star"),
    TWO_STAR("2 Star"),
    THREE_STAR("3 Star"),
    FOUR_STAR("4 Star"),
    FIVE_STAR("5 Star");

    private String value;

    RatingName(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }
}
