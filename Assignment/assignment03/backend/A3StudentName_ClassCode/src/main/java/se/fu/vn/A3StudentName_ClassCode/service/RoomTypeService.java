package se.fu.vn.A3StudentName_ClassCode.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import se.fu.vn.A3StudentName_ClassCode.pojo.RoomType;
import se.fu.vn.A3StudentName_ClassCode.repository.RoomTypeRepository;

import java.util.List;

@Service
public class RoomTypeService {
    @Autowired
        private RoomTypeRepository roomTypeRepository;

    public List<RoomType> getAllRoomTypes() {
        return roomTypeRepository.findAll();
    }
}
