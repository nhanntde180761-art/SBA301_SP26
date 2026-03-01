package se.fu.vn.A3StudentName_ClassCode.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class BookingManagerDTO {
    private Integer bookingId;
    private String roomNumber;
    private LocalDate bookingDate;
    private String customerName;
    private LocalDate startDate;
    private LocalDate endDate;
    private Integer status;

    public BookingManagerDTO(Integer bookingId, String roomNumber, LocalDate bookingDate, String customerName, LocalDate startDate, LocalDate endDate, Integer status) {
        this.bookingId = bookingId;
        this.roomNumber = roomNumber;
        this.bookingDate = bookingDate;
        this.customerName = customerName;
        this.startDate = startDate;
        this.endDate = endDate;
        this.status = status;
    }
}
