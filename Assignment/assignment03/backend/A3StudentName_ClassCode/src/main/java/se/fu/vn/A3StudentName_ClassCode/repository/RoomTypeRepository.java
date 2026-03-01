package se.fu.vn.A3StudentName_ClassCode.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import se.fu.vn.A3StudentName_ClassCode.pojo.RoomType;

public interface RoomTypeRepository extends JpaRepository<RoomType, Integer> {
    RoomType findRoomTypeById(Integer id);
}
