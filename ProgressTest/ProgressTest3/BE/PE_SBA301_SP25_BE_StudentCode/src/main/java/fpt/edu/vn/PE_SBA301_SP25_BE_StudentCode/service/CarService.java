package fpt.edu.vn.PE_SBA301_SP25_BE_StudentCode.service;

import fpt.edu.vn.PE_SBA301_SP25_BE_StudentCode.dto.CarDTO;
import fpt.edu.vn.PE_SBA301_SP25_BE_StudentCode.pojo.Car;
import fpt.edu.vn.PE_SBA301_SP25_BE_StudentCode.pojo.Country;
import fpt.edu.vn.PE_SBA301_SP25_BE_StudentCode.repository.CarRepository;
import fpt.edu.vn.PE_SBA301_SP25_BE_StudentCode.repository.CountryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Service
public class CarService {
    @Autowired
    private CarRepository carRepository;
    @Autowired
    private CountryRepository countryRepository;

    public List<CarDTO> findAll() {
        List<Car> cars = carRepository.findAll();
        List<CarDTO> carDTOS = new ArrayList<>();
        for (Car car : cars) {
            CarDTO carDTO = new CarDTO();
            carDTO.setCarID(car.getCarID());
            carDTO.setCarName(car.getCarName());
            carDTO.setUnitsInStock(car.getUnitsInStock());
            carDTO.setUnitPrice(car.getUnitPrice());
            carDTO.setCountryID(car.getCountryID().getCountryID());
            carDTO.setCountryName(car.getCountryID().getCountryName());
            carDTO.setCreatedAt(car.getCreatedAt());
            carDTO.setUpdatedAt(car.getUpdatedAt());
            carDTOS.add(carDTO);
        }
        return carDTOS;
    }

    public boolean deleteCar(Integer carID) {
        Car car = carRepository.findById(carID).orElse(null);
        if (car != null) {
            carRepository.delete(car);
            return true;
        }
        return false;
    }

    public boolean updateCar(CarDTO carDTO) {
        Car car = carRepository.findById(carDTO.getCarID()).orElse(null);
        Country country = countryRepository.findById(carDTO.getCountryID()).orElse(null);
        if (car != null && country != null) {
            car.setCarName(carDTO.getCarName());
            car.setCountryID(country);
            car.setUnitsInStock(carDTO.getUnitsInStock());
            car.setUnitPrice(carDTO.getUnitPrice());
            car.setUpdatedAt(Instant.now());
            carRepository.save(car);
            return true;
        }
        return false;
    }

    public boolean addCar(CarDTO carDTO) {
        Country country = countryRepository.findById(carDTO.getCountryID()).orElse(null);
        if (country != null) {
            Car car = new Car();
            car.setCarName(carDTO.getCarName());
            car.setCountryID(country);
            car.setUnitsInStock(carDTO.getUnitsInStock());
            car.setUnitPrice(carDTO.getUnitPrice());
            car.setCreatedAt(Instant.now());
            car.setUpdatedAt(Instant.now());
            carRepository.save(car);
            return true;
        }
        return false;
    }
}
