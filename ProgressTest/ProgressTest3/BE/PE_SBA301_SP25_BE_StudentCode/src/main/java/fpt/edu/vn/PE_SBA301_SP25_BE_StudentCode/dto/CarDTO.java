package fpt.edu.vn.PE_SBA301_SP25_BE_StudentCode.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
@Getter
@Setter
public class CarDTO {
    private Integer carID;
    private String carName;
    private Integer countryID;
    private String countryName;
    private Short unitsInStock;
    private Integer unitPrice;
    private Instant createdAt;
    private Instant updatedAt;

    public CarDTO() {

    }
}
