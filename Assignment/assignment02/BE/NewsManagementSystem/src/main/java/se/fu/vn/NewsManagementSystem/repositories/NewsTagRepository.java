package se.fu.vn.NewsManagementSystem.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import se.fu.vn.NewsManagementSystem.pojos.NewsTag;

public interface NewsTagRepository extends JpaRepository<NewsTag, Integer> {
}
