package se.fu.vn.NewsManagementSystem.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import se.fu.vn.NewsManagementSystem.pojos.Category;

public interface CategoryRepository extends JpaRepository<Category, Integer> {
}
