package fpt.edu.vn.PE_SBA301_SP25_BE_StudentCode.pojo;

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
@Table(name = "Country")
public class Country {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "CountryID", nullable = false)
    private Integer countryID;

    @Nationalized
    @Column(name = "CountryName", length = 15)
    private String countryName;

    @OneToMany(mappedBy = "countryID")
    @JsonIgnore
    private Set<Car> cars = new LinkedHashSet<>();


}