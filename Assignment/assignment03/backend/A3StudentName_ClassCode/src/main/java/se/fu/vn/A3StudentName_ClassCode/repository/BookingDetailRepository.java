package se.fu.vn.A3StudentName_ClassCode.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import se.fu.vn.A3StudentName_ClassCode.pojo.BookingDetail;

import java.time.LocalDate;

public interface BookingDetailRepository extends JpaRepository<BookingDetail, Integer> {
    @Query("SELECT COUNT(bd) FROM BookingDetail bd WHERE bd.roomID.id = :roomId " +
            "AND (:startDate < bd.endDate AND :endDate > bd.startDate)")
    long countOverlappingBookings(@Param("roomId") Integer roomId,
                                  @Param("startDate") LocalDate startDate,
                                  @Param("endDate") LocalDate endDate);
}
