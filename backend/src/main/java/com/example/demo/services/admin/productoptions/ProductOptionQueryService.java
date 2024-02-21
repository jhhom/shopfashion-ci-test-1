package com.example.demo.services.admin.productoptions;

import static com.example.demo.jooqmodels.Tables.*;

import java.util.List;
import org.jooq.DSLContext;
import org.springframework.stereotype.Service;

@Service
public class ProductOptionQueryService {
  private DSLContext ctx;

  public ProductOptionQueryService(DSLContext ctx) {
    this.ctx = ctx;
  }

  public List<DTO.ListProductOptions.Response> listProductOptions(String optionName) {
    var query =
        ctx.select(PRODUCT_OPTIONS.CODE, PRODUCT_OPTIONS.OPTION_NAME, PRODUCT_OPTIONS.POSITION)
            .from(PRODUCT_OPTIONS);

    if (optionName != null) {
      query.where(PRODUCT_OPTIONS.OPTION_NAME.likeIgnoreCase("%" + optionName + "%"));
    }

    return query
        .orderBy(PRODUCT_OPTIONS.POSITION.asc())
        .fetch(
            o -> {
              var r = new DTO.ListProductOptions.Response();
              r.code = o.value1();
              r.name = o.value2();
              r.position = o.value3();
              return r;
            });
  }

  public DTO.GetProductOptionForEdit.Response getProductOptionForEdit(String optionCode) {
    var options =
        ctx.select(PRODUCT_OPTIONS.OPTION_NAME, PRODUCT_OPTIONS.POSITION)
            .from(PRODUCT_OPTIONS)
            .where(PRODUCT_OPTIONS.CODE.eq(optionCode))
            .fetchOne();

    var values =
        ctx.select(PRODUCT_OPTION_VALUES.ID, PRODUCT_OPTION_VALUES.OPTION_VALUE)
            .from(PRODUCT_OPTION_VALUES)
            .where(PRODUCT_OPTION_VALUES.OPTION_CODE.eq(optionCode))
            .fetch(
                x -> new DTO.GetProductOptionForEdit.ResponseOptionValue(x.value1(), x.value2()));

    return new DTO.GetProductOptionForEdit.Response(options.value1(), options.value2(), values);
  }

  public static class DTO {
    public static class ListProductOptions {
      public static record QueryFilter(String optionName) {}

      public static class Response {
        public String code;
        public int position;
        public String name;
      }
    }

    public static class GetProductOptionForEdit {
      public static record Response(
          String optionName, int position, List<ResponseOptionValue> values) {}

      public static record ResponseOptionValue(Integer id, String value) {}
    }
  }
}
