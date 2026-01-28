package fu.se.chapter12demo.services;

import fu.se.chapter12demo.pojos.Employee;
import fu.se.chapter12demo.repositories.IEmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class EmployeeService implements IEmployeeService {
    @Autowired
    private IEmployeeRepository employeeRepository;

    public Employee getEmployeeById(String id){
        return employeeRepository.getEmployeesById(id);
    }

    public Employee delete(int id){
        return employeeRepository.delete(id);
    }

    public Employee create(Employee employee) {
        return employeeRepository.create(employee);
    }

    public Page<Employee> getEmployees(Pageable page){
        return employeeRepository.findAll(page);
    }

}
