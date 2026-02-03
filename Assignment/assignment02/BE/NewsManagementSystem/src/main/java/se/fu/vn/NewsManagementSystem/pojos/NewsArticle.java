package se.fu.vn.NewsManagementSystem.pojos;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.Nationalized;

import java.time.Instant;
import java.util.LinkedHashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "NewsArticle")
public class NewsArticle {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "NewsArticleID", nullable = false)
    private Integer id;

    @Nationalized
    @Column(name = "NewsTitle", length = 250)
    private String newsTitle;

    @Nationalized
    @Column(name = "Headline", length = 250)
    private String headline;

    @ColumnDefault("getdate()")
    @Column(name = "CreatedDate")
    private Instant createdDate;

    @Nationalized
    @Lob
    @Column(name = "NewsContent")
    private String newsContent;

    @Nationalized
    @Column(name = "NewsSource", length = 150)
    private String newsSource;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CategoryID", referencedColumnName = "CategoryID") // Thêm referenced
    private Category category;

    @ColumnDefault("1")
    @Column(name = "NewsStatus")
    private Boolean newsStatus;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CreatedByID", referencedColumnName = "AccountID")
    private SystemAccount createdBy; // Đổi tên thành createdBy

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "UpdatedByID", referencedColumnName = "AccountID")
    private SystemAccount updatedBy;

    @Column(name = "ModifiedDate")
    private Instant modifiedDate;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "NewsTag",
            joinColumns = @JoinColumn(name = "NewsArticleID"),
            inverseJoinColumns = @JoinColumn(name = "TagID")
    )
    private Set<Tag> tags = new LinkedHashSet<>();



}