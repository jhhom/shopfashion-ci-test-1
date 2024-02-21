/*
 * This file is generated by jOOQ.
 */
package com.example.demo.jooqmodels.tables.records;


import com.example.demo.jooqmodels.tables.CustomerCartConfigurableItems;

import java.time.LocalDateTime;

import org.jooq.Record2;
import org.jooq.impl.UpdatableRecordImpl;


/**
 * This class is generated by jOOQ.
 */
@SuppressWarnings({ "all", "unchecked", "rawtypes", "this-escape" })
public class CustomerCartConfigurableItemsRecord extends UpdatableRecordImpl<CustomerCartConfigurableItemsRecord> {

    private static final long serialVersionUID = 1L;

    /**
     * Setter for
     * <code>public.customer_cart_configurable_items.customer_id</code>.
     */
    public void setCustomerId(Integer value) {
        set(0, value);
    }

    /**
     * Getter for
     * <code>public.customer_cart_configurable_items.customer_id</code>.
     */
    public Integer getCustomerId() {
        return (Integer) get(0);
    }

    /**
     * Setter for
     * <code>public.customer_cart_configurable_items.product_variant_id</code>.
     */
    public void setProductVariantId(Integer value) {
        set(1, value);
    }

    /**
     * Getter for
     * <code>public.customer_cart_configurable_items.product_variant_id</code>.
     */
    public Integer getProductVariantId() {
        return (Integer) get(1);
    }

    /**
     * Setter for <code>public.customer_cart_configurable_items.quantity</code>.
     */
    public void setQuantity(Integer value) {
        set(2, value);
    }

    /**
     * Getter for <code>public.customer_cart_configurable_items.quantity</code>.
     */
    public Integer getQuantity() {
        return (Integer) get(2);
    }

    /**
     * Setter for <code>public.customer_cart_configurable_items.added_at</code>.
     */
    public void setAddedAt(LocalDateTime value) {
        set(3, value);
    }

    /**
     * Getter for <code>public.customer_cart_configurable_items.added_at</code>.
     */
    public LocalDateTime getAddedAt() {
        return (LocalDateTime) get(3);
    }

    // -------------------------------------------------------------------------
    // Primary key information
    // -------------------------------------------------------------------------

    @Override
    public Record2<Integer, Integer> key() {
        return (Record2) super.key();
    }

    // -------------------------------------------------------------------------
    // Constructors
    // -------------------------------------------------------------------------

    /**
     * Create a detached CustomerCartConfigurableItemsRecord
     */
    public CustomerCartConfigurableItemsRecord() {
        super(CustomerCartConfigurableItems.CUSTOMER_CART_CONFIGURABLE_ITEMS);
    }

    /**
     * Create a detached, initialised CustomerCartConfigurableItemsRecord
     */
    public CustomerCartConfigurableItemsRecord(Integer customerId, Integer productVariantId, Integer quantity, LocalDateTime addedAt) {
        super(CustomerCartConfigurableItems.CUSTOMER_CART_CONFIGURABLE_ITEMS);

        setCustomerId(customerId);
        setProductVariantId(productVariantId);
        setQuantity(quantity);
        setAddedAt(addedAt);
        resetChangedOnNotNull();
    }
}
