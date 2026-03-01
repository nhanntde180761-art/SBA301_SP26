package se.fu.vn.A3StudentName_ClassCode.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import se.fu.vn.A3StudentName_ClassCode.dto.ManagerRoomDTO;
import se.fu.vn.A3StudentName_ClassCode.service.RoomInformationService;
import se.fu.vn.A3StudentName_ClassCode.service.RoomTypeService;

import java.util.List;

@RestController
@RequestMapping("/rooms")
@CrossOrigin(origins = "http://localhost:5173")
public class RoomInformationController {
    @Autowired
    private RoomInformationService roomInformationService;

    @GetMapping
    public ResponseEntity<List<ManagerRoomDTO>> getAllRooms() {
        List<ManagerRoomDTO> rooms = roomInformationService.findAll();
        return ResponseEntity.ok(rooms);
    }

    @PostMapping("/update")
    public ResponseEntity<?> updateRoom(@RequestBody ManagerRoomDTO roomDTO) {
        try {
            boolean isUpdated = roomInformationService.updateRoomFromDTO(roomDTO);
            if (isUpdated) {
                return ResponseEntity.ok("Cập nhật phòng thành công!");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy phòng để cập nhật");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Lỗi hệ thống: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRoom(@PathVariable Integer id) {
        try {
            boolean isDeleted = roomInformationService.deleteRoom(id);
            if (isDeleted) {
                return ResponseEntity.ok("Xóa phòng thành công!");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy phòng với ID: " + id);
            }
        } catch (Exception e) {
            // Lỗi này thường xảy ra nếu phòng đang có người đặt (Ràng buộc khóa ngoại trong DB)
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Không thể xóa phòng này vì đang có dữ liệu liên quan (lịch sử đặt phòng).");
        }
    }

    @PostMapping("/add")
    public ResponseEntity<?> addRoom(@RequestBody ManagerRoomDTO roomDTO) {
        try {
            boolean isAdded = roomInformationService.addRoomFromDTO(roomDTO);
            if (isAdded) {
                return ResponseEntity.ok("Thêm phòng thành công!");
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Không thể thêm phòng. Vui lòng kiểm tra lại dữ liệu.");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Lỗi hệ thống: " + e.getMessage());
        }
    }
}
