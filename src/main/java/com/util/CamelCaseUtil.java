package com.util;

public class CamelCaseUtil {

	public static String toCamelCase(String columnName) {
		StringBuilder result = new StringBuilder();
		boolean capitalizeNext = false;
		Boolean vairable = columnName.startsWith("is") ? false : true;
		for (int i = 0; i < columnName.length(); i++) {
			char currentChar = columnName.charAt(i);
			if (currentChar == '_') {
				capitalizeNext = true;
			} else {

				if ((i == 0 && vairable) || capitalizeNext) {
					result.append(Character.toUpperCase(currentChar));
					capitalizeNext = false;
				} else {
					result.append(currentChar);
				}
			}
		}
		if (result.toString().startsWith("Is")) {
			result.setCharAt(1, Character.toLowerCase(result.charAt(1)));
		}

		return result.toString();
	}
}
