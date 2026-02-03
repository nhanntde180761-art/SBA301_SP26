package se.fu.vn.NewsManagementSystem.controllers;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import se.fu.vn.NewsManagementSystem.pojos.SystemAccount;
import se.fu.vn.NewsManagementSystem.services.SystemAccountService;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class SystemAccountController {
    @Autowired
    private SystemAccountService systemAccountService;

    @GetMapping
    public ResponseEntity<List<SystemAccount>> getAllSystemAccounts() {
        return ResponseEntity.ok(systemAccountService.getSystemAccountRepository());
    }

    @PostMapping
    public ResponseEntity<SystemAccount> createSystemAccount(@RequestBody SystemAccount systemAccount) {
        systemAccountService.saveSystemAccount(systemAccount);
        return ResponseEntity.ok(systemAccount);
    }

    @PutMapping
    public ResponseEntity<SystemAccount> updateSystemAccount(@RequestBody SystemAccount systemAccount) {
        systemAccountService.updateSystemAccount(systemAccount);
        return ResponseEntity.ok(systemAccount);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSystemAccount(@PathVariable("id") Integer systemAccountId) {
        systemAccountService.deleteSystemAccount(systemAccountId);
        return ResponseEntity.ok().build();
    }
}
