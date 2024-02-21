package com.example.demo.services.admin.dashboard;

import static com.example.demo.jooqmodels.Tables.*;
import static org.jooq.impl.DSL.*;

import com.example.demo.jooqmodels.enums.OrderStatus;
import java.math.BigDecimal;
import java.math.MathContext;
import java.sql.Timestamp;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.YearMonth;
import java.time.temporal.TemporalAdjusters;
import java.util.List;
import org.apache.commons.lang3.tuple.ImmutablePair;
import org.jooq.DSLContext;
import org.jooq.Record;
import org.jooq.Result;
import org.springframework.stereotype.Service;

@Service
public class SalesGraphService {
  private DSLContext ctx;

  public SalesGraphService(DSLContext ctx) {
    this.ctx = ctx;
  }

  public DTO.GraphResult graph(SalesGraphPeriod period, LocalDate date) {
    var statBounds = calculateStatBounds(date, period);

    var sales =
        ctx.select(
                coalesce(sum(ORDERS.TOTAL_PRICE), 0),
                count(ORDERS.ID),
                countDistinct(ORDERS.CUSTOMER_ID))
            .from(ORDERS)
            .where(
                and(
                    ORDERS.CREATED_AT.greaterOrEqual(statBounds.left),
                    ORDERS.CREATED_AT.lessOrEqual(statBounds.right),
                    ORDERS.ORDER_STATUS.eq(OrderStatus.PAID)))
            .fetchOne();

    var graph = salesGraph(statBounds.left.toLocalDate(), statBounds.right.toLocalDate(), period);

    var result = new DTO.GraphResult();

    result.totalSales = (BigDecimal) sales.value1();
    result.numOfPaidOrders = sales.value2();
    result.numOfCustomers = sales.value3();

    result.avgOrderValue =
        result.numOfPaidOrders == 0
            ? BigDecimal.ZERO
            : result.totalSales.divide(
                BigDecimal.valueOf(result.numOfPaidOrders), MathContext.DECIMAL128);
    result.salesAmount = graph;
    result.meta = new DTO.GraphResultMeta(statBounds.left, statBounds.right);

    return result;
  }

  public static class DTO {
    public static class GraphResult {
      public BigDecimal totalSales;
      public int numOfCustomers;
      public int numOfPaidOrders;
      public BigDecimal avgOrderValue;
      public List<GraphResultDataPoint> salesAmount;
      public GraphResultMeta meta;
    }

    public static class GraphResultMeta {
      public LocalDateTime start;
      public LocalDateTime end;

      public GraphResultMeta(LocalDateTime start, LocalDateTime end) {
        this.start = start;
        this.end = end;
      }
    }

    public static class GraphResultDataPoint {
      public LocalDateTime date;
      public BigDecimal amount;

      public GraphResultDataPoint(LocalDate date, BigDecimal amount) {
        this.date = LocalDateTime.of(date, LocalTime.of(0, 0));
        this.amount = amount;
      }
    }
  }

  public List<DTO.GraphResultDataPoint> salesGraph(
      LocalDate start, LocalDate end, SalesGraphPeriod period) {
    String interval =
        switch (period) {
          case TWO_WEEKS -> "1 day";
          case MONTH -> "1 day";
          case YEAR -> "1 month";
        };

    Result<Record> queryResults =
        ctx.resultQuery(
                """
                    WITH time_points AS (
                    SELECT GENERATE_SERIES (
                """
                    .concat(String.format("'%s'::TIMESTAMP WITHOUT TIME ZONE,", start.toString()))
                    .concat(String.format("'%s'::TIMESTAMP WITHOUT TIME ZONE,", end.toString()))
                    .concat(String.format("'%s'::interval", interval))
                    .concat(
                        """
                                        ) AS point
                                        ) SELECT t.point AS date, COALESCE(SUM(o.total_price), 0) AS amount
                                        FROM time_points t
                                        LEFT JOIN orders o
                                """)
                    .concat(
                        String.format(
                            "ON o.created_at >= t.point AND o.created_at < t.point + '%s'",
                            interval))
                    .concat("GROUP BY t.point ORDER BY t.point;"))
            .fetch();

    List<DTO.GraphResultDataPoint> results =
        queryResults.map(
            r -> {
              var v1 = (Timestamp) r.getValue(0);
              var v2 = (BigDecimal) r.getValue(1);

              DTO.GraphResultDataPoint d =
                  new DTO.GraphResultDataPoint(v1.toLocalDateTime().toLocalDate(), v2);

              return d;
            });

    return results;
  }

  public static ImmutablePair<LocalDateTime, LocalDateTime> calculateStatBounds(
      LocalDate date, SalesGraphPeriod period) {

    if (period == SalesGraphPeriod.YEAR) {
      int year = date.getYear();

      var start = LocalDateTime.of(year, 1, 1, 0, 0);
      var end = LocalDateTime.of(year, 12, 31, 0, 0);
      return ImmutablePair.of(start, end);
    } else if (period == SalesGraphPeriod.MONTH) {
      int year = date.getYear();

      YearMonth month = YearMonth.of(year, date.getMonthValue());
      var start = LocalDateTime.of(year, month.getMonth(), 1, 0, 0);
      var end =
          LocalDateTime.of(year, month.getMonth(), month.atEndOfMonth().getDayOfMonth(), 0, 0);
      return ImmutablePair.of(start, end);
    } else {
      return startAndEndDayOfWeek(date);
    }
    // parsing formatted dates in java:
    // https://jenkov.com/tutorials/java-date-time/parsing-formatting-dates.html
  }

  public static ImmutablePair<LocalDateTime, LocalDateTime> startAndEndDayOfWeek(LocalDate date) {
    LocalDate firstDayOfWeek = date.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
    LocalDate lastDayOfWeek = firstDayOfWeek.with(TemporalAdjusters.nextOrSame(DayOfWeek.SUNDAY));

    return ImmutablePair.of(
        LocalDateTime.of(
            firstDayOfWeek.getYear(),
            firstDayOfWeek.getMonth(),
            firstDayOfWeek.getDayOfMonth(),
            0,
            0),
        LocalDateTime.of(
            lastDayOfWeek.getYear(),
            lastDayOfWeek.getMonth(),
            lastDayOfWeek.getDayOfMonth(),
            0,
            0));
  }

  public static enum SalesGraphPeriod {
    TWO_WEEKS,
    YEAR,
    MONTH,
  }
}
