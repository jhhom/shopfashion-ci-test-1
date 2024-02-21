package com.example.demo.controllers.store;

import com.example.demo.services.admin.taxon.TaxonUtil;
import com.example.demo.services.common.ResultMessage;
import com.example.demo.services.store.customers.CustomerAuthService;
import com.example.demo.services.store.customers.cart.CartQueryService;
import com.example.demo.services.store.products.ProductBreadcrumbService;
import com.example.demo.services.store.products.ProductReviewService;
import com.example.demo.services.store.products.ProductSearchService;
import com.example.demo.services.store.products.StoreProductQueryService;
import com.example.demo.services.store.products.TaxonTreeService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.validation.Valid;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import org.jooq.DSLContext;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("store")
public class StoreProductsController {
  private final DSLContext ctx;

  private final CartQueryService cartQueryService;
  private final CustomerAuthService customerAuthService;
  private final StoreProductQueryService productQueryService;
  private final ProductReviewService productReviewService;
  private final ProductSearchService productSearchService;
  private final TaxonTreeService taxonTreeService;
  private final ProductBreadcrumbService productBreadcrumbService;

  public StoreProductsController(
      ObjectMapper mapper,
      DSLContext ctx,
      CartQueryService cartQueryService,
      CustomerAuthService customerAuthService,
      StoreProductQueryService productQueryService,
      ProductReviewService productReviewService,
      ProductSearchService productSearchService,
      TaxonTreeService taxonTreeService,
      ProductBreadcrumbService productBreadcrumbService) {
    this.ctx = ctx;
    this.customerAuthService = customerAuthService;
    this.productQueryService = productQueryService;
    this.productReviewService = productReviewService;
    this.productSearchService = productSearchService;
    this.taxonTreeService = taxonTreeService;
    this.productBreadcrumbService = productBreadcrumbService;
    this.cartQueryService = cartQueryService;
  }

  @PostMapping("register_customer")
  public ResultMessage registerCustomer(
      @Valid @RequestBody CustomerAuthService.DTO.CustomerRegister.Request req) {
    return customerAuthService.registerCustomer(req);
  }

  @GetMapping("search_product_autocomplete/{searchTerm}")
  public ProductSearchService.DTO.SearchProductAutocomplete.Response searchProductAutocomplete(
      @PathVariable String searchTerm) {
    return productSearchService.searchProductAutocomplete(searchTerm);
  }

  @GetMapping("breadcrumbs/product_details/{productId}")
  public ProductBreadcrumbService.DTO.GetProductDetailsBreadcrumbs.Response
      getProductDetailsBreadcrumbs(
          @PathVariable Integer productId,
          @RequestParam(name = "comingFromTaxon", required = false) String comingFromTaxon) {
    return productBreadcrumbService.getProductDetailsBreadcrumbs(
        productId, comingFromTaxon == null ? Optional.empty() : Optional.of(comingFromTaxon));
  }

  @GetMapping("breadcrumbs/product_listings")
  public ProductBreadcrumbService.DTO.GetProductListingsBreadcrumbs.Response
      getProductListingsBreadcrumbs(
          @RequestParam(name = "taxonSlug", required = false) String taxonSlug) {
    return productBreadcrumbService.getProductListingsBreadcrumbs(taxonSlug);
  }

  @GetMapping("products/{productId}")
  public StoreProductQueryService.DTO.GetOneProduct.Response getOneProduct(
      @PathVariable Integer productId) {
    return productQueryService.getOneProduct(productId);
  }

  @GetMapping("product_reviews/{productId}")
  public ProductReviewService.DTO.ListAllProductReviews.Response listAllProductReviews(
      @PathVariable Integer productId) {
    return productReviewService.listAllProductReviews(productId);
  }

  @GetMapping("taxon_tree")
  public List<TaxonUtil.DTO.Taxon> getTaxonTree() {
    return taxonTreeService.getTaxonTree();
  }

  @GetMapping("product_listings_taxon_tree")
  public List<TaxonUtil.DTO.Taxon> productListingsTaxonTree(
      @RequestParam(name = "taxonSlug", required = true) String taxonSlug) {
    return taxonTreeService.getProductListingsTaxonTree(taxonSlug);
  }

  @GetMapping("root_taxons")
  public List<TaxonUtil.DTO.Item> rootTaxons() {
    return taxonTreeService.getRootTaxons();
  }

  @GetMapping("search_products/{searchTerm}")
  public List<ProductSearchService.DTO.SearchProducts.Product> searchProducts(
      @PathVariable String searchTerm) {
    return productSearchService.searchProducts(searchTerm);
  }

  @GetMapping("latest_products")
  public List<StoreProductQueryService.DTO.GetLatestProducts.Product> latestProducts() {
    return productQueryService.getLatestProducts();
  }

  @PutMapping("products/cart_items_info")
  public CartQueryService.DTO.GetCartItemsInfo.Response getCartItemsInfo(
      @Valid @RequestBody CartQueryService.DTO.GetCartItemsInfo.Request req) {
    return cartQueryService.getCartItemsInfo(req);
  }

  @PostMapping("customers_login")
  public CustomerAuthService.DTO.CustomerLogin.Response customerLogin(
      @Valid @RequestBody CustomerAuthService.DTO.CustomerLogin.Request req) {
    return customerAuthService.loginBasic(req);
  }

  @GetMapping("products_by_taxon")
  public StoreProductQueryService.DTO.ListProductsByTaxonSlug.Response listProductsByTaxonSlug(
      @RequestParam(name = "taxonSlug", required = true) String taxonSlug,
      @RequestParam(name = "minPrice", required = false) BigDecimal minPrice,
      @RequestParam(name = "maxPrice", required = false) BigDecimal maxPrice,
      @RequestParam(name = "sortPriceOrder", required = false)
          StoreProductQueryService.DTO.ListProductsByTaxonSlug.SortPriceOrder sortPriceOrder) {

    return productQueryService.listProductsByTaxonSlug(
        ctx,
        taxonSlug,
        new StoreProductQueryService.DTO.ListProductsByTaxonSlug.Query(
            minPrice, maxPrice, sortPriceOrder));
  }
}
