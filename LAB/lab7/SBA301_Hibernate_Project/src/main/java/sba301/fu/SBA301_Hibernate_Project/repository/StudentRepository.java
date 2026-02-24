package sba301.fu.SBA301_Hibernate_Project.repository;

import sba301.fu.SBA301_Hibernate_Project.dao.StudentDAO;
import sba301.fu.SBA301_Hibernate_Project.pojo.Student;

import java.util.List;

public class StudentRepository implements IStudentRepository {
    private StudentDAO studentDAO;

    public StudentRepository(StudentDAO studentDAO) {
        this.studentDAO = studentDAO;
    }

    @Override
    public List<Student> findAll() {
        return studentDAO.getStudents();
    }

    @Override
    public void save(Student student) {
        studentDAO.save(student);
    }

    @Override
    public void delete(int studentID) {
        studentDAO.delete(studentID);
    }

    @Override
    public void update(Student student) {
        studentDAO.update(student);
    }

    @Override
    public Student findByEmail(String email) {
        return studentDAO.findByEmail(email);
    }

    @Override
    public Student findById(int studentID) {
        return studentDAO.findById(studentID);
    }
}
