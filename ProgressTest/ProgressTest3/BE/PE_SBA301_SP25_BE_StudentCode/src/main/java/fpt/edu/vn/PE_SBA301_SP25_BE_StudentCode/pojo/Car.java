package fpt.edu.vn.PE_SBA301_SP25_BE_StudentCode.pojo;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Nationalized;

import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "Cars")
public class Car {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "CarID", nullable = false)
    private Integer carID;

    @Nationalized
    @Column(name = "CarName", length = 40)
    private String carName;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CountryID", referencedColumnName = "CountryID")
    private Country countryID;

    @Column(name = "UnitsInStock")
    private Short unitsInStock;

    @Column(name = "UnitPrice")
    private Integer unitPrice;

    @Column(name = "CreatedAt")
    private Instant createdAt;

    @Column(name = "UpdatedAt")
    private Instant updatedAt;


}