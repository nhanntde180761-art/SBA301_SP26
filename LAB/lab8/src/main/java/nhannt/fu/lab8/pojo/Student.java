package nhannt.fu.lab8.pojo;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
@Getter
@Setter
@Document(collection = "students")
public class Student {
    @Id
    private int id;
    private String email;
    private String password;
    private  String firstName;
    private String lastName;
    private int marks;
}
