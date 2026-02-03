package se.fu.vn.NewsManagementSystem.pojos;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

@Getter
@Setter
@EqualsAndHashCode
@Embeddable
public class NewsTagId implements Serializable {
    private static final long serialVersionUID = -7274916253891229924L;
    @Column(name = "NewsArticleID", nullable = false)
    private Integer newsArticleID;

    @Column(name = "TagID", nullable = false)
    private Integer tagID;


}