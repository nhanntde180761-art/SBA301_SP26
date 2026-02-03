package se.fu.vn.NewsManagementSystem.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import se.fu.vn.NewsManagementSystem.pojos.SystemAccount;
import se.fu.vn.NewsManagementSystem.repositories.SystemAccountRepository;

import java.util.List;

@Service
public class SystemAccountService {
    @Autowired
    private SystemAccountRepository systemAccountRepository;

    public List<SystemAccount> getSystemAccountRepository()
    {
        return systemAccountRepository.findAll();
    }

    public SystemAccount getSystemAccountById(Integer id)
    {
        return systemAccountRepository.findById(id).orElse(null);
    }

    public void  saveSystemAccount(SystemAccount systemAccount)
    {
        systemAccountRepository.save(systemAccount);
    }

    public void   deleteSystemAccount(Integer systemAccount)
    {
        systemAccountRepository.deleteById(systemAccount);
    }

    public void   updateSystemAccount(SystemAccount systemAccount)
    {
        if (systemAccountRepository.existsById(systemAccount.getId())) {
            systemAccountRepository.save(systemAccount);
        }
    }
}
