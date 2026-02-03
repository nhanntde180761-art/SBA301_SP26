package se.fu.vn.NewsManagementSystem.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import se.fu.vn.NewsManagementSystem.pojos.Category;
import se.fu.vn.NewsManagementSystem.pojos.NewsArticle;

public interface NewsArticleRepository extends JpaRepository<NewsArticle, Integer> {
}
