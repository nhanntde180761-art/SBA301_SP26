package fpt.edu.vn.PE_SBA301_SP25_BE_StudentCode.controller;

import fpt.edu.vn.PE_SBA301_SP25_BE_StudentCode.pojo.Country;
import fpt.edu.vn.PE_SBA301_SP25_BE_StudentCode.service.CountryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/countries")
@CrossOrigin(origins = "http://localhost:5173")
public class CountryController {
    @Autowired
    private CountryService countryService;

    @GetMapping
    public ResponseEntity<List<Country>> getAllCountries(){
        List<Country> countries = countryService.getCountries();
        return ResponseEntity.ok(countries);
    }
}
