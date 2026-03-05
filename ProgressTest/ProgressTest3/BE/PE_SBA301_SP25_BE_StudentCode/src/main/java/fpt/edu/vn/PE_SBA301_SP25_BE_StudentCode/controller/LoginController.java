package fpt.edu.vn.PE_SBA301_SP25_BE_StudentCode.controller;

import fpt.edu.vn.PE_SBA301_SP25_BE_StudentCode.config.JwtUtil;
import fpt.edu.vn.PE_SBA301_SP25_BE_StudentCode.dto.LoginRequest;
import fpt.edu.vn.PE_SBA301_SP25_BE_StudentCode.pojo.AccountMember;
import fpt.edu.vn.PE_SBA301_SP25_BE_StudentCode.service.LoginService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/login")
@CrossOrigin (origins = "http://localhost:5173")
public class LoginController {
    @Autowired
    private LoginService loginService;
    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping
    public ResponseEntity<?> login(@RequestBody LoginRequest request) { // Dùng @RequestBody thay vì @RequestParam
        AccountMember member = loginService.login(request.getEmail(), request.getPassword());
        if (member != null) {
            String token = jwtUtil.generateToken(member.getMemberID(), member.getMemberRole());
            return ResponseEntity.ok(Map.of(
                    "token", token,
                    "memberID", member.getMemberID(),
                    "role", member.getMemberRole()
            ));
        }
        return ResponseEntity.status(401).body("Invalid credentials");
    }
}
