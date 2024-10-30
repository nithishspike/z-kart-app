package com.handlers;
//import org.json.simple.JSONObject;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;
import javax.json.Json;
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
import com.models.Users;
import com.util.ClientDataDecryptor;
import com.util.PasswordEncryptor;

public class AuthHandler {
	private static final String EMAIL = "email";
	private static final String PASSWORD = "password";
	private static final String MOBILE = "mobile";
	private static final String ADDRESS = "address";
	private static final String FIRSTNAME ="first_name";
	private static final String LASTNAME = "last_name";
	private static final String USERID = "user_id";
	private static final String SALT = "salt";
//	private static final String PREVPWD = "prev_pwd";
	private static Dao DaoObj = new Dao();
	private static final Logger logger = LoggerConfig.getLogger();
	private static PasswordEncryptor hashPassword = new PasswordEncryptor();
	
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
	
	
	public JSONObject put(HttpSession session,Map<String, String> queryParams,JsonObject payloadData) throws Exception {
//	        JsonReader jsonReader = Json.createReader(req.getInputStream());
//	        JsonObject jsonObject = jsonReader.readObject();
	        String email = payloadData.getString(EMAIL, null);
	        String password ;//= payloadData.getString(PASSWORD, null);
	        String encryptedData=payloadData.getString("encryptedData",null);
	        
	        System.out.println(encryptedData+"email is"+email);
	        if (email != null ) {//to check the email is valid or not
	        	
	        	if(DaoObj.FetchRecord("users",Users.class,createHashMap("email"+"=",email), null).isEmpty()) {
	        		throw new ApplicationException(HttpServletResponse.SC_BAD_REQUEST, "Invalid Email id");
	        	}
	        	else {
	        		JSONObject json = new JSONObject();
	                json.put("message", "Email is valid");
	        		return json;
	        	}
	        }
	        else if (encryptedData!=null) { // to check it has encryptedData or not
	            Users obj=ClientDataDecryptor.decryptData(encryptedData);
	            System.out.println(obj.getEmail()+" "+obj.getPassword());
	            if(obj.getEmail()!=null) { //to validate the email and password
		            List<Users> user = (List<Users>) DaoObj.FetchRecord(DatabaseTable.USERS.getTableName(), Users.class, createHashMap(EMAIL + "=", obj.getEmail()), null, PASSWORD, USERID, SALT,"is_admin");
		            JSONObject json=new JSONObject();
		            if (user.isEmpty()) {
		            	json.put("email","Invalid email");
		                throw new ApplicationException(HttpServletResponse.SC_UNAUTHORIZED, json);
		            }
	
		            password = hashPassword.hashPasswordWithSalt(obj.getPassword(), user.get(0).getSalt());
	
		            if (!user.get(0).getPassword().equals(password)) {
		            	json.put("password","Invalid Password");
		                throw new ApplicationException(HttpServletResponse.SC_UNAUTHORIZED,json);
		            } else {
		                // Set user session for login
		                session.setAttribute("user", user.get(0).getUserId()); //set the session to the user
		                session.setMaxInactiveInterval(15 * 60); //  15 minutes
		                
		                json.put("message", "Login successful. Welcome!");
		                json.put("isAdmin", user.get(0).getisAdmin());
		                return json;
		            }
	            }
	            else { // validate the password
	            	if (session == null || session.getAttribute("user") == null) {
		                throw new ApplicationException(HttpServletResponse.SC_UNAUTHORIZED, "User is not logged in.");
		              
	            	}
		            long userId = (long) session.getAttribute("user");
		            List<Users> user = (List<Users>) DaoObj.FetchRecord(DatabaseTable.USERS.getTableName(), Users.class, createHashMap(USERID + "=", userId), null, PASSWORD, SALT);

		            if (user.isEmpty()) {
		                throw new ApplicationException(HttpServletResponse.SC_UNAUTHORIZED, "User not found");
		            }
		            password = hashPassword.hashPasswordWithSalt(obj.getPassword(), user.get(0).getSalt());
                    System.out.println(password+" ="+user.get(0).getPassword());
		            if (!user.get(0).getPassword().equals(password)) {
		                throw new ApplicationException(HttpServletResponse.SC_UNAUTHORIZED, "Incorrect password");
		            }
                    System.out.println("crossed the exception");
		            // Store validation time in session to allow password update within 2 minutes
		            session.setAttribute("passwordValidated", true);
		            session.setAttribute("passwordValidatedTime", System.currentTimeMillis());
		            JSONObject json=new JSONObject();
		            json.put("isValid",true);
		            json.put("message","Password verification successful");
		            return json;
	            }
	        }
	        // Case 4: If both email and password are missing
	        	else {
	        		throw new ApplicationException(HttpServletResponse.SC_BAD_REQUEST, "Email and/or Password are missing.");
	        	}
	}

	
	public JSONObject post(HttpSession session,Map<String, String> queryParams,JsonObject payloadData) throws Exception {//signup

			JSONObject json=new JSONObject();
			String firstName = payloadData.getString(FIRSTNAME, null);
			String lastName = payloadData.getString(LASTNAME, null);
			String encryptData = payloadData.getString("encryptedData", null);
			String mobile = payloadData.getString(MOBILE, null);
			String address = payloadData.getString(ADDRESS, null);
			String salt = hashPassword.generateSalt();
			Users Obj=ClientDataDecryptor.decryptData(encryptData);
			// Simple validation for missing field
			String email=Obj.getEmail();
			String password = hashPassword.hashPasswordWithSalt(Obj.getPassword(), salt);
			
			if (firstName.isEmpty() || lastName.isEmpty() || email.isEmpty() || password.isEmpty() || address.isEmpty()
					|| mobile.isEmpty()) {
				throw new ApplicationException(HttpServletResponse.SC_BAD_REQUEST,"Missing required fields.");
			}
			
			// Check for existing users by email, mobile, and password
			List<?> user =  DaoObj.FetchRecord(DatabaseTable.USERS.getTableName(), Users.class,createHashMap(EMAIL+"=", email),null, MOBILE);
			if (user.size() != 0) {
				json.put("email","Email is already used");
			}

			if (((Users) DaoObj.getCount(DatabaseTable.USERS.getTableName(), Users.class, createHashMap(MOBILE+"=", Long.parseLong(mobile))).get(0))
					.getCount() > 0) {
				json.put("mobile","Mobile number is already used.");
			}

			if (((Users) DaoObj.getCount(DatabaseTable.USERS.getTableName(), Users.class, createHashMap(PASSWORD+"=", password)).get(0)).getCount() > 0) {
				json.put("password","Password is already used.");
			}
			if(!json.isEmpty()) {
				throw new ApplicationException(HttpServletResponse.SC_CONFLICT,json);
			}
			// Prepare the list for inserting data
			Map<String, Object> insertHm = createHashMap(FIRSTNAME, firstName, LASTNAME, lastName, EMAIL, email,
					PASSWORD, password, MOBILE, Long.parseLong(mobile), SALT, salt);
			List<Map<String, Object>> insertList = new ArrayList<>();
			insertList.add(insertHm);
			// Call the UserDao to insert the user into the database
			List<Users> userObj =(List<Users>) DaoObj.InsertRecord(DatabaseTable.USERS.getTableName(), insertList, Users.class, "user_id");
			if ( userObj!= null) {
				JSONObject obj=new JSONObject();
				session.setAttribute("user", userObj.get(0).getUserId());
				session.setMaxInactiveInterval(30 * 60);
			    obj.put("message", "signin Successfully");
			    obj.put("isAdmin",userObj.get(0).getisAdmin());
			    return obj;
			} else {
				throw new ApplicationException(HttpServletResponse.SC_INTERNAL_SERVER_ERROR,"Error during signup");
			}
		
	}
	
	public JSONObject delete(HttpSession session,Map<String, String> queryParams,JsonObject payloadData) throws IOException, ApplicationException {
	    if (session != null) {
	        session.invalidate(); // Invalidate the session if it exists
	    }
	    JSONObject obj=new JSONObject();
	    obj.put("message", "Logout Successfully");
	    return obj;
	  
	}

	

}
