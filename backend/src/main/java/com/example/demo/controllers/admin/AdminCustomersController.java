package com.example.demo.controllers.admin;

import com.example.demo.services.admin.CustomerService;
import com.example.demo.services.common.Pagination;
import com.example.demo.utils.QueryEditor;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.InitBinder;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/admin")
public class AdminCustomersController {

  private ObjectMapper mapper;
  private final Validator validator;
  private final CustomerService customerService;

  public AdminCustomersController(ObjectMapper mapper, CustomerService customerService) {
    this.mapper = mapper;
    ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
    this.validator = factory.getValidator();
    this.customerService = customerService;
  }

  @InitBinder
  public void initBinder(WebDataBinder binder) {
    binder.registerCustomEditor(
        CustomerService.DTO.ListCustomers.Filter.class,
        new QueryEditor<>(mapper, validator, CustomerService.DTO.ListCustomers.Filter.class));
    binder.registerCustomEditor(
        Pagination.class, new QueryEditor<>(mapper, validator, Pagination.class));
  }

  @GetMapping("customers")
  public CustomerService.DTO.ListCustomers.Result listCustomers(
      @RequestParam(name = "filter", required = true)
          CustomerService.DTO.ListCustomers.Filter filter,
      @RequestParam(name = "pagination", required = false) Pagination pagination) {
    var result = customerService.listCustomers(filter, pagination);
    return result;
  }

  @GetMapping("customers/{customerId}")
  public CustomerService.DTO.GetCustomerDetails.Result getCustomerDetails(
      @PathVariable Integer customerId) {
    var result = customerService.getCustomerDetails(customerId);
    return result;
  }
}
