package com.example.demo.controllers.admin;

import com.example.demo.services.admin.order.OrderCommandService;
import com.example.demo.services.admin.order.OrderQueryService;
import com.example.demo.services.common.Pagination;
import com.example.demo.services.common.ResultMessage;
import com.example.demo.utils.QueryEditor;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.validation.Valid;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.jooq.DSLContext;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.InitBinder;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("admin/orders")
public class OrdersController {
  private ObjectMapper mapper;
  private final Validator validator;

  private final OrderCommandService orderCommandService;
  private final OrderQueryService orderQueryService;

  public OrdersController(
      ObjectMapper mapper,
      DSLContext ctx,
      OrderCommandService orderCommandService,
      OrderQueryService orderQueryService) {
    this.mapper = mapper;
    ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
    this.validator = factory.getValidator();
    this.orderCommandService = orderCommandService;
    this.orderQueryService = orderQueryService;
  }

  @InitBinder
  public void initBinder(WebDataBinder binder) {
    binder.registerCustomEditor(
        OrderQueryService.DTO.ListOrders.QueryFilter.class,
        new QueryEditor<>(mapper, validator, OrderQueryService.DTO.ListOrders.QueryFilter.class));
    binder.registerCustomEditor(
        Pagination.class, new QueryEditor<>(mapper, validator, Pagination.class));
  }

  @GetMapping()
  public OrderQueryService.DTO.ListOrders.Result listOrders(
      @RequestParam(name = "filter", required = false)
          OrderQueryService.DTO.ListOrders.QueryFilter filter,
      @RequestParam(name = "pagination", required = false) Pagination pagination) {
    var result = orderQueryService.listOrders(filter, pagination);
    return result;
  }

  @GetMapping("{orderId}")
  public OrderQueryService.DTO.GetOneOrder.Result getOneOrder(@PathVariable Integer orderId)
      throws JsonProcessingException {
    try {
      var order = orderQueryService.getOneOrder(orderId);
      return order;
    } catch (JsonProcessingException ex) {
      throw ex;
    }
  }

  @PutMapping("{orderId}/cancel")
  public ResultMessage cancelOrder(@PathVariable Integer orderId) {
    var result = orderCommandService.cancelOrder(orderId);
    return result;
  }

  @PutMapping("{orderId}/product/{productId}/shipment_status")
  public ResultMessage updateItemShipmentStatus(
      @PathVariable Integer orderId,
      @PathVariable Integer productId,
      @RequestBody @Valid OrderCommandService.DTO.UpdateItemShipmentStatus.Request req) {

    var result = orderCommandService.updateItemShipmentStatus(orderId, productId, req);
    return result;
  }
}
