package com.example.demo.cucumber;

import static com.example.demo.jooqmodels.Tables.*;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.core.Is.is;
import static org.junit.Assert.assertTrue;

import com.example.demo.controllers.store.StoreProductsController;
import com.example.demo.services.store.products.ProductSearchService;
import com.example.demo.services.store.products.StoreProductQueryService;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import org.apache.commons.collections4.CollectionUtils;
import org.jooq.DSLContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.web.servlet.MockMvc;

public class ProductSearchStepDefinitions {

  @Autowired DSLContext ctx;

  @Autowired StoreProductsController ctrl;

  ProductSearchService.DTO.SearchProductAutocomplete.Response response;

  @Given("the database has following products")
  public void the_database_has_following_products(List<String> productNames) throws Throwable {
    ctx.truncate(TAXONS, PRODUCTS).cascade().execute();

    Integer taxonId =
        ctx.insertInto(TAXONS)
            .set(TAXONS.TAXON_NAME, "taxon")
            .set(TAXONS.SLUG, "slug")
            .returning(TAXONS.ID)
            .fetchOne(x -> x.getId());

    for (String p : productNames) {
      ctx.insertInto(PRODUCTS)
          .set(PRODUCTS.PRODUCT_NAME, p)
          .set(PRODUCTS.TAXON_ID, taxonId)
          .execute();
    }
  }

  @When("user types in the search term {string}")
  public void user_types_in_the_search_term(String word) throws Throwable {
    response = ctrl.searchProductAutocomplete(word);
  }

  @Then("the search should suggest")
  public void the_search_should_suggest(List<String> expected) throws Throwable {
    var expectedSet = new HashSet<>(expected);
    var productNames = new HashSet<>(response.productNames());
    assertTrue(CollectionUtils.isEqualCollection(expectedSet, productNames));
  }
}
