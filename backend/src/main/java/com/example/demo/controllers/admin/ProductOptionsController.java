package com.example.demo.controllers.admin;

import com.example.demo.services.admin.productoptions.ProductOptionCommandService;
import com.example.demo.services.admin.productoptions.ProductOptionQueryService;
import com.example.demo.services.common.Pagination;
import com.example.demo.services.common.ResultMessage;
import com.example.demo.utils.QueryEditor;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.validation.Valid;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import java.util.List;
import org.jooq.DSLContext;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.InitBinder;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("admin")
public class ProductOptionsController {
  private ObjectMapper mapper;
  private final Validator validator;
  private final ProductOptionQueryService optionsQueryService;
  private final ProductOptionCommandService optionsCommandService;

  public ProductOptionsController(
      ObjectMapper mapper,
      ProductOptionQueryService optionsQueryService,
      ProductOptionCommandService optionsCommandService) {
    this.mapper = mapper;
    ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
    this.validator = factory.getValidator();
    this.optionsQueryService = optionsQueryService;
    this.optionsCommandService = optionsCommandService;
  }

  @InitBinder
  public void initBinder(WebDataBinder binder) {
    binder.registerCustomEditor(
        ProductOptionQueryService.DTO.ListProductOptions.QueryFilter.class,
        new QueryEditor<>(
            mapper, validator, ProductOptionQueryService.DTO.ListProductOptions.QueryFilter.class));
  }

  @GetMapping("product_options")
  public List<ProductOptionQueryService.DTO.ListProductOptions.Response> listProductOptions(
      @RequestParam(name = "filter", required = false)
          ProductOptionQueryService.DTO.ListProductOptions.QueryFilter filter) {
    return optionsQueryService.listProductOptions(filter.optionName());
  }

  @GetMapping("product_options/{optionCode}/edit")
  public ProductOptionQueryService.DTO.GetProductOptionForEdit.Response getProductOptionForEdit(
      @PathVariable String optionCode) {
    return optionsQueryService.getProductOptionForEdit(optionCode);
  }

  @PostMapping("product_options")
  public ResultMessage createProductOption(
      @Valid @RequestBody ProductOptionCommandService.DTO.CreateProductOption.Request req) {
    return optionsCommandService.createProductOption(req);
  }

  @PutMapping("product_options/{optionCode}")
  public ResultMessage editProductOption(
      @PathVariable String optionCode,
      @Valid @RequestBody ProductOptionCommandService.DTO.EditProductOption.Request req) {
    return optionsCommandService.editProductOption(optionCode, req);
  }

  @DeleteMapping("product_options/{optionCode}")
  public ResultMessage deleteProductOption(@PathVariable String optionCode) {
    return optionsCommandService.deleteProductOption(optionCode);
  }

  @DeleteMapping("product_option_values/{optionValueId}")
  public ResultMessage deleteProductOptionValue(@PathVariable Integer optionValueId) {
    return optionsCommandService.deleteProductOptionValue(optionValueId);
  }
}
