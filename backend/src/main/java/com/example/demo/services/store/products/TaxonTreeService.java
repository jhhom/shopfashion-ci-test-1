package com.example.demo.services.store.products;

import static com.example.demo.jooqmodels.Tables.TAXONS;

import com.example.demo.services.admin.taxon.TaxonUtil;
import java.util.ArrayList;
import java.util.List;
import org.jooq.DSLContext;
import org.springframework.stereotype.Service;

@Service
public class TaxonTreeService {
  private final DSLContext ctx;

  public TaxonTreeService(DSLContext ctx) {
    this.ctx = ctx;
  }

  public List<TaxonUtil.DTO.Taxon> getTaxonTree() {
    var taxonItems =
        ctx.select(TAXONS.ID, TAXONS.PARENT_ID, TAXONS.TAXON_NAME, TAXONS.SLUG)
            .from(TAXONS)
            .fetch(x -> new TaxonUtil.DTO.Item(x.value1(), x.value3(), x.value4(), x.value2()));

    var nodes = TaxonUtil.buildTree(taxonItems);
    return nodes;
  }

  public List<TaxonUtil.DTO.Item> getRootTaxons() {
    var taxonItems =
        ctx.select(TAXONS.ID, TAXONS.PARENT_ID, TAXONS.TAXON_NAME, TAXONS.SLUG)
            .from(TAXONS)
            .where(TAXONS.PARENT_ID.isNull())
            .fetch(x -> new TaxonUtil.DTO.Item(x.value1(), x.value3(), x.value4(), x.value2()));

    return taxonItems;
  }

  public List<TaxonUtil.DTO.Taxon> getProductListingsTaxonTree(String taxonSlug) {
    List<TaxonUtil.DTO.Item> taxonItems =
        ctx.select(TAXONS.ID, TAXONS.PARENT_ID, TAXONS.TAXON_NAME, TAXONS.SLUG)
            .from(TAXONS)
            .fetch(
                v -> {
                  return new TaxonUtil.DTO.Item(v.value1(), v.value3(), v.value4(), v.value2());
                });

    var nodes = TaxonUtil.buildTree(taxonItems);

    var results = searchTree(taxonSlug, nodes, 1, new ArrayList<>());

    for (var r : results) {
      for (var c : r.children) {
        c.children = new ArrayList<>();
      }
    }

    return results;
  }

  private List<TaxonUtil.DTO.Taxon> searchTree(
      String slug,
      List<TaxonUtil.DTO.Taxon> tree,
      int level,
      List<TaxonUtil.DTO.Taxon> parentSiblings) {
    for (var n : tree) {
      if (n.slug.equals(slug)) {
        if (level == 1) {
          return n.children;
        } else if (level == 2) {
          return tree;
        } else {
          return parentSiblings;
        }
      }
      var result = searchTree(slug, n.children, level + 1, tree);
      if (result.size() > 0) {
        return result;
      }
    }
    return new ArrayList<>();
  }
}
