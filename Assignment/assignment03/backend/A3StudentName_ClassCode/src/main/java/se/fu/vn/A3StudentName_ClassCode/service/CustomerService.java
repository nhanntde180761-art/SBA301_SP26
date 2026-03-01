package se.fu.vn.A3StudentName_ClassCode.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import se.fu.vn.A3StudentName_ClassCode.pojo.Customer;
import se.fu.vn.A3StudentName_ClassCode.repository.CustomerRepository;

import java.util.ArrayList;
import java.util.List;

@Service
public class CustomerService {
    @Autowired
    private CustomerRepository customerRepository;

    public List<Customer> getAllCustomers() {
        List<Customer> customers = customerRepository.findAll();
        List<Customer> customersNotStaff = new ArrayList<>();
        for (Customer customer : customers) {
            if (customer.getCustomerRole().equals("Staff")) {
                continue;
            }
            customersNotStaff.add(customer);
        }
        return customersNotStaff;
    }

    public boolean setStatus(int id, Integer status) {
        Customer customer = customerRepository.findById(id).orElse(null);
        if (customer != null) {
            customer.setCustomerStatus(status);
            customerRepository.save(customer);
            return true;
        }
        return false;
    }

    public Customer login(Customer customer) {
        List<Customer> customers = customerRepository.findAll();
        for (Customer c : customers) {
            if (c.getEmailAddress().equals(customer.getEmailAddress()) && c.getPassword().equals(customer.getPassword())) {
                return c;
            }
        }
        return null;
    }

    public void save(Customer updatedCustomer) {
        Customer existingCustomer = customerRepository.findById(updatedCustomer.getId()).orElse(null);
        if (existingCustomer != null) {
            existingCustomer.setCustomerFullName(updatedCustomer.getCustomerFullName());
            existingCustomer.setCustomerBirthday(updatedCustomer.getCustomerBirthday());
            existingCustomer.setTelephone(updatedCustomer.getTelephone());
            customerRepository.save(existingCustomer);
        }
    }

    public Customer createCustomer(Customer customer) {
        customer.setCustomerRole("Customer");
        customer.setCustomerStatus(1);
        return customerRepository.save(customer);
    }
}
