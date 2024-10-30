package com.servlets;

import com.dao.Dao;
import com.emulator.Runner;
import com.models.Brand;
import com.models.Product;
import com.models.UserProduct;
import com.models.Users;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

//@WebServlet("/main")
public class Main {
	public static <T> Object invokeMethod(List<T> objectList, int index, String methodName)
			throws NoSuchMethodException, SecurityException, IllegalAccessException, IllegalArgumentException,
			InvocationTargetException {

		if (index < 0 || index >= objectList.size()) {
			throw new IndexOutOfBoundsException("Index out of bounds for the object list.");
		}

		// Get the object from the list at the specified index
		T obj = objectList.get(index);

		// Find the method with the specified name and invoke it
		Method method = obj.getClass().getMethod(methodName);
		return method.invoke(obj);
	}

	public static HashMap<String, Object> createHashMap(Object... keyValuePairs) {
		HashMap<String, Object> map = new HashMap<>();
		// Ensure the number of arguments is even (as key-value pairs)
		if (keyValuePairs.length % 2 != 0) {
			throw new IllegalArgumentException("Invalid number of arguments. Please provide key-value pairs.");
		}
		// Iterate over the key-value pairs and populate the HashMap
		for (int i = 0; i < keyValuePairs.length; i += 2) {
			String key = (String) keyValuePairs[i]; // Cast the key to String
			Object value = keyValuePairs[i + 1]; // The value can be any Object
			map.put(key, value);
		}

		return map;
	}

	public static void main(String[] args) throws Exception {
		Dao obj = new Dao();

//    	select data
		obj.FetchRecord("users", Users.class, createHashMap("user_id <", 100004l,"last_name ilike ","doe"+"%"),null, "first_name", "last_name", "email","user_id");
//		System.out.println("new Connection" + new Runner().Tc.get());
//    	Runner.closeConnection();
//       insert data
//    	ArrayList<Map<String,Object>> mp=new ArrayList<>();
//    	Dao obj1=new Dao();
//    	HashMap<String,Object> v=new HashMap<>();
//    	v.put("user_id",100001);
//    	v.put("product_id", 500000l);
//    	v.put("quantity", 3);
//    	v.put("created_time", 98676467l);
//    	mp.add(v);
//    	obj1.InsertRecord("user_product",mp,UserProduct.class);

//    	update data
//    	System.out.println(((Brand) obj.UpdateRecord("brand", Brand.class,  createHashMap("brand_name = ", "TechCo"),createHashMap("updated_time", 998576453L),"brand_id","brand_name").get(0)).getBrandName());

//    	delete data
//    	obj.DeleteRecord("users", null, createHashMap("email","bob@example.com","mobile",5554321l));

//    	multiple join
//    	List<String[]> k=new ArrayList<>();
//    	k.add(new String[] {"join","brand","brand.brand_id","product.brand_id"});
//    	List<Product> obj1 = obj.FetchJoinRecord("product", k, null, Product.class, new String[]{});
//
    	
//        System.out.println(invokeMethod(obj1,2,"getCreatedTime"));

//        '
//    	new join method join
   	List<String[]> joins=new ArrayList<>();
    	joins.add(new String[] {"join","brand","brand.brand_id","product.brand_id"});
   	Map<Class<?>, List<String>> columnToRetrieve = new HashMap<>();
    	columnToRetrieve.put(Product.class, Arrays.asList("product_id","product_name","specification") );
  	columnToRetrieve.put(Brand.class, Arrays.asList( "brand_id", "brand_name") );
//    System.out.println(((Product) obj.FetchJoinRecord("product", joins, createHashMap("brand.brand_id","product.brand_id"),createHashMap("limit",2,"offset",0,"orderDesc","product_id"), columnToRetrieve).get(0)).getSpecification());
    	
//        // Create a sample HashMap and add it to the list
//        HashMap<String, Object> sampleData = new HashMap<>();
//        sampleData.put("first_name", "John");
//        sampleData.put("last_name", "Doe");
//        sampleData.put("age", 30);
//        listOfData.add(sampleData);
//        HashMap<String, Object> sampleData1 = new HashMap<>();
//        sampleData1.put("first_name", "bob");
//        sampleData1.put("last_name", "sun");
//        sampleData1.put("age", 40);
//        listOfData.add(sampleData1);
//        listOfData.add(sampleData1);
//    	List<?> obj=DynamicPojoMapper.mapListToPojoList(listOfData, "Nitish");
//    	System.out.println(obj.get(0).getClass().getMethod("getlastName").invoke(obj.get(0)));

	}
}
