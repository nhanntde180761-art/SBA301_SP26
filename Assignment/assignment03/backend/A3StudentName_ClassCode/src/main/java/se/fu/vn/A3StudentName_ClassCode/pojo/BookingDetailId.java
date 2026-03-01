package se.fu.vn.A3StudentName_ClassCode.pojo;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

@Getter
@Setter
@EqualsAndHashCode
@Embeddable
public class BookingDetailId implements Serializable {
    private static final long serialVersionUID = 7541949745076584898L;
    @Column(name = "BookingReservationID", nullable = false)
    private Integer bookingReservationID;

    @Column(name = "RoomID", nullable = false)
    private Integer roomID;


}