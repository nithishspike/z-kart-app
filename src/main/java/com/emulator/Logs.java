package com.emulator;

import java.util.logging.FileHandler;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.logging.SimpleFormatter;


public class Logs {
	private static final Logger logger = Logger.getLogger(Logs.class.getName());
    static int number=1;
	private static void setupLogger() {
		try {
			System.out.println(logger+" "+Logs.class.getName());
			// Create a FileHandler with a limit of 1MB and 5 rotating log files
	        FileHandler fileHandler = new FileHandler("application."+number+++".log", 1024 * 1024, 5, true);
	        fileHandler.setFormatter(new SimpleFormatter());  // Set a simple text format
	        logger.addHandler(fileHandler);
	        logger.setLevel(Level.ALL);
//	        int a=1/0;// Log all levels
	        } 
		catch (Exception e) {
			
	        logger.log(Level.SEVERE, "Failed to set up file handler1 "+e);
	    }
}
}
