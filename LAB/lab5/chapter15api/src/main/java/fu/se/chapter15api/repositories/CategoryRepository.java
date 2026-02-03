package fu.se.chapter15api.repositories;

import fu.se.chapter15api.pojos.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Integer> {
}
