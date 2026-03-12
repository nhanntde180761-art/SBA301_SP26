package nhannt.fu.lab8.service;

import nhannt.fu.lab8.pojo.Student;
import nhannt.fu.lab8.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudentService {
    @Autowired
    private StudentRepository studentRepository;

    public List<Student> findAll() {
        return studentRepository.findAll();
    }

    public void  save(Student student) {
        studentRepository.save(student);
    }

    public void  delete(Student student) {
        studentRepository.delete(student);
    }

    public Student findByEmail(String email) {
        return studentRepository.findByEmail(email);
    }

    public Student update(Student student) {
        return studentRepository.save(student);
    }
}
