package com.emulator;

public enum CRUD {
    CREATE("create"),
    READ("select"),
    UPDATE("update"),
    DELETE("delete"),
    INSERT("insert"); // Remove the comma here

    private String operation; // Use lowercase for convention

    private CRUD(String operation) {
        this.operation = operation;
    }

    public String getOperation() {
        return operation;
    }
}
