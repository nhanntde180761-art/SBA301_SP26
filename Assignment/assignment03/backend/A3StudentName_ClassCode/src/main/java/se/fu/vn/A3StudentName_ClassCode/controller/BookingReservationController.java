package se.fu.vn.A3StudentName_ClassCode.controller;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import se.fu.vn.A3StudentName_ClassCode.dto.BookingManagerDTO;
import se.fu.vn.A3StudentName_ClassCode.dto.BookingRequest;
import se.fu.vn.A3StudentName_ClassCode.pojo.BookingReservation;
import se.fu.vn.A3StudentName_ClassCode.service.BookingReservationService;

import java.util.List;

@RestController
@RequestMapping("/bookings")
@CrossOrigin (origins = "http://localhost:5173")
public class BookingReservationController {
    @Autowired
    private BookingReservationService bookingReservationService;

    @GetMapping
    public ResponseEntity<List<BookingManagerDTO>> getAllBookingReservations(){
        List<BookingManagerDTO> bookingReservations = bookingReservationService.getAllBookingReservations();
        return ResponseEntity.ok(bookingReservations);
    }

    @PostMapping("/update-status/{id}")
    public ResponseEntity<?> updateBookingStatus(
            @PathVariable Integer id,
            @RequestParam Integer status) {

        // Logic: 1 -> Chờ, 2 -> Chấp nhận, 3 -> Từ chối
        boolean isUpdated = bookingReservationService.updateStatus(id, status);

        if (isUpdated) {
            // Trả về nội dung đơn giản để Modal React chuyển sang trạng thái "Thành công"
            return ResponseEntity.ok().body("Cập nhật trạng thái thành công");
        } else {
            return ResponseEntity.badRequest().body("Không tìm thấy đơn đặt phòng hoặc lỗi hệ thống");
        }
    }

    @PostMapping("/create")
    public ResponseEntity<?> createBooking(@RequestBody BookingRequest request) {
        try {
            // Log để kiểm tra dữ liệu nhận được
            System.out.println("Đang đặt phòng ID: " + request.getRoomId());

            BookingReservation newBooking = bookingReservationService.saveBooking(request);
            return ResponseEntity.ok(newBooking);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Lỗi đặt phòng: " + e.getMessage());
        }
    }

}
