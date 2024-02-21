/*
 * This file is generated by jOOQ.
 */
package com.example.demo.jooqmodels.tables.records;


import com.example.demo.jooqmodels.tables.ProductOptionValues;

import java.time.LocalDateTime;

import org.jooq.Record1;
import org.jooq.impl.UpdatableRecordImpl;


/**
 * This class is generated by jOOQ.
 */
@SuppressWarnings({ "all", "unchecked", "rawtypes", "this-escape" })
public class ProductOptionValuesRecord extends UpdatableRecordImpl<ProductOptionValuesRecord> {

    private static final long serialVersionUID = 1L;

    /**
     * Setter for <code>public.product_option_values.id</code>.
     */
    public void setId(Integer value) {
        set(0, value);
    }

    /**
     * Getter for <code>public.product_option_values.id</code>.
     */
    public Integer getId() {
        return (Integer) get(0);
    }

    /**
     * Setter for <code>public.product_option_values.option_code</code>.
     */
    public void setOptionCode(String value) {
        set(1, value);
    }

    /**
     * Getter for <code>public.product_option_values.option_code</code>.
     */
    public String getOptionCode() {
        return (String) get(1);
    }

    /**
     * Setter for <code>public.product_option_values.option_value</code>.
     */
    public void setOptionValue(String value) {
        set(2, value);
    }

    /**
     * Getter for <code>public.product_option_values.option_value</code>.
     */
    public String getOptionValue() {
        return (String) get(2);
    }

    /**
     * Setter for <code>public.product_option_values.updated_at</code>.
     */
    public void setUpdatedAt(LocalDateTime value) {
        set(3, value);
    }

    /**
     * Getter for <code>public.product_option_values.updated_at</code>.
     */
    public LocalDateTime getUpdatedAt() {
        return (LocalDateTime) get(3);
    }

    /**
     * Setter for <code>public.product_option_values.created_at</code>.
     */
    public void setCreatedAt(LocalDateTime value) {
        set(4, value);
    }

    /**
     * Getter for <code>public.product_option_values.created_at</code>.
     */
    public LocalDateTime getCreatedAt() {
        return (LocalDateTime) get(4);
    }

    // -------------------------------------------------------------------------
    // Primary key information
    // -------------------------------------------------------------------------

    @Override
    public Record1<Integer> key() {
        return (Record1) super.key();
    }

    // -------------------------------------------------------------------------
    // Constructors
    // -------------------------------------------------------------------------

    /**
     * Create a detached ProductOptionValuesRecord
     */
    public ProductOptionValuesRecord() {
        super(ProductOptionValues.PRODUCT_OPTION_VALUES);
    }

    /**
     * Create a detached, initialised ProductOptionValuesRecord
     */
    public ProductOptionValuesRecord(Integer id, String optionCode, String optionValue, LocalDateTime updatedAt, LocalDateTime createdAt) {
        super(ProductOptionValues.PRODUCT_OPTION_VALUES);

        setId(id);
        setOptionCode(optionCode);
        setOptionValue(optionValue);
        setUpdatedAt(updatedAt);
        setCreatedAt(createdAt);
        resetChangedOnNotNull();
    }
}
