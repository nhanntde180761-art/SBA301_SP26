package se.fu.vn.NewsManagementSystem.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import se.fu.vn.NewsManagementSystem.pojos.SystemAccount;
import se.fu.vn.NewsManagementSystem.services.LoginService;

@RestController
@RequestMapping("/api/login")
@CrossOrigin(origins = "http://localhost:5173")
public class LoginController {
    @Autowired
    private LoginService loginService;

    @PostMapping()
    public ResponseEntity<SystemAccount> login(@RequestBody SystemAccount systemAccount) {
        SystemAccount loggedInAccount = loginService.login(systemAccount.getAccountEmail(), systemAccount.getAccountPassword());
        if (loggedInAccount != null) {
            return ResponseEntity.ok(loggedInAccount);
        } else {
            return ResponseEntity.status(401).build(); // Unauthorized
        }
    }


}
