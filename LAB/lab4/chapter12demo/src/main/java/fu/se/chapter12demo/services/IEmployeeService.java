package fu.se.chapter12demo.services;

import fu.se.chapter12demo.pojos.Employee;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface IEmployeeService {
    public Employee getEmployeeById(String id);
    public Employee delete(int id);
    public Employee create(Employee employee);
    public Page<Employee> getEmployees(Pageable page);
}
