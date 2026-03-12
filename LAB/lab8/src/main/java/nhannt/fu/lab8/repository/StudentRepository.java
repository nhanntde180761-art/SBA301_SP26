package nhannt.fu.lab8.repository;

import nhannt.fu.lab8.pojo.Student;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface StudentRepository extends MongoRepository<Student, Integer> {
    public Student findByEmail(String email);
}
