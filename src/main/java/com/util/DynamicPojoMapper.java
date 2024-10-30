package com.util;

import java.io.Serializable;
import java.lang.reflect.InvocationTargetException;
import java.util.*;
import javassist.*;

public class DynamicPojoMapper {

	static List<Object> dynamicObjects = new ArrayList<>();

	public static Class<?> generate(String className, Map<String, Class<?>> properties)
			throws NotFoundException, CannotCompileException {

		ClassPool pool = ClassPool.getDefault();
		CtClass cc = pool.makeClass(className);

		cc.addInterface(resolveCtClass(Serializable.class));

		for (Map.Entry<String, Class<?>> entry : properties.entrySet()) {
			cc.addField(new CtField(resolveCtClass(entry.getValue()), entry.getKey(), cc));
			cc.addMethod(generateGetter(cc, entry.getKey(), entry.getValue()));
			cc.addMethod(generateSetter(cc, entry.getKey(), entry.getValue()));
		}

		return cc.toClass();
	}

	private static CtMethod generateGetter(CtClass declaringClass, String fieldName, Class<?> fieldClass)
			throws CannotCompileException {
		String getterName = "get" + CamelCaseUtil.toCamelCase(fieldName);
		String methodCode = String.format("public %s %s(){ return this.%s; }", fieldClass.getName(), getterName,
				fieldName);
		return CtMethod.make(methodCode, declaringClass);
	}

	private static CtMethod generateSetter(CtClass declaringClass, String fieldName, Class<?> fieldClass)
			throws CannotCompileException {
		String setterName = "set" + CamelCaseUtil.toCamelCase(fieldName);
		String methodCode = String.format("public void %s(%s %s){ this.%s = %s; }", setterName, fieldClass.getName(),
				fieldName, fieldName, fieldName);
		return CtMethod.make(methodCode, declaringClass);
	}

	private static CtClass resolveCtClass(Class<?> clazz) throws NotFoundException {
		ClassPool pool = ClassPool.getDefault();
		return pool.get(clazz.getName());
	}

	public static Map<String, Class<?>> extractPropertiesFromHashMap(Map<String, Object> map) {
		Map<String, Class<?>> properties = new HashMap<>();
		for (Map.Entry<String, Object> entry : map.entrySet()) {
			properties.put(entry.getKey(), entry.getValue().getClass());
		}
		return properties;
	}

	// Method to convert column names to camel case

	public static <T> List<Object> mapListToPojoList(List<Map<String, Object>> mapList, String clazz)
			throws NotFoundException, CannotCompileException, InstantiationException, IllegalAccessException,
			IllegalArgumentException, InvocationTargetException, NoSuchMethodException, SecurityException {
		// Example input: List of HashMaps
		// Dynamically generate a class for each HashMap and store objects

		int i = 1;
		for (Map<String, Object> map : mapList) {
			System.out.println(map);
			Map<String, Class<?>> properties = extractPropertiesFromHashMap(map);
			Class<?> dynamicClass = generate("DynamicClass1" + (i + ""), properties);
			i += 1;
			// Create an instance of the dynamic class and set field values
			Object instance = dynamicClass.getDeclaredConstructor().newInstance();

			for (Map.Entry<String, Object> entry : map.entrySet()) {
				String setterMethod = "set" + CamelCaseUtil.toCamelCase(entry.getKey());

				if (entry.getValue() == null)
				dynamicClass.getMethod(setterMethod, entry.getValue().getClass()).invoke(instance, entry.getValue());
			}

			dynamicObjects.add(instance);

			// Example: Use getter to retrieve values
//                for (String fieldName : map.keySet()) {
//                    String getterMethod = "get" + toCamelCase(fieldName);
//                    Object value = dynamicClass.getMethod(getterMethod).invoke(instance);
//                    System.out.println("Field: " + fieldName + ", Value: " + value);
//                }
		}
		// Ensure the correct setter method name is used
//            String setterMethod = "set" + toCamelCase("first_name"); // This will yield setFirstName
//            dynamicObjects.get(0).getClass().getMethod(setterMethod, String.class).invoke(dynamicObjects.get(0), "hi");
//            System.out.println(dynamicObjects.get(0).getClass().getMethod("getfirstName").invoke(dynamicObjects.get(0)));
		return dynamicObjects;
	}
}
