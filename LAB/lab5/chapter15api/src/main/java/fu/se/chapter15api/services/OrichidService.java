package fu.se.chapter15api.services;

import fu.se.chapter15api.exceptions.ResourceNotFoundException; // Import class bạn vừa tạo
import fu.se.chapter15api.pojos.Orchid;
import fu.se.chapter15api.repositories.OrchidRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class OrichidService implements IOrichidService {
    @Autowired
    private OrchidRepository orchidRepository;

    public List<Orchid> getAllOrchids() {
        return orchidRepository.findAll();
    }

    public Orchid insertOrchid(Orchid orchid) {
        return orchidRepository.save(orchid);
    }

    public Orchid updateOrchid(int orchidID, Orchid orchid) {
        // Sử dụng orElseThrow để kích hoạt Global Exception Handling
        Orchid existingOrchid = orchidRepository.findById(orchidID).orElse(null);

        // Cập nhật các thông tin
        existingOrchid.setOrchidName(orchid.getOrchidName());
        existingOrchid.setOrchidDescription(orchid.getOrchidDescription());
        existingOrchid.setNatural(orchid.isNatural());
        existingOrchid.setAttractive(orchid.isAttractive());
        existingOrchid.setOrchidURL(orchid.getOrchidURL());
        existingOrchid.setCategory(orchid.getCategory()); // Cập nhật cả Category (Mapping)

        return orchidRepository.save(existingOrchid);
    }

    public void deleteOrchid(int orchidID) {
        // Kiểm tra trước khi xóa để báo lỗi chính xác
        if (!orchidRepository.existsById(orchidID)) {
            throw new ResourceNotFoundException("Cannot delete! Orchid ID " + orchidID + " does not exist.");
        }
        orchidRepository.deleteById(orchidID);
    }

    // Đổi kiểu trả về từ Optional sang Orchid trực tiếp
    public Optional<Orchid> getOrchidID(int orchidID) {
        return Optional.of(orchidRepository.findById(orchidID)
                .orElseThrow(() -> new ResourceNotFoundException("Orchid not found with ID: " + orchidID)));
    }
}