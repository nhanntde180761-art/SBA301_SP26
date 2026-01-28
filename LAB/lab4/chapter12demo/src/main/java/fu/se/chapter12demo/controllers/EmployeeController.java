package fu.se.chapter12demo.controllers;

import fu.se.chapter12demo.pojos.Employee;
import fu.se.chapter12demo.services.IEmployeeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

@RestController
@Tag(name = "Employee Operations", description = "CRUD with your Employee")
public class EmployeeController {
    @Autowired
    private IEmployeeService employeeService;

    @GetMapping(value = "/employees", produces = "application/json")
    public Page<Employee> firstPage(Pageable page){
        return employeeService.getEmployees(page);
    }

    @Operation(
            summary = "Get an employee by ID",
            operationId = "getEmployeeById",
            tags = {"employees"},
            responses = {
                    @ApiResponse(responseCode = "200", description = "Employee found!",
                              content = @Content(schema = @Schema(implementation = Employee.class))),
                    @ApiResponse(responseCode = "404", description = "Employee not found!")
            }
    )
    @GetMapping("/employees/{empId}")
    public Employee getEmployeeById(@PathVariable String empId){
        return employeeService.getEmployeeById(empId);
    }

    @DeleteMapping(path = {"/employees/{id}"})
    public Employee delete(@PathVariable ("id") int id){
        return employeeService.delete(id);
    }

    @PostMapping("/employees")
    public Employee create(@RequestBody Employee employee){
        return employeeService.create(employee);
    }
}
