package com.example.demo.services.admin.taxon;

import static com.example.demo.jooqmodels.Tables.*;
import static org.jooq.impl.DSL.*;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import java.util.List;
import org.jooq.DSLContext;
import org.springframework.stereotype.Service;

import com.example.demo.services.common.ResultMessage;
import com.example.demo.services.common.exceptions.DbDeletedEntityInUseException;
import com.example.demo.services.common.exceptions.DbUniqueValueConflictException;

@Service
public class TaxonService {
  private final DSLContext ctx;

  public TaxonService(DSLContext ctx) {
    this.ctx = ctx;
  }

  public ResultMessage createTaxon(DTO.CreateTaxon.Request req) {

    var conflictingSlugQueryCondition = and(TAXONS.SLUG.eq(req.taxonSlug));
    if (req.parentTaxonId == null) {
      conflictingSlugQueryCondition = conflictingSlugQueryCondition.and(TAXONS.PARENT_ID.isNull());
    } else {
      conflictingSlugQueryCondition =
          conflictingSlugQueryCondition.and(TAXONS.PARENT_ID.eq(req.parentTaxonId));
    }

    var isConflicting =
        ctx.select(exists(ctx.select(TAXONS.ID).from(TAXONS).where(conflictingSlugQueryCondition)))
            .fetchOne()
            .value1();

    if (isConflicting) {
      throw new DbUniqueValueConflictException("slug");
    }

    ctx.insertInto(TAXONS)
        .columns(TAXONS.TAXON_NAME, TAXONS.PARENT_ID, TAXONS.SLUG)
        .values(req.taxonName, req.parentTaxonId, req.taxonSlug)
        .execute();

    return new ResultMessage("Taxon created successfully");
  }

  public ResultMessage editTaxon(int taxonId, DTO.EditTaxon.Request req) {
    // check if there is other taxon that has the same slug and parent
    var isConflicting =
        ctx.select(
                exists(
                    ctx.select(TAXONS.ID)
                        .from(TAXONS)
                        .where(
                            and(
                                TAXONS.PARENT_ID.eq(
                                    ctx.select(TAXONS.PARENT_ID)
                                        .from(TAXONS)
                                        .where(TAXONS.ID.eq(taxonId))),
                                TAXONS.ID.notEqual(taxonId),
                                TAXONS.SLUG.equal(req.taxonSlug)))))
            .fetchOne()
            .value1();
    if (isConflicting) {
      throw new DbUniqueValueConflictException("slug");
    }

    ctx.update(TAXONS)
        .set(TAXONS.TAXON_NAME, req.taxonName)
        .set(TAXONS.SLUG, req.taxonSlug)
        .where(TAXONS.ID.eq(taxonId))
        .execute();

    return new ResultMessage("Taxon updated successfully");
  }

  public ResultMessage deleteTaxon(int taxonId) {
    var inUse =
        ctx.select(exists(ctx.select(TAXONS.ID).from(TAXONS).where(TAXONS.PARENT_ID.eq(taxonId))))
            .fetchOne()
            .value1();

    if (inUse) {
      throw new DbDeletedEntityInUseException("taxons");
    }

    ctx.deleteFrom(TAXONS).where(TAXONS.ID.eq(taxonId)).execute();

    return new ResultMessage("Taxon deleted successfully");
  }

  public List<TaxonUtil.DTO.TaxonParentItem> getAssignableTaxonParents() {
    var taxonItems =
        ctx.select(TAXONS.ID, TAXONS.PARENT_ID, TAXONS.TAXON_NAME, TAXONS.SLUG)
            .from(TAXONS)
            .fetch(v -> new TaxonUtil.DTO.Item(v.value1(), v.value3(), v.value4(), v.value2()));

    var nodes = TaxonUtil.buildTree(taxonItems);

    var items = TaxonUtil.convertTreeToParentItems(nodes);

    return items;
  }

  public DTO.GetOneTaxon.Response getOneTaxon(int taxonId) {
    return ctx.select(TAXONS.ID, TAXONS.TAXON_NAME, TAXONS.PARENT_ID, TAXONS.SLUG)
        .from(TAXONS)
        .where(TAXONS.ID.eq(taxonId))
        .fetchOne(
            v -> {
              var r = new DTO.GetOneTaxon.Response();

              r.taxonId = v.value1();
              r.taxonName = v.value2();
              r.parentTaxonId = v.value3();
              r.taxonSlug = v.value4();

              return r;
            });
  }

  public List<TaxonUtil.DTO.Taxon> getTaxonTree() {
    var taxonItems =
        ctx.select(TAXONS.ID, TAXONS.PARENT_ID, TAXONS.TAXON_NAME, TAXONS.SLUG)
            .from(TAXONS)
            .fetch(
                v -> {
                  return new TaxonUtil.DTO.Item(v.value1(), v.value3(), v.value4(), v.value2());
                });

    var nodes = TaxonUtil.buildTree(taxonItems);

    return nodes;
  }

  public static class DTO {
    private static final String TAXON_SLUG_PATTERN = "^[a-z0-9]+(?:-+[a-z0-9]+)*$";

    public static class CreateTaxon {

      public static class Request {
        public @NotNull String taxonName;

        @NotNull
        @NotBlank
        @Pattern(
            regexp = TAXON_SLUG_PATTERN,
            message = "Slug can only contain alphanumerics and dashes")
        public String taxonSlug;

        public Integer parentTaxonId;
      }
    }

    public static class EditTaxon {
      public static class Request {
        public @NotNull String taxonName;
        public @NotNull @NotBlank @Pattern(
            regexp = TAXON_SLUG_PATTERN,
            message = "Slug can only contain alphanumerics and dashes") String taxonSlug;
      }
    }

    public static class GetAssignableTaxonParent {
      public int taxonId;
      public String taxonFullpath;
    }

    public static class GetOneTaxon {
      public static class Response {
        public int taxonId;
        public String taxonName;
        public String taxonSlug;
        public Integer parentTaxonId;
      }
    }
  }
}
