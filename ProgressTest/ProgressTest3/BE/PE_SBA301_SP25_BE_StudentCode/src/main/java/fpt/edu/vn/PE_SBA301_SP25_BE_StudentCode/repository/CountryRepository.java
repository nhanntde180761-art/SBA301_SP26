package fpt.edu.vn.PE_SBA301_SP25_BE_StudentCode.repository;

import fpt.edu.vn.PE_SBA301_SP25_BE_StudentCode.pojo.Country;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CountryRepository extends JpaRepository<Country, Integer> {
}
