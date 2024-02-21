package com.example.demo.controllers.admin;

import com.example.demo.services.admin.ProductAssociationTypesService;
import com.example.demo.services.common.Pagination;
import com.example.demo.services.common.ResultMessage;
import com.example.demo.utils.QueryEditor;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.validation.Valid;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
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
public class ProductAssociationsController {
  private ObjectMapper mapper;
  private final Validator validator;

  private final ProductAssociationTypesService productAssociationTypesService;

  public ProductAssociationsController(
      ObjectMapper mapper, ProductAssociationTypesService productAssociationTypesService) {
    this.mapper = mapper;
    ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
    this.validator = factory.getValidator();
    this.productAssociationTypesService = productAssociationTypesService;
  }

  @InitBinder
  public void initBinder(WebDataBinder binder) {
    binder.registerCustomEditor(
        ProductAssociationTypesService.DTO.ListProductAssociationTypes.QueryFilter.class,
        new QueryEditor<>(
            mapper,
            validator,
            ProductAssociationTypesService.DTO.ListProductAssociationTypes.QueryFilter.class));
  }

  @GetMapping("product_association_types")
  public ProductAssociationTypesService.DTO.ListProductAssociationTypes.Result listAssociationTypes(
      @RequestParam(name = "filter", required = true)
          ProductAssociationTypesService.DTO.ListProductAssociationTypes.QueryFilter filter) {
    return productAssociationTypesService.listProductAssociationTypes(filter);
  }

  @GetMapping("product_association_types/{associationTypeId}")
  public ProductAssociationTypesService.DTO.GetOneProductAssociationType.Result
      getOneProductAssociationType(@PathVariable Integer associationTypeId) {
    return productAssociationTypesService.getOneProductAssociationType(associationTypeId);
  }

  @PostMapping("product_association_types")
  public ResultMessage createProductAssociationType(
      @Valid @RequestBody
          ProductAssociationTypesService.DTO.CreateProductAssociationType.Request req) {
    return productAssociationTypesService.createProductAssociationType(req);
  }

  @PutMapping("product_association_types/{associationTypeId}")
  public ResultMessage editProductAssociationType(
      @PathVariable Integer associationTypeId,
      @Valid @RequestBody
          ProductAssociationTypesService.DTO.CreateProductAssociationType.Request req) {
    return productAssociationTypesService.editProductAssociationType(associationTypeId, req);
  }

  @DeleteMapping("product_association_types/{associationTypeId}")
  public ResultMessage deleteProductAssociationType(@PathVariable Integer associationTypeId) {
    return productAssociationTypesService.deleteProductAssociationType(associationTypeId);
  }
}
