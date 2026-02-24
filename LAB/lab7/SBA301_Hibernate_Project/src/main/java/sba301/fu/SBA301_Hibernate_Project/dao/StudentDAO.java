package sba301.fu.SBA301_Hibernate_Project.dao;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.hibernate.cfg.Configuration;
import org.hibernate.query.Query;
import sba301.fu.SBA301_Hibernate_Project.pojo.Student;

import java.util.List;

public class StudentDAO {

    private SessionFactory sessionFactory = null;
    private Configuration cf = null;

    public StudentDAO() {
        cf = new Configuration();
        cf = cf.configure("hibernate.cfg.xml");
        sessionFactory = cf.buildSessionFactory();
    }


    public void save(Student student) {
        Session session = sessionFactory.openSession();
        Transaction t = session.beginTransaction();
        try {
            session.save(student);
            t.commit();
            System.out.println("Student saved successfully");
        } catch (Exception e) {
            t.rollback();
            System.out.println("Error saving student: " + e.getMessage());
        }
    }

    public List<Student> getStudents() {
        Session session = sessionFactory.openSession();
        Transaction t = session.beginTransaction();
        try {
            Query<Student> query = session.createQuery("FROM Student");
            List<Student> students = query.getResultList();
            t.commit();
            return students;
        } catch (Exception e) {
            t.rollback();
            System.out.println("Error retrieving students: " + e.getMessage());
        }
        return null;
    }

    public void delete(int studentID) {
        Session session = sessionFactory.openSession();
        Transaction t = session.beginTransaction();
        try {
            Student student = session.get(Student.class, studentID);
            if (student != null) {
                session.delete(student);
                t.commit();
                System.out.println("Student deleted successfully");
            } else {
                System.out.println("Student not found with ID: " + studentID);
            }
        } catch (Exception e) {
            t.rollback();
            System.out.println("Error deleting student: " + e.getMessage());
        }
    }

    public Student findById(int studentID) {
        Session session = sessionFactory.openSession();
        try {
            return (Student) session.get(Student.class, studentID);
        }
            catch (RuntimeException e) {
                throw e;
            }
    }

    public void update(Student student) {
        Session session = sessionFactory.openSession();
        Transaction t = session.beginTransaction();
        try {
            session.update(student);
            t.commit();
            System.out.println("Student updated successfully");
        } catch (Exception e) {
            t.rollback();
            System.out.println("Error updating student: " + e.getMessage());
        }
    }

    public Student findByEmail(String email) {
        Session session = sessionFactory.openSession();
        try {
            String hql = "FROM Student WHERE email = :email";
            Query<Student> query = session.createQuery(hql, Student.class);
            query.setParameter("email", email);
            return query.uniqueResult();
        } catch (RuntimeException e) {
            throw e;
        }
    }
}
