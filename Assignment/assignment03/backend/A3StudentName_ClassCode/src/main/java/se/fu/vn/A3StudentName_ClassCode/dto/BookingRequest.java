package se.fu.vn.A3StudentName_ClassCode.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
public class BookingRequest {
    private LocalDate startDate;
    private LocalDate endDate;
    private Integer roomId;
    private BigDecimal totalAmount;
    private Integer customerId;
}
