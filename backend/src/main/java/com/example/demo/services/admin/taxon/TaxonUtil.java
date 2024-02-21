package com.example.demo.services.admin.taxon;

import com.google.common.collect.ImmutableList;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public class TaxonUtil {

  public static List<DTO.Taxon> buildTree(List<DTO.Item> items) {
    // 1. find the root (which are items that have no parents)
    // 2. shift the root items into the nodes as root nodes
    // 3. for each root node, scan the remaining item list for any item with the root node as the
    // parent id
    // 4. shift from the array into the root node's children list
    // 5. repeat the process for each of the root node's children

    List<DTO.Taxon> nodes = new ArrayList<>();

    // 1. find the root (which are items that have no parents)
    // 2. shift the root items into the nodes as root nodes
    nodes.addAll(
        items.stream()
            .filter(i -> i.parentId == null)
            .map(x -> new DTO.Taxon(x.id, x.taxonName, x.slug, new ArrayList<>()))
            .toList());

    items = new ArrayList<>(items.stream().filter(x -> x.parentId != null).toList());

    // 3. for each root node, scan the remaining item list for any item with the root node as the
    // parent id
    // 4. shift from the array into the root node's children list
    // 5. repeat the process for each of the root node's children
    for (DTO.Taxon n : nodes) {
      moveItemsIntoNodeChildren(n, items);
    }

    return nodes;
  }

  public static void moveItemsIntoNodeChildren(DTO.Taxon taxon, List<DTO.Item> items) {
    // for each item in `items` list, check if the item's parent is taxon
    // if it is, add it to taxon's children and remove it from the `items` array

    for (int i = 0; i < items.size(); i++) {
      var currentItem = items.get(i);

      if (currentItem.parentId.equals(taxon.id)) {
        var v = items.remove(i);
        i--;
        if (taxon.children == null) {
          taxon.children = new ArrayList<>();
        }

        String slug = taxon.slug + "/" + v.slug;

        taxon.children.add(
            new DTO.Taxon(currentItem.id, currentItem.taxonName, slug, new ArrayList<>()));
      }
    }

    if (taxon.children != null) {
      for (int i = 0; i < taxon.children.size(); i++) {
        moveItemsIntoNodeChildren(taxon.children.get(i), items);
      }
    }
  }

  public static List<DTO.TaxonParentItem> convertTreeToParentItems(List<DTO.Taxon> taxons) {
    List<DTO.TaxonParentItem> items = new ArrayList<>();

    for (var t : taxons) {
      items.add(new DTO.TaxonParentItem(t.id, t.taxonName));

      for (var c : t.children) {
        convertTaxonToParentItems(items, List.of(t.taxonName), c);
      }
    }

    return items;
  }

  public static Optional<DTO.Taxon> findTaxonWithMatchingSlugFromTree(
      List<DTO.Taxon> tree, String slug) {
    for (var node : tree) {
      if (node.slug.equals(slug)) {
        return Optional.of(node);
      }

      if (node.children.size() > 0) {
        var nodeInSubtree = findTaxonWithMatchingSlugFromTree(node.children, slug);
        if (nodeInSubtree.isPresent()) {
          return nodeInSubtree;
        }
      }
    }

    return Optional.empty();
  }

  private static void convertTaxonToParentItems(
      List<DTO.TaxonParentItem> items, List<String> prefixes, DTO.Taxon taxon) {

    List<String> taxonFullPathSegments =
        new ImmutableList.Builder<String>().addAll(prefixes).add(taxon.taxonName).build();

    String taxonFullPath = String.join("/", taxonFullPathSegments.stream().map(p -> p).toList());

    items.add(new DTO.TaxonParentItem(taxon.id, taxonFullPath));

    for (var c : taxon.children) {
      convertTaxonToParentItems(items, taxonFullPathSegments, c);
    }
  }

  public static class DTO {
    public static class Item {
      public int id;
      public String taxonName;
      public String slug;
      public Integer parentId;

      public Item(int id, String taxonName, String slug, Integer parentId) {
        this.id = id;
        this.taxonName = taxonName;
        this.slug = slug;
        this.parentId = parentId;
      }
    }

    public static class Taxon {
      public int id;
      public String taxonName;
      public String slug;
      public List<Taxon> children;

      public Taxon(int id, String taxonName, String slug, List<Taxon> children) {
        this.id = id;
        this.taxonName = taxonName;
        this.slug = slug;
        this.children = children;
      }

      @Override
      public String toString() {
        return "T: " + slug + "(" + children.size() + ")";
      }
    }

    public static class TaxonParentItem {
      public int taxonId;
      public String taxonFullpath;

      public TaxonParentItem(int taxonId, String taxonFullPath) {
        this.taxonId = taxonId;
        this.taxonFullpath = taxonFullPath;
      }
    }
  }
}
