package com.example.demo.services.admin;

import static com.example.demo.jooqmodels.Tables.*;

import org.jooq.DSLContext;
import org.springframework.stereotype.Service;

@Service
public class BreadcrumbService {
  private final DSLContext ctx;

  public BreadcrumbService(DSLContext ctx) {
    this.ctx = ctx;
  }

  public DTO.GetBreadcrumbTitle.Response getBreadcrumbTitle(String param, String value) {
    String title = null;
    if (param.equals("taxonId")) {
      title =
          ctx.select(TAXONS.TAXON_NAME)
              .from(TAXONS)
              .where(TAXONS.ID.eq(Integer.parseInt(value)))
              .fetchOne(x -> x.value1());
    } else if (param.equals("optionCode")) {
      title =
          ctx.select(PRODUCT_OPTIONS.OPTION_NAME)
              .from(PRODUCT_OPTIONS)
              .where(PRODUCT_OPTIONS.CODE.eq(value))
              .fetchOne(x -> x.value1());
    } else if (param.equals("productId")) {
      title =
          ctx.select(PRODUCTS.PRODUCT_NAME)
              .from(PRODUCTS)
              .where(PRODUCTS.ID.eq(Integer.parseInt(value)))
              .fetchOne(x -> x.value1());
    } else if (param.equals("productVariantId")) {
      title =
          ctx.select(PRODUCT_VARIANTS.VARIANT_NAME)
              .from(PRODUCT_VARIANTS)
              .where(PRODUCT_VARIANTS.ID.eq(Integer.parseInt(value)))
              .fetchOne(x -> x.value1());
    } else if (param.equals("productAssociationTypeId")) {
      title =
          ctx.select(PRODUCT_ASSOCIATION_TYPES.TYPE_NAME)
              .from(PRODUCT_ASSOCIATION_TYPES)
              .where(PRODUCT_ASSOCIATION_TYPES.ID.eq(Integer.parseInt(value)))
              .fetchOne(x -> x.value1());
    } else if (param.equals("orderId")) {
      title = value;
    } else if (param.equals("customerId")) {
      title =
          ctx.select(CUSTOMERS.EMAIL)
              .from(CUSTOMERS)
              .where(CUSTOMERS.ID.eq(Integer.parseInt(value)))
              .fetchOne(x -> x.value1());
    }

    return new DTO.GetBreadcrumbTitle.Response(param, title);
  }

  public static class DTO {
    public static class GetBreadcrumbTitle {
      public static record Response(String param, String title) {}
      ;
    }
  }
}
