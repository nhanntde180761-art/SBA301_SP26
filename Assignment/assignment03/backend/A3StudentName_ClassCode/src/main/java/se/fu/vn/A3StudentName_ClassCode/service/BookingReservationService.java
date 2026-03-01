package se.fu.vn.A3StudentName_ClassCode.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import se.fu.vn.A3StudentName_ClassCode.dto.BookingManagerDTO;
import se.fu.vn.A3StudentName_ClassCode.dto.BookingRequest;
import se.fu.vn.A3StudentName_ClassCode.pojo.*;
import se.fu.vn.A3StudentName_ClassCode.repository.BookingDetailRepository;
import se.fu.vn.A3StudentName_ClassCode.repository.BookingReservationRepository;
import se.fu.vn.A3StudentName_ClassCode.repository.CustomerRepository;
import se.fu.vn.A3StudentName_ClassCode.repository.RoomInformationRepository;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookingReservationService {
    @Autowired
    private BookingReservationRepository bookingReservationRepository;
    @Autowired
    private CustomerRepository customerRepository;
    @Autowired
    private RoomInformationRepository roomInformationRepository;
    @Autowired
    private BookingDetailRepository bookingDetailRepository;

    public List<BookingManagerDTO> getAllBookingReservations(){
        List<BookingReservation> bookingReservations = bookingReservationRepository.findAll();
        return bookingReservations.stream().map(booking -> new BookingManagerDTO(
                booking.getId(),
                booking.getBookingDetails().stream().toList().get(0).getRoomID().getRoomNumber(),
                booking.getBookingDate(),
                booking.getCustomerID().getCustomerFullName(),
                booking.getBookingDetails().stream().toList().get(0).getStartDate(),
                booking.getBookingDetails().stream().toList().get(0).getEndDate(),
                booking.getBookingStatus()

        )).toList();
    }

    public boolean updateStatus(Integer id, Integer status) {
        BookingReservation bookingReservation = bookingReservationRepository.findById(id).orElse(null);
        if (bookingReservation != null) {
            bookingReservation.setBookingStatus(status);
            bookingReservationRepository.save(bookingReservation);
            return true;
        }
        return false;
    }

    public BookingReservation saveBooking(BookingRequest request) {
        // 1. Kiểm tra ngày tháng
        LocalDate start = request.getStartDate();
        LocalDate end = request.getEndDate();

        // 2. Kiểm tra trùng lịch
        long overlapCount = bookingDetailRepository.countOverlappingBookings(
                request.getRoomId(), start, end);
        if (overlapCount > 0) {
            throw new RuntimeException("Phòng đã được đặt trong khoảng thời gian này!");
        }

        // 3. Lưu BookingReservation (Bảng cha)
        BookingReservation bookingReservation = new BookingReservation();
        bookingReservation.setBookingDate(LocalDate.now());
        bookingReservation.setTotalPrice(request.getTotalAmount());

        Customer customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy khách hàng"));
        bookingReservation.setCustomerID(customer);
        bookingReservation.setBookingStatus(1);

        BookingReservation savedReservation = bookingReservationRepository.save(bookingReservation);

        // 4. LẤY THÔNG TIN PHÒNG
        RoomInformation room = roomInformationRepository.findById(request.getRoomId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy phòng"));

        // 5. KHỞI TẠO ĐỐI TƯỢNG ID PHỨC HỢP (QUAN TRỌNG NHẤT)
        BookingDetailId detailId = new BookingDetailId();
        detailId.setBookingReservationID(savedReservation.getId()); // Gán ID kiểu Integer
        detailId.setRoomID(room.getId()); // Gán ID kiểu Integer

        // 6. KHỞI TẠO VÀ LƯU BOOKING DETAIL
        BookingDetail bookingDetail = new BookingDetail();
        bookingDetail.setId(detailId); // Gán khóa chính phức hợp vào trước

        // Gán các Object Entity để Hibernate mapping qua @MapsId
        bookingDetail.setBookingReservationID(savedReservation);
        bookingDetail.setRoomID(room);

        bookingDetail.setStartDate(start);
        bookingDetail.setEndDate(end);
        bookingDetail.setActualPrice(room.getRoomPricePerDay());

        bookingDetailRepository.save(bookingDetail);

        return savedReservation;
    }

    @Transactional(readOnly = true) // Thêm dòng này để tránh lỗi Lazy Loading
    public List<BookingManagerDTO> getHistoryByCustomerId(Integer customerId) {
        List<BookingReservation> bookings = bookingReservationRepository.findByCustomerID_Id(customerId);

        if (bookings == null) return new ArrayList<>();

        return bookings.stream().map(booking -> {
            // Lấy detail đầu tiên
            BookingDetail detail = (booking.getBookingDetails() != null && !booking.getBookingDetails().isEmpty())
                    ? booking.getBookingDetails().iterator().next()
                    : null;

            return new BookingManagerDTO(
                    booking.getId(),
                    (detail != null && detail.getRoomID() != null) ? detail.getRoomID().getRoomNumber() : "N/A",
                    booking.getBookingDate(),
                    (booking.getCustomerID() != null) ? booking.getCustomerID().getCustomerFullName() : "N/A",
                    (detail != null) ? detail.getStartDate() : null,
                    (detail != null) ? detail.getEndDate() : null,
                    booking.getBookingStatus()
            );
        }).collect(Collectors.toList());
    }
}
