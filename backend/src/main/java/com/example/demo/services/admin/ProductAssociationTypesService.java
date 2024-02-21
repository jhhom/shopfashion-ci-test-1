package com.example.demo.services.admin;

import static com.example.demo.jooqmodels.Tables.PRODUCT_ASSOCIATION_TYPES;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import org.jooq.DSLContext;
import org.springframework.stereotype.Service;

import com.example.demo.services.common.ResultMessage;

@Service
public class ProductAssociationTypesService {
  private final DSLContext ctx;

  public ProductAssociationTypesService(DSLContext ctx) {
    this.ctx = ctx;
  }

  public ResultMessage createProductAssociationType(DTO.CreateProductAssociationType.Request req) {
    ctx.insertInto(PRODUCT_ASSOCIATION_TYPES)
        .columns(PRODUCT_ASSOCIATION_TYPES.TYPE_NAME)
        .values(req.name)
        .execute();

    return new ResultMessage("Product association type created successfully");
  }

  public ResultMessage deleteProductAssociationType(int associationTypeId) {
    ctx.delete(PRODUCT_ASSOCIATION_TYPES)
        .where(PRODUCT_ASSOCIATION_TYPES.ID.eq(associationTypeId))
        .execute();

    return new ResultMessage("Product association type is deleted successfully");
  }

  public ResultMessage editProductAssociationType(
      int associationTypeId, DTO.CreateProductAssociationType.Request req) {
    ctx.update(PRODUCT_ASSOCIATION_TYPES)
        .set(PRODUCT_ASSOCIATION_TYPES.TYPE_NAME, req.name)
        .where(PRODUCT_ASSOCIATION_TYPES.ID.eq(associationTypeId))
        .execute();

    return new ResultMessage("Product association type updated successfully");
  }

  public DTO.GetOneProductAssociationType.Result getOneProductAssociationType(
      int associationTypeId) {
    var r =
        ctx.select(PRODUCT_ASSOCIATION_TYPES.ID, PRODUCT_ASSOCIATION_TYPES.TYPE_NAME)
            .from(PRODUCT_ASSOCIATION_TYPES)
            .where(PRODUCT_ASSOCIATION_TYPES.ID.eq(associationTypeId))
            .fetchOne();

    return new DTO.GetOneProductAssociationType.Result(r.value1(), r.value2());
  }

  public DTO.ListProductAssociationTypes.Result listProductAssociationTypes(
      DTO.ListProductAssociationTypes.QueryFilter filter) {
    var query =
        ctx.select(PRODUCT_ASSOCIATION_TYPES.ID, PRODUCT_ASSOCIATION_TYPES.TYPE_NAME)
            .from(PRODUCT_ASSOCIATION_TYPES);
    if (filter.name != null) {
      query.where(PRODUCT_ASSOCIATION_TYPES.TYPE_NAME.likeIgnoreCase("%" + filter.name + "%"));
    }
    var results =
        query
            .orderBy(PRODUCT_ASSOCIATION_TYPES.CREATED_AT.desc())
            .fetch(
                v -> {
                  var r =
                      new DTO.ListProductAssociationTypes.Result.ProductAssociationType(
                          v.value1(), v.value2());
                  return r;
                });

    return new DTO.ListProductAssociationTypes.Result(results);
  }

  public static class DTO {
    public static class CreateProductAssociationType {
      public static record Request(@NotNull @NotBlank String name) {}
    }

    public static class GetOneProductAssociationType {
      public static record Result(int id, String name) {}
    }

    public static class ListProductAssociationTypes {
      public static record QueryFilter(String name) {}

      public static record Result(List<ProductAssociationType> results) {

        public static record ProductAssociationType(Integer id, String name) {}
      }
    }
  }
}
