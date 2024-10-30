package com.enums;

public enum UserFields {
    EMAIL("email"),
    PASSWORD("password"),
    MOBILE("mobile"),
	ADDRESS("address"),
    FIRSTNAME("first_name"),
    LASTNAME("last_name"),
    USERID("user_id"),
    SALT("salt"),
    PREVPWD("prev_pwd");

    private final String fieldName;

    UserFields(String fieldName) {
        this.fieldName = fieldName;
    }

    public String getFieldName() {
        return fieldName;
    }
}
