package com.filters;

import java.io.IOException;
import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.json.simple.JSONObject;

public class SessionValidationFilter implements Filter {

    public void init(FilterConfig filterConfig) throws ServletException {}

    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;

        // Set CORS headers
        httpResponse.setHeader("Access-Control-Allow-Origin", "http://localhost:4200"); // Replace '*' with a specific domain if needed
        httpResponse.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        httpResponse.setHeader("Access-Control-Allow-Credentials", "true"); 
        httpResponse.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
        
        String path = httpRequest.getRequestURI();
        String method = httpRequest.getMethod();
        System.out.println("Filter working: " + method + " "+httpRequest.getSession(false));

        // Handle OPTIONS request (preflight request) for CORS
        if (method.equalsIgnoreCase("OPTIONS")) {
            // Allow OPTIONS requests without session validation
            httpResponse.setStatus(HttpServletResponse.SC_OK);
            return;  // Skip the rest of the filter chain for OPTIONS requests
        }
        // Allow specific URLs and GET method on /products endpoint without session validation
        if (path.endsWith("/login") || path.endsWith("/signup") || ((path.endsWith("/product") || path.endsWith("/category") || path.endsWith("/brand") || path.endsWith("/discount"))) && method.equalsIgnoreCase("GET")) {
            System.out.println("Public URL accessed, session validation skipped");
            chain.doFilter(request, response); // Continue to the servlet
            return;
        }

        // Perform session validation for other protected resources
        HttpSession session = httpRequest.getSession(false); // false = don't create a new session
        if (session == null || session.getAttribute("user") == null) {
            // If session is invalid or doesn't exist, return unauthorized status
            System.out.println("Invalid session");
            httpResponse.setContentType("application/json");
            JSONObject obj=new JSONObject();
    	    obj.put("Error", "Invalid Session");
            httpResponse.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            httpResponse.getWriter().write(obj.toJSONString());
            return;
        } else {
            // Session is valid, continue processing the request
            session.setMaxInactiveInterval(10 * 60); // Set session timeout (10 minutes)
            System.out.println("Session validation successful: " + session.getAttribute("user"));
            chain.doFilter(request, response);
        }
    }

    public void destroy() {}
}
