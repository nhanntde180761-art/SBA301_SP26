package nhannt.fu.lab8.service;

import nhannt.fu.lab8.pojo.Student;
import nhannt.fu.lab8.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class LoginService {
    @Autowired
    private StudentRepository studentRepository;
    public boolean login(String email, String password) {
        Student student = studentRepository.findByEmail(email);
        if (student != null && student.getPassword().equals(password)) {
            return true;
        } else {
            return false;
        }
    }
}
