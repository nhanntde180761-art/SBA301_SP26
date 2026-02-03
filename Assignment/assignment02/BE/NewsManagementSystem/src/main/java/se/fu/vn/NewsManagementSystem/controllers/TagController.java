package se.fu.vn.NewsManagementSystem.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import se.fu.vn.NewsManagementSystem.pojos.Tag;
import se.fu.vn.NewsManagementSystem.services.TagService;

import java.util.List;

@RestController
@RequestMapping("/api/tags")
@CrossOrigin(origins = "http://localhost:5173")
public class TagController {
    @Autowired
    private TagService tagService;

    @GetMapping
    public ResponseEntity<List<Tag>> getAllTags() {
        return ResponseEntity.ok(tagService.getTags());
    }

    @PostMapping
    public ResponseEntity<Tag> createTag(@RequestBody Tag tag) {
        tagService.addTag(tag);
        return ResponseEntity.ok(tag);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Tag> updateTag(@PathVariable Integer id, @RequestBody Tag tag) {
        tag.setId(id);
        tagService.updateTag(tag);
        return ResponseEntity.ok(tag);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTag(@PathVariable Integer id) {
        tagService.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
