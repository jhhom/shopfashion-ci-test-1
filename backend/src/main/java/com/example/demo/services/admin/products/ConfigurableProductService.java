package com.example.demo.services.admin.products;

import static com.example.demo.jooqmodels.Tables.*;
import static org.jooq.impl.DSL.*;

import com.example.demo.jooqmodels.enums.ProductStatus;
import com.example.demo.jooqmodels.enums.ProductType;
import com.example.demo.services.common.MediaService;
import com.example.demo.services.common.ResultMessage;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.io.IOException;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import lombok.Getter;
import org.jooq.DSLContext;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ConfigurableProductService {
  private final DSLContext ctx;
  private final MediaService mediaService;

  public ConfigurableProductService(DSLContext ctx, MediaService mediaService) {
    this.ctx = ctx;
    this.mediaService = mediaService;
  }

  @Transactional
  public ResultMessage createConfigurableProduct(DTO.CreateConfigurableProduct.Request req)
      throws IOException {
    String productImageKey = null;

    if (req.imageBase64 != null) {
      Optional<String> fileExtension = MediaService.extractFileExtensionFromBase64(req.imageBase64);
      var savedMedia =
          mediaService.saveMedia(
              MediaService.productImageFilename(req.name, fileExtension), req.imageBase64);

      productImageKey = savedMedia.left.toString();
    }

    final String savedImageKey = productImageKey;

    Integer productId =
        ctx.insertInto(PRODUCTS)
            .columns(
                PRODUCTS.PRODUCT_NAME,
                PRODUCTS.PRODUCT_DESCRIPTION,
                PRODUCTS.PRICING,
                PRODUCTS.PRODUCT_TYPE,
                PRODUCTS.TAXON_ID,
                PRODUCTS.PRODUCT_STATUS,
                PRODUCTS.PRODUCT_IMAGE_URL)
            .values(
                req.name,
                req.description,
                BigDecimal.ZERO,
                ProductType.CONFIGURABLE,
                req.mainTaxonId,
                req.status,
                savedImageKey)
            .returning(PRODUCTS.ID)
            .fetchOne()
            .getId();
    if (req.productOptionCodes.size() != 0) {
      var query =
          ctx.insertInto(PRODUCT_CONFIGURABLE_OPTIONS)
              .columns(
                  PRODUCT_CONFIGURABLE_OPTIONS.PRODUCT_OPTION_CODE,
                  PRODUCT_CONFIGURABLE_OPTIONS.PRODUCT_ID);
      for (var c : req.productOptionCodes) {
        query.values(c, productId);
      }
      query.execute();
    }

    if (req.productTaxonIds.size() != 0) {
      var query =
          ctx.insertInto(PRODUCT_TAXONS)
              .columns(PRODUCT_TAXONS.PRODUCT_ID, PRODUCT_TAXONS.TAXON_ID);
      for (var c : req.productTaxonIds) {
        query.values(productId, c);
      }
      query.execute();
    }

    if (req.productAssociations.size() != 0) {
      var query =
          ctx.insertInto(PRODUCT_ASSOCIATIONS)
              .columns(
                  PRODUCT_ASSOCIATIONS.PRODUCT_ASSOCIATION_TYPE_ID,
                  PRODUCT_ASSOCIATIONS.PRODUCT_ID);
      for (var a : req.productAssociations) {
        query.values(a, productId);
      }
      query.execute();
    }

    return new ResultMessage("Product created successfully");
  }

  @Transactional
  public ResultMessage editConfigurableProduct(
      int productId, DTO.EditConfigurableProduct.Request req) throws IOException {

    String productImageKey = null;

    if (req.imageBase64 == null && req.removeImage) {
      String currentKey =
          ctx.select(PRODUCTS.PRODUCT_IMAGE_URL)
              .from(PRODUCTS)
              .where(PRODUCTS.ID.eq(productId))
              .fetchOne(x -> x.value1());

      if (currentKey != null) {
        mediaService.removeFile(currentKey);
      }
    } else if (req.imageBase64 != null) {
      Optional<String> fileExtension = MediaService.extractFileExtensionFromBase64(req.imageBase64);
      var savedMedia =
          mediaService.saveMedia(
              MediaService.productImageFilename(req.name, fileExtension), req.imageBase64);

      productImageKey = savedMedia.left.toString();
    }

    var updateQuery =
        ctx.update(PRODUCTS)
            .set(PRODUCTS.PRODUCT_NAME, req.name)
            .set(PRODUCTS.PRODUCT_DESCRIPTION, req.description)
            .set(PRODUCTS.TAXON_ID, req.mainTaxonId)
            .set(PRODUCTS.PRODUCT_STATUS, req.status);

    if (req.imageBase64 == null && req.removeImage) {
      updateQuery.set(PRODUCTS.PRODUCT_IMAGE_URL, (String) null);
    } else if (productImageKey != null) {
      updateQuery.set(PRODUCTS.PRODUCT_IMAGE_URL, productImageKey);
    }

    updateQuery
        .where(and(PRODUCTS.ID.eq(productId), PRODUCTS.PRODUCT_TYPE.eq(ProductType.CONFIGURABLE)))
        .execute();

    ctx.delete(PRODUCT_TAXONS).where(PRODUCT_TAXONS.PRODUCT_ID.eq(productId)).execute();

    if (req.status == ProductStatus.ARCHIVED) {
      ctx.delete(CUSTOMER_CART_CONFIGURABLE_ITEMS)
          .where(
              CUSTOMER_CART_CONFIGURABLE_ITEMS.PRODUCT_VARIANT_ID.in(
                  ctx.select(PRODUCT_VARIANTS.ID)
                      .from(PRODUCT_VARIANTS)
                      .where(PRODUCT_VARIANTS.PRODUCT_ID.eq(productId))))
          .execute();
    }

    if (req.productTaxonIds.size() > 0) {

      var batch =
          ctx.batch(
              ctx.insertInto(PRODUCT_TAXONS, PRODUCT_TAXONS.PRODUCT_ID, PRODUCT_TAXONS.TAXON_ID)
                  .values((Integer) null, null));

      for (var taxonId : req.productTaxonIds) {
        batch.bind(productId, taxonId);
      }

      batch.execute();
    }

    ctx.delete(PRODUCT_ASSOCIATIONS).where(PRODUCT_ASSOCIATIONS.PRODUCT_ID.eq(productId)).execute();

    System.out.println("🔥 1 UPDATE PRODUCT ASSOCIATIONS");

    if (req.productAssociations.size() != 0) {
      var batch =
          ctx.batch(
                  ctx.insertInto(
                      PRODUCT_ASSOCIATIONS,
                      PRODUCT_ASSOCIATIONS.PRODUCT_ID,
                      PRODUCT_ASSOCIATIONS.PRODUCT_ASSOCIATION_TYPE_ID).values((Integer) null, null))
              ;

      for (var associationId : req.productAssociations) {
        System.out.println("BIND PRODUCT ID: " + productId + ", ASSC ID: " + associationId);
        batch.bind(productId, associationId);
        System.out.println("BIND??");
      }
      try {
        System.out.println("✅ SQL: " + batch);
      } catch (RuntimeException ex) {
        System.out.println("PRINT EXCEPTION: " + ex);
        throw ex;
      }
      batch.execute();
    }

    System.out.println("🔥 2 UPDATE PRODUCT ASSCS COMPLETE");

    return new ResultMessage("Product updated successfully");
  }

  public DTO.GetProductConfigurableOptionsAndValues.Response getProductConfigurableOptionsAndValues(
      int productId) {
    var options =
        ctx.select(
                PRODUCT_OPTIONS.CODE,
                PRODUCT_OPTIONS.OPTION_NAME,
                multisetAgg(PRODUCT_OPTION_VALUES.ID, PRODUCT_OPTION_VALUES.OPTION_VALUE))
            .from(PRODUCT_CONFIGURABLE_OPTIONS)
            .join(PRODUCT_OPTIONS)
            .on(PRODUCT_OPTIONS.CODE.eq(PRODUCT_CONFIGURABLE_OPTIONS.PRODUCT_OPTION_CODE))
            .join(PRODUCT_OPTION_VALUES)
            .on(PRODUCT_OPTION_VALUES.OPTION_CODE.eq(PRODUCT_OPTIONS.CODE))
            .where(PRODUCT_CONFIGURABLE_OPTIONS.PRODUCT_ID.eq(productId))
            .groupBy(PRODUCT_OPTIONS.CODE)
            .fetch(
                x -> {
                  DTO.GetProductConfigurableOptionsAndValues.Option o =
                      new DTO.GetProductConfigurableOptionsAndValues.Option();
                  o.optionCode = x.value1();
                  o.optionName = x.value2();
                  o.optionValues =
                      x.value3().stream()
                          .map(
                              v ->
                                  new DTO.GetProductConfigurableOptionsAndValues.OptionValue(
                                      v.value1(), v.value2()))
                          .toList();
                  return o;
                });

    String productName =
        ctx.select(PRODUCTS.PRODUCT_NAME)
            .from(PRODUCTS)
            .where(PRODUCTS.ID.eq(productId))
            .fetchOne(x -> x.value1());

    return new DTO.GetProductConfigurableOptionsAndValues.Response(productName, options);
  }

  public static class DTO {
    public static class CreateConfigurableProduct {
      @Getter
      public static class Request {
        @NotNull public String name;
        @NotNull public String description;
        @NotNull public Integer mainTaxonId;

        @NotNull
        @NotEmpty(message = "There must be at least one product option for a configurable product")
        public List<String> productOptionCodes;

        @NotNull public List<Integer> productTaxonIds;
        @NotNull public List<Integer> productAssociations;
        @NotNull public ProductStatus status;

        public String imageBase64;
      }
    }

    public static class EditConfigurableProduct {
      @Getter
      public static class Request {
        @NotNull public String name;
        @NotNull public String description;
        @NotNull public int mainTaxonId;
        @NotNull public List<Integer> productTaxonIds;
        @NotNull public List<Integer> productAssociations;
        @NotNull public ProductStatus status;

        public String imageBase64;

        public boolean removeImage;
      }
    }

    public static class GetProductConfigurableOptionsAndValues {

      public static record Response(String productName, List<Option> configurableOptions) {}

      public static class Option {

        public String optionCode;
        public String optionName;
        public List<OptionValue> optionValues;
      }

      public static class OptionValue {

        public int id;
        public String value;

        public OptionValue(int id, String value) {
          this.id = id;
          this.value = value;
        }
      }
    }
  }
}
