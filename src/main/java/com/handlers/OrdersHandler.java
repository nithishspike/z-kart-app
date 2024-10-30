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

import org.json.simple.JSONObject;

import com.config.LoggerConfig;
import com.dao.Dao;
import com.enums.DatabaseTable;
import com.exception.ApplicationException;
import com.models.Discounts;
import com.models.Invoice;
import com.models.UserDiscounts;
import com.models.UserProduct;
import com.util.GenerateDiscount;
import com.util.JsonUtil;
import com.util.OrdersUtil;
import com.util.UsersUtil;


public class OrdersHandler {
	private static final Logger logger = LoggerConfig.getLogger();
	public HashMap<String, Object> createHashMap(Object... keyValuePairs) {
		HashMap<String, Object> map = new HashMap<>();
		// Ensure the number of arguments is even (as key-value pairs)
		if (keyValuePairs.length % 2 != 0) {
			throw new IllegalArgumentException("Invalid number of arguments. Please provide key-value pairs.");
		}
		for (int i = 0; i < keyValuePairs.length; i += 2) {
			String key = (String) keyValuePairs[i]; // Cast the key to String
			Object value = keyValuePairs[i + 1]; // The value can be any Object
			map.put(key, value);
		}
		return map;
	}
	
	public JSONObject post(HttpSession session,Map<String, String> queryParams,JsonObject payloadData) throws ApplicationException {
        try {
            Dao dao = new Dao();
//            List<Discounts> discountList=null;
            List<UserDiscounts> userDiscountList = null;
            long userId = (long) session.getAttribute("user");
            OrdersUtil.parseAndValidateRequest(payloadData, "shipping_address", "payment_mode");
//            // Fetch user cart
            List<UserProduct> cartItems = OrdersUtil.fetchUserCart(dao, userId);
            Map<String, Object> result = OrdersUtil.calculateTotalAndPrepareInvoice(cartItems, dao,payloadData.get("deal"));
            double totalAmount = (double) result.get("totalAmount");
			List<Double> priceList = (List<Double>) result.get("priceList");
            // Create the invoice
			
            if(payloadData.containsKey("user_discount_id")) {
            	//apply discount  if have discount id
//               HashMap<String,Object> queryOptions=new HashMap<String,Object>();
               Map<Class<?>, List<String>> columnToRetrieve=new HashMap<>();
               columnToRetrieve.put(Discounts.class, Arrays.asList("discount_code","percentage","discount_id")); //column to retrieve
               List<String[]> joins = new ArrayList<>();
               joins.add(new String[] {"join","discounts","discounts.discount_id","user_discounts.discount_id"});
               long userDiscountId=payloadData.getJsonNumber("user_discount_id").longValue();
               userDiscountList=dao.FetchJoinRecord(DatabaseTable.USER_DISCOUNTS.getTableName(),
            		   				UserDiscounts.class,joins, 
            		   				createHashMap("user_discount_id"+"=",userDiscountId), null,columnToRetrieve);
               dao.UpdateRecord(DatabaseTable.USER_DISCOUNTS.getTableName()
            		   			, UserDiscounts.class, createHashMap("user_discount_id"+"=",userDiscountId),createHashMap("status",2));
               //Apply discount is used
            }
            List<Integer> stock=(List<Integer>)result.get("stock");
            OrdersUtil.updateProducts(cartItems,stock);
            List<Invoice> invoiceObj = OrdersUtil.createInvoice(dao, userId, totalAmount, payloadData,userDiscountList);
//            // Add invoice items to database
//            
            String invoiceNumber=OrdersUtil.addInvoiceItems(dao, cartItems, invoiceObj,priceList);
//            // Clear user cart
            OrdersUtil.clearUserCart(dao, userId);
            JSONObject json=new JSONObject();
            if(totalAmount>=20000) 
            {
            	HashMap<String,Object> discount=GenerateDiscount.RandomDiscountGenerator();
            	List<Map<String,Object>> columnValues=new ArrayList<>();
            	columnValues.add(createHashMap("user_id",userId,"discount_id",discount.get("discount_id")));
            	dao.InsertRecord(DatabaseTable.USER_DISCOUNTS.getTableName(),columnValues, UserDiscounts.class);
            	json.put("discount_code",discount.get("discount_code"));
            	json.put("percentage", discount.get("percentage"));
            }
            json.put("message","User Order has been placed successfully");
            return json;
        } catch (ApplicationException e) {
            logger.log(Level.SEVERE, e.getMessage(), e);
            throw new ApplicationException(e.getstatusCode(), e.getMessage());
        }
        catch (Exception e) {
            logger.log(Level.SEVERE, "An error occurred while placing the order.", e);
            throw new ApplicationException(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Internal Server Error");
        }
    }
public Object get(HttpSession session,Map<String, String> queryParams,JsonObject payloadData) throws ApplicationException{
	
	try {
		
		List<Invoice> invoiceList;
		long userId = UsersUtil.getSessionUserId(session);
		HashMap<String, HashMap<String, Object>> params = OrdersUtil.extractParams(queryParams);
		if(UsersUtil.validateAdmin(session))
		{
			invoiceList=OrdersUtil.fetchInvoice(userId,true,params);
		}
		else {
			invoiceList=OrdersUtil.fetchInvoice(userId,false,params);
		}
		
		System.out.println(JsonUtil.convertToJson(invoiceList).toString());
		return JsonUtil.convertToJson(invoiceList);
		
	}
	catch (ApplicationException e) {
        logger.log(Level.SEVERE, e.getMessage(), e);
        throw new ApplicationException(e.getstatusCode(), e.getMessage());
    }
    catch (Exception e) {
        logger.log(Level.SEVERE, "An error occurred while placing the order.", e);
       
   }
	return null;
}
public void put(HttpSession session,Map<String, String> queryParams,JsonObject payloadData) throws ApplicationException{
	   
}
public void delete(HttpSession session,Map<String, String> queryParams,JsonObject payloadData) throws ApplicationException{
	   
}

}
