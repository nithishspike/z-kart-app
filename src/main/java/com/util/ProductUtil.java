package com.util;

import java.io.IOException;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.logging.Logger;

import javax.json.Json;
import javax.json.JsonObject;
import javax.json.JsonReader;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.config.LoggerConfig;
import com.dao.Dao;
import com.enums.DatabaseTable;
import com.exception.ApplicationException;
import com.models.Discounts;
import com.models.Users;

public class ProductUtil {
	private static final Logger logger = LoggerConfig.getLogger();
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
    public static long getUserIdFromSession(HttpServletRequest req) throws ApplicationException  {
        HttpSession session = req.getSession(false);
        if (session == null || session.getAttribute("user") == null) {
            throw new ApplicationException(HttpServletResponse.SC_UNAUTHORIZED, "User session not found");
        }
        return (long) session.getAttribute("user");
    }

    public static JsonObject getPayload(HttpServletRequest req) throws ApplicationException {
        try (JsonReader jsonReader = Json.createReader(req.getInputStream())) {
            return jsonReader.readObject();
        } catch (IOException e) {
            throw new ApplicationException(HttpServletResponse.SC_BAD_REQUEST, "Invalid request payload");
        }
    }
    
    
    public static HashMap<String, HashMap<String, Object>> extractParams(Map<String, String> paramMap) throws ApplicationException {
        HashMap<String, Object> conditionFieldValues = new HashMap<>();
        HashMap<String, Object> queryOptions = new HashMap<>();
        Dao daoObj = new Dao();

        System.out.println("Parameters: " + paramMap);

        for (Map.Entry<String, String> entry : paramMap.entrySet()) {
            String key = entry.getKey();
            String value = entry.getValue();
            String paramValue = value;
            System.out.println("Key: " + key + ", Value: " + paramValue);

            if (paramValue != null && !paramValue.equalsIgnoreCase("null")) {
                try {
                    switch (key) {
                        case "product_id":
                            conditionFieldValues.put("product.product_id"+"=", Long.parseLong(paramValue));
                            break;
                        case "filter_brand":
                            conditionFieldValues.put("brand.brand_id"+"=", Long.parseLong(paramValue));
                            break;
                        case "filter_category":
                            conditionFieldValues.put("category.category_id"+"=", Long.parseLong(paramValue));
                            break;
                        case "max_price":
                            conditionFieldValues.put("product.product_price <=", Double.parseDouble(paramValue));
                            break;
                        case "min_price":
                            conditionFieldValues.put("product.product_price >=", Double.parseDouble(paramValue));
                            break;
                        case "min_stock":
                            conditionFieldValues.put("product.stock >=", Integer.parseInt(paramValue));
                            break;
                        case "max_stock":
                            conditionFieldValues.put("product.stock <=", Integer.parseInt(paramValue));
                            break;
                        case "filter_name":
                            conditionFieldValues.put("category.display_name ilike", paramValue + "%");
                            conditionFieldValues.put("brand.brand_name ilike", paramValue + "%");
                            conditionFieldValues.put("product.product_name ilike", paramValue + "%");
                            break;
                        case "page_size":
                            if (!paramValue.isEmpty()) {
                                queryOptions.put("limit", Integer.parseInt(paramValue));
                            }
                            break;
                        case "page_number":
                            if (paramMap.containsKey("page_size") ) {
                                try {
                                    int pageSize = Integer.parseInt(paramMap.get("page_size"));
                                    queryOptions.put("offset", pageSize * Integer.parseInt(paramValue));
                                } catch (NumberFormatException e) {
                                    throw new ApplicationException(HttpServletResponse.SC_BAD_REQUEST, "Invalid page number format.");
                                }
                            }
                            break;
                        case "deal":
                            try {
                            	System.out.println("disocunt id is"+paramValue);
                                List<Discounts> discounts = daoObj.FetchRecord(DatabaseTable.DISCOUNTS.getTableName(), Discounts.class,
                                    createHashMap("discount_id"+"=", Integer.parseInt(paramValue), "is_enabled"+"=", true), null, "discount_code", "percentage");
                                
                                if(discounts.isEmpty()) {
                                	throw new ApplicationException(HttpServletResponse.SC_BAD_REQUEST, "Invalid Discount ID" );
                                }
                                else {
                                	String discountCode=discounts.get(0).getDiscountCode();
                                	if(discountCode.equals("DEAL_NOW")) {
                                		queryOptions.put("orderDesc", "stock");
                                        queryOptions.put("limit", 1);
                                	}
                                }
                            } catch (Exception e) {
                            	e.printStackTrace();
                                throw new ApplicationException(HttpServletResponse.SC_BAD_REQUEST, "Error fetching discount records: " + e.getMessage());
                            }
                            break;
                    }
                } catch (NumberFormatException e) {
                    throw new ApplicationException(HttpServletResponse.SC_BAD_REQUEST, "Invalid format for parameter: " + key);
                }
            }
        }

        HashMap<String, HashMap<String, Object>> resultMap = new HashMap<>();
        resultMap.put("conditionFieldValues", conditionFieldValues);
        resultMap.put("queryOptions", queryOptions);
        return resultMap;
    }



    
    public static Map<String, Object> createUpdateMap(JsonObject jsonObject, String... fields) throws ApplicationException {
        Map<String, Object> updateMap = new HashMap<>();
        for (String field : fields) {
            if (!jsonObject.containsKey(field)) {
                throw new ApplicationException(HttpServletResponse.SC_BAD_REQUEST, "Missing required field: " + field);
            }
            updateMap.put(field, jsonObject.getString(field));
        }
        return updateMap;
    }
}
