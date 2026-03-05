package fpt.edu.vn.PE_SBA301_SP25_BE_StudentCode.service;

import fpt.edu.vn.PE_SBA301_SP25_BE_StudentCode.pojo.AccountMember;
import fpt.edu.vn.PE_SBA301_SP25_BE_StudentCode.repository.AccountMemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class LoginService {
    @Autowired
    private AccountMemberRepository accountMemberRepository;
    public AccountMember login(String email, String password) {
        AccountMember accountMember = accountMemberRepository.findAccountMembersByEmailAddressAndMemberPassword(email, password);
        if (accountMember != null) {
            return accountMember;
        } else {
            return null;
        }
    }
}
