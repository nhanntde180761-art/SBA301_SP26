package fu.se.chapter15api.controllers;

import fu.se.chapter15api.pojos.Orchid;
import fu.se.chapter15api.services.IOrichidService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin
@RequestMapping("/orchids")
public class OrchidController {
    @Autowired
    private IOrichidService orchidService;

    @GetMapping("/")
    public ResponseEntity<List<Orchid>> fetchAll() {
        return ResponseEntity.ok(orchidService.getAllOrchids());
    }

    @PostMapping("/")
    @ResponseStatus(HttpStatus.CREATED)
    public Orchid createOrchid(@RequestBody Orchid orchid) {
        return orchidService.insertOrchid(orchid);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Orchid> updateOrchid(@PathVariable("id") int orchidID, @RequestBody Orchid orchid) {
        Orchid updatedOrchid = orchidService.updateOrchid(orchidID, orchid);
        return ResponseEntity.ok(updatedOrchid);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteOrchid(@PathVariable("id") int orchidID) {
        orchidService.deleteOrchid(orchidID);
        return ResponseEntity.ok("Orchid deleted successfully");
    }

    @GetMapping("/{id}")
    public ResponseEntity<Optional<Orchid>> getOrchidById(@PathVariable("id") int orchidID) {
        Optional<Orchid> o = orchidService.getOrchidID(orchidID);
        return ResponseEntity.ok(o);
    }

}
