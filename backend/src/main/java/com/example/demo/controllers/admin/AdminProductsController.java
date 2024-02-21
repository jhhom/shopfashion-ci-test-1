package com.example.demo.controllers.admin;

import com.example.demo.services.admin.productoptions.ProductOptionQueryService;
import com.example.demo.services.admin.products.AdminProductQueryService;
import com.example.demo.services.admin.products.ConfigurableProductService;
import com.example.demo.services.admin.products.ConfigurableProductService.DTO.GetProductConfigurableOptionsAndValues;
import com.example.demo.services.admin.products.ProductDeleteService;
import com.example.demo.services.admin.products.SimpleProductService;
import com.example.demo.services.common.Pagination;
import com.example.demo.services.common.ResultMessage;
import com.example.demo.services.store.products.StoreProductQueryService.DTO.GetOneProduct.ConfigurableProduct;
import com.example.demo.utils.QueryEditor;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.validation.Valid;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import java.io.IOException;
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
public class AdminProductsController {
  private ObjectMapper mapper;
  private final Validator validator;

  private final ProductDeleteService productDeleteService;
  private final SimpleProductService simpleProductService;
  private final ConfigurableProductService configurableProductService;
  private final AdminProductQueryService productQueryService;

  public AdminProductsController(
      ObjectMapper mapper,
      ProductDeleteService productDeleteService,
      SimpleProductService simpleProductService,
      ConfigurableProductService configurableProductService,
      AdminProductQueryService productQueryService) {
    this.mapper = mapper;
    ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
    this.validator = factory.getValidator();

    this.productDeleteService = productDeleteService;
    this.simpleProductService = simpleProductService;
    this.configurableProductService = configurableProductService;
    this.productQueryService = productQueryService;
  }

  @InitBinder
  public void initBinder(WebDataBinder binder) {
    binder.registerCustomEditor(
        AdminProductQueryService.DTO.ListProducts.Filter.class,
        new QueryEditor<>(
            mapper, validator, AdminProductQueryService.DTO.ListProducts.Filter.class));
    binder.registerCustomEditor(
        Pagination.class, new QueryEditor<>(mapper, validator, Pagination.class));
  }

  @GetMapping("products/{productId}/product_option_values")
  public ConfigurableProductService.DTO.GetProductConfigurableOptionsAndValues.Response
      getProductConfigurableOptionsAndValues(@PathVariable Integer productId) {

    var result = configurableProductService.getProductConfigurableOptionsAndValues(productId);
    return result;
  }

  @GetMapping("products/{productId}")
  public AdminProductQueryService.DTO.GetOneProduct.Response getOneProduct(
      @PathVariable Integer productId) {
    return productQueryService.getOneProduct(productId);
  }

  @GetMapping("products")
  public AdminProductQueryService.DTO.ListProducts.Response listProducts(
      @RequestParam(name = "filter", required = true)
          AdminProductQueryService.DTO.ListProducts.Filter filter,
      @RequestParam(name = "pagination", required = false) Pagination pagination) {
    return productQueryService.listProducts(filter, pagination);
  }

  @DeleteMapping("products/{productId}")
  public ResultMessage deleteOneProduct(@PathVariable Integer productId) {
    return productDeleteService.deleteOneProduct(productId);
  }

  @DeleteMapping("products")
  public ResultMessage deleteProducts(
      @Valid @RequestBody ProductDeleteService.DTO.DeleteManyProductsRequest req)
      throws IOException {
    return productDeleteService.deleteManyProducts(req.productIds());
  }

  @PostMapping("products/simple")
  public ResultMessage createSimpleProduct(
      @Valid @RequestBody SimpleProductService.DTO.CreateSimpleProduct.Request req)
      throws IOException {
    return simpleProductService.createSimpleProduct(req);
  }

  @PostMapping("products/configurable")
  public ResultMessage createConfigurableProduct(
      @Valid @RequestBody ConfigurableProductService.DTO.CreateConfigurableProduct.Request req)
      throws IOException {
    return configurableProductService.createConfigurableProduct(req);
  }

  @PutMapping("products/{productId}/simple")
  public ResultMessage editSimpleProduct(
      @PathVariable(name = "productId") Integer productId,
      @Valid @RequestBody SimpleProductService.DTO.EditSimpleProduct.Request req)
      throws IOException {
    return simpleProductService.editSimpleProduct(productId, req);
  }

  @PutMapping("products/{productId}/configurable")
  public ResultMessage editConfigurableProduct(
      @PathVariable(name = "productId") Integer productId,
      @Valid @RequestBody ConfigurableProductService.DTO.EditConfigurableProduct.Request req)
      throws IOException {
    return configurableProductService.editConfigurableProduct(productId, req);
  }
}
