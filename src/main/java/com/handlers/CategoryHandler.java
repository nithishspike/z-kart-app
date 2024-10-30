package com.handlers;

import java.util.List;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.json.JsonObject;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.config.LoggerConfig;
import com.dao.Dao;
import com.exception.ApplicationException;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.models.Category;

public class CategoryHandler {
	
	private static final Logger logger = LoggerConfig.getLogger();
	
	public void post(HttpSession session,Map<String, String> queryParams,JsonObject payloadData) throws Exception {
		
	}
	
	public void put(HttpSession session,Map<String, String> queryParams,JsonObject payloadData) throws Exception {
			
		}
	public Object get(HttpSession session,Map<String, String> queryParams,JsonObject payloadData) throws ApplicationException {
	       try {
		       	Dao DaoObj=new Dao();
		       	List<Category> categoryList=DaoObj.FetchRecord("category",Category.class, null, null, "category_id","category_description","unique_name","display_name");
	            ObjectMapper objectMapper = new ObjectMapper();
	            objectMapper.setSerializationInclusion(JsonInclude.Include.NON_DEFAULT);
//	            String jsonResponse = objectMapper.writeValueAsString(categoryList);
	            return objectMapper.writeValueAsString(categoryList);
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
	
	public void delete(HttpSession session,Map<String, String> queryParams,JsonObject payloadData) throws Exception {
		
	}

}
