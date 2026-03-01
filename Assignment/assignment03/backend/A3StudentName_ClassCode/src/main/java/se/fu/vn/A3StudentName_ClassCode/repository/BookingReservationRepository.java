package se.fu.vn.A3StudentName_ClassCode.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import se.fu.vn.A3StudentName_ClassCode.pojo.BookingReservation;

import java.util.List;

public interface BookingReservationRepository extends JpaRepository<BookingReservation, Integer> {
    @Query("SELECT b FROM BookingReservation b LEFT JOIN FETCH b.bookingDetails d LEFT JOIN FETCH d.roomID WHERE b.customerID.id = :customerId")
    List<BookingReservation> findByCustomerID_Id(@Param("customerId") Integer customerId);
}
