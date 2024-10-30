package com.handlers;

import javax.servlet.http.HttpServletResponse;
import java.util.List;
import javax.json.JsonObject;

import java.util.HashMap;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.servlet.http.HttpSession;

import org.json.JSONObject;

import com.config.LoggerConfig;
import com.dao.Dao;
import com.enums.DatabaseTable;
import com.exception.ApplicationException;
import com.models.Users;
import com.util.JsonUtil;
import com.util.UsersUtil;

public class UsersHandler {

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
	    public Object get(HttpSession session,Map<String, String> queryParams,JsonObject payloadData) throws ApplicationException {
	        try {
	            Dao DaoObj=new Dao();
	            
	            List<JSONObject> jsonResponse;
	            List<Users> users;
	            if(queryParams.get("email") != null) {
	            	if(!UsersUtil.validateAdmin(session)) {
	            		throw new ApplicationException(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorised Access to resource");
	            	}
	            	else {
	            		users=DaoObj.FetchRecord(DatabaseTable.USERS.getTableName(),Users.class,createHashMap("email"+"=",queryParams.get("email")), null);
	            		jsonResponse = JsonUtil.convertToJson(users);
	            	}
	            }
	            else {
	            	long userId = UsersUtil.getSessionUserId(session);
	            	users = DaoObj.FetchRecord(DatabaseTable.USERS.getTableName(), Users.class,createHashMap("user_id"+"=",userId), null, 
	                        "first_name", "last_name", "email", "mobile", "user_id", "address","is_admin");
		            
	            	
		            jsonResponse = JsonUtil.convertToJson(users);
	            }
	            return jsonResponse;
	        } 
	        catch (ApplicationException e) {
	            logger.log(Level.SEVERE, e.getMessage(), e);
	            throw new ApplicationException(e.getstatusCode(), e.getMessage());
	        }catch (Exception e) {
	            logger.warning("Unexpected error in usersHandler " + e);
	            throw new ApplicationException(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Internal server error");
	        }
	    }

	    public Object put(HttpSession session,Map<String, String> queryParams,JsonObject payloadData) throws Exception {
//	        try {
	        	Dao DaoObj=new Dao();
	            long userId = UsersUtil.getSessionUserId(session);
//	            JsonObject jsonObject = Json.createReader(req.getInputStream()).readObject();
	            Map<String, Object> updateFields = new HashMap<>();

	            if (payloadData.containsKey("new_password")) {
	                if (UsersUtil.isPasswordValidationExpired(session)) {
	                    throw new ApplicationException(HttpServletResponse.SC_REQUEST_TIMEOUT, 
	                                                   "Password validation expired or not validated");
	                }
	                updateFields.putAll(UsersUtil.handlePassword(session, userId, payloadData, updateFields));
	            }
	            // Update other user fields
	            JSONObject json=new JSONObject();
	            updateFields.putAll(UsersUtil.updateUserFieldsFromJson(payloadData, updateFields));
	            System.out.println("updates are "+updateFields);
	            if (!updateFields.isEmpty()) {
	                DaoObj.UpdateRecord(DatabaseTable.USERS.getTableName(), Users.class, 
	                                    createHashMap("user_id=", userId), updateFields);
	                
	                json.put("isValid",true);
	                json.put("message","User details updated successfully");
	                
	            }
	            else {
	            	json.put("isValid",false);
	            	json.put("message","User detials not updated");
	            }
	            return json;
//	        } 
//	        catch (ApplicationException e) {
//	            logger.log(Level.SEVERE, e.getMessage(), e);
//	            throw new ApplicationException(e.getstatusCode(), e.getMessage());
//	        }
//	        catch (Exception e) {
//	            logger.warning("Internal Server Error: " + e);
//	            throw new ApplicationException(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, 
//	                                           "An error occurred while updating user details.");
//	        }
	    }
	    
    public void delete(HttpSession session,Map<String, String> queryParams,JsonObject payloadData)
    {
    	
    }
	public void userHistory(HttpSession session,Map<String, String> queryParams,JsonObject payloadData) {
		// Retrieve user history from the database and send it back as JSON or HTML.
	}
}
//	