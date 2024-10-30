package com.util;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.json.JsonObject;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.json.simple.JSONObject;

import com.dao.Dao;
import com.enums.DatabaseTable;
import com.exception.ApplicationException;
import com.models.Users;

public class UsersUtil {
    
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
	
    public static long getSessionUserId(HttpSession session) throws ApplicationException {
        Long userId = (Long) session.getAttribute("user");
        if (userId == null) {
            throw new ApplicationException(HttpServletResponse.SC_UNAUTHORIZED, "User not authenticated.");
        }
        return userId;
    }

    public static void validateAdminAccess(List<Users> users) throws ApplicationException {
        if (users == null || users.isEmpty()) {
            throw new ApplicationException(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized Access");
        }
    }

    public static boolean isPasswordValidationExpired(HttpSession session) {
        Boolean passwordValidated = (Boolean) session.getAttribute("passwordValidated");
        Long passwordValidatedTime = (Long) session.getAttribute("passwordValidatedTime");
        return (passwordValidated == null || !passwordValidated ||
               (System.currentTimeMillis() - passwordValidatedTime) > 2 * 60 * 1000);
    }

    public static  Map<String, Object> updateUserFieldsFromJson(JsonObject jsonObject, Map<String, Object> updateFields) throws Exception {
    	JSONObject json=new JSONObject();
        if (jsonObject.containsKey("first_name")) {
            updateFields.put("first_name", jsonObject.getString("first_name"));
        }
        if (jsonObject.containsKey("last_name")) {
            updateFields.put("last_name", jsonObject.getString("last_name"));
        }
        if (jsonObject.containsKey("email")) {
        	Dao DaoObj=new Dao();
        	List<Users> user=DaoObj.FetchRecord(DatabaseTable.USERS.getTableName(), Users.class,createHashMap("email"+"=",jsonObject.getString("email")),null);
            if(!user.isEmpty()) {
            	json.put("email","Email is already used");
            	
            }
        	updateFields.put("email", jsonObject.getString("email"));
        }
        if (jsonObject.containsKey("address")) {
            updateFields.put("address", jsonObject.getString("address"));
        }
        if (jsonObject.containsKey("mobile")) {
        	Dao DaoObj=new Dao();
        	List<Users> user=DaoObj.FetchRecord(DatabaseTable.USERS.getTableName(), Users.class,createHashMap("mobile"+"=",Long.parseLong(jsonObject.getString("mobile"))),null);
            if(!user.isEmpty()) {
            	json.put("mobile","Mobile Number is already used");
            }
//            long mobile = jsonObject.getJsonNumber("mobile").longValue();
            updateFields.put("mobile", Long.parseLong(jsonObject.getString("mobile"))); 
        }
        if(!json.isEmpty()) {
        	throw new ApplicationException(HttpServletResponse.SC_CONFLICT,json);
        }
        return updateFields;
    }
    
    public static Map<String, Object> handlePassword(HttpSession session, long userId, JsonObject jsonObject, 
            Map<String, Object> updateFields) throws Exception {
    	Dao DaoObj=new Dao();
        PasswordEncryptor hashPassword = new PasswordEncryptor();
		List<Users> users = DaoObj.FetchRecord(DatabaseTable.USERS.getTableName(), Users.class, 
		createHashMap("user_id=", userId), null, "password", "prev_pwd", "salt");
		if (users.isEmpty()) {
			throw new ApplicationException(HttpServletResponse.SC_UNAUTHORIZED, "User not found");
		}
		Users user = users.get(0);
		String newPassword = jsonObject.getString("new_password");
		Users obj=ClientDataDecryptor.decryptData(newPassword);
		String hashedNewPassword = hashPassword.hashPasswordWithSalt(obj.getPassword(), user.getSalt());
		
		String[] previousPasswords = user.getPrevPwd() != null ? user.getPrevPwd().split(",") : new String[0];
		for (String prevPassword : previousPasswords) {
			if (prevPassword.equals(hashedNewPassword)) {
				throw new ApplicationException(HttpServletResponse.SC_BAD_REQUEST, 
		                     "New password cannot be the same as previous passwords");
			}
		}
		
		updateFields.put("password", hashedNewPassword);
		if (previousPasswords.length == 0) {
			updateFields.put("prev_pwd", user.getPassword());
		} else {
			String updatedPrevPwd = user.getPassword() + "," + previousPasswords[0];
			updateFields.put("prev_pwd", updatedPrevPwd);
		}
		session.removeAttribute("passwordValidated");
		session.removeAttribute("passwordValidatedTime");
		return updateFields;
    }
    
    public static boolean validateAdmin(HttpSession session) throws Exception {
		List<Users> user=null;
		Dao DaoObj=new Dao();
		long userId=(long) session.getAttribute("user");
		HashMap<String,Object> condition =new HashMap<>();
		condition.put("user_id"+"=", userId);
		user = DaoObj.FetchRecord(DatabaseTable.USERS.getTableName(), Users.class,condition, null, "is_admin");
		System.out.println("is admin is logging "+user.get(0).getisAdmin());
		return user.get(0).getisAdmin();
	}
}

