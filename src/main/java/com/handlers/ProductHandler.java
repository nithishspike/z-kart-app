package com.handlers;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.json.JsonObject;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.config.LoggerConfig;
import com.dao.Dao;
import com.enums.DatabaseTable;
import com.exception.ApplicationException;
import com.models.Brand;
import com.models.Product;
import com.util.JsonUtil;
import com.util.ProductUtil;
import com.util.UsersUtil;

public class ProductHandler {
	
	ThreadLocal<List<String[]>> joins =ThreadLocal.withInitial(ArrayList::new);
	ThreadLocal<Map<Class<?>, List<String>>> columnToRetrieve =ThreadLocal.withInitial(HashMap::new);
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
	public void post (HttpSession session,Map<String, String> queryParams,JsonObject payloadData)
	{
		
	}
    public Object get(HttpSession session,Map<String, String> queryParams,JsonObject payloadData) throws ApplicationException {
       try {
    	List<String[]> joins = new ArrayList<>();
    	Map<Class<?>, List<String>> columnToRetrieve=new HashMap<>();
    	columnToRetrieve.put(Product.class, Arrays.asList("product_id","specification","product_name","product_price","stock","brand_id","category_id") );
    	columnToRetrieve.put(Brand.class, Arrays.asList( "brand_id", "brand_name") );
    	HashMap<String, HashMap<String, Object>> params = ProductUtil.extractParams(queryParams);
    	HashMap<String, Object> conditionFieldValues = params.get("conditionFieldValues");
    	HashMap<String, Object> queryOptions = params.get("queryOptions");
    	joins.add(new String[] {"join","brand","brand.brand_id","product.brand_id"});
    	joins.add(new String[] {"join","category","category.category_id","product.category_id"});
    	Dao DaoObj=new Dao();
    	List<Product> user=  DaoObj.FetchJoinRecord(DatabaseTable.PRODUCT.getTableName(),Product.class,joins, conditionFieldValues, queryOptions, columnToRetrieve);
//        System.out.println("product is fetching");
    	return JsonUtil.convertToJson(user).toString();
       }
       catch(ApplicationException e)
	   {
		   logger.log(Level.SEVERE ,e.getMessage(),e);
		   throw new ApplicationException(e.getstatusCode(),e.getMessage());
	   }
       catch(Exception e)
       {
    	   logger.warning("An Internal Server Error in ProductHandler "+e);
    	   throw new ApplicationException(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Internal Server Error");
   		
       }
    }
    
	public Object  put(HttpSession session,Map<String, String> queryParams,JsonObject payloadData) throws ApplicationException {
		
		try {
			Dao DaoObj=new Dao();
//			jsonReader = Json.createReader(req.getInputStream());
//			JsonObject jsonObject = jsonReader.readObject();
			if(!UsersUtil.validateAdmin(session))
			{
				throw new ApplicationException(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorised Access to resource");
			}
			if(!payloadData.containsKey("product_id") || !payloadData.containsKey("quantity"))
			{
				throw new ApplicationException(HttpServletResponse.SC_NOT_FOUND,"Invalid parameters");
			}
			List<Product> productList=DaoObj.UpdateRecord(DatabaseTable.PRODUCT.getTableName(),
					Product.class,createHashMap("product_id"+"=",Long.parseLong(payloadData.getString("product_id"))),
					createHashMap("stock",Integer.parseInt(payloadData.getString("quantity"))),
					"product_name");
			if(productList.isEmpty()) 
			{
				throw new ApplicationException(HttpServletResponse.SC_NOT_FOUND,"Invalid product id");
			}
			return "Product quanitity is updated";
		}  
		catch(ApplicationException e)
		   {
			logger.warning("Application error in ProductHandler: " + e);
			throw new ApplicationException(e.getstatusCode(),e.getMessage());
		   }
		catch (Exception e) {
			logger.warning("An Internal Server Error in ProductHandler "+e);
	    	throw new ApplicationException(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Internal Server Error");
	   		  
		}
	}
	public Object delete(HttpSession session,Map<String, String> queryParams,JsonObject payloadData) throws ApplicationException {
		Dao DaoObj=new Dao();
		try {
//			jsonReader = Json.createReader(req.getInputStream());
//			JsonObject jsonObject = jsonReader.readObject();
			if(UsersUtil.validateAdmin(session)) {
				List<Product> listObj=DaoObj.DeleteRecord(DatabaseTable.PRODUCT.getTableName(),Product.class, createHashMap("product_id"+"=",Long.parseLong(payloadData.getString("product_id"))));
				if(listObj.isEmpty())
				{
					throw new ApplicationException(HttpServletResponse.SC_NOT_FOUND,"Invalid product id");
				}
				return "Deleted the product successfully";
			}
			else {
				logger.warning("Unauthorised access to the resource");
				throw new ApplicationException(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorised access to the resource");
				
			}
		}
		catch(ApplicationException e)
		   {
			   logger.log(Level.SEVERE ,e.getMessage(),e);
			   throw new ApplicationException(e.getstatusCode(),e.getMessage());
		   }
		
		catch (Exception e) {
			logger.warning("An Internal Server Error in ProductHandler "+e);
	    	throw new ApplicationException(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Internal Server Error");
	   		
		}
		
		
	}
}
