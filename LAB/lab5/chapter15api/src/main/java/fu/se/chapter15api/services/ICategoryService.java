package fu.se.chapter15api.services;

import fu.se.chapter15api.pojos.Category;

import java.util.List;

public interface ICategoryService {
    public List<Category> getAllCategories();
}
