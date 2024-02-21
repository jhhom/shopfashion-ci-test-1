package com.example.demo.controllers.admin;

import com.example.demo.services.admin.generateproductvariant.GenerateProductVariantService;
import com.example.demo.services.admin.productvariants.ProductVariantCommandService;
import com.example.demo.services.admin.productvariants.ProductVariantQueryService;
import com.example.demo.services.common.Pagination;
import com.example.demo.services.common.ResultMessage;
import com.example.demo.utils.QueryEditor;
import com.fasterxml.jackson.core.JsonProcessingException;
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
public class ProductVariantsController {
  private ObjectMapper mapper;
  private final Validator validator;

  private final ProductVariantCommandService variantCommandService;
  private final ProductVariantQueryService variantQueryService;
  private final GenerateProductVariantService generateVariantService;

  public ProductVariantsController(
      ObjectMapper mapper,
      ProductVariantCommandService variantCommandService,
      ProductVariantQueryService variantQueryService,
      GenerateProductVariantService generateProductVariantService) {
    this.mapper = mapper;
    ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
    this.validator = factory.getValidator();
    this.variantCommandService = variantCommandService;
    this.variantQueryService = variantQueryService;
    this.generateVariantService = generateProductVariantService;
  }

  @InitBinder
  public void initBinder(WebDataBinder binder) {
    binder.registerCustomEditor(
        ProductVariantQueryService.DTO.ListProductVariants.QueryFilter.class,
        new QueryEditor<>(
            mapper,
            validator,
            ProductVariantQueryService.DTO.ListProductVariants.QueryFilter.class));
  }

  @GetMapping("product_variants/{productVariantId}/edit")
  public ProductVariantQueryService.DTO.GetProductVariantForEdit.Response getProductVariantForEdit(
      @PathVariable Integer productVariantId) {
    return variantQueryService.getProductVariantForEdit(productVariantId);
  }

  @PostMapping("product_variants")
  public ResultMessage createProductVariant(
      @Valid @RequestBody ProductVariantCommandService.DTO.CreateProductVariant.Request req) {
    return variantCommandService.createProductVariant(req);
  }

  @PutMapping("product_variants/{productVariantId}")
  public ResultMessage editProductVariant(
      @PathVariable Integer productVariantId,
      @Valid @RequestBody ProductVariantCommandService.DTO.EditProductVariant.Request req) {
    return variantCommandService.editProductVariant(productVariantId, req);
  }

  @DeleteMapping("product_variants/{productVariantId}")
  public ResultMessage deleteProductVariant(@PathVariable Integer productVariantId) {
    return variantCommandService.deleteProductVariant(productVariantId);
  }

  @GetMapping("products/{productId}/product_variants")
  public ProductVariantQueryService.DTO.ListProductVariants.Response listProductVariants(
      @PathVariable Integer productId,
      @RequestParam(name = "filter", required = false)
          ProductVariantQueryService.DTO.ListProductVariants.QueryFilter filter) {
    return variantQueryService.listProductVariants(filter.variantName(), productId);
  }

  @GetMapping("products/{productId}/product_variants/generate")
  public GenerateProductVariantService.DTO.GenerateProductVariant.Result generateProductVariants(
      @PathVariable Integer productId) throws JsonProcessingException {
    try {
      return generateVariantService.generateProductVariant(productId);
    } catch (JsonProcessingException ex) {
      throw ex;
    }
  }

  @PostMapping("products/{productId}/product_variants/generate")
  public ResultMessage saveGeneratedProductVariants(
      @PathVariable Integer productId,
      @Valid @RequestBody
          GenerateProductVariantService.DTO.SaveGeneratedProductVariant.Request request) {
    return generateVariantService.saveGeneratedProductVariant(
        productId, request.existingProductVariants(), request.generatedProductVariants());
  }
}
