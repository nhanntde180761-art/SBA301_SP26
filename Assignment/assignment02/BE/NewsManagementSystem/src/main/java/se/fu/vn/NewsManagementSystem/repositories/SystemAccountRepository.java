package se.fu.vn.NewsManagementSystem.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import se.fu.vn.NewsManagementSystem.pojos.SystemAccount;

public interface SystemAccountRepository extends JpaRepository<SystemAccount, Integer> {
}
