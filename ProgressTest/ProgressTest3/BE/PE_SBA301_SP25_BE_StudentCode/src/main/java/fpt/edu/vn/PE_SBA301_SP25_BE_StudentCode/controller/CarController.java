package fpt.edu.vn.PE_SBA301_SP25_BE_StudentCode.controller;

import fpt.edu.vn.PE_SBA301_SP25_BE_StudentCode.dto.CarDTO;
import fpt.edu.vn.PE_SBA301_SP25_BE_StudentCode.service.CarService;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/cars")
@CrossOrigin(origins = "http://localhost:5173")
public class CarController {
    @Autowired
    private CarService carService;

    @GetMapping
    public ResponseEntity<List<CarDTO>> getAllCars() {
        List<CarDTO> cars = carService.findAll();
        return ResponseEntity.ok(cars);
    }

    @DeleteMapping
    public ResponseEntity<?> deleteCar(@RequestParam Integer carID) {
        boolean isDeleted = carService.deleteCar(carID);
        if (isDeleted) {
            return ResponseEntity.ok("Car deleted successfully!");
        } else {
            return ResponseEntity.badRequest().body("Car not found or deletion failed!");
        }
    }

    @PutMapping
    public ResponseEntity<?> updateCar(@RequestBody CarDTO carDTO) {
        boolean isUpdated = carService.updateCar(carDTO);
        if (isUpdated) {
            return ResponseEntity.ok("Car updated successfully!");
        } else {
            return ResponseEntity.badRequest().body("Car not found or update failed!");
        }
    }

    @PostMapping
    public ResponseEntity<?> addCar(@RequestBody CarDTO carDTO) {
        boolean isAdded = carService.addCar(carDTO);
        if (isAdded) {
            return ResponseEntity.ok("Car added successfully!");
        } else {
            return ResponseEntity.badRequest().body("Failed to add car!");
        }
    }
}
