package com.enums;

public enum DatabaseTable {
    USERS("users"),
    BRAND("brand"),
    CATEGORY("category"),
    DISCOUNTS("discounts"),
    INVOICE("invoice"),
    INVOICE_ITEMS("invoice_items"),
    PRODUCT("product"),
    USER_DISCOUNTS("user_discounts"),
    USER_PRODUCT("user_product");
	
    private final String tableName;
    DatabaseTable(String tableName) {
        this.tableName = tableName;
    }

    public String getTableName() {
        return tableName;
    }
}

