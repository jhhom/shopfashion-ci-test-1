package com.example.demo.services.admin.taxon;

import static com.example.demo.jooqmodels.Tables.*;
import static org.jooq.impl.DSL.*;

import java.util.List;
import org.jooq.DSLContext;
import org.springframework.stereotype.Service;

@Service
public class TaxonSlugService {

  private final DSLContext ctx;

  public TaxonSlugService(DSLContext ctx) {
    this.ctx = ctx;
  }

  public DTO.CheckTaxonSlugUniqueness.Response checkTaxonSlugIsUnique(
      DTO.CheckTaxonSlugUniqueness.Query req) {

    var queryConditions = and(TAXONS.SLUG.eq(req.slug));

    var query = ctx.select(TAXONS.ID).from(TAXONS);

    if (req.parentTaxonId == null) {
      queryConditions = queryConditions.and(TAXONS.PARENT_ID.isNull());
    } else {
      queryConditions = queryConditions.and(TAXONS.PARENT_ID.eq(req.parentTaxonId));
    }

    if (req.taxonId != null) {
      queryConditions = queryConditions.and(TAXONS.ID.eq(req.taxonId));
    }

    var isConflicting = ctx.select(exists(query.where(queryConditions))).fetchOne().value1();

    var isUnique = !isConflicting;

    return new DTO.CheckTaxonSlugUniqueness.Response(isUnique);
  }

  public DTO.GenerateUniqueTaxonSlug.Response generateUniqueTaxonSlug(
      String taxonName, Integer parentTaxonId) {
    var query = ctx.select(TAXONS.SLUG).from(TAXONS);

    if (parentTaxonId == null) {
      query.where(TAXONS.PARENT_ID.isNull());
    } else {
      query.where(TAXONS.PARENT_ID.eq(parentTaxonId));
    }

    var existingSlugs = query.fetch(x -> x.value1());

    return new DTO.GenerateUniqueTaxonSlug.Response(generateUniqueSlug(existingSlugs, taxonName));
  }

  private String generateUniqueSlug(List<String> existingSlugs, String name) {
    String slug = titleToSlug(name);

    if (!existingSlugs.contains(slug)) {
      return slug;
    }

    int uniquePostfix = 1;
    while (existingSlugs.contains(slug + "-" + uniquePostfix)) {
      uniquePostfix++;
    }

    slug = slug + "-" + uniquePostfix;

    return slug;
  }

  private String titleToSlug(String title) {
    return title.toLowerCase().replace(" ", "-");
  }

  public static class DTO {
    public static class CheckTaxonSlugUniqueness {

      public static record Query(String slug, Integer taxonId, Integer parentTaxonId) {}

      public static record Response(Boolean isUnique) {}
    }

    public static class GenerateUniqueTaxonSlug {

      public static record Response(String slug) {}
    }
  }
}
