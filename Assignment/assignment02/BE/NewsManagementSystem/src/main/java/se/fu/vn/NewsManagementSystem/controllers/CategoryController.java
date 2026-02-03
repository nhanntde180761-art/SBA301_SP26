package se.fu.vn.NewsManagementSystem.controllers;

import jakarta.websocket.server.PathParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import se.fu.vn.NewsManagementSystem.pojos.Category;
import se.fu.vn.NewsManagementSystem.services.CategoryService;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin(origins = "http://localhost:5173")
public class CategoryController {
    @Autowired
    private CategoryService categoryService;

    @GetMapping
    public ResponseEntity<List<Category>> getAllCategories() {
        return ResponseEntity.ok(categoryService.getCategoryRepository());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Category> getCategoryById(@PathVariable Integer id) {
        Category category = categoryService.getCategoryById(id);
        if (category != null) {
            return ResponseEntity.ok(category);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{name}")
    public ResponseEntity<List<Category>> getCategoryByName(@PathParam("name") String categoryName) {
        List<Category> categories = categoryService.getCategoryByName(categoryName);
        return ResponseEntity.ok(categories);
    }

    @PutMapping("/{id}") // Thêm /{id} vào đây
    public ResponseEntity<Void> updateCategory(@PathVariable Integer id, @RequestBody Category category) {
        category.setId(id); // Đảm bảo ID từ URL được set vào object
        categoryService.updateCategory(category);
        return ResponseEntity.ok().build();
    }

    @PostMapping
    public ResponseEntity<Void> addCategory(@RequestBody Category category) {
        categoryService.addCategory(category);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable("id") Integer categoryId) {
        categoryService.deleteCategory(categoryId);
        return ResponseEntity.ok().build();
    }

}
