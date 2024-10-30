package com.handlers;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.json.JsonObject;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.json.JSONArray;
import org.json.JSONObject;

import com.config.LoggerConfig;
import com.dao.Dao;
import com.enums.DatabaseTable;
import com.exception.ApplicationException;
import com.models.Discounts;
import com.models.Invoice;
import com.models.UserDiscounts;
import com.util.JsonUtil;

public class DiscountHandler {
	private static final Logger logger = LoggerConfig.getLogger();
	public HashMap<String, Object> createHashMap(Object... keyValuePairs) {
		HashMap<String, Object> map = new HashMap<>();
		if (keyValuePairs.length % 2 != 0) {
			throw new IllegalArgumentException("Invalid number of arguments. Please provide key-value pairs.");
		}
		for (int i = 0; i < keyValuePairs.length; i += 2) {
			String key = (String) keyValuePairs[i]; 
			Object value = keyValuePairs[i + 1]; 
			map.put(key, value);
		}

		return map;
	}
  public Object get(HttpSession session,Map<String, String> queryParams,JsonObject payloadData) throws ApplicationException {
	try {
	Dao DaoObj=new Dao();
	
	if(queryParams.get("discount_code")!=null) {
	    long userId=(long) session.getAttribute("user");
	    List<Discounts> disObj=DaoObj.FetchRecord(DatabaseTable.DISCOUNTS.getTableName(),Discounts.class,createHashMap("discount_code"+"=",queryParams.get("discount_code"),"is_enabled"+"=",true),null,"discount_id","percentage");
		if(disObj.isEmpty()) {
			throw new ApplicationException(HttpServletResponse.SC_NOT_FOUND,"Invalid Discount code");//to check the discount is in stored in discounts
		}
		long discountId=disObj.get(0).getDiscountId();
		int percentage=disObj.get(0).getPercentage();
		
		List<UserDiscounts> userDiscount=DaoObj.FetchRecord(DatabaseTable.USER_DISCOUNTS.getTableName(),UserDiscounts.class,createHashMap("discount_id"+"=",discountId,"user_id"+"=",userId,"status"+"=",1),createHashMap("orderDesc","created_time","limit",1,"offset",0));
		if(userDiscount.isEmpty()) {
			throw new ApplicationException(HttpServletResponse.SC_NOT_FOUND,"User is not eligible for this discount");//to check the user is eligible for this discount
		}
		else 
		{
			JSONObject obj=new JSONObject();
		    obj.put("percentage", percentage);
		    System.out.println(obj.put("discount_id", discountId));
		    return obj;
		}
	}
	else if(queryParams.get("discount_id")!=null)
	{
		List<Discounts> disObj=DaoObj.FetchRecord(DatabaseTable.DISCOUNTS.getTableName(),Discounts.class,createHashMap("discount_id"+"=",Integer.parseInt(queryParams.get("discount_id")),"is_enabled"+"=",true),null,"discount_id","percentage","discount_code");
		if(disObj.isEmpty()) {
			throw new ApplicationException(HttpServletResponse.SC_NOT_FOUND,"Invalid Discount Id");//to check the discount is in stored in discounts
		}
		return JsonUtil.convertToJson(disObj);
	}
	else {
		if(session==null) {
			throw new ApplicationException(HttpServletResponse.SC_BAD_GATEWAY,"Unauthorised Access");
		}
	    long userId=(long) session.getAttribute("user");
		List<String[]> joins = new ArrayList<>();
//		List<Map<String, Object>> discountsList = new ArrayList<>();
		
		joins.add(new String[] {"join","discounts","discounts.discount_id","user_discounts.discount_id"});
		Map<Class<?>, List<String>> columnToRetrieve=new HashMap<>();
		columnToRetrieve.put(UserDiscounts.class,Arrays.asList("discount_id","user_id","status","created_time","user_discount_id"));
		columnToRetrieve.put(Discounts.class,Arrays.asList("percentage","discount_code"));
		
		HashMap<String, Object> conditionFieldValues=createHashMap("user_discounts.user_id"+"=",userId,"user_discounts.status"+"=",1);
		List<UserDiscounts> list=  DaoObj.FetchJoinRecord(DatabaseTable.USER_DISCOUNTS.getTableName(),UserDiscounts.class, joins, conditionFieldValues, null, columnToRetrieve);
    	System.out.println(list);
    	JSONObject jsons=new JSONObject();
    	JSONArray discountsArray = new JSONArray();
		for(UserDiscounts i:list) {
			JSONObject json=new JSONObject();
			List<Invoice> invoiceList=DaoObj.FetchRecord(DatabaseTable.INVOICE.getTableName(),Invoice.class,createHashMap("created_time"+">",i.getCreatedTime()), null);
			if(invoiceList.size()>=3) {
				DaoObj.UpdateRecord(DatabaseTable.USER_DISCOUNTS.getTableName(),UserDiscounts.class,createHashMap("user_id"+"=",userId,"created_time"+"=",i.getCreatedTime()),createHashMap("status",2));
			}
			else {
				System.out.println("Discount object "+i.getDiscounts());
				json.put("discount_id",i.getDiscountId());
				if(i.getDiscounts()!=null) {
				json.put("percentage",i.getDiscounts().getPercentage());
				json.put("discound_code",i.getDiscounts().getDiscountCode());
				}
				
				json.put("created_time",i.getCreatedTime());
				json.put("user_discount_id",i.getUserDiscountId());
				discountsArray.put(json);
			}	
		}
		jsons.put("discounts",discountsArray);
		return jsons;
	}
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
public void post(HttpSession session,Map<String, String> queryParams,JsonObject payloadData) throws ApplicationException {
	
}
public void put(HttpSession session,Map<String, String> queryParams,JsonObject payloadData) throws ApplicationException {
	
}
public void delete(HttpSession session,Map<String, String> queryParams,JsonObject payloadData) throws ApplicationException {
	
}

}
