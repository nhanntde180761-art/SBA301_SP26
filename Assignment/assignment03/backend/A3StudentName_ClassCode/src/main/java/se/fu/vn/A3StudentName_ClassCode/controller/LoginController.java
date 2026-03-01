package se.fu.vn.A3StudentName_ClassCode.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import se.fu.vn.A3StudentName_ClassCode.pojo.Customer;
import se.fu.vn.A3StudentName_ClassCode.service.CustomerService;

@RestController
@RequestMapping("/login")
@CrossOrigin(origins = "http://localhost:5173")
public class LoginController {
    @Autowired
    private CustomerService customerService;
    @PostMapping
    public ResponseEntity<Customer> login(@RequestBody Customer customer) {
        Customer customer1 = customerService.login(customer);
        if (customer1 != null) {
            return ResponseEntity.ok(customer1);
        }
        return ResponseEntity.status(401).build();
    }
}
