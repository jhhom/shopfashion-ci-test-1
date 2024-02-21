package com.example.demo.services.admin.products;

import static com.example.demo.jooqmodels.Tables.*;
import static org.jooq.impl.DSL.*;

import com.example.demo.jooqmodels.enums.ProductStatus;
import com.example.demo.jooqmodels.enums.ProductType;
import com.example.demo.services.common.MediaService;
import com.example.demo.services.common.ResultMessage;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.io.IOException;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import lombok.Getter;
import org.jooq.DSLContext;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SimpleProductService {
  private final DSLContext ctx;
  private final MediaService mediaService;

  public SimpleProductService(DSLContext ctx, MediaService mediaService) {
    this.ctx = ctx;
    this.mediaService = mediaService;
  }

  @Transactional
  public ResultMessage createSimpleProduct(DTO.CreateSimpleProduct.Request req) throws IOException {

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
                req.pricing,
                ProductType.SIMPLE,
                req.mainTaxonId,
                req.status,
                savedImageKey)
            .returning(PRODUCTS.ID)
            .fetchOne()
            .getId();

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
  public ResultMessage editSimpleProduct(int productId, DTO.EditSimpleProduct.Request req)
      throws IOException {

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
            .set(PRODUCTS.PRICING, req.pricing)
            .set(PRODUCTS.TAXON_ID, req.mainTaxonId)
            .set(PRODUCTS.PRODUCT_STATUS, req.status);

    if (req.imageBase64 == null && req.removeImage) {
      updateQuery.set(PRODUCTS.PRODUCT_IMAGE_URL, (String) null);
    } else if (productImageKey != null) {
      updateQuery.set(PRODUCTS.PRODUCT_IMAGE_URL, productImageKey);
    }

    updateQuery
        .where(and(PRODUCTS.ID.eq(productId), PRODUCTS.PRODUCT_TYPE.eq(ProductType.SIMPLE)))
        .execute();

    if (req.status == ProductStatus.ARCHIVED) {
      ctx.delete(CUSTOMER_CART_SIMPLE_ITEMS)
          .where(CUSTOMER_CART_SIMPLE_ITEMS.PRODUCT_ID.eq(productId))
          .execute();
    }

    ctx.delete(PRODUCT_TAXONS).where(PRODUCT_TAXONS.PRODUCT_ID.eq(productId)).execute();

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

    if (req.productAssociations.size() != 0) {
      var batch =
          ctx.batch(
              ctx.insertInto(
                      PRODUCT_ASSOCIATIONS,
                      PRODUCT_ASSOCIATIONS.PRODUCT_ID,
                      PRODUCT_ASSOCIATIONS.PRODUCT_ASSOCIATION_TYPE_ID)
                  .values((Integer) null, null));

      for (var associationId : req.productAssociations) {
        batch.bind(productId, associationId);
      }
      batch.execute();
    }

    return new ResultMessage("Product updated successfully");
  }

  public static class DTO {

    public static class CreateSimpleProduct {
      @Getter
      public static class Request {

        @NotNull public String name;
        @NotNull public String description;
        @NotNull public BigDecimal pricing;
        @NotNull @Positive public Integer mainTaxonId;
        @NotNull public List<Integer> productTaxonIds;
        @NotNull public List<Integer> productAssociations;
        @NotNull public ProductStatus status;

        String imageBase64;
      }
    }

    public static class EditSimpleProduct {
      @Getter
      public static class Request {
        @NotNull public String name;
        @NotNull public String description;

        @NotNull
        @Positive(message = "Pricing must be 0 or positive")
        public BigDecimal pricing;

        @NotNull public int mainTaxonId;
        @NotNull public List<Integer> productTaxonIds;
        @NotNull public List<Integer> productAssociations;
        @NotNull public ProductStatus status;

        public String imageBase64;

        public boolean removeImage;
      }
    }
  }
}
