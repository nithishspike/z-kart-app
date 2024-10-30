package com.config;
import redis.clients.jedis.*;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.util.Date;
import java.util.HashMap;
import java.util.Properties;
import java.util.logging.FileHandler;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.logging.SimpleFormatter;

class My{
	public int a;
	public String b;
	public HashMap<String, Integer> mp;
	public My(int a, String b, HashMap<String, Integer> mp) {
		this.a = a;
		this.b = b;
		this.mp = mp;
	}
	
	@Override
	protected Object clone() throws CloneNotSupportedException {
		return new My(a, b, (HashMap<String, Integer>)mp.clone());
	}
	
//	@Override
//	public String toString() {
//		// TODO Auto-generated method stub
//		return a + ", " + b + " " + mp;
//	}
}
public class Main {
	
	private static final Logger logger = Logger.getLogger(Main.class.getName());
	
	public static void setupLogger() {
		try {
			System.out.println(logger+" "+Main.class.getName());
			// Create a FileHandler with a limit of 1MB and 5 rotating log files
	        FileHandler fileHandler = new FileHandler("application."+new Date().getTime()+".log", 1024 * 1024, 5, true);
	        fileHandler.setFormatter(new SimpleFormatter());  // Set a simple text format
	        logger.addHandler(fileHandler);
	        logger.setLevel(Level.ALL);
	        
	        
	        
//	        int a=1/0;// Log all levels
	        } 
		catch (Exception e) {
			
	        logger.log(Level.SEVERE, "Failed to set up file handler1 "+e);
	    }
		
		HashMap<String, Integer> mp = new HashMap<>();
		
		mp.put("a", 1);
		mp.put("b", 10);
		mp.put("c", 100);
		mp.put("d", 1000);
		
		
		My obj = new My(2, "saran", mp);
		
		My obj1 = null;
		try {
			obj1 = (My) obj.clone();
		} catch (CloneNotSupportedException e) {
			e.printStackTrace();
		}
		
		System.out.println(obj);
		System.out.println(obj1);
		obj1.mp.put("e", 420);
		obj1.a=8;
		System.out.println(obj);
		System.out.println(obj1);
		
		
	}

	public static void main(String[] args) {
		
//		Jedis obj=new Jedis("localhost");
//		System.out.println("ping "+obj.set("name","nithish"));
//		System.out.println(obj.get("name"));
		setupLogger();
		
		 logger.info("This is an INFO message");
	     logger.warning("This is a WARNING message");
	     logger.severe("This is a SEVERE error message");
		

//		try {
//			InputStream is = new FileInputStream("/Users/nithish-tt0489/eclipse-workspace/Servers/Tomcat v9.0 Server at localhost-config/tables.properties");
//			Properties pt = new Properties();
//			
//			pt.load(is);
//			System.out.println(pt);
//			pt.forEach((key, value) -> {
//				System.out.println(key + " : " + value);
//			});
//		} 
//		catch (IOException e) {
//			e.printStackTrace();
//		}
		

	}

}
