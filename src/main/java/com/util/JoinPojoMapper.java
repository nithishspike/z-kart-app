package com.util;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

import com.models.Product;
import com.models.UserProduct;

public class JoinPojoMapper {
    public static <T> List<T> mapListToPojoList(Map<Class<?>, List<String>> classMapList, 
                                                List<Map<String, Object>> mapList, 
                                                Class<?> mainClass)
            throws NoSuchMethodException, SecurityException, IllegalAccessException, 
                   IllegalArgumentException, InvocationTargetException, 
                   InstantiationException {
//    	columnToRetrieve.put(UserProduct.class,Arrays.asList("product_id","quantity"));
//    	columnToRetrieve.put(Product.class, Arrays.asList("product_name","product_price","stock"));
        // Create a list to hold all the main class objects
        List<T> objList = new ArrayList<>();
        // Iterate through the mapList
//        System.out.println("main class is "+mainClass);
        for (Map<String, Object> map : mapList) {
            // Create an instance of the main class for each map
        	
            T mainObj = (T) mainClass.getDeclaredConstructor().newInstance();

            // Process each class and its associated column names
            for (Map.Entry<Class<?>, List<String>> entry : classMapList.entrySet()) {
                Class<?> clazz = entry.getKey();    // Get the class type
                List<String> columnNames = entry.getValue(); // Get the column names tied to the class

                // Create an instance of the POJO (the class)
                Object obj = clazz.getDeclaredConstructor().newInstance();

                // Iterate over each column name and set the corresponding field in the POJO
                for (String columnName : columnNames) {
                    Object value = map.get(columnName); // Get the value from the map
                    if (value != null) {
                        // Construct the setter method name
                        String setterName = "set" + CamelCaseUtil.toCamelCase(columnName);

                        // Determine the appropriate parameter type for the setter
                        Class<?> valueType = value.getClass();
                        if (value instanceof BigDecimal) {
                            valueType = double.class;
                            value = ((BigDecimal) value).doubleValue();
                        } else if (value instanceof Long) {
                            valueType = long.class;
                        } else if (value instanceof Integer) {
                            valueType = int.class;
                        } else if (value instanceof Double) {
                            valueType = double.class;
                        } else if (value instanceof Boolean) {
                            valueType = boolean.class;
                        } else if (value instanceof Float) {
                            valueType = float.class;
                        } else if (value instanceof Character) {
                            valueType = char.class;
                        }

                        Method setter = clazz.getMethod(setterName, valueType);
                        setter.invoke(obj, value);
                    }
                }
                
                // Associate this object with the main class object using its setter
//                System.out.println("comparing the sub main class "+clazz+" "+mainClass);
                if (!clazz.equals(mainClass)) {
//                	System.out.println(true);
                    // Nest child class in main class if it's not the same as the main class
                    String associationSetter = "set" + clazz.getSimpleName(); // Assuming the method name follows this pattern
                    Method associationMethod = mainClass.getMethod(associationSetter, clazz);
                    associationMethod.invoke(mainObj, obj);
                    associationMethod =mainClass.getMethod("get"+clazz.getSimpleName());
//                    System.out.println("invoked value is"+associationMethod.invoke(mainObj)+" "+associationSetter);
                    
                } else {
                    // If clazz is the same as mainClass, directly populate mainObj
                    mainObj = (T) obj;
                }
            }

            // Add the fully populated main object to the list
//            System.out.println(((UserProduct) mainObj).getProduct());
            objList.add(mainObj);
        }

        // Return the list of fully populated main objects
        return objList;
    }
}



