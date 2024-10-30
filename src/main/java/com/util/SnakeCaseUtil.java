package com.util;

public class SnakeCaseUtil {
	public static String camelToSnakeRegex(String camelCase) {
        // Use regular expression to insert an underscore before each uppercase letter and convert to lowercase
        return camelCase
                .replaceAll("([a-z])([A-Z]+)", "$1_$2") // Insert _ between lowercase and uppercase letter
                .toLowerCase();                         // Convert entire string to lowercase
    }
}
