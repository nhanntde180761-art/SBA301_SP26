package fu.se.chapter15api.pojos;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
@Getter
@Setter
@Entity
@Table(name = "orchid")
public class Orchid implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "orchid_id")
    private int orchidID;

    @Column(name = "orchid_name")
    private String orchidName;

    @Column(name = "is_natural", columnDefinition = "bit default 0")
    private boolean isNatural;

    @Column(name = "orchid_description")
    private String orchidDescription;

    @Column(name = "orchid_category")
    private String orchidCategory;

    @Column(name = "is_attractive", columnDefinition = "bit default 0")
    private boolean isAttractive;

    @Column(name = "orchid_url")
    private String orchidURL;

    // Đừng quên thêm Getter, Setter và Constructor nhé!
}
