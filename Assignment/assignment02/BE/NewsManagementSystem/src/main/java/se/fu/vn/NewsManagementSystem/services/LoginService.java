package se.fu.vn.NewsManagementSystem.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import se.fu.vn.NewsManagementSystem.pojos.SystemAccount;
import se.fu.vn.NewsManagementSystem.repositories.SystemAccountRepository;

@Service
public class LoginService {
    @Autowired
    private SystemAccountRepository systemAccountRepository;

    public SystemAccount login(String email, String password) {
        for (SystemAccount account : systemAccountRepository.findAll()) {
            if (account.getAccountEmail().equals(email) && account.getAccountPassword().equals(password)) {
                return account;
            }
        }
        return null;
    }
}
