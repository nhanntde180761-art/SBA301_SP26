package fu.se.chapter15api.repositories;

import fu.se.chapter15api.pojos.Orchid;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrchidRepository extends JpaRepository<Orchid, Integer> {
}
