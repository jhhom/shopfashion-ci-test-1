package com.example.demo.services.admin.products;

import static com.example.demo.jooqmodels.Tables.*;
import static org.jooq.impl.DSL.*;

import com.example.demo.jooqmodels.enums.ProductStatus;
import com.example.demo.jooqmodels.enums.ProductType;
import com.example.demo.services.common.MediaService;
import com.example.demo.services.common.Pagination;
import com.example.demo.services.common.Pagination.PaginationMeta;
import java.math.BigDecimal;
import java.util.List;
import org.jooq.DSLContext;
import org.springframework.stereotype.Service;

@Service
public class AdminProductQueryService {

  private final DSLContext ctx;
  private final MediaService mediaService;

  public AdminProductQueryService(DSLContext ctx, MediaService mediaService) {
    this.ctx = ctx;
    this.mediaService = mediaService;
  }

  public DTO.GetOneProduct.Response getOneProduct(int productId) {

    var availableAssociations =
        ctx.select(PRODUCT_ASSOCIATION_TYPES.ID, PRODUCT_ASSOCIATION_TYPES.TYPE_NAME)
            .from(PRODUCT_ASSOCIATION_TYPES)
            .fetch(
                v -> {
                  return new DTO.GetOneProduct.ProductAssociation(v.value1(), v.value2());
                });

    var productAssociations =
        ctx.select(PRODUCT_ASSOCIATION_TYPES.ID, PRODUCT_ASSOCIATION_TYPES.TYPE_NAME)
            .from(PRODUCT_ASSOCIATIONS)
            .join(PRODUCT_ASSOCIATION_TYPES)
            .on(PRODUCT_ASSOCIATIONS.PRODUCT_ASSOCIATION_TYPE_ID.eq(PRODUCT_ASSOCIATION_TYPES.ID))
            .fetch(
                v -> {
                  return new DTO.GetOneProduct.ProductAssociation(v.value1(), v.value2());
                });

    var taxonIds =
        ctx.select(PRODUCT_TAXONS.TAXON_ID)
            .from(PRODUCT_TAXONS)
            .where(PRODUCT_TAXONS.PRODUCT_ID.eq(productId))
            .fetch(v -> v.value1());

    return ctx.select(
            PRODUCTS.ID,
            PRODUCTS.PRODUCT_NAME,
            PRODUCTS.PRODUCT_DESCRIPTION,
            PRODUCTS.PRODUCT_TYPE,
            PRODUCTS.TAXON_ID,
            PRODUCTS.PRICING,
            PRODUCTS.PRODUCT_IMAGE_URL,
            PRODUCTS.PRODUCT_STATUS,
            multisetAgg(PRODUCT_OPTIONS.OPTION_NAME, PRODUCT_OPTIONS.CODE))
        .from(PRODUCTS)
        .leftJoin(PRODUCT_CONFIGURABLE_OPTIONS)
        .on(PRODUCT_CONFIGURABLE_OPTIONS.PRODUCT_ID.eq(PRODUCTS.ID))
        .leftJoin(PRODUCT_OPTIONS)
        .on(PRODUCT_OPTIONS.CODE.eq(PRODUCT_CONFIGURABLE_OPTIONS.PRODUCT_OPTION_CODE))
        .where(PRODUCTS.ID.eq(productId))
        .groupBy(PRODUCTS.ID)
        .fetchOne(
            v -> {
              var r = new DTO.GetOneProduct.Response();
              r.id = v.get(PRODUCTS.ID);
              r.name = v.get(PRODUCTS.PRODUCT_NAME);
              r.description = v.get(PRODUCTS.PRODUCT_DESCRIPTION);
              r.mainTaxonId = v.get(PRODUCTS.TAXON_ID);
              r.productTaxonIds = taxonIds;
              r.status = v.get(PRODUCTS.PRODUCT_STATUS);
              r.availableAssociations = availableAssociations;
              r.productAssociations = productAssociations;
              r.imageUrl = v.get(PRODUCTS.PRODUCT_IMAGE_URL);

              if (r.imageUrl != null) {
                r.imageUrl = mediaService.mediaUrl(r.imageUrl);
              }

              if (v.value4() == ProductType.SIMPLE) {
                r.product = new DTO.GetOneProduct.ResponseProductSimple(v.get(PRODUCTS.PRICING));
              } else {
                r.product =
                    new DTO.GetOneProduct.ResponseProductConfigurable(
                        v.value9()
                            .map(x -> new DTO.GetOneProduct.ProductOption(x.value2(), x.value1())));
              }

              return r;
            });
  }

  public DTO.ListProducts.Response listProducts(
      DTO.ListProducts.Filter filter, Pagination reqPagination) {
    var dataQuery =
        ctx.select(
                PRODUCTS.ID, PRODUCTS.PRODUCT_NAME, PRODUCTS.PRODUCT_TYPE, PRODUCTS.PRODUCT_STATUS)
            .from(PRODUCTS)
            .leftJoin(PRODUCT_TAXONS)
            .on(PRODUCTS.ID.eq(PRODUCT_TAXONS.PRODUCT_ID));

    var countQuery =
        ctx.select(countDistinct(PRODUCTS.ID))
            .from(PRODUCTS)
            .leftJoin(PRODUCT_TAXONS)
            .on(PRODUCTS.ID.eq(PRODUCT_TAXONS.PRODUCT_ID));

    if (filter.productName != null) {
      dataQuery.where(PRODUCTS.PRODUCT_NAME.likeIgnoreCase("%" + filter.productName + "%"));
      countQuery.where(PRODUCTS.PRODUCT_NAME.likeIgnoreCase("%" + filter.productName + "%"));
    }

    if (filter.taxonId != null) {
      dataQuery.where(
          or(PRODUCTS.TAXON_ID.eq(filter.taxonId), PRODUCT_TAXONS.TAXON_ID.eq(filter.taxonId)));
      countQuery.where(
          or(PRODUCTS.TAXON_ID.eq(filter.taxonId), PRODUCT_TAXONS.TAXON_ID.eq(filter.taxonId)));
    }

    if (filter.status != null) {
      dataQuery.where(PRODUCTS.PRODUCT_STATUS.eq(filter.status));
      countQuery.where(PRODUCTS.PRODUCT_STATUS.eq(filter.status));
    }

    Integer totalItems = countQuery.fetchOne().value1();
    int totalPages =
        Math.ceilDiv(
            totalItems, reqPagination == null ? Pagination.MAX_PAGE_SIZE : reqPagination.pageSize);
    Pagination pagination =
        reqPagination == null
            ? new Pagination(Pagination.MAX_PAGE_SIZE, totalPages)
            : reqPagination;

    if (pagination.pageNumber > totalPages) {
      pagination.pageNumber = totalPages;
    }

    var pointer = Pagination.paginationToLimitOffsetPointer(pagination);
    dataQuery.groupBy(PRODUCTS.ID).limit(pointer.limit).offset(pointer.offset);

    var products =
        dataQuery.fetch(
            d -> {
              var p = new DTO.ListProducts.Product();
              p.id = d.value1();
              p.name = d.value2();
              p.type = d.value3();
              p.status = d.value4();
              return p;
            });

    return new DTO.ListProducts.Response(
        products, new PaginationMeta(totalItems, pagination.pageSize, pagination.pageNumber));
  }

  public static class DTO {
    public static class GetOneProduct {
      public static class Response {
        public int id;
        public String name;
        public String description;
        public Integer mainTaxonId;
        public List<Integer> productTaxonIds;
        public ProductStatus status;
        public List<ProductAssociation> availableAssociations;
        public List<ProductAssociation> productAssociations;
        public String imageUrl;
        public ResponseProduct product;
      }

      public abstract static sealed class ResponseProduct
          permits ResponseProductSimple, ResponseProductConfigurable {
        public String type;

        public ResponseProduct(String type) {
          this.type = type;
        }
      }

      public static final class ResponseProductSimple extends ResponseProduct {
        public BigDecimal pricing;

        public ResponseProductSimple(BigDecimal pricing) {
          super("SIMPLE");
          this.pricing = pricing;
        }
      }

      public static final class ResponseProductConfigurable extends ResponseProduct {
        public List<ProductOption> productOptions;

        public ResponseProductConfigurable(List<ProductOption> productOptions) {
          super("CONFIGURABLE");
          this.productOptions = productOptions;
        }
      }

      public static class ProductAssociation {
        public int id;
        public String name;

        public ProductAssociation(int id, String name) {
          this.id = id;
          this.name = name;
        }
      }

      public static class ProductOption {
        public String code;
        public String name;

        public ProductOption(String code, String name) {
          this.code = code;
          this.name = name;
        }
      }
    }

    public static class ListProducts {
      public static record Filter(String productName, Integer taxonId, ProductStatus status) {}

      public static class Response {
        public List<Product> results;
        public PaginationMeta paginationMeta;

        public Response(List<Product> results, PaginationMeta paginationMeta) {
          this.results = results;
          this.paginationMeta = paginationMeta;
        }
      }

      public static class Product {
        public int id;
        public String name;
        public ProductType type;
        public ProductStatus status;
      }
    }
  }
}
