package se.fu.vn.A3StudentName_ClassCode.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import se.fu.vn.A3StudentName_ClassCode.pojo.RoomType;
import se.fu.vn.A3StudentName_ClassCode.service.RoomTypeService;

import java.util.List;

@RestController
@RequestMapping("/roomtypes")
@CrossOrigin(origins = "http://localhost:5173")
public class RoomTypeController {
    @Autowired
    private RoomTypeService roomTypeService;

    @GetMapping
    public ResponseEntity<List<RoomType>> getAllRoomTypes(){
        List<RoomType> roomTypes = roomTypeService.getAllRoomTypes();
        return ResponseEntity.ok(roomTypes);
    }
}
