package com.example.demo.services.store.products;

import static com.example.demo.jooqmodels.Tables.*;
import static org.jooq.impl.DSL.*;

import com.example.demo.jooqmodels.enums.ProductStatus;
import com.example.demo.jooqmodels.enums.ProductType;
import com.example.demo.services.admin.taxon.TaxonUtil;
import com.example.demo.services.common.MediaService;
import com.example.demo.services.common.exceptions.ResourceNotFoundException;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import org.jooq.DSLContext;
import org.springframework.stereotype.Service;

@Service
public class StoreProductQueryService {
  private final DSLContext ctx;
  private final MediaService mediaService;

  public StoreProductQueryService(DSLContext ctx, MediaService mediaService) {
    this.ctx = ctx;
    this.mediaService = mediaService;
  }

  public List<DTO.GetLatestProducts.Product> getLatestProducts() {
    return ctx.select(
            PRODUCTS.ID,
            PRODUCTS.PRODUCT_NAME,
            PRODUCTS.PRICING,
            PRODUCTS.PRODUCT_STATUS,
            PRODUCTS.PRODUCT_IMAGE_URL,
            PRODUCTS.PRODUCT_TYPE,
            coalesce(avg(PRODUCT_REVIEWS.RATING), 0),
            countDistinct(PRODUCT_REVIEWS.ORDER_ID),
            min(PRODUCT_VARIANTS.PRICING).as("minPrice"),
            max(PRODUCT_VARIANTS.PRICING).as("maxPrice"))
        .from(PRODUCTS)
        .leftJoin(PRODUCT_REVIEWS)
        .on(PRODUCTS.ID.eq(PRODUCT_REVIEWS.PRODUCT_ID))
        .leftJoin(PRODUCT_VARIANTS)
        .on(
            PRODUCT_VARIANTS
                .PRODUCT_ID
                .eq(PRODUCTS.ID)
                .and(PRODUCT_VARIANTS.PRODUCT_STATUS.notEqual(ProductStatus.ARCHIVED)))
        .groupBy(PRODUCTS.ID)
        .orderBy(PRODUCTS.CREATED_AT.desc(), PRODUCTS.PRODUCT_NAME)
        .limit(3)
        .fetch(
            v -> {
              ProductType productType = v.get(PRODUCTS.PRODUCT_TYPE);
              ProductStatus productStatus = v.get(PRODUCTS.PRODUCT_STATUS);
              String imageUrl = v.get(PRODUCTS.PRODUCT_IMAGE_URL);
              long rating = Math.round(((BigDecimal) v.value7()).doubleValue());
              int numberOfReviews = v.value8();

              BigDecimal minPrice = v.value9();
              BigDecimal maxPrice = v.value10();

              ProductPricing.Pricing pricing =
                  productType == ProductType.SIMPLE
                      ? new ProductPricing.SimpleProductPricing(v.value3())
                      : !(minPrice == null || maxPrice == null)
                          ? new ProductPricing.ConfigurableProductPricing(minPrice, maxPrice)
                          : new ProductPricing.ProductPricingUnavailable();

              imageUrl = mediaService.mediaUrl(imageUrl);

              return new DTO.GetLatestProducts.Product(
                  v.value1(),
                  imageUrl,
                  v.value2(),
                  productStatus,
                  rating,
                  numberOfReviews,
                  pricing);
            });
  }

  public DTO.GetOneProduct.Response getOneProduct(int productId) {
    var product =
        ctx.select(
                PRODUCTS.ID,
                PRODUCTS.PRODUCT_NAME,
                PRODUCTS.PRODUCT_DESCRIPTION,
                PRODUCTS.PRODUCT_TYPE,
                PRODUCTS.TAXON_ID,
                PRODUCTS.PRODUCT_STATUS,
                PRODUCTS.PRODUCT_IMAGE_URL,
                PRODUCTS.PRICING,
                coalesce(avg(PRODUCT_REVIEWS.RATING), 0),
                count(PRODUCT_REVIEWS.ORDER_ID))
            .from(PRODUCTS)
            .leftJoin(PRODUCT_REVIEWS)
            .on(PRODUCTS.ID.eq(PRODUCT_REVIEWS.PRODUCT_ID))
            .where(PRODUCTS.ID.eq(productId))
            .groupBy(PRODUCTS.ID)
            .fetchOne(
                v -> {
                  var p = new DTO.GetOneProduct.Response();
                  p.id = v.value1();
                  p.name = v.value2();
                  p.description = v.value3();
                  p.mainTaxonId = v.value5();
                  p.status = v.value6();
                  p.productImageUrl = v.value7();
                  p.rating = Math.round(((BigDecimal) v.value9()).doubleValue());
                  p.numberOfReviews = v.value10();
                  p.pricing = v.value8();

                  p.productImageUrl = mediaService.mediaUrl(p.productImageUrl);

                  return p;
                });

    if (product == null) {
      throw new ResourceNotFoundException("products");
    }

    product.first3Reviews =
        ctx.select(
                PRODUCT_REVIEWS.COMMENT,
                PRODUCT_REVIEWS.RATING,
                PRODUCT_REVIEWS.CREATED_AT,
                CUSTOMERS.EMAIL)
            .from(PRODUCT_REVIEWS)
            .join(ORDERS)
            .on(PRODUCT_REVIEWS.ORDER_ID.eq(ORDERS.ID))
            .join(CUSTOMERS)
            .on(ORDERS.CUSTOMER_ID.eq(CUSTOMERS.ID))
            .where(PRODUCT_REVIEWS.PRODUCT_ID.eq(productId))
            .orderBy(PRODUCT_REVIEWS.CREATED_AT.desc())
            .limit(3)
            .fetch(
                x -> new DTO.GetOneProduct.Review(x.value4(), x.value1(), x.value2(), x.value3()));

    var associationTypeIds =
        ctx.selectDistinct(PRODUCT_ASSOCIATION_TYPES.ID)
            .from(PRODUCT_ASSOCIATION_TYPES)
            .join(PRODUCT_ASSOCIATIONS)
            .on(PRODUCT_ASSOCIATIONS.PRODUCT_ASSOCIATION_TYPE_ID.eq(PRODUCT_ASSOCIATION_TYPES.ID))
            .where(PRODUCT_ASSOCIATIONS.PRODUCT_ID.eq(productId))
            .fetch(x -> x.value1());

    if (associationTypeIds.size() != 0) {
      product.associations =
          ctx.select(
                  PRODUCT_ASSOCIATION_TYPES.ID,
                  PRODUCT_ASSOCIATION_TYPES.TYPE_NAME,
                  multisetAgg(
                      PRODUCTS.ID,
                      PRODUCTS.PRODUCT_NAME,
                      PRODUCTS.PRODUCT_IMAGE_URL,
                      PRODUCTS.PRICING))
              .from(PRODUCT_ASSOCIATIONS)
              .join(PRODUCT_ASSOCIATION_TYPES)
              .on(PRODUCT_ASSOCIATIONS.PRODUCT_ASSOCIATION_TYPE_ID.eq(PRODUCT_ASSOCIATION_TYPES.ID))
              .join(PRODUCTS)
              .on(PRODUCTS.ID.eq(PRODUCT_ASSOCIATIONS.PRODUCT_ID))
              .where(
                  PRODUCT_ASSOCIATIONS
                      .PRODUCT_ID
                      .notEqual(productId)
                      .and(PRODUCT_ASSOCIATION_TYPES.ID.in(associationTypeIds)))
              .groupBy(PRODUCT_ASSOCIATION_TYPES.ID)
              .fetch(
                  v -> {
                    var products =
                        v.value3()
                            .map(
                                x -> {
                                  return new DTO.GetOneProduct.AssociationProduct(
                                      x.value1(),
                                      x.value2(),
                                      mediaService.mediaUrl(x.value3()),
                                      x.value4());
                                });

                    return new DTO.GetOneProduct.ResponseAssociation(
                        v.value1(), v.value2(), products);
                  });
    } else {
      product.associations = new ArrayList<>();
    }

    product.productTaxonIds =
        ctx.select(PRODUCT_TAXONS.TAXON_ID)
            .from(PRODUCT_TAXONS)
            .where(PRODUCT_TAXONS.PRODUCT_ID.eq(productId))
            .fetch(v -> v.value1());

    if (product.productType == ProductType.SIMPLE) {
      product.product = new DTO.GetOneProduct.SimpleProduct(product.pricing);
    } else {
      var productOptions =
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
              .orderBy(PRODUCT_OPTIONS.POSITION.asc())
              .fetch(
                  v -> {
                    List<DTO.GetOneProduct.ProductOptionValue> values =
                        v.value3()
                            .map(
                                x ->
                                    new DTO.GetOneProduct.ProductOptionValue(
                                        x.value1(), x.value2()));

                    return new DTO.GetOneProduct.ProductOption(v.value1(), v.value2(), values);
                  });

      var variants =
          ctx.select(
                  PRODUCT_VARIANTS.ID,
                  PRODUCT_VARIANTS.PRICING,
                  PRODUCT_VARIANTS.PRODUCT_STATUS,
                  multisetAgg(
                      PRODUCT_OPTION_VALUES.OPTION_CODE,
                      PRODUCT_VARIANT_OPTIONS.PRODUCT_OPTION_VALUE_ID))
              .from(PRODUCT_VARIANTS)
              .join(PRODUCT_VARIANT_OPTIONS)
              .on(PRODUCT_VARIANT_OPTIONS.PRODUCT_VARIANT_ID.eq(PRODUCT_VARIANTS.ID))
              .join(PRODUCT_OPTION_VALUES)
              .on(PRODUCT_OPTION_VALUES.ID.eq(PRODUCT_VARIANT_OPTIONS.PRODUCT_OPTION_VALUE_ID))
              .where(
                  and(
                      PRODUCT_VARIANTS.PRODUCT_STATUS.notEqual(ProductStatus.ARCHIVED),
                      PRODUCT_VARIANTS.PRODUCT_ID.eq(productId)))
              .groupBy(PRODUCT_VARIANTS.ID)
              .fetch(
                  v -> {
                    var optionValues =
                        v.value4()
                            .map(
                                x ->
                                    new DTO.GetOneProduct.VariantOptionValue(
                                        x.value1(), x.value2()));

                    return new DTO.GetOneProduct.ProductVariant(
                        v.value1(), optionValues, v.value3(), null, v.value2());
                  });
      product.product = new DTO.GetOneProduct.ConfigurableProduct(variants, productOptions);
    }

    return product;
  }

  public DTO.ListProductsByTaxonSlug.Response listProductsByTaxonSlug(
      DSLContext ctx, String taxonSlug, DTO.ListProductsByTaxonSlug.Query query) {
    var taxonItems =
        ctx.select(TAXONS.ID, TAXONS.PARENT_ID, TAXONS.TAXON_NAME, TAXONS.SLUG)
            .from(TAXONS)
            .fetch(
                x -> {
                  return new TaxonUtil.DTO.Item(x.value1(), x.value3(), x.value4(), x.value2());
                });

    var nodes = TaxonUtil.buildTree(taxonItems);

    var taxon = TaxonUtil.findTaxonWithMatchingSlugFromTree(nodes, taxonSlug);
    if (taxon.isEmpty()) {
      throw new ResourceNotFoundException("taxon");
    }

    System.out.println("SORT ORDER '" + query.sortPriceOrder + "'");

    var productsWithMatchingMainTaxonQuery =
        ctx.select(
                PRODUCTS.ID,
                PRODUCTS.PRODUCT_NAME,
                PRODUCTS.PRICING,
                PRODUCTS.PRODUCT_STATUS,
                PRODUCTS.PRODUCT_IMAGE_URL,
                PRODUCTS.PRODUCT_TYPE,
                coalesce(avg(PRODUCT_REVIEWS.RATING), 0),
                countDistinct(PRODUCT_REVIEWS.ORDER_ID),
                min(PRODUCT_VARIANTS.PRICING).as("min_price"),
                max(PRODUCT_VARIANTS.PRICING).as("max_price"))
            .from(PRODUCTS)
            .leftJoin(PRODUCT_REVIEWS)
            .on(PRODUCTS.ID.eq(PRODUCT_REVIEWS.PRODUCT_ID))
            .leftJoin(PRODUCT_VARIANTS)
            .on(
                and(
                    PRODUCT_VARIANTS.PRODUCT_ID.eq(PRODUCTS.ID),
                    PRODUCT_VARIANTS.PRODUCT_STATUS.notEqual(ProductStatus.ARCHIVED)))
            .where(
                and(
                    PRODUCTS.TAXON_ID.eq(taxon.get().id),
                    PRODUCTS.PRODUCT_STATUS.notEqual(ProductStatus.ARCHIVED)));

    if (query.minPrice != null) {
      productsWithMatchingMainTaxonQuery.and(PRODUCTS.PRICING.greaterOrEqual(query.minPrice));
    }
    if (query.maxPrice != null) {
      productsWithMatchingMainTaxonQuery.and(PRODUCTS.PRICING.lessOrEqual(query.maxPrice));
    }

    var productsWithMatchingMainTaxon =
        productsWithMatchingMainTaxonQuery
            .groupBy(PRODUCTS.ID)
            .fetch(
                v -> {
                  var productType = v.value6();
                  var product = new DTO.ListProductsByTaxonSlug.Product();

                  product.id = v.value1();
                  product.name = v.value2();
                  product.imgUrl = mediaService.mediaUrl(v.value5());
                  product.status = v.value4();
                  product.rating = Math.round(((BigDecimal) v.value7()).doubleValue());
                  product.numberOfReviews = v.value8();

                  if (productType == ProductType.SIMPLE) {
                    product.pricing = new ProductPricing.SimpleProductPricing(v.value3());
                    product.sortPrice = v.value3();
                  } else if (v.value10() == null || v.value9() == null) {
                    product.pricing = new ProductPricing.ProductPricingUnavailable();
                    product.sortPrice = BigDecimal.ZERO;
                  } else {
                    var pricing =
                        new ProductPricing.ConfigurableProductPricing(v.value9(), v.value10());
                    product.pricing = pricing;
                    product.sortPrice = pricing.maxPrice;
                  }

                  return product;
                });

    var productsWithMatchingTaxonQuery =
        ctx.select(
                PRODUCTS.ID,
                PRODUCTS.PRODUCT_NAME,
                PRODUCTS.PRICING,
                PRODUCTS.PRODUCT_STATUS,
                PRODUCTS.PRODUCT_IMAGE_URL,
                PRODUCTS.PRODUCT_TYPE,
                coalesce(avg(PRODUCT_REVIEWS.RATING), 0),
                countDistinct(PRODUCT_REVIEWS.ORDER_ID),
                min(PRODUCT_VARIANTS.PRICING).as("min_price"),
                max(PRODUCT_VARIANTS.PRICING).as("max_price"))
            .from(PRODUCTS)
            .leftJoin(PRODUCT_REVIEWS)
            .on(PRODUCTS.ID.eq(PRODUCT_REVIEWS.PRODUCT_ID))
            .leftJoin(PRODUCT_VARIANTS)
            .on(
                and(
                    PRODUCT_VARIANTS.PRODUCT_ID.eq(PRODUCTS.ID),
                    PRODUCT_VARIANTS.PRODUCT_STATUS.notEqual(ProductStatus.ARCHIVED)))
            .join(PRODUCT_TAXONS)
            .on(PRODUCT_TAXONS.PRODUCT_ID.eq(PRODUCTS.ID))
            .where(
                and(
                    PRODUCT_TAXONS.TAXON_ID.eq(taxon.get().id),
                    PRODUCTS.PRODUCT_STATUS.notEqual(ProductStatus.ARCHIVED)));

    if (productsWithMatchingMainTaxon.size() > 0) {
      productsWithMatchingTaxonQuery.and(
          PRODUCTS.ID.notIn(productsWithMatchingMainTaxon.stream().map(x -> x.id).toList()));
    }

    if (query.minPrice != null) {
      productsWithMatchingTaxonQuery.having(
          min(PRODUCT_VARIANTS.PRICING).greaterOrEqual(query.minPrice));
    }
    if (query.maxPrice != null) {
      productsWithMatchingTaxonQuery.having(
          max(PRODUCT_VARIANTS.PRICING).lessOrEqual(query.maxPrice));
    }
    productsWithMatchingTaxonQuery.groupBy(PRODUCTS.ID);

    List<DTO.ListProductsByTaxonSlug.Product> productsWithMatchingTaxon =
        productsWithMatchingTaxonQuery
            .fetch()
            .map(
                v -> {
                  var productType = v.value6();
                  var product = new DTO.ListProductsByTaxonSlug.Product();

                  product.id = v.value1();
                  product.name = v.value2();
                  product.imgUrl = mediaService.mediaUrl(v.value5());
                  product.status = v.value4();
                  product.rating = Math.round(((BigDecimal) v.value7()).doubleValue());
                  product.numberOfReviews = v.value8();

                  if (productType == ProductType.SIMPLE) {
                    product.pricing = new ProductPricing.SimpleProductPricing(v.value3());
                    product.sortPrice = v.value3();
                  } else if (v.value10() == null || v.value9() == null) {
                    product.pricing = new ProductPricing.ProductPricingUnavailable();
                    product.sortPrice = BigDecimal.ZERO;
                  } else {
                    ProductPricing.ConfigurableProductPricing pricing =
                        new ProductPricing.ConfigurableProductPricing(v.value9(), v.value10());
                    product.pricing = pricing;
                    product.sortPrice = pricing.maxPrice;
                  }

                  return product;
                });

    List<DTO.ListProductsByTaxonSlug.Product> products = productsWithMatchingMainTaxon;
    products.addAll(productsWithMatchingTaxon);

    if (query.sortPriceOrder != null) {
      if (query.sortPriceOrder == DTO.ListProductsByTaxonSlug.SortPriceOrder.asc) {
        products =
            products.stream()
                .sorted(
                    (a, b) ->
                        a.sortPrice
                            .subtract(b.sortPrice)
                            // multiply by 100 to convert Ringgit to cents. E.g RM 1.25 becomes 125
                            // cents.
                            .multiply(BigDecimal.valueOf(100))
                            .intValue())
                .toList();
      } else {
        products =
            products.stream()
                .sorted(
                    (a, b) ->
                        b.sortPrice
                            .subtract(a.sortPrice)
                            // multiply by 100 to convert Ringgit to cents. E.g RM 1.25 becomes 125
                            // cents.
                            .multiply(BigDecimal.valueOf(100))
                            .intValue())
                .toList();
      }
    }

    return new DTO.ListProductsByTaxonSlug.Response(taxon.get().taxonName, products);
  }

  public static class DTO {
    public static class GetLatestProducts {
      public static record Product(
          int id,
          String imgUrl,
          String name,
          ProductStatus status,
          long rating,
          int numberOfReviews,
          ProductPricing.Pricing pricing) {}
    }

    public static class GetOneProduct {
      public static class Response {
        public int id;
        public String name;
        public String description;
        public Integer mainTaxonId;
        public List<Integer> productTaxonIds;
        public ProductStatus status;
        public List<ResponseAssociation> associations;
        public String productImageUrl;
        public long rating;
        public int numberOfReviews;
        public List<Review> first3Reviews;
        public Product product;

        private BigDecimal pricing;
        private ProductType productType;
      }

      public abstract static sealed class Product permits SimpleProduct, ConfigurableProduct {
        public String type;

        public Product(String type) {
          this.type = type;
        }
      }

      public static final class SimpleProduct extends Product {
        public BigDecimal pricing;

        public SimpleProduct(BigDecimal pricing) {
          super("SIMPLE");
          this.pricing = pricing;
        }
      }

      public static final class ConfigurableProduct extends Product {
        public List<ProductVariant> variants;
        public List<ProductOption> productOptions;

        public ConfigurableProduct(
            List<ProductVariant> variants, List<ProductOption> productOptions) {
          super("CONFIGURABLE");
          this.variants = variants;
          this.productOptions = productOptions;
        }
      }

      public static record ResponseAssociation(
          int id, String name, List<AssociationProduct> otherProducts) {}

      public static record AssociationProduct(
          int id, String name, String imgUrl, BigDecimal pricing) {}

      public static record Review(
          String customerEmail, String comment, int rating, LocalDateTime createdAt) {}

      public static record ProductVariant(
          int id,
          List<VariantOptionValue> optionValues,
          ProductStatus status,
          String imgUrl,
          BigDecimal pricing) {}

      public static record VariantOptionValue(String optionCode, int optionValueId) {}

      public static record ProductOption(
          String code, String name, List<ProductOptionValue> values) {}

      public static record ProductOptionValue(int id, String value) {}
    }

    public static class ListProductsByTaxonSlug {
      public static class Response {
        public String taxonName;
        public List<Product> products;

        public Response(String taxonName, List<Product> products) {
          this.taxonName = taxonName;
          this.products = products;
        }
      }

      public static enum SortPriceOrder {
        asc,
        desc
      }

      public static record Query(
          BigDecimal minPrice, BigDecimal maxPrice, SortPriceOrder sortPriceOrder) {}

      public static class Product {
        public Integer id;
        public String imgUrl;
        public String name;
        public ProductStatus status;
        public long rating;
        public Integer numberOfReviews;
        public ProductPricing.Pricing pricing;

        public BigDecimal sortPrice;
      }
    }
  }
}
