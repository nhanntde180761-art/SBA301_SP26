package nhannt.fu.lab8.controller;

import jakarta.websocket.server.PathParam;
import nhannt.fu.lab8.service.LoginService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class LoginController {
    @Autowired
    private LoginService loginService;

    @GetMapping("/login")
    public String showLoginForm() {
        return "login";
    }

    @PostMapping("/login")
    public String login(@RequestParam String email, @RequestParam String password) {
        if (loginService.login(email, password)) {
            return "redirect:/";
        } else {
            return "login";
        }
    }
}
