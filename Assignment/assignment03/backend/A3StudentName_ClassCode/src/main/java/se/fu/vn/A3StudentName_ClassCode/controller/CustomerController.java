package se.fu.vn.A3StudentName_ClassCode.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import se.fu.vn.A3StudentName_ClassCode.dto.BookingManagerDTO;
import se.fu.vn.A3StudentName_ClassCode.pojo.Customer;
import se.fu.vn.A3StudentName_ClassCode.service.BookingReservationService;
import se.fu.vn.A3StudentName_ClassCode.service.CustomerService;

import java.util.List;

@RestController
@RequestMapping("/customers")
@CrossOrigin(origins = "http://localhost:5173")
public class CustomerController {
    @Autowired
    private CustomerService customerService;
    @Autowired
    private BookingReservationService bookingReservationService;

    @GetMapping
    public ResponseEntity<List<Customer>> getAllCustomers(){
        List<Customer> customers = customerService.getAllCustomers();
        return ResponseEntity.ok(customers);
    }

    @PostMapping("/setStatus/{id}")
    public ResponseEntity<?> setStatus(
            @PathVariable int id,
            @RequestParam Integer status) {

        // Gọi xuống Service để update Database
        boolean isUpdated = customerService.setStatus(id, status);

        if (isUpdated) {
            return ResponseEntity.ok("Cập nhật trạng thái thành công!");
        } else {
            return ResponseEntity.badRequest().body("Không tìm thấy khách hàng hoặc cập nhật thất bại!");
        }
    }

    @GetMapping("/{customerId}")
    public ResponseEntity<?> getBookingHistory(@PathVariable Integer customerId) {
        try {
            // Bạn cần viết thêm hàm này trong Service
            List<BookingManagerDTO> history = bookingReservationService.getHistoryByCustomerId(customerId);
            return ResponseEntity.ok(history);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi: " + e.getMessage());
        }
    }

    @PutMapping("/profile/update")
    public ResponseEntity<?> updateProfile(@RequestBody Customer updatedCustomer) {
        customerService.save(updatedCustomer);
        return ResponseEntity.ok("Success");
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Customer customer) {
        try {
            Customer savedCustomer = customerService.createCustomer(customer);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedCustomer);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Lỗi đăng ký: " + e.getMessage());
        }
    }
}
