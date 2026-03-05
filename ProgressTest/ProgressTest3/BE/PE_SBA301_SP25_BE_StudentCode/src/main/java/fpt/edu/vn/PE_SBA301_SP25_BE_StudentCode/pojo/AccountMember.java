package fpt.edu.vn.PE_SBA301_SP25_BE_StudentCode.pojo;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Nationalized;

@Getter
@Setter
@Entity
@Table(name = "AccountMember")
public class AccountMember {
    @Id
    @Nationalized
    @Column(name = "MemberID", nullable = false, length = 20)
    private String memberID;

    @Nationalized
    @Column(name = "MemberPassword", length = 80)
    private String memberPassword;

    @Nationalized
    @Column(name = "EmailAddress", length = 100)
    private String emailAddress;

    @Column(name = "MemberRole")
    private Integer memberRole;


}