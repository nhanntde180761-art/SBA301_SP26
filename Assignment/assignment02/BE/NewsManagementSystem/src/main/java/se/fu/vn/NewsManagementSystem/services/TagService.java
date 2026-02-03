package se.fu.vn.NewsManagementSystem.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import se.fu.vn.NewsManagementSystem.pojos.Tag;
import se.fu.vn.NewsManagementSystem.repositories.TagRepository;

import java.util.List;

@Service
public class TagService {
    @Autowired
    private TagRepository tagRepository;

    public List<Tag> getTags() {
        return tagRepository.findAll();
    }

    public void deleteById(int id) {
        tagRepository.deleteById(id);
    }

    public void addTag(Tag tag) {
        tagRepository.save(tag);
    }

    public void updateTag(Tag tag) {
        if (tagRepository.existsById(tag.getId())) {
            tagRepository.save(tag);
        }
    }

}
