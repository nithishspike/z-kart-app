package com.servlets;
import javax.json.Json;
import javax.json.JsonObject;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.json.JSONObject;

import com.exception.ApplicationException;

import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.HashMap;
import java.util.Map;
import java.util.logging.Logger;

public class MainServlet extends HttpServlet {

    private static final long serialVersionUID = 1L;
    private static final Logger logger = Logger.getLogger(MainServlet.class.getName());
	
    @Override
    protected void service(HttpServletRequest request, HttpServletResponse response) {
        try {
            String pathInfo = request.getPathInfo(); 
            HttpSession session = request.getSession(false);
            Map<String, String> queryParams = extractQueryParams(request);
            JsonObject payloadData;
            System.out.println(request.getContentLength());
            if(request.getContentLength()<=0) {
            	payloadData=null;
            }
            else {
            	payloadData = Json.createReader(request.getInputStream()).readObject();
            }
            Object result;
            System.out.println("MainServlet - Path Info: " + pathInfo);
            if (pathInfo != null && !pathInfo.isEmpty()) {
                // Extract the first segment from the path
                String[] pathSegments = pathInfo.split("/");
                if (pathSegments.length > 1) {
                    String firstSegment = pathSegments[1];
                    firstSegment = firstSegment.substring(0, 1).toUpperCase() + firstSegment.substring(1) + "Handler";
                    System.out.println("Handler Class: " + firstSegment);
                    Class<?> clazz = Class.forName("com.handlers." + firstSegment);
                    String httpMethod = request.getMethod().toLowerCase();
                    for (Method method : clazz.getDeclaredMethods()) {
                        if (method.getName().toLowerCase().contains(httpMethod)) {
                            System.out.println("Invoking method: " + method.getName());
                            if(firstSegment.equals("AuthHandler") && (method.getName().equalsIgnoreCase("put") || method.getName().equalsIgnoreCase("post")))
                            {
                            	session=request.getSession();
                            	System.out.println("creating a session");
                            }
                            	method.setAccessible(true); 
                            try {
                                result= method.invoke(clazz.getDeclaredConstructor().newInstance(),session,queryParams,payloadData);
                                System.out.println(result);
                                response.setContentType("application/json");
                                response.setStatus(HttpServletResponse.SC_OK);
                                response.getWriter().write(result.toString());
                                return;
                            } catch (InvocationTargetException e) {
                                Throwable targetException = e.getTargetException();
                                e.printStackTrace();
                                if (targetException instanceof ApplicationException) {
                                	
                                    throw (ApplicationException) targetException; 
                                } else {
                                	
                                	throw new RuntimeException(targetException);
                                }
                            }
                        }
                    }
                    throw new ApplicationException(HttpServletResponse.SC_METHOD_NOT_ALLOWED, "Method not supported");
                } else {
                    throw new ApplicationException(HttpServletResponse.SC_BAD_REQUEST, "Invalid path");
                }
            } else {
               
                throw new ApplicationException(HttpServletResponse.SC_BAD_REQUEST, "Invalid path");
            }
        } 
        catch (ApplicationException e) {
        	e.printStackTrace();
        	System.out.println("Catching Exception in applicationException");
            logger.warning("Application error: " + e.getMessage());
            response.setStatus(e.getstatusCode());
            response.setContentType("application/json");
            System.out.println("Error Excepiton");
            try {
            	if (e.getJsonError() != null) {
                    response.getWriter().write(e.getJsonError().toString());  // Send JSON object directly
                } else {
                    response.getWriter().write("{\"message\": \"" + e.getMessage() + "\"}");
                }
            } catch (IOException ioException) {
                logger.severe("Error writing response: " + ioException.getMessage());
            }
        }
        catch (Exception e) {
        	e.printStackTrace();
        	System.out.println("Catching Exceptioin in Exception");
            logger.severe("Internal server error: " + e.getMessage());
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.setContentType("application/json");
            try {
            	response.getWriter().write("hi");
                response.getWriter().write("{\"error\": \"Internal Server Error \"}");
            } catch (IOException ioException) {
            	
                logger.severe("Error writing response: " + ioException.getMessage());
            }
        }
    }
    private Map<String, String> extractQueryParams(HttpServletRequest request) {
        Map<String, String> queryParams = new HashMap<>();
        request.getParameterMap().forEach((key, value) -> queryParams.put(key, value[0]));
        return queryParams;
    }

}
