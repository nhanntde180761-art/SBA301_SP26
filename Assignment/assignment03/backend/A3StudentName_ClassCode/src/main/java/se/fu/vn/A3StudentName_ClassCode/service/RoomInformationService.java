package se.fu.vn.A3StudentName_ClassCode.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import se.fu.vn.A3StudentName_ClassCode.dto.ManagerRoomDTO;
import se.fu.vn.A3StudentName_ClassCode.pojo.RoomInformation;
import se.fu.vn.A3StudentName_ClassCode.pojo.RoomType;
import se.fu.vn.A3StudentName_ClassCode.repository.RoomInformationRepository;
import se.fu.vn.A3StudentName_ClassCode.repository.RoomTypeRepository;

import java.util.List;


@Service
public class RoomInformationService {
    @Autowired
    private RoomInformationRepository roomInformationRepository;
    @Autowired
    private RoomTypeRepository roomTypeRepository;

    public List<ManagerRoomDTO> findAll() {
        List<RoomInformation> roomInformations = roomInformationRepository.findAll();
        return roomInformations.stream().map(roomInformation -> new ManagerRoomDTO(
                roomInformation.getId(),
                roomInformation.getRoomNumber(),
                roomInformation.getRoomTypeID().getId(),
                roomInformation.getRoomTypeID().getRoomTypeName(),
                roomInformation.getRoomTypeID().getTypeDescription(),
                roomInformation.getRoomDetailDescription(),
                roomInformation.getRoomMaxCapacity(),
                roomInformation.getRoomPricePerDay(),
                roomInformation.getRoomTypeID().getTypeNote(),
                roomInformation.getRoomStatus()
        )).toList();
    }

    public boolean updateRoomFromDTO(ManagerRoomDTO roomDTO) {
        RoomInformation roomInformation = roomInformationRepository.findById(roomDTO.getRoomId()).orElse(null);
        if (roomInformation != null) {
            roomInformation.setRoomNumber(roomDTO.getRoomNumber());
            roomInformation.setRoomDetailDescription(roomDTO.getRoomDescription());
            roomInformation.setRoomMaxCapacity(roomDTO.getRoomCapacity());
            roomInformation.setRoomPricePerDay(roomDTO.getRoomPrice());
            roomInformationRepository.save(roomInformation);
            return true;
        }
        return false;
    }

    public boolean deleteRoom(Integer id) {
        RoomInformation roomInformation = roomInformationRepository.findById(id).orElse(null);
        if (roomInformation != null){
            if (roomInformation.getBookingDetails().isEmpty()) {
                roomInformationRepository.delete(roomInformation);
                return true;
            } else if (!roomInformation.getBookingDetails().isEmpty() && roomInformation.getRoomStatus() == 1){
                roomInformation.setRoomStatus(3);
                roomInformationRepository.save(roomInformation);
                return true;
            } else if (!roomInformation.getBookingDetails().isEmpty() && roomInformation.getRoomStatus() == 3) {
                roomInformation.setRoomStatus(1);
                roomInformationRepository.save(roomInformation);
                return true;
            }
        }
        return false;
    }

    public boolean addRoomFromDTO(ManagerRoomDTO roomDTO) {
        RoomInformation roomInformation = new RoomInformation();
        roomInformation.setRoomNumber(roomDTO.getRoomNumber());
        roomInformation.setRoomDetailDescription(roomDTO.getRoomDescription());
        roomInformation.setRoomMaxCapacity(roomDTO.getRoomCapacity());
        roomInformation.setRoomPricePerDay(roomDTO.getRoomPrice());
        RoomType roomType = roomTypeRepository.findRoomTypeById(roomDTO.getRoomTypeId());
        if (roomType != null) {
            roomInformation.setRoomTypeID(roomType);
        } else {
            return false;
        }
        roomInformation.setRoomStatus(1);
        roomInformationRepository.save(roomInformation);
        return true;
    }
}
