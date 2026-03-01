package se.fu.vn.A3StudentName_ClassCode.pojo;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.LinkedHashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "BookingReservation")
public class BookingReservation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "BookingReservationID", nullable = false)
    private Integer id;

    @Column(name = "BookingDate")
    private LocalDate bookingDate;

    @Column(name = "TotalPrice", precision = 18, scale = 2)
    private BigDecimal totalPrice;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CustomerID")
    private Customer customerID;

    @Column(name = "BookingStatus")
    private Integer bookingStatus;

    @OneToMany(mappedBy = "bookingReservationID")
    private Set<BookingDetail> bookingDetails = new LinkedHashSet<>();


}