package se.fu.vn.A3StudentName_ClassCode.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class ManagerRoomDTO {
    private Integer roomId;
    private String roomNumber;
    private Integer roomTypeId;
    private String roomType;
    private String typeDescription;
    private String roomDescription;
    private Integer roomCapacity;
    private BigDecimal roomPrice;
    private String roomNote;
    private Integer status;

    public ManagerRoomDTO(Integer roomId, String roomNumber, Integer roomTypeId, String roomType, String typeDescription, String roomDescription, Integer roomCapacity, BigDecimal roomPrice, String roomNote, Integer status) {
        this.roomId = roomId;
        this.roomNumber = roomNumber;
        this.roomTypeId = roomTypeId;
        this.roomType = roomType;
        this.typeDescription = typeDescription;
        this.roomDescription = roomDescription;
        this.roomCapacity = roomCapacity;
        this.roomPrice = roomPrice;
        this.roomNote = roomNote;
        this.status = status;
    }
}
