package com.example.demo.services.store.products;

import static com.example.demo.jooqmodels.Tables.*;
import static org.jooq.impl.DSL.*;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import org.apache.commons.lang3.tuple.ImmutablePair;
import org.jooq.DSLContext;
import org.springframework.stereotype.Service;

import com.example.demo.services.common.exceptions.ResourceNotFoundException;

@Service
public class ProductBreadcrumbService {
  private final DSLContext ctx;

  public ProductBreadcrumbService(DSLContext ctx) {
    this.ctx = ctx;
  }

  public DTO.GetProductDetailsBreadcrumbs.Response getProductDetailsBreadcrumbs(
      int productId, Optional<String> comingFromTaxon) {

    List<DTO.GetProductDetailsBreadcrumbs.Crumb> crumbs = new ArrayList<>();

    var taxon = getProductTaxon(productId, comingFromTaxon);

    DTO.GetProductDetailsBreadcrumbs.Crumb lastSegmentCrumb =
        ctx.select(TAXONS.ID, TAXONS.TAXON_NAME, TAXONS.SLUG, TAXONS.PARENT_ID)
            .from(TAXONS)
            .where(TAXONS.ID.eq(taxon.left))
            .fetchOne(
                x ->
                    new DTO.GetProductDetailsBreadcrumbs.Crumb(
                        x.value1(), x.value2(), x.value3(), x.value4()));

    crumbs.add(lastSegmentCrumb);

    Integer parentId = lastSegmentCrumb.parentId;
    while (parentId != null) {
      var q =
          ctx.select(TAXONS.ID, TAXONS.TAXON_NAME, TAXONS.SLUG, TAXONS.PARENT_ID)
              .from(TAXONS)
              .where(TAXONS.ID.eq(parentId));

      DTO.GetProductDetailsBreadcrumbs.Crumb segment =
          q.fetchOne(
              x ->
                  new DTO.GetProductDetailsBreadcrumbs.Crumb(
                      x.value1(), x.value2(), x.value3(), x.value4()));

      parentId = segment.parentId;

      crumbs.add(segment);
    }

    crumbs = crumbs.reversed();

    String path = "";

    for (var i = 0; i < crumbs.size(); i++) {
      var c = crumbs.get(i);

      path += c.slug;
      if (i < crumbs.size() - 1) {
        path += "/";
      }

      crumbs.set(i, new DTO.GetProductDetailsBreadcrumbs.Crumb(c.id, c.name, path, parentId));
    }

    return new DTO.GetProductDetailsBreadcrumbs.Response(crumbs, taxon.right);
  }

  /**
   * This function gets the taxon that should be displayed as the breadcrumb on the Product Details
   * page
   *
   * <p>This is determined based on how user arrives at the Product Details page : - If they click
   * on the product on the product listing with a specific taxon, that taxon will be displayed -
   * Otherwise if they arrive at the product without through a taxon, e.g through the search page,
   * then the product's main taxon will be used
   *
   * @param ctx
   * @param productId id of the product in the Product Details page
   * @param comingFromTaxon which taxon user is at before they arrive on the Product Details page
   * @return a tuple of [taxonId, productName]
   */
  private ImmutablePair<Integer, String> getProductTaxon(
      int productId, Optional<String> comingFromTaxon) {

    var taxon =
        ctx.select(PRODUCTS.TAXON_ID, PRODUCTS.PRODUCT_NAME)
            .from(PRODUCTS)
            .where(PRODUCTS.ID.eq(productId))
            .fetchOne();
    if (comingFromTaxon.isEmpty()) {
      return ImmutablePair.of(taxon.value1(), taxon.value2());
    }

    // given men/tops/t-shirts
    // find the corresponding taxon id

    // algorithm:
    // 1. break slug into segments: `men`, `top`, `t-shirts`
    // 2. start with parentId = null, search for taxon with `men` and `parentId`
    // 3. after found the taxon, update parentId, and continue searching for taxon with the next
    // slug until the last slug is found
    String fromTaxon = comingFromTaxon.get();

    var segments = fromTaxon.split("/");

    Integer taxonId = null;

    for (String s : segments) {
      var query = ctx.select(TAXONS.ID).from(TAXONS);
      var queryConditions = and(TAXONS.SLUG.eq(s));

      if (taxonId != null) {
        queryConditions = queryConditions.and(TAXONS.PARENT_ID.eq(taxonId));
      }

      var currentTaxon = query.where(queryConditions).fetchOne();
      if (currentTaxon == null) {
        return ImmutablePair.of(taxon.value1(), taxon.value2());
      }

      taxonId = currentTaxon.value1();
    }

    return ImmutablePair.of(taxonId, taxon.value2());
  }

  public DTO.GetProductListingsBreadcrumbs.Response getProductListingsBreadcrumbs(
      String taxonSlug) {
    var segments = new ArrayList<>(Arrays.asList(taxonSlug.split("/")));

    String lastSegment = segments.removeLast();

    List<DTO.GetProductListingsBreadcrumbs.SlugSegment> breadcrumbs = new ArrayList<>();

    int parentId = 0;
    String slugPath = "";

    for (int i = 0; i < segments.size(); i++) {
      String segment = segments.get(i);
      var queryCondition = and(TAXONS.SLUG.eq(segment));

      if (parentId == 0) {
        queryCondition = queryCondition.and(TAXONS.PARENT_ID.isNull());
      } else {
        queryCondition = queryCondition.and(TAXONS.PARENT_ID.eq(parentId));
      }

      DTO.GetProductListingsBreadcrumbs.SlugSegment taxon =
          ctx.select(TAXONS.ID, TAXONS.SLUG, TAXONS.TAXON_NAME)
              .from(TAXONS)
              .where(queryCondition)
              .limit(1)
              .fetchOne(
                  x ->
                      new DTO.GetProductListingsBreadcrumbs.SlugSegment(
                          x.value1(), x.value3(), x.value2()));

      if (taxon == null) {
        throw new ResourceNotFoundException("taxon");
      }

      parentId = taxon.id;
      slugPath += i == 0 ? taxon.slug : "/" + taxon.slug;

      breadcrumbs.add(
          new DTO.GetProductListingsBreadcrumbs.SlugSegment(taxon.id, taxon.name, slugPath));
    }

    if (lastSegment != null) {
      var queryCondition = and(TAXONS.SLUG.eq(lastSegment));

      if (parentId == 0) {
        queryCondition = queryCondition.and(TAXONS.PARENT_ID.isNull());
      } else {
        queryCondition = queryCondition.and(TAXONS.PARENT_ID.eq(parentId));
      }

      var q =
          ctx.select(TAXONS.ID, TAXONS.SLUG, TAXONS.TAXON_NAME).from(TAXONS).where(queryCondition);

      DTO.GetProductListingsBreadcrumbs.SlugSegment taxon =
          q.fetchOne(
              x ->
                  new DTO.GetProductListingsBreadcrumbs.SlugSegment(
                      x.value1(), x.value3(), x.value2()));
      if (taxon == null) {
        throw new ResourceNotFoundException("taxon");
      }

      return new DTO.GetProductListingsBreadcrumbs.Response(
          breadcrumbs, new DTO.GetProductListingsBreadcrumbs.SlugLastSegment(taxon.id, taxon.name));
    }

    return new DTO.GetProductListingsBreadcrumbs.Response(breadcrumbs, null);
  }

  public static class DTO {
    public static class GetProductDetailsBreadcrumbs {
      public static record Response(List<Crumb> crumbs, String productName) {}

      public static record Crumb(int id, String name, String slug, Integer parentId) {}
    }

    public static class GetProductListingsBreadcrumbs {
      public static record Response(List<SlugSegment> precedingSlugs, SlugLastSegment lastSlug) {}

      public static record SlugSegment(int id, String name, String slug) {}

      public static record SlugLastSegment(int id, String name) {}
    }
  }
}
