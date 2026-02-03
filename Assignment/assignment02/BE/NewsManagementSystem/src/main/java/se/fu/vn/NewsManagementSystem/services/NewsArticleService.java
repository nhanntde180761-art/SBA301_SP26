package se.fu.vn.NewsManagementSystem.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import se.fu.vn.NewsManagementSystem.pojos.NewsArticle;
import se.fu.vn.NewsManagementSystem.repositories.NewsArticleRepository;

import java.util.List;

@Service
public class NewsArticleService {
    @Autowired
    private NewsArticleRepository newsArticleRepository;

    public List<NewsArticle> getAllNewsArticles()
    {
        return newsArticleRepository.findAll();
    }

    public  NewsArticle getNewsArticleById(Integer id)
    {
        return newsArticleRepository.findById(id).orElse(null);
    }

    public  NewsArticle saveNewsArticle(NewsArticle newsArticle)
    {
        return newsArticleRepository.save(newsArticle);
    }

    public   void deleteNewsArticleById(Integer id)
    {
        newsArticleRepository.deleteById(id);
    }

    public void updateNewsArticle(NewsArticle newsArticle) {
        if (newsArticleRepository.existsById(newsArticle.getId())) {
            newsArticleRepository.save(newsArticle);
        }
    }
}
