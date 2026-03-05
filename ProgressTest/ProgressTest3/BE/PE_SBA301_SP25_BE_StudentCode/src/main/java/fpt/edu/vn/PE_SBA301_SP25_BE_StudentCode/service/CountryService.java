package fpt.edu.vn.PE_SBA301_SP25_BE_StudentCode.service;

import fpt.edu.vn.PE_SBA301_SP25_BE_StudentCode.pojo.Country;
import fpt.edu.vn.PE_SBA301_SP25_BE_StudentCode.repository.CountryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CountryService {
    @Autowired
    private CountryRepository countryRepository;

    public List<Country> getCountries() {
        return countryRepository.findAll();
    }
}
