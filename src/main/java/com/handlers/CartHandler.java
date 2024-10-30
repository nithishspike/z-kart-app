package com.handlers;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.json.Json;
import javax.json.JsonArray;
import javax.json.JsonObject;
import javax.json.JsonReader;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.json.JSONObject;

import com.config.LoggerConfig;
import com.dao.Dao;
import com.enums.DatabaseTable;
import com.exception.ApplicationException;
import com.models.Product;
import com.models.UserProduct;
import com.models.Users;
import com.util.CartUtil;
import com.util.JsonUtil;
public class CartHandler {
	private static final Logger logger = LoggerConfig.getLogger();
	public HashMap<String, Object> createHashMap(Object... keyValuePairs) {
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
	public boolean validateUser(HttpServletRequest req) throws ApplicationException {
		List<Users> user=null;
		try {
			
			Dao DaoObj=new Dao();
			HttpSession session=req.getSession(false);
			long userId=(long) session.getAttribute("user");
			user = DaoObj.FetchRecord(DatabaseTable.USERS.getTableName(), Users.class, createHashMap("user_id "+"=",userId), null, "is_admin");
		} catch (Exception e) {
			logger.warning("An error occurred while validating the user in ProductHandler");
			throw new ApplicationException(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "An error occurred while validating the user in ProductHandler");
		}
		return user.get(0).getisAdmin();
	}
	public Object post(HttpSession session,Map<String, String> queryParams,JsonObject payloadData) throws ApplicationException {
	   try {
		   List<UserProduct> listObj;
	    Dao DaoObj=new Dao();
		long userId=(long) session.getAttribute("user");
//		JsonReader jsonReader = Json.createReader(req.getInputStream());
//		JsonObject jsonObject = jsonReader.readObject();
		if(!payloadData.containsKey("product_id") || !payloadData.containsKey("quantity"))
		{
			
			throw new ApplicationException(HttpServletResponse.SC_NOT_FOUND,"Invalid parameters");
		}
//		System.out.println(jsonObject.get);
		long productId=payloadData.getJsonNumber("product_id").longValue();
		List<Product> listProduct=DaoObj.FetchRecord(DatabaseTable.PRODUCT.getTableName(), Product.class,createHashMap("product_id"+"=",productId), null);
		if(listProduct.isEmpty())
		{
			throw new ApplicationException(HttpServletResponse.SC_NOT_MODIFIED,"Prouduct is not avaliable to purchase");
		}
		listObj=DaoObj.FetchRecord(DatabaseTable.USER_PRODUCT.getTableName(), UserProduct.class,createHashMap("user_id"+"=",userId,"product_id"+"=",productId), null,"user_id");
		if(!listObj.isEmpty())
		{
			throw new ApplicationException(HttpServletResponse.SC_NOT_MODIFIED,"The product is already in your cart");
		}
	   List<Map<String, Object>> fieldValues=new ArrayList<>();
	   fieldValues.add(createHashMap("user_id",userId,"product_id",productId,"quantity",payloadData.getInt("quantity")));
	   DaoObj.InsertRecord(DatabaseTable.USER_PRODUCT.getTableName(),
			   fieldValues,
			   UserProduct.class);
	   JSONObject json=new JSONObject();
	   json.put("message", "Product has been successfully added");
	   return json;
	   }
	   catch(ApplicationException e)
	   {
		   logger.log(Level.SEVERE ,e.getMessage(),e);
		   throw new ApplicationException(e.getstatusCode(),e.getMessage());
	   }
	   catch(Exception e) {
		   logger.log(Level.SEVERE ,"An error occurred while updating user details.", e);
       	   throw new ApplicationException(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Internal Server Errror");
	   }
		
	}
	public Object get(HttpSession session,Map<String, String> queryParams,JsonObject payloadData) throws ApplicationException {
//		List<UserProduct> cartList;
		try {
			Dao DaoObj=new Dao();
			long userId=(long) session.getAttribute("user");
			List<String[]> joins = new ArrayList<>();
	    	Map<Class<?>, List<String>> columnToRetrieve=new HashMap<>();
	    	columnToRetrieve.put(UserProduct.class,Arrays.asList("product_id","quantity"));
	    	columnToRetrieve.put(Product.class, Arrays.asList("product_name","product_price","stock"));
	    	joins.add(new String[] {"join","product","product.product_id","user_product.product_id"});
			List<UserProduct> userProductList=DaoObj.FetchJoinRecord(DatabaseTable.USER_PRODUCT.getTableName(), UserProduct.class,joins,createHashMap("user_product.user_id "+"=",userId), null,columnToRetrieve);
			List<JSONObject> jsonResponse =JsonUtil.convertToJson(userProductList);
//            cartList=DaoObj.FetchRecord(DatabaseTable.USER_PRODUCT.getTableName(),UserProduct.class,createHashMap("user_id "+"=",userId),null,"product_id","quantity");
            if(userProductList.isEmpty()) {
                    throw new ApplicationException(HttpServletResponse.SC_NO_CONTENT,"Cart is Empty");
            }
            else {
//            	ObjectMapper objectMapper = new ObjectMapper();
//                objectMapper.setSerializationInclusion(JsonInclude.Include.NON_DEFAULT);
//                String jsonResponse = objectMapper.writeValueAsString(cartList);
                return jsonResponse;
            }
            
		}
		catch(ApplicationException e) {
			   logger.log(Level.SEVERE ,e.getMessage(),e);
			   throw new ApplicationException(e.getstatusCode(),e.getMessage());
		}
		catch(Exception e) {
			logger.log(Level.SEVERE ,"An error occurred while updating user details.", e);
	       	throw new ApplicationException(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Internal Server Errror");
		}
		
	}
	public Object put(HttpSession session,Map<String, String> queryParams,JsonObject payloadData) throws ApplicationException {
	    try {
	        Dao daoObj = new Dao();
	        long userId = (long) session.getAttribute("user");
//	        JsonReader jsonReader = Json.createReader(req.getInputStream());
//	        JsonArray jsonArray = jsonReader.readArray();
//	        JsonArray jsonArray = jsonReader.readArray();
	        // Iterate through each product in the array
//	        for (JsonObject jsonObject : jsonArray.getValuesAs(JsonObject.class)) {
//	            // Check if product_id and quantity are provided
	            if (!payloadData.containsKey("product_id") || !payloadData.containsKey("quantity")) {
	                throw new ApplicationException(HttpServletResponse.SC_NOT_FOUND, "Invalid parameters");
	            }
//
	            long productId = payloadData.getJsonNumber("product_id").longValue();
	            int quantity = payloadData.getInt("quantity");
//	            // Check stock and product availability using CartUtil
	            List<Product> listProduct = CartUtil.checkProductStock(daoObj, productId, quantity);
//
//	            // Check if the product exists in the user's cart
//	            if (!CartUtil.isProductInCart(daoObj, userId, productId)) {
//	                throw new ApplicationException(HttpServletResponse.SC_NOT_MODIFIED, "Product item not found in cart");
//	            }

	            // Update the product quantity in the cart or delete if quantity is 0
	            CartUtil.updateProductInCart(daoObj, userId, productId, quantity);

	            // Log deletion message
	            if (quantity == 0) {
	                System.out.println(listProduct.get(0).getProductName() + " has been Deleted from the cart");
	            }
//	        }

	        // Send success response
	        JSONObject json=new JSONObject();
	        json.put("message", "Products have been successfully updated");
	        return json;
	    } catch (Exception e) {
	        logger.log(Level.SEVERE, "An error occurred while updating cart details.", e);
	        throw new ApplicationException(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Internal Server Error");
	    }
	}


	public void delete(HttpSession session,Map<String, String> queryParams,JsonObject payloadData) throws ApplicationException {
		
	}
	}
