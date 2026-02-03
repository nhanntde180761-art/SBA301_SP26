package se.fu.vn.NewsManagementSystem.pojos;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.Nationalized;
import se.fu.vn.NewsManagementSystem.pojos.NewsArticle;

import java.util.LinkedHashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "Category")
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "CategoryID", nullable = false)
    private Integer id;

    @Nationalized
    @Column(name = "CategoryName", length = 100)
    private String categoryName;

    @Nationalized
    @Column(name = "CategoryDescription", length = 250)
    private String categoryDescription;

    @ManyToOne(fetch = FetchType.EAGER) // EAGER để lấy luôn tên cha
    @JoinColumn(name = "ParentCategoryID", referencedColumnName = "CategoryID")
    // QUAN TRỌNG: Giữ lại id và name của cha, nhưng chặn không cho cha quét ngược lại danh sách con
    @JsonIgnoreProperties({"subCategories", "newsArticles", "parentCategory"})
    private Category parentCategory;

    @ColumnDefault("1")
    @Column(name = "IsActive")
    private Boolean isActive;

    @OneToMany(mappedBy = "parentCategory")
    @JsonIgnore // Cấm tuyệt đối việc quét xuống danh sách con để ngắt vòng lặp
    private Set<Category> subCategories = new LinkedHashSet<>();

    @OneToMany(mappedBy = "category")
    @JsonIgnore
    private Set<NewsArticle> newsArticles = new LinkedHashSet<>();
}