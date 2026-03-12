package nhannt.fu.lab8.controller;

import nhannt.fu.lab8.pojo.Student;
import nhannt.fu.lab8.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@Controller
public class HomeController {
    @Autowired
    private StudentService studentService;

    @GetMapping("/")
    public String home(Model model) {
        List<Student> studentList = studentService.findAll();
        model.addAttribute("students", studentList);
        return "home";
    }

    @PostMapping("/manageStudent")
    public String manageStudent(@RequestParam("btnManageStudent") String action,
                                @RequestParam("txtID") int id,
                                @RequestParam("txtEmail") String email,
                                @RequestParam("txtPassword") String password,
                                @RequestParam("txtFirstName") String firstName,
                                @RequestParam("txtLastName") String lastName,
                                @RequestParam("txtMark") int mark) {

        Student student = new Student();
        student.setId(id);
        student.setEmail(email);
        student.setPassword(password);
        student.setFirstName(firstName);
        student.setLastName(lastName);
        student.setMarks(mark);

        switch (action) {
            case "add": studentService.save(student); break;
            case "update": studentService.update(student); break;
            case "delete": studentService.delete(student); break;
        }
        return "redirect:/";
    }
}
