/*
 * This file is generated by jOOQ.
 */
package com.example.demo.jooqmodels.tables;


import com.example.demo.jooqmodels.Keys;
import com.example.demo.jooqmodels.Public;
import com.example.demo.jooqmodels.tables.ProductAssociationTypes.ProductAssociationTypesPath;
import com.example.demo.jooqmodels.tables.Products.ProductsPath;
import com.example.demo.jooqmodels.tables.records.ProductAssociationsRecord;

import java.util.Arrays;
import java.util.Collection;
import java.util.List;

import org.jooq.Condition;
import org.jooq.Field;
import org.jooq.ForeignKey;
import org.jooq.InverseForeignKey;
import org.jooq.Name;
import org.jooq.Path;
import org.jooq.PlainSQL;
import org.jooq.QueryPart;
import org.jooq.Record;
import org.jooq.SQL;
import org.jooq.Schema;
import org.jooq.Select;
import org.jooq.Stringly;
import org.jooq.Table;
import org.jooq.TableField;
import org.jooq.TableOptions;
import org.jooq.UniqueKey;
import org.jooq.impl.DSL;
import org.jooq.impl.SQLDataType;
import org.jooq.impl.TableImpl;


/**
 * This class is generated by jOOQ.
 */
@SuppressWarnings({ "all", "unchecked", "rawtypes", "this-escape" })
public class ProductAssociations extends TableImpl<ProductAssociationsRecord> {

    private static final long serialVersionUID = 1L;

    /**
     * The reference instance of <code>public.product_associations</code>
     */
    public static final ProductAssociations PRODUCT_ASSOCIATIONS = new ProductAssociations();

    /**
     * The class holding records for this type
     */
    @Override
    public Class<ProductAssociationsRecord> getRecordType() {
        return ProductAssociationsRecord.class;
    }

    /**
     * The column
     * <code>public.product_associations.product_association_type_id</code>.
     */
    public final TableField<ProductAssociationsRecord, Integer> PRODUCT_ASSOCIATION_TYPE_ID = createField(DSL.name("product_association_type_id"), SQLDataType.INTEGER.nullable(false), this, "");

    /**
     * The column <code>public.product_associations.product_id</code>.
     */
    public final TableField<ProductAssociationsRecord, Integer> PRODUCT_ID = createField(DSL.name("product_id"), SQLDataType.INTEGER.nullable(false), this, "");

    private ProductAssociations(Name alias, Table<ProductAssociationsRecord> aliased) {
        this(alias, aliased, (Field<?>[]) null, null);
    }

    private ProductAssociations(Name alias, Table<ProductAssociationsRecord> aliased, Field<?>[] parameters, Condition where) {
        super(alias, null, aliased, parameters, DSL.comment(""), TableOptions.table(), where);
    }

    /**
     * Create an aliased <code>public.product_associations</code> table
     * reference
     */
    public ProductAssociations(String alias) {
        this(DSL.name(alias), PRODUCT_ASSOCIATIONS);
    }

    /**
     * Create an aliased <code>public.product_associations</code> table
     * reference
     */
    public ProductAssociations(Name alias) {
        this(alias, PRODUCT_ASSOCIATIONS);
    }

    /**
     * Create a <code>public.product_associations</code> table reference
     */
    public ProductAssociations() {
        this(DSL.name("product_associations"), null);
    }

    public <O extends Record> ProductAssociations(Table<O> path, ForeignKey<O, ProductAssociationsRecord> childPath, InverseForeignKey<O, ProductAssociationsRecord> parentPath) {
        super(path, childPath, parentPath, PRODUCT_ASSOCIATIONS);
    }

    /**
     * A subtype implementing {@link Path} for simplified path-based joins.
     */
    public static class ProductAssociationsPath extends ProductAssociations implements Path<ProductAssociationsRecord> {
        public <O extends Record> ProductAssociationsPath(Table<O> path, ForeignKey<O, ProductAssociationsRecord> childPath, InverseForeignKey<O, ProductAssociationsRecord> parentPath) {
            super(path, childPath, parentPath);
        }
        private ProductAssociationsPath(Name alias, Table<ProductAssociationsRecord> aliased) {
            super(alias, aliased);
        }

        @Override
        public ProductAssociationsPath as(String alias) {
            return new ProductAssociationsPath(DSL.name(alias), this);
        }

        @Override
        public ProductAssociationsPath as(Name alias) {
            return new ProductAssociationsPath(alias, this);
        }

        @Override
        public ProductAssociationsPath as(Table<?> alias) {
            return new ProductAssociationsPath(alias.getQualifiedName(), this);
        }
    }

    @Override
    public Schema getSchema() {
        return aliased() ? null : Public.PUBLIC;
    }

    @Override
    public UniqueKey<ProductAssociationsRecord> getPrimaryKey() {
        return Keys.PRODUCT_ASSOCIATIONS_PKEY;
    }

    @Override
    public List<ForeignKey<ProductAssociationsRecord, ?>> getReferences() {
        return Arrays.asList(Keys.PRODUCT_ASSOCIATIONS__PRODUCT_ASSOCIATIONS_PRODUCT_ASSOCIATION_TYPE_ID_FKEY, Keys.PRODUCT_ASSOCIATIONS__PRODUCT_ASSOCIATIONS_PRODUCT_ID_FKEY);
    }

    private transient ProductAssociationTypesPath _productAssociationTypes;

    /**
     * Get the implicit join path to the
     * <code>public.product_association_types</code> table.
     */
    public ProductAssociationTypesPath productAssociationTypes() {
        if (_productAssociationTypes == null)
            _productAssociationTypes = new ProductAssociationTypesPath(this, Keys.PRODUCT_ASSOCIATIONS__PRODUCT_ASSOCIATIONS_PRODUCT_ASSOCIATION_TYPE_ID_FKEY, null);

        return _productAssociationTypes;
    }

    private transient ProductsPath _products;

    /**
     * Get the implicit join path to the <code>public.products</code> table.
     */
    public ProductsPath products() {
        if (_products == null)
            _products = new ProductsPath(this, Keys.PRODUCT_ASSOCIATIONS__PRODUCT_ASSOCIATIONS_PRODUCT_ID_FKEY, null);

        return _products;
    }

    @Override
    public ProductAssociations as(String alias) {
        return new ProductAssociations(DSL.name(alias), this);
    }

    @Override
    public ProductAssociations as(Name alias) {
        return new ProductAssociations(alias, this);
    }

    @Override
    public ProductAssociations as(Table<?> alias) {
        return new ProductAssociations(alias.getQualifiedName(), this);
    }

    /**
     * Rename this table
     */
    @Override
    public ProductAssociations rename(String name) {
        return new ProductAssociations(DSL.name(name), null);
    }

    /**
     * Rename this table
     */
    @Override
    public ProductAssociations rename(Name name) {
        return new ProductAssociations(name, null);
    }

    /**
     * Rename this table
     */
    @Override
    public ProductAssociations rename(Table<?> name) {
        return new ProductAssociations(name.getQualifiedName(), null);
    }

    /**
     * Create an inline derived table from this table
     */
    @Override
    public ProductAssociations where(Condition condition) {
        return new ProductAssociations(getQualifiedName(), aliased() ? this : null, null, condition);
    }

    /**
     * Create an inline derived table from this table
     */
    @Override
    public ProductAssociations where(Collection<? extends Condition> conditions) {
        return where(DSL.and(conditions));
    }

    /**
     * Create an inline derived table from this table
     */
    @Override
    public ProductAssociations where(Condition... conditions) {
        return where(DSL.and(conditions));
    }

    /**
     * Create an inline derived table from this table
     */
    @Override
    public ProductAssociations where(Field<Boolean> condition) {
        return where(DSL.condition(condition));
    }

    /**
     * Create an inline derived table from this table
     */
    @Override
    @PlainSQL
    public ProductAssociations where(SQL condition) {
        return where(DSL.condition(condition));
    }

    /**
     * Create an inline derived table from this table
     */
    @Override
    @PlainSQL
    public ProductAssociations where(@Stringly.SQL String condition) {
        return where(DSL.condition(condition));
    }

    /**
     * Create an inline derived table from this table
     */
    @Override
    @PlainSQL
    public ProductAssociations where(@Stringly.SQL String condition, Object... binds) {
        return where(DSL.condition(condition, binds));
    }

    /**
     * Create an inline derived table from this table
     */
    @Override
    @PlainSQL
    public ProductAssociations where(@Stringly.SQL String condition, QueryPart... parts) {
        return where(DSL.condition(condition, parts));
    }

    /**
     * Create an inline derived table from this table
     */
    @Override
    public ProductAssociations whereExists(Select<?> select) {
        return where(DSL.exists(select));
    }

    /**
     * Create an inline derived table from this table
     */
    @Override
    public ProductAssociations whereNotExists(Select<?> select) {
        return where(DSL.notExists(select));
    }
}
