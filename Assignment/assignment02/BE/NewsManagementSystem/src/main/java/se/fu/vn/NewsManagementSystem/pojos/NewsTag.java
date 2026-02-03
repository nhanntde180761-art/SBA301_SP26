package se.fu.vn.NewsManagementSystem.pojos;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Getter
@Setter
@Entity
@Table(name = "NewsTag")
public class NewsTag {
    @EmbeddedId
    private NewsTagId id;

    @MapsId("newsArticleID")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "NewsArticleID", nullable = false)
    private NewsArticle newsArticleID;

    @MapsId("tagID")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "TagID", nullable = false)
    private Tag tagID;


}