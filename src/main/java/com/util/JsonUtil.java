package com.util;

import org.json.JSONObject;

import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class JsonUtil {

    public static <T> List<JSONObject> convertToJson(List<T> classList) {
        List<JSONObject> jsonArray = new ArrayList<>();

        for (T obj : classList) {
            JSONObject jsonObject = new JSONObject();

            // Get all declared fields from the object's class
            Field[] fields = obj.getClass().getDeclaredFields();

            for (Field field : fields) {
                field.setAccessible(true); // Allow access to private fields
                try {
                    Object value = field.get(obj);
//                    System.out.println("1field value"+field.getName()+" "+value);
                    if (value != null ) { // Include only non-null fields
//                        System.out.println(value + " " + value.getClass());
                        
                        if (isPrimitiveOrWrapper(value.getClass())) {
                        	//System.out.println("2field value"+field.getName()+" "+value);
                            jsonObject.put(field.getName(), value);
                        } else {
                            // Recursively convert objects to JSON
                            // Since convertToJson returns a list, we take the first item for a single object
                            jsonObject.put(field.getName(), convertToJson(Arrays.asList(value)).get(0));
                        }
                    }
                } catch (IllegalAccessException e) {
                    e.printStackTrace(); // Handle the exception as needed
                }
            }
            jsonArray.add(jsonObject);
        }
//        System.out.println("jsonArray " + jsonArray);
        return jsonArray;
    }

    // Helper method to check if a class is a primitive or its wrapper
    private static boolean isPrimitiveOrWrapper(Class<?> clazz) {
        return clazz.isPrimitive() ||
               clazz == Boolean.class ||
               clazz == Character.class ||
               clazz == Byte.class ||
               clazz == Short.class ||
               clazz == Integer.class ||
               clazz == Long.class ||
               clazz == Float.class || 
               clazz == String.class ||
               clazz == Double.class;
    }
}
