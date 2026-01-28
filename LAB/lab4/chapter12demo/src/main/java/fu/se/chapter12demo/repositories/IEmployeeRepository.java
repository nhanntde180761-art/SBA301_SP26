package fu.se.chapter12demo.repositories;

import fu.se.chapter12demo.pojos.Employee;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

public interface IEmployeeRepository extends PagingAndSortingRepository<Employee, String> {
    public Employee getEmployeesById(String id);
    public Employee delete(int id);
    public Employee create(Employee employee);
    public List<Employee> getAllEmployees();
    // Thêm tham số Pageable vào interface
    Page<Employee> getAllEmployees(Pageable pageable);
}