package com.example.demo.example.util;

import static com.example.demo.services.admin.taxon.TaxonUtil.DTO.Item;
import static com.example.demo.services.admin.taxon.TaxonUtil.DTO.Taxon;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.junit.jupiter.api.Assertions.*;

import com.example.demo.services.admin.taxon.TaxonUtil;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.List;
import org.hamcrest.Description;
import org.hamcrest.Matcher;
import org.hamcrest.TypeSafeMatcher;
import org.junit.jupiter.api.Test;

public class TaxonUtilTest {
  @Test
  void testGetFieldFromObject() throws NoSuchFieldException, IllegalAccessException {

    LoginRequest req = new LoginRequest("james", "james132");
    Object r = req;

    Object password = null;

    Field field = req.getClass().getField("password");
    password = field.get(req);

    System.out.println("🔥 PASSWORD: " + password);
  }

  public static class LoginRequest {
    public String email;
    public String password;

    public LoginRequest(String email, String password) {
      this.email = email;
      this.password = password;
    }
  }

  @Test
  void testMoveItemsIntoNodeChildren() throws JsonProcessingException {
    List<Taxon> nodes =
        new ArrayList<>() {
          {
            add(new Taxon(1, "Men", "men", new ArrayList<>()));
            // add(new Taxon(10, "Women", "women", new ArrayList<>()));
          }
        };

    List<Item> items =
        new ArrayList<>() {
          {
            add(new Item(2, "Tops", "tops", 1));
            add(new Item(3, "Polo Shirts", "polo-shirts", 2));
            add(new Item(4, "T-Shirts", "t-shirts", 2));
            add(new Item(5, "Bottoms", "bottoms", 1));
            add(new Item(6, "Jeans", "jeans", 5));
            add(new Item(7, "Shorts", "shorts", 5));
            add(new Item(8, "Outerwear", "outerwear", 1));
          }
        };

    for (var n : nodes) {
      TaxonUtil.moveItemsIntoNodeChildren(n, items);
    }

    ObjectMapper mapper = new ObjectMapper();
    var prettyJson = mapper.writerWithDefaultPrettyPrinter().writeValueAsString(nodes);

    System.out.println(prettyJson);

    assertThat(nodes, TaxonTreeMatcher.matchesTree(new ArrayList<>()));
  }

  @Test
  void testBuildTaxonTree() {
    List<Item> items =
        new ArrayList<>() {
          {
            add(new Item(1, "Men", "men", null));
            add(new Item(2, "Tops", "tops", 1));
            add(new Item(3, "Polo Shirts", "polo-shirts", 2));
            add(new Item(4, "T-Shirts", "t-shirts", 2));
            add(new Item(5, "Bottoms", "bottoms", 1));
            add(new Item(6, "Jeans", "jeans", 5));
            add(new Item(7, "Shorts", "shorts", 5));
            add(new Item(8, "Outerwear", "outerwear", 1));
          }
        };

    var tree = TaxonUtil.buildTree(items);

    List<Taxon> expectedTree =
        new ArrayList<>() {
          {
            add(
                new Taxon(
                    1,
                    "Men",
                    "men",
                    new ArrayList<>() {
                      {
                        add(
                            new Taxon(
                                2,
                                "Tops",
                                "men/tops",
                                new ArrayList<>() {
                                  {
                                    add(
                                        new Taxon(
                                            3,
                                            "Polo Shirts",
                                            "men/tops/polo-shirts",
                                            new ArrayList<>()));
                                    add(
                                        new Taxon(
                                            4, "T-Shirts", "men/tops/t-shirts", new ArrayList<>()));
                                  }
                                }));
                        add(
                            new Taxon(
                                5,
                                "Bottoms",
                                "men/bottoms",
                                new ArrayList<>() {
                                  {
                                    add(
                                        new Taxon(
                                            6, "Jeans", "men/bottoms/jeans", new ArrayList<>()));
                                    add(
                                        new Taxon(
                                            7, "Shorts", "men/bottoms/shorts", new ArrayList<>()));
                                  }
                                }));
                        add(new Taxon(8, "Outerwear", "men/outerwear", new ArrayList<>()));
                      }
                    }));
          }
        };

    assertThat(tree, TaxonTreeMatcher.matchesTree(expectedTree));
  }

  public class TaxonTreeMatcher {
    public static Matcher<List<Taxon>> matchesTree(List<Taxon> tree) {
      return new TaxonTreeMatcher.MatchesTree(tree);
    }

    public static class MatchesTree extends TypeSafeMatcher<List<Taxon>> {
      private final List<Taxon> actualTree;

      public MatchesTree(List<Taxon> actualTree) {
        this.actualTree = actualTree;
      }

      @Override
      protected boolean matchesSafely(List<Taxon> expected) {
        return matchList(this.actualTree, expected);
      }

      private boolean matchList(List<Taxon> tree1, List<Taxon> tree2) {
        if (tree1.size() != tree2.size()) {
          return false;
        }
        for (var node1 : tree1) {
          var matchingNodesFromTree2 =
              tree2.stream()
                  .filter(
                      node2 ->
                          node2.id == node1.id
                              && node2.slug.equals(node1.slug)
                              && node2.taxonName.equals(node1.taxonName))
                  .toList();
          if (matchingNodesFromTree2.size() == 0) {
            return false;
          }
          var node2 = matchingNodesFromTree2.get(0);

          if (node1.children.size() == 0 && node2.children.size() == 0) {
            return true;
          }

          if (node1.children.size() != node2.children.size()) {
            return false;
          }
          var childrenMatch = matchList(node1.children, node2.children);
          if (!childrenMatch) {
            return false;
          }
        }

        return true;
      }

      @Override
      public void describeTo(Description description) {
        description.appendText("tree matches");
      }
    }
  }
}
