package fu.se.chapter15api.services;

import fu.se.chapter15api.pojos.Orchid;
import fu.se.chapter15api.repositories.OrchidRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
@Service
public class OrichidService implements IOrichidService {
    @Autowired
    private OrchidRepository orchidRepository;

    public List<Orchid> getAllOrchids() {
        return orchidRepository.findAll();
    }

    public Orchid insertOrchid(Orchid orchid) {
        return orchidRepository.save(orchid);
    }

    public Orchid updateOrchid(int orchidID, Orchid orchid) {
        Orchid o = orchidRepository.findById(orchidID).orElse(null);
        if (o != null) {
            o.setOrchidName(orchid.getOrchidName());
            o.setOrchidDescription(orchid.getOrchidDescription());
        }
        return orchidRepository.save(orchid);
    }

    public void deleteOrchid(int orchidID) {
        orchidRepository.deleteById(orchidID);
    }

    public Optional<Orchid> getOrchidID(int orchidID) {
        return orchidRepository.findById(orchidID);
    }


}
