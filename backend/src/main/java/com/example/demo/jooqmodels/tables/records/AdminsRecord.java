/*
 * This file is generated by jOOQ.
 */
package com.example.demo.jooqmodels.tables.records;


import com.example.demo.jooqmodels.tables.Admins;

import java.time.LocalDateTime;

import org.jooq.Record1;
import org.jooq.impl.UpdatableRecordImpl;


/**
 * This class is generated by jOOQ.
 */
@SuppressWarnings({ "all", "unchecked", "rawtypes", "this-escape" })
public class AdminsRecord extends UpdatableRecordImpl<AdminsRecord> {

    private static final long serialVersionUID = 1L;

    /**
     * Setter for <code>public.admins.id</code>.
     */
    public void setId(Integer value) {
        set(0, value);
    }

    /**
     * Getter for <code>public.admins.id</code>.
     */
    public Integer getId() {
        return (Integer) get(0);
    }

    /**
     * Setter for <code>public.admins.email</code>.
     */
    public void setEmail(String value) {
        set(1, value);
    }

    /**
     * Getter for <code>public.admins.email</code>.
     */
    public String getEmail() {
        return (String) get(1);
    }

    /**
     * Setter for <code>public.admins.password</code>.
     */
    public void setPassword(String value) {
        set(2, value);
    }

    /**
     * Getter for <code>public.admins.password</code>.
     */
    public String getPassword() {
        return (String) get(2);
    }

    /**
     * Setter for <code>public.admins.username</code>.
     */
    public void setUsername(String value) {
        set(3, value);
    }

    /**
     * Getter for <code>public.admins.username</code>.
     */
    public String getUsername() {
        return (String) get(3);
    }

    /**
     * Setter for <code>public.admins.updated_at</code>.
     */
    public void setUpdatedAt(LocalDateTime value) {
        set(4, value);
    }

    /**
     * Getter for <code>public.admins.updated_at</code>.
     */
    public LocalDateTime getUpdatedAt() {
        return (LocalDateTime) get(4);
    }

    /**
     * Setter for <code>public.admins.created_at</code>.
     */
    public void setCreatedAt(LocalDateTime value) {
        set(5, value);
    }

    /**
     * Getter for <code>public.admins.created_at</code>.
     */
    public LocalDateTime getCreatedAt() {
        return (LocalDateTime) get(5);
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
     * Create a detached AdminsRecord
     */
    public AdminsRecord() {
        super(Admins.ADMINS);
    }

    /**
     * Create a detached, initialised AdminsRecord
     */
    public AdminsRecord(Integer id, String email, String password, String username, LocalDateTime updatedAt, LocalDateTime createdAt) {
        super(Admins.ADMINS);

        setId(id);
        setEmail(email);
        setPassword(password);
        setUsername(username);
        setUpdatedAt(updatedAt);
        setCreatedAt(createdAt);
        resetChangedOnNotNull();
    }
}
