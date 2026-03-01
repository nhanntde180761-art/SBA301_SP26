package se.fu.vn.A3StudentName_ClassCode.pojo;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "BookingDetail")
public class BookingDetail {
    @EmbeddedId
    private BookingDetailId id;

    @MapsId("bookingReservationID")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "BookingReservationID", nullable = false)
    private BookingReservation bookingReservationID;

    @MapsId("roomID")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "RoomID", nullable = false)
    private RoomInformation roomID;

    @Column(name = "StartDate")
    private LocalDate startDate;

    @Column(name = "EndDate")
    private LocalDate endDate;

    @Column(name = "ActualPrice", precision = 18, scale = 2)
    private BigDecimal actualPrice;


}