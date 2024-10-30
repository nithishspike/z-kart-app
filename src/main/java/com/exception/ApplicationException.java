package com.exception;

import org.json.JSONObject;

public class ApplicationException extends Exception {
    private static final long serialVersionUID = 1L;
    private final int statusCode;
    JSONObject json=new JSONObject();
    private JSONObject jsonError;
    
	public ApplicationException(int statusCode,String message ) {
		super(message);
		this.statusCode=statusCode;
		this.jsonError = null;
        
    }
	
	public ApplicationException(int statusCode, JSONObject jsonError) {
        super(jsonError.toString());
        this.statusCode = statusCode;
//        JSONObject json=new JSONObject();
//    	json.put("email","Email is already used");
        this.jsonError = jsonError;
    }
	
	public int getstatusCode() {
		return statusCode;
	}
	
	public JSONObject getJsonError() {
	
        return jsonError;
    }
}
