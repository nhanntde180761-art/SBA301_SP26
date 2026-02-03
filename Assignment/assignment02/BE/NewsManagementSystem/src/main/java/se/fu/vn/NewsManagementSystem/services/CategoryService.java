package se.fu.vn.NewsManagementSystem.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import se.fu.vn.NewsManagementSystem.pojos.Category;
import se.fu.vn.NewsManagementSystem.repositories.CategoryRepository;

import java.util.ArrayList;
import java.util.List;

@Service
public class CategoryService {
    @Autowired
    private CategoryRepository categoryRepository;

    public List<Category> getCategoryRepository() {
        return categoryRepository.findAll();
    }

    public Category getCategoryById(Integer id) {
        return categoryRepository.findById(id).orElse(null);
    }

    public List<Category> getCategoryByName(String categoryName) {
        List<Category> result = new ArrayList<>();
        List<Category> categories = categoryRepository.findAll();
        for (Category category : categories) {
            if (category.getCategoryName().equalsIgnoreCase(categoryName)) {
                result.add(category);
            }
        }
        return result;
    }

    public void deleteCategory(Integer categoryId) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow();

        if (!category.getNewsArticles().isEmpty()) {
            throw new RuntimeException("Cannot delete category: Category is being used in news articles.");
        }
        categoryRepository.delete(category);
    }

    public void addCategory(Category category) {
        categoryRepository.save(category);
    }

    public void  updateCategory(Category category) {
        if (categoryRepository.existsById(category.getId())) {
            categoryRepository.save(category);
        }
    }


}
