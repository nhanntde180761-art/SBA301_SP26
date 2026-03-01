package se.fu.vn.A3StudentName_ClassCode.pojo;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Nationalized;

import java.time.LocalDate;
import java.util.LinkedHashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "Customer")
public class Customer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "CustomerID", nullable = false)
    private Integer id;

    @Nationalized
    @Column(name = "CustomerFullName", length = 150)
    private String customerFullName;

    @Nationalized
    @Column(name = "Telephone", length = 20)
    private String telephone;

    @Nationalized
    @Column(name = "EmailAddress", length = 100)
    private String emailAddress;

    @Column(name = "CustomerBirthday")
    private LocalDate customerBirthday;

    @Column(name = "CustomerStatus")
    private Integer customerStatus;

    @Nationalized
    @Column(name = "CustomerRole", length = 20)
    private String customerRole;

    @Nationalized
    @Column(name = "Password", length = 100)
    private String password;

    @OneToMany(mappedBy = "customerID")
    @JsonIgnore
    private Set<BookingReservation> bookingReservations = new LinkedHashSet<>();


}