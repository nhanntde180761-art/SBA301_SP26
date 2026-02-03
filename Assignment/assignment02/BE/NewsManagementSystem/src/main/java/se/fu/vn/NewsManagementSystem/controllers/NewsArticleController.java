package se.fu.vn.NewsManagementSystem.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import se.fu.vn.NewsManagementSystem.pojos.NewsArticle;
import se.fu.vn.NewsManagementSystem.services.NewsArticleService;

import java.util.List;

@RestController
@RequestMapping("/api/news-articles")
@CrossOrigin(origins = "http://localhost:5173")
public class NewsArticleController {
    @Autowired
    private NewsArticleService newsArticleService;

    @GetMapping
    public ResponseEntity<List<NewsArticle>> getAllNewsArticles() {
        return ResponseEntity.ok(newsArticleService.getAllNewsArticles());
    }

    @PostMapping
    public ResponseEntity<NewsArticle> createNewsArticle(@RequestBody NewsArticle newsArticle) {
        newsArticleService.saveNewsArticle(newsArticle);
        return ResponseEntity.ok(newsArticle);
    }

    @PutMapping
    public ResponseEntity<NewsArticle> updateNewsArticle(@RequestBody NewsArticle newsArticle) {
        newsArticleService.updateNewsArticle(newsArticle);
        return ResponseEntity.ok(newsArticle);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNewsArticle(@PathVariable Integer id) {
        newsArticleService.deleteNewsArticleById(id);
        return ResponseEntity.ok().build();
    }
}
