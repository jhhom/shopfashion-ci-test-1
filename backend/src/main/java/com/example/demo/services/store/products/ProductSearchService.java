package com.example.demo.services.store.products;

import static com.example.demo.jooqmodels.Tables.*;
import static org.jooq.impl.DSL.*;

import com.example.demo.jooqmodels.enums.ProductStatus;
import com.example.demo.jooqmodels.enums.ProductType;
import com.example.demo.services.common.MediaService;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import org.jooq.DSLContext;
import org.springframework.stereotype.Service;

@Service
public class ProductSearchService {
  private final DSLContext ctx;
  private final MediaService mediaService;

  public ProductSearchService(DSLContext ctx, MediaService mediaService) {
    this.ctx = ctx;
    this.mediaService = mediaService;
  }

  public DTO.SearchProductAutocomplete.Response searchProductAutocomplete(String searchTerm) {
    if (searchTerm.equals("")) {
      return new DTO.SearchProductAutocomplete.Response(new ArrayList<>());
    }

    List<String> productNames =
        List.copyOf(
            new HashSet<String>(
                ctx.select(PRODUCTS.PRODUCT_NAME)
                    .from(PRODUCTS)
                    .where(
                        and(
                            PRODUCTS.PRODUCT_NAME.likeIgnoreCase("%" + searchTerm + "%"),
                            PRODUCTS.PRODUCT_STATUS.notEqual(ProductStatus.ARCHIVED)))
                    .orderBy(PRODUCTS.PRODUCT_NAME)
                    .fetch(x -> x.value1())));

    return new DTO.SearchProductAutocomplete.Response(productNames);
  }

  public List<DTO.SearchProducts.Product> searchProducts(String searchTerm) {
    return ctx.select(
            PRODUCTS.ID,
            PRODUCTS.PRODUCT_NAME,
            PRODUCTS.PRICING,
            PRODUCTS.PRODUCT_STATUS,
            PRODUCTS.PRODUCT_IMAGE_URL,
            PRODUCTS.PRODUCT_TYPE,
            coalesce(avg(PRODUCT_REVIEWS.RATING), 0),
            count(PRODUCT_REVIEWS.ORDER_ID),
            min(PRODUCT_VARIANTS.PRICING),
            max(PRODUCT_VARIANTS.PRICING))
        .from(PRODUCTS)
        .leftJoin(PRODUCT_REVIEWS)
        .on(PRODUCTS.ID.eq(PRODUCT_REVIEWS.PRODUCT_ID))
        .leftJoin(PRODUCT_VARIANTS)
        .on(
            PRODUCT_VARIANTS
                .PRODUCT_ID
                .eq(PRODUCTS.ID)
                .and(PRODUCT_VARIANTS.PRODUCT_STATUS.notEqual(ProductStatus.ARCHIVED)))
        .where(
            and(
                PRODUCTS.PRODUCT_NAME.likeIgnoreCase("%" + searchTerm + "%"),
                PRODUCTS.PRODUCT_STATUS.notEqual(ProductStatus.ARCHIVED)))
        .groupBy(PRODUCTS.ID)
        .orderBy(PRODUCTS.PRODUCT_NAME)
        .fetch(
            v -> {
              var productType = v.value6();
              var p = new DTO.SearchProducts.Product();
              p.id = v.value1();
              p.imgUrl = mediaService.mediaUrl(v.value5());
              p.name = v.value2();
              p.status = v.value4();
              p.numberOfReviews = v.value8();
              p.rating = Math.round(((BigDecimal) v.value7()).doubleValue());

              var minPrice = v.value9();
              var maxPrice = v.value10();

              if (productType == ProductType.SIMPLE) {
                p.pricing = new ProductPricing.SimpleProductPricing(v.value3());
              } else if (minPrice == null || maxPrice == null) {
                p.pricing = new ProductPricing.ProductPricingUnavailable();
              } else {
                p.pricing = new ProductPricing.ConfigurableProductPricing(v.value9(), v.value10());
              }

              return p;
            });
  }

  public static class DTO {
    public static class SearchProductAutocomplete {
      public static record Response(List<String> productNames) {}
    }

    public static class SearchProducts {
      public static class Product {
        public int id;
        public String imgUrl;
        public String name;
        public ProductStatus status;
        public long rating;
        public int numberOfReviews;
        public ProductPricing.Pricing pricing;
      }
    }
  }
}
