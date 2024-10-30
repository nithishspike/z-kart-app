package com.util;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.json.JsonNumber;
import javax.json.JsonObject;
import javax.json.JsonValue;
import javax.servlet.http.HttpServletResponse;


import com.dao.Dao;
import com.enums.DatabaseTable;
import com.exception.ApplicationException;
import com.models.Discounts;
import com.models.Invoice;
import com.models.InvoiceItems;
import com.models.Product;
import com.models.UserDiscounts;
import com.models.UserProduct;
import com.models.Users;

public class OrdersUtil {
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
	public static void parseAndValidateRequest(JsonObject jsonObject, String... requiredKeys) throws ApplicationException, IOException {
        
        
        for (String key : requiredKeys) {
            if (!jsonObject.containsKey(key)) {
                throw new ApplicationException(HttpServletResponse.SC_NOT_FOUND, "Missing required parameter: " + key);
            }
        }
    }

    public static List<UserProduct> fetchUserCart(Dao dao, long userId) throws Exception {
        List<UserProduct> cartItems = dao.FetchRecord(DatabaseTable.USER_PRODUCT.getTableName(), 
                UserProduct.class, 
                createHashMap("user_id =", userId), null);
        if (cartItems.isEmpty()) {
            throw new ApplicationException(HttpServletResponse.SC_NOT_FOUND, "User Cart is Empty");
        }
        return cartItems;
    }

    public static Map<String, Object> calculateTotalAndPrepareInvoice(List<UserProduct> cartItems, Dao dao,JsonValue deal) throws Exception {
    	System.out.println("deal number is "+deal);
    	long dealProduct=0;
    	Discounts discountObj=null;
    	List<Integer> stockList=new ArrayList<Integer>();
        double totalAmount = 0;
        if (deal instanceof JsonNumber) {
            JsonNumber dealNumber = (JsonNumber) deal;
            long dealId = dealNumber.longValue();  // Get the deal ID as a long
            discountObj=dao.FetchRecord(DatabaseTable.DISCOUNTS.getTableName(),Discounts.class, createHashMap("discount_id"+"=",dealId), null).get(0);
            if(discountObj.getDiscountCode().equals("DEAL_NOW")) {
            	dealProduct=dao.FetchRecord(DatabaseTable.PRODUCT.getTableName(),Product.class, null,
                		createHashMap("orderDesc", "stock","limit", 1)).get(0).getProductId();
            }
            
        }
        
        List<Double> price=new ArrayList<Double>();
        for (UserProduct cartItem : cartItems) {
            List<Product> product = dao.FetchRecord(DatabaseTable.PRODUCT.getTableName(), 
                    Product.class, 
                    createHashMap("product_id =", cartItem.getProductId(), "stock >=", cartItem.getQuantity()), null);
            stockList.add(product.get(0).getStock());
            if (product.isEmpty()) {
                throw new ApplicationException(HttpServletResponse.SC_NOT_FOUND, "Product not available for purchase");
            }
            if(product.get(0).getProductId()==dealProduct)
            {
            	System.out.println("Offer accepted ");
            	double discount=((100-discountObj.getPercentage())/100.0);
            	totalAmount+=discount*product.get(0).getProductPrice()* cartItem.getQuantity();
            	System.out.println("Offer accepted " + totalAmount);
            }
            else {
            	totalAmount += product.get(0).getProductPrice() * cartItem.getQuantity();
            }
            
            price.add(product.get(0).getProductPrice());
        }
        Map<String, Object> result = new HashMap<>();
        result.put("totalAmount", totalAmount);
        result.put("priceList", price);
        result.put("stock", stockList);
        return result;
    }

    public static List<Invoice> createInvoice(Dao dao, long userId, double totalAmount, JsonObject payloadMap,List<UserDiscounts> userDiscount) throws Exception {
        List<Map<String, Object>> invoiceFields = new ArrayList<>();
        System.out.println("mapping is "+payloadMap);
        invoiceFields.add(createHashMap(
                "user_id", userId,
                "total_amount", totalAmount,
                "payment_mode", payloadMap.getInt("payment_mode"),
                "shipping_address", payloadMap.getString("shipping_address")
                ));
        if(userDiscount!=null) {
        	invoiceFields.get(0).put("discount_id",userDiscount.get(0).getDiscounts().getDiscountId());
        	invoiceFields.get(0).put("total_amount",totalAmount*(100-userDiscount.get(0).getDiscounts().getPercentage())/100);
        	System.out.println("Discount Applied");
        }
//        invoiceFields.get(0).put("discount_id", );
        return dao.InsertRecord(DatabaseTable.INVOICE.getTableName(), invoiceFields, Invoice.class, "invoice_id", "invoice_number");
    }

    public static String addInvoiceItems(Dao dao, List<UserProduct> cartItems, List<Invoice> invoiceObj,List<Double> priceList) throws Exception {
        List<Map<String, Object>> invoiceItems = new ArrayList<>();
        int i=0;
        for (UserProduct cartItem : cartItems) {
            invoiceItems.add(createHashMap(
                    "product_id", cartItem.getProductId(),
                    "quantity", cartItem.getQuantity(),
                    "price", priceList.get(i++),
                    "invoice_id", invoiceObj.get(0).getInvoiceId()));
        }
        dao.InsertRecord("invoice_items", invoiceItems, InvoiceItems.class);
        return invoiceObj.get(0).getInvoiceNumber();
    }
    
    public static HashMap<String, HashMap<String, Object>> extractParams(Map<String, String> paramMap) {
        HashMap<String, Object> conditionFieldValues = new HashMap<>();
        HashMap<String, Object> queryOptions = new HashMap<>();
        
        paramMap.forEach((key, value) -> {
            // Assuming value is an array with one element, you can adjust if needed
            String paramValue = value;
            System.out.println("Key: " + key + ", Value: " + paramValue);
            
            if (paramValue != null && !paramValue.equalsIgnoreCase("null")) {
                switch (key) {
                    case "page_size":
                        queryOptions.put("limit", Integer.parseInt(paramValue));
                        break;
                    case "page_number":
                        if (paramMap.containsKey("page_size") ) {
                            int pageSize = Integer.parseInt(paramMap.get("page_size"));
                            queryOptions.put("offset", pageSize * Integer.parseInt(paramValue));
                        }
                        break;
                    case "email":
                    	conditionFieldValues.put("users.email"+"=", paramValue);
                    	break;
                    case "invoice_number":
                    	conditionFieldValues.put("invoice.invoice_number"+"=",paramValue);
                    	break;
                }
            }
        });
        
        HashMap<String, HashMap<String, Object>> resultMap = new HashMap<>();
        resultMap.put("conditionFieldValues", conditionFieldValues);
        resultMap.put("queryOptions", queryOptions);
        
        return resultMap; 
    }

    public static  void updateProducts(List<UserProduct> cartItems,List<Integer> stock) throws Exception
    {
    	Dao daoObj=new Dao();
    	int i=0;
    	for(UserProduct item:cartItems) {
    		daoObj.UpdateRecord(DatabaseTable.PRODUCT.getTableName()
    				,Product.class,createHashMap("product_id"+"=",item.getProductId()),createHashMap("stock",stock.get(i++)-item.getQuantity()));
    		
    	}
    	System.out.println("product updated Successfully");
    }
    public static List<Invoice> fetchInvoice(long userId,boolean isAdmin,HashMap<String, HashMap<String, Object>> params) throws Exception {
    	List<String[]> joins = new ArrayList<>();
    	Dao dao = new Dao();
    	HashMap<String,Object> condition = new HashMap<>();
    	HashMap<String,Object> queryOptions=new HashMap<>();
    	joins.add(new String[] {"join",DatabaseTable.INVOICE_ITEMS.getTableName(),"invoice.invoice_id","invoice_items.invoice_id"});
		joins.add(new String[] {"left join",DatabaseTable.DISCOUNTS.getTableName(),"discounts.discount_id","invoice.discount_id"});
		joins.add(new String[] {"join",DatabaseTable.PRODUCT.getTableName(),"product.product_id","invoice_items.product_id"});
		Map<Class<?>, List<String>> columnToRetrieve=new HashMap<>();
		columnToRetrieve.put(Invoice.class,Arrays.asList("invoice_id","invoice_number","payment_mode","discount_id","total_amount","shipping_address","created_time"));
		columnToRetrieve.put(InvoiceItems.class,Arrays.asList("product_id","price","quantity"));
		columnToRetrieve.put(Discounts.class,Arrays.asList("discount_code","percentage"));
		columnToRetrieve.put(Product.class,Arrays.asList("product_name","specification"));
		condition.put("invoice.user_id"+"=",userId);
		if(!params.get("conditionFieldValues").isEmpty()) {
			condition=params.get("conditionFieldValues");
		}
		
		if(!params.get("queryOptions").isEmpty()) {
			queryOptions=params.get("queryOptions");
		}
		System.out.println("query working is "+queryOptions);
		if(isAdmin) {
			
			joins.add(new String[] {"join",DatabaseTable.USERS.getTableName(),"users.user_id","invoice.user_id"});
			columnToRetrieve.put(Users.class,Arrays.asList("first_name","last_name","user_id"));
			return dao.FetchJoinRecord(DatabaseTable.INVOICE.getTableName(),
					Invoice.class,joins,condition,queryOptions, columnToRetrieve);
		}
		else {
			
			return dao.FetchJoinRecord(DatabaseTable.INVOICE.getTableName(),
					Invoice.class,joins, 
					condition,queryOptions, columnToRetrieve);
		}
	 }
		
    	
    public static void clearUserCart(Dao dao, long userId) throws Exception {
        dao.DeleteRecord(DatabaseTable.USER_PRODUCT.getTableName(), UserProduct.class, createHashMap("user_id =", userId));
    }
}
