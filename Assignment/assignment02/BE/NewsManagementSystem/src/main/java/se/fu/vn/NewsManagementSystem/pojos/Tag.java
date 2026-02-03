package se.fu.vn.NewsManagementSystem.pojos;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Nationalized;

import java.util.LinkedHashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "Tag")
public class Tag {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "TagID", nullable = false)
    private Integer id;

    @Nationalized
    @Column(name = "TagName", length = 50)
    private String tagName;

    @Nationalized
    @Column(name = "Note", length = 250)
    private String note;

    @ManyToMany(mappedBy = "tags")
    @com.fasterxml.jackson.annotation.JsonIgnore
    private Set<NewsArticle> newsArticles = new LinkedHashSet<>();


}