package fu.se.chapter12demo.repositories;

import fu.se.chapter12demo.pojos.Employee;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
@Repository
public class EmployeeRepository implements IEmployeeRepository {
    private List<Employee> employees = createList();

    private static List<Employee> createList() {
        List<Employee> tempEmployees = new ArrayList<>();

        // Sử dụng Collections.addAll để thêm nhiều đối tượng cùng lúc
        Collections.addAll(tempEmployees,
                new Employee("EMP01", "Steven Paris", "Technical Manager", 3000),
                new Employee("EMP02", "John Lemon", "Developer", 1000),
                new Employee("EMP03", "Steven Paris", "Tester", 3000),
                new Employee("EMP04", "David William", "Accountant", 1000),
                new Employee("EMP05", "Christopher Robert", "HR Manager", 3000),
                new Employee("EMP06", "George Ronald", "Developer", 1000)
        );

        return tempEmployees;
    }

    public List<Employee> getAllEmployees() {
        return employees;
    }

    @Override
    public Page<Employee> getAllEmployees(Pageable pageable) {
        return null;
    }

    public Employee getEmployeesById(int id) {
        for (Employee employee : employees) {
            if (employee.equals(id)) {
                return employee;
            }
        }
        return null;
    }

    @Override
    public Employee getEmployeesById(String id) {
        return null;
    }

    public Employee delete(int id) {
        for (Employee employee : employees) {
            if (employee.equals(id)) {
                employees.remove(employee);
                return employee;
            }
        }
        return null;
    }

    public Employee create(Employee employee) {
        employees.add(employee);
        return employee;
    }

    @Override
    public Iterable<Employee> findAll(Sort sort) {
        return employees;
    }

    @Override
    public Page<Employee> findAll(Pageable pageable) {
        List<Employee> allEmployees = createList();
        int start = (int) pageable.getOffset();
        int end = Math.min(start + pageable.getPageSize(), allEmployees.size());
        List<Employee> pageContents = allEmployees.subList(start, end);

        return new PageImpl<>(pageContents, pageable, allEmployees.size());
    }
}
