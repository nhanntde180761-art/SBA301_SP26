package fu.se.chapter15api.services;

import fu.se.chapter15api.pojos.Orchid;

import java.util.List;
import java.util.Optional;

public interface IOrichidService {
    public List<Orchid> getAllOrchids();
    public Orchid insertOrchid(Orchid orchid);
    public Orchid updateOrchid(int orchidID,Orchid orchid);
    public  void deleteOrchid(int orchidID);
    public Optional<Orchid> getOrchidID(int orchidID);
}
