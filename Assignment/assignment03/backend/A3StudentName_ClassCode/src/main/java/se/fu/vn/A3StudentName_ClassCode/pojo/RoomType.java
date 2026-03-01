package se.fu.vn.A3StudentName_ClassCode.pojo;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Nationalized;

import java.util.LinkedHashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "RoomType")
public class RoomType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "RoomTypeID", nullable = false)
    private Integer id;

    @Nationalized
    @Column(name = "RoomTypeName", length = 100)
    private String roomTypeName;

    @Nationalized
    @Column(name = "TypeDescription")
    private String typeDescription;

    @Nationalized
    @Column(name = "TypeNote")
    private String typeNote;

    @OneToMany(mappedBy = "roomTypeID")
    @JsonIgnore
    private Set<RoomInformation> roomInformations = new LinkedHashSet<>();


}