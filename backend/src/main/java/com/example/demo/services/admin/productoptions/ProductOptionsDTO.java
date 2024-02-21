package com.example.demo.services.admin.productoptions;

public class ProductOptionsDTO {
  public static class OptionPosition {
    public String code;
    public int position;

    public OptionPosition(String code, int position) {
      this.code = code;
      this.position = position;
    }
  }
}
