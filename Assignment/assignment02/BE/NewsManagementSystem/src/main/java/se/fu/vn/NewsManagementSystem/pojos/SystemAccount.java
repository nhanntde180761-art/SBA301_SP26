package se.fu.vn.NewsManagementSystem.pojos;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Nationalized;

import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "SystemAccount")
public class SystemAccount {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "AccountID", nullable = false)
    private Integer id;

    @Nationalized
    @Column(name = "AccountName", length = 100)
    private String accountName;

    @Nationalized
    @Column(name = "AccountEmail", length = 100)
    private String accountEmail;

    @Column(name = "AccountRole")
    private Integer accountRole;

    @Nationalized
    @Column(name = "AccountPassword", length = 100)
    private String accountPassword;
// Trong file SystemAccount.java

    @com.fasterxml.jackson.annotation.JsonIgnore
    @OneToMany(mappedBy = "createdBy")
    private List<NewsArticle> createdNews;

    @com.fasterxml.jackson.annotation.JsonIgnore
    @OneToMany(mappedBy = "updatedBy")
    private List<NewsArticle> updatedNews;

}