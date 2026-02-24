package sba301.fu.SBA301_Hibernate_Project.repository;

import sba301.fu.SBA301_Hibernate_Project.pojo.Student;

import java.util.List;

public interface IStudentRepository {
    public List<Student> findAll();
    public void save(Student student);
    public void delete(int studentID);
    public void update(Student student);
    public Student findByEmail(String email);

    Student findById(int studentID);
}
