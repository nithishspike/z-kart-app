package com.util;

import java.util.*;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.math.BigDecimal;

public class PojoMapper {

	public static <T> List<T> mapListToPojoList(List<Map<String, Object>> mapList, Class<T> clazz)
			throws NoSuchMethodException, SecurityException, IllegalAccessException, IllegalArgumentException,
			InvocationTargetException, InstantiationException {
//		System.out.println("pojo" + clazz);
		List<T> pojoList = new ArrayList<>();
		if (clazz == null || mapList==null || mapList.isEmpty()  ) {
			System.out.println("Class Name is NULL");
			return pojoList;
		}
		for (Map<String, Object> map : mapList) {
			T obj = (T) clazz.newInstance(); // Create an instance of the POJO

			// Iterate over all entries in the map
			for (Map.Entry<String, Object> entry : map.entrySet()) {
				String fieldName = entry.getKey();
				Object value = entry.getValue();
				// Construct the setter method name (e.g., "setName" for "name")
//	                String setterName = "set" + Character.toUpperCase(fieldName.charAt(0)) + fieldName.substring(1);
				String setterName = "set" + CamelCaseUtil.toCamelCase(fieldName);
				Class<?> valueType=value.getClass();
                if(value instanceof Long)
                {
                	valueType=long.class;
                }
                else if(value instanceof Integer)
                {
                	valueType=int.class;
                }
                else if(value instanceof Double)
                {
                	valueType=double.class;
                }
                else if(value instanceof Boolean)
                {
                	valueType=boolean.class;
                }
                else if(value instanceof Float)
                {
                	valueType=float.class;
                }
                else if(value instanceof Character) {
                	valueType=char.class;
                }
                else if(value instanceof BigDecimal) {
                	value=((BigDecimal) value).doubleValue(); 
                	valueType=double.class;
                }
				// Find the setter method in the class that accepts the value's type
				if (value != null) {
					Method setter = clazz.getMethod(setterName, valueType);
					setter.invoke(obj, value); // Call the setter method with the map value
				}

			}

			pojoList.add(obj); // Add the populated object to the list
		}

		return pojoList;
	}

}
