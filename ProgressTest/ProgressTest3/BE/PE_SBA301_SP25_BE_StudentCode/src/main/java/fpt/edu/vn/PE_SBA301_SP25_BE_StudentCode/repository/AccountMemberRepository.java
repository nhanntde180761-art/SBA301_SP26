package fpt.edu.vn.PE_SBA301_SP25_BE_StudentCode.repository;

import fpt.edu.vn.PE_SBA301_SP25_BE_StudentCode.pojo.AccountMember;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AccountMemberRepository extends JpaRepository<AccountMember, Integer> {
    AccountMember findAccountMembersByEmailAddressAndMemberPassword(String emailAddress, String memberPassword);
}
