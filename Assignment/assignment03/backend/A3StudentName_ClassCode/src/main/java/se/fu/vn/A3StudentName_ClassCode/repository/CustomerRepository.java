package se.fu.vn.A3StudentName_ClassCode.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import se.fu.vn.A3StudentName_ClassCode.pojo.Customer;

public interface CustomerRepository extends JpaRepository<Customer, Integer> {
    Customer findCustomerById(Integer id);
}
