package se.fu.vn.A3StudentName_ClassCode.pojo;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Nationalized;

import java.math.BigDecimal;
import java.util.LinkedHashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "RoomInformation")
public class RoomInformation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "RoomID", nullable = false)
    private Integer id;

    @Nationalized
    @Column(name = "RoomNumber", length = 50)
    private String roomNumber;

    @Nationalized
    @Lob
    @Column(name = "RoomDetailDescription")
    private String roomDetailDescription;

    @Column(name = "RoomMaxCapacity")
    private Integer roomMaxCapacity;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "RoomTypeID")
    private RoomType roomTypeID;

    @Column(name = "RoomStatus")
    private Integer roomStatus;

    @Column(name = "RoomPricePerDay", precision = 18, scale = 2)
    private BigDecimal roomPricePerDay;

    @OneToMany(mappedBy = "roomID")
    private Set<BookingDetail> bookingDetails = new LinkedHashSet<>();


}