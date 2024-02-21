package com.example.demo.services.common;

import jakarta.validation.constraints.Positive;

public class Pagination {
  @Positive public int pageSize;

  @Positive public int pageNumber;

  public static final int MAX_PAGE_SIZE = 10_000;

  public Pagination(int pageSize, int pageNumber) {
    this.pageSize = pageSize;
    this.pageNumber = pageNumber;
  }

  public static class SQLPagination {
    public int limit;
    public int offset;

    SQLPagination(int limit, int offset) {
      this.limit = limit;
      this.offset = offset;
    }
  }

  public static class PaginationMeta {
    public int totalItems;
    public int pageSize;
    public int pageNumber;
    public int totalPages;

    public PaginationMeta(int totalItems, int pageSize, int pageNumber) {
      this.totalItems = totalItems;
      this.pageSize = pageSize;
      this.pageNumber = pageNumber;
      this.totalPages = (int) Math.round(Math.ceil((double) this.totalItems / this.pageSize));
    }
  }

  public static SQLPagination paginationToLimitOffsetPointer(Pagination p) {
    int offset = (p.pageNumber - 1) * p.pageSize;
    return new SQLPagination(p.pageSize, offset);
  }
}
