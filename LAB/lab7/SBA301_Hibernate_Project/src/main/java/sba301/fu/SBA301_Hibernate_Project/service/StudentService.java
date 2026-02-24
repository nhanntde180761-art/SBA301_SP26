package sba301.fu.SBA301_Hibernate_Project.service;

import sba301.fu.SBA301_Hibernate_Project.dao.StudentDAO;
import sba301.fu.SBA301_Hibernate_Project.pojo.Student;
import sba301.fu.SBA301_Hibernate_Project.repository.IStudentRepository;
import sba301.fu.SBA301_Hibernate_Project.repository.StudentRepository;

import java.util.List;

public class StudentService implements IStudentService{
    public IStudentRepository iStudentRepository = new StudentRepository(new StudentDAO());

    public StudentService() {
    }

    @Override
    public List<Student> findAll() {
        return iStudentRepository.findAll();
    }

    @Override
    public void save(Student student) {
        iStudentRepository.save(student);
    }

    @Override
    public void delete(int studentID) {
        iStudentRepository.delete(studentID);
    }

    @Override
    public void update(Student student) {
        iStudentRepository.update(student);
    }

    @Override
    public Student findByEmail(String email) {
        return iStudentRepository.findByEmail(email);
    }

    @Override
    public Student findById(int studentID) {
        return iStudentRepository.findById(studentID);
    }
}
