package com.example.demo.services.store.products;

import java.math.BigDecimal;

public class ProductPricing {
  public abstract static sealed class Pricing
      permits SimpleProductPricing, ConfigurableProductPricing, ProductPricingUnavailable {
    public String type;

    public Pricing(String type) {
      this.type = type;
    }
  }

  public static final class SimpleProductPricing extends Pricing {
    public BigDecimal price;

    public SimpleProductPricing(BigDecimal price) {
      super("SIMPLE");
      this.price = price;
    }
  }

  public static final class ConfigurableProductPricing extends Pricing {
    public BigDecimal minPrice;
    public BigDecimal maxPrice;

    public ConfigurableProductPricing(BigDecimal minPrice, BigDecimal maxPrice) {
      super("CONFIGURABLE");
      this.minPrice = minPrice;
      this.maxPrice = maxPrice;
    }
  }

  public static final class ProductPricingUnavailable extends Pricing {
    public ProductPricingUnavailable() {
      super("UNAVAILABLE");
    }
  }
}
