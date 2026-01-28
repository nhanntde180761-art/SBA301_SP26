package fu.se.chapter12demo;

import fu.se.chapter12demo.pojos.Employee;
import fu.se.chapter12demo.repositories.IEmployeeRepository;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

public class EmployeeRepositoryTest {
    @Autowired
    private IEmployeeRepository employeeRepository;

    @Test
    public void testSaveEmployee() {
        Employee employee = new Employee("TEST01", "John", "Leader", 4000);
        Employee saveEmployee = employeeRepository.create(employee);
        Assertions.assertThat(saveEmployee).isNotNull();
        Assertions.assertThat(saveEmployee.getEmpId()).isNotNull();
    }
}
