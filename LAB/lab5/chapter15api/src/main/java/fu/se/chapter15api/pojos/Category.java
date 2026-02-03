package fu.se.chapter15api.pojos;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Entity
@Data
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int categoryID;
    private String categoryName;

    @OneToMany(mappedBy = "category")
    @JsonIgnore // Tránh vòng lặp vô hạn khi trả về JSON
    private List<Orchid> orchids;
}
