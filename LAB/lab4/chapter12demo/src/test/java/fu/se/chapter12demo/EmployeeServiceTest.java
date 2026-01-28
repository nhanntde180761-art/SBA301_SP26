package fu.se.chapter12demo;

import fu.se.chapter12demo.pojos.Employee;
import fu.se.chapter12demo.repositories.IEmployeeRepository;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

public class EmployeeServiceTest {
    @Autowired
    private IEmployeeRepository employeeRepository;
    @Test
    public void testFindAll(){
        Page<Employee> employees =
                employeeRepository.getAllEmployees((PageRequest.of(0, 10)));
        Assertions.assertThat(employees).isNotNull();
    }
}
