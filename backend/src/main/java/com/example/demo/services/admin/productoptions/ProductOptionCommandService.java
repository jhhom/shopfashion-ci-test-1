package com.example.demo.services.admin.productoptions;

import static com.example.demo.jooqmodels.Tables.*;
import static org.jooq.impl.DSL.exists;

import com.example.demo.services.common.ResultMessage;
import com.example.demo.services.common.exceptions.DbDeletedEntityInUseException;
import com.example.demo.services.common.exceptions.ProductOptionConflictOptionValueNames;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import org.jooq.DSLContext;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProductOptionCommandService {
  private DSLContext ctx;

  public ProductOptionCommandService(DSLContext ctx) {
    this.ctx = ctx;
  }

  @Transactional
  public ResultMessage createProductOption(DTO.CreateProductOption.Request req) {
    if (new HashSet<String>(req.productOptionValues).size() != req.productOptionValues.size()) {
      throw new ProductOptionConflictOptionValueNames();
    }

    int position = 1;

    if (req.position == null) {
      Integer lastPos =
          ctx.select(PRODUCT_OPTIONS.POSITION)
              .from(PRODUCT_OPTIONS)
              .orderBy(PRODUCT_OPTIONS.POSITION.desc())
              .fetchOne()
              .value1();
      if (lastPos != null) {
        position = lastPos + 1;
      }
    } else {
      List<ProductOptionsDTO.OptionPosition> currentOptionsPosition =
          ctx.select(PRODUCT_OPTIONS.CODE, PRODUCT_OPTIONS.POSITION)
              .from(PRODUCT_OPTIONS)
              .where(PRODUCT_OPTIONS.POSITION.greaterOrEqual(PRODUCT_OPTIONS.POSITION))
              .orderBy(PRODUCT_OPTIONS.POSITION.asc())
              .fetch(o -> new ProductOptionsDTO.OptionPosition(o.value1(), o.value2()));
      var positionsToUpdate =
          Util.findPositionsToUpdateGivenPositionToInsert(currentOptionsPosition, req.position);

      for (var pos : positionsToUpdate) {
        ctx.update(PRODUCT_OPTIONS)
            .set(PRODUCT_OPTIONS.POSITION, pos.position)
            .where(PRODUCT_OPTIONS.CODE.eq(pos.code))
            .execute();
      }

      position = req.position;
    }

    String optionCode =
        ctx.insertInto(PRODUCT_OPTIONS)
            .columns(PRODUCT_OPTIONS.CODE, PRODUCT_OPTIONS.OPTION_NAME, PRODUCT_OPTIONS.POSITION)
            .values(req.code, req.name, position)
            .returning(PRODUCT_OPTIONS.CODE)
            .fetchOne(v -> v.getCode());

    if (req.productOptionValues.size() > 0) {
      var query =
          ctx.insertInto(PRODUCT_OPTION_VALUES)
              .columns(PRODUCT_OPTION_VALUES.OPTION_CODE, PRODUCT_OPTION_VALUES.OPTION_VALUE);

      for (String optionValue : req.productOptionValues) {
        query.values(optionCode, optionValue);
      }

      query.execute();
    }

    return new ResultMessage("Product option created successfully");
  }

  @Transactional
  public ResultMessage deleteProductOption(String optionCode) {
    List<Integer> productVariantIds =
        ctx.select(PRODUCT_VARIANTS.ID)
            .from(PRODUCT_VARIANTS)
            .where(
                PRODUCT_VARIANTS.ID.in(
                    ctx.select(PRODUCT_VARIANT_OPTIONS.PRODUCT_VARIANT_ID)
                        .from(PRODUCT_VARIANT_OPTIONS)
                        .where(
                            PRODUCT_VARIANT_OPTIONS.PRODUCT_OPTION_VALUE_ID.in(
                                ctx.select(PRODUCT_OPTION_VALUES.ID)
                                    .from(PRODUCT_OPTION_VALUES)
                                    .where(PRODUCT_OPTION_VALUES.OPTION_CODE.eq(optionCode))))))
            .fetch(x -> x.value1());

    ctx.delete(ORDER_LINE_CONFIGURABLE_ITEMS)
        .where(ORDER_LINE_CONFIGURABLE_ITEMS.PRODUCT_VARIANT_ID.in(productVariantIds))
        .execute();

    ctx.delete(PRODUCT_VARIANT_OPTIONS)
        .where(
            PRODUCT_VARIANT_OPTIONS.PRODUCT_OPTION_VALUE_ID.in(
                ctx.select(PRODUCT_OPTION_VALUES.ID)
                    .from(PRODUCT_OPTION_VALUES)
                    .where(PRODUCT_OPTION_VALUES.OPTION_CODE.eq(optionCode))))
        .execute();

    ctx.delete(PRODUCT_VARIANT_OPTIONS)
        .where(PRODUCT_VARIANT_OPTIONS.PRODUCT_VARIANT_ID.in(productVariantIds))
        .execute();

    ctx.delete(PRODUCT_VARIANTS).where(PRODUCT_VARIANTS.ID.in(productVariantIds)).execute();

    ctx.delete(PRODUCT_OPTION_VALUES)
        .where(PRODUCT_OPTION_VALUES.OPTION_CODE.eq(optionCode))
        .execute();

    ctx.delete(PRODUCT_CONFIGURABLE_OPTIONS)
        .where(PRODUCT_CONFIGURABLE_OPTIONS.PRODUCT_OPTION_CODE.eq(optionCode))
        .execute();

    ctx.delete(PRODUCT_OPTIONS).where(PRODUCT_OPTIONS.CODE.eq(optionCode)).execute();

    return new ResultMessage("Product option is deleted successfully");
  }

  @Transactional
  public ResultMessage editProductOption(String optionCode, DTO.EditProductOption.Request req) {
    List<String> optionValueNames =
        new ArrayList<>(req.editedProductOptionValues.stream().map(v -> v.name).toList());
    optionValueNames.addAll(req.newProductOptionValues);

    if (new HashSet<String>(optionValueNames).size() != optionValueNames.size()) {
      throw new ProductOptionConflictOptionValueNames();
    }

    ObjectMapper om = new ObjectMapper();

    Integer position = null;

    if (req.position != null) {
      // check if the user updated the position of the option
      var currentOptionPosition =
          ctx.select(PRODUCT_OPTIONS.POSITION)
              .from(PRODUCT_OPTIONS)
              .where(PRODUCT_OPTIONS.CODE.eq(optionCode))
              .fetchOne(x -> x.value1());

      if (!req.position.equals(currentOptionPosition)) {
        // check if there is a product option that has the same position as the input
        var currentOptionsPosition =
            ctx.select(PRODUCT_OPTIONS.CODE, PRODUCT_OPTIONS.POSITION)
                .from(PRODUCT_OPTIONS)
                .where(PRODUCT_OPTIONS.POSITION.greaterOrEqual(req.position))
                .orderBy(PRODUCT_OPTIONS.POSITION.asc())
                .fetch(
                    o -> {
                      return new ProductOptionsDTO.OptionPosition(o.value1(), o.value2());
                    });

        var positionsToUpdate =
            Util.findPositionsToUpdateGivenPositionToInsert(currentOptionsPosition, req.position);

        for (var p : positionsToUpdate) {
          var q =
              ctx.update(PRODUCT_OPTIONS)
                  .set(PRODUCT_OPTIONS.POSITION, p.position)
                  .where(PRODUCT_OPTIONS.CODE.eq(p.code));

          q.execute();
        }

        position = req.position;
      }
    }

    if (position == null) {
      ctx.update(PRODUCT_OPTIONS)
          .set(PRODUCT_OPTIONS.OPTION_NAME, req.name)
          .where(PRODUCT_OPTIONS.CODE.eq(optionCode))
          .execute();
    } else {
      ctx.update(PRODUCT_OPTIONS)
          .set(PRODUCT_OPTIONS.OPTION_NAME, req.name)
          .set(PRODUCT_OPTIONS.POSITION, position)
          .where(PRODUCT_OPTIONS.CODE.eq(optionCode))
          .execute();
    }

    for (var p : req.editedProductOptionValues) {
      ctx.update(PRODUCT_OPTION_VALUES)
          .set(PRODUCT_OPTION_VALUES.OPTION_VALUE, p.name)
          .where(PRODUCT_OPTION_VALUES.ID.eq(p.id))
          .execute();
    }

    if (req.newProductOptionValues.size() > 0) {
      var batch =
          ctx.batch(
              ctx.insertInto(
                      PRODUCT_OPTION_VALUES,
                      PRODUCT_OPTION_VALUES.OPTION_CODE,
                      PRODUCT_OPTION_VALUES.OPTION_VALUE)
                  .values((String) null, null));

      for (var v : req.newProductOptionValues) {
        batch.bind(optionCode, v);
      }
      batch.execute();
    }

    return new ResultMessage("Product option updated successfully");
  }

  public ResultMessage deleteProductOptionValue(int optionValueId) {

    var inUse =
        ctx.select(
                exists(
                    ctx.select(PRODUCT_VARIANT_OPTIONS.ID)
                        .from(PRODUCT_VARIANT_OPTIONS)
                        .where(PRODUCT_VARIANT_OPTIONS.PRODUCT_OPTION_VALUE_ID.eq(optionValueId))))
            .fetchOne()
            .value1();
    if (inUse) {
      throw new DbDeletedEntityInUseException("productOptionValues");
    }

    ctx.deleteFrom(PRODUCT_OPTION_VALUES)
        .where(PRODUCT_OPTION_VALUES.ID.eq(optionValueId))
        .execute();

    return new ResultMessage("Product option value deleted successfully");
  }

  public static class DTO {

    public static class CreateProductOption {
      public static class Request {
        @NotNull public String code;

        @NotNull public String name;

        public Integer position;

        @NotNull public List<String> productOptionValues;
      }
    }

    public static class EditProductOption {

      public static class Request {
        @NotNull public String name;

        public Integer position;

        @NotNull public List<EditedProductOptionValue> editedProductOptionValues;

        @NotNull public List<String> newProductOptionValues;
      }

      public static record EditedProductOptionValue(Integer id, String name) {}
    }
  }
}
