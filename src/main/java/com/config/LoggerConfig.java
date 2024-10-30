package com.config;

import java.io.IOException;
import java.util.logging.ConsoleHandler;
import java.util.logging.FileHandler;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.logging.SimpleFormatter;

public class LoggerConfig {
	private static Logger logger=Logger.getLogger(LoggerConfig.class.getName());
	public static void configureLogger() throws IOException {
		FileHandler fileHandler = new FileHandler("/Users/nithish-tt0489/eclipse-workspace/OnlineShopping/log/application.log", 50000, 5, true);
        fileHandler.setFormatter(new SimpleFormatter()); 
        fileHandler.setLevel(Level.INFO); 
        logger.addHandler(fileHandler); 
        System.out.println("logging the data");
        ConsoleHandler consoleHandler = new ConsoleHandler();
        consoleHandler.setFormatter(new SimpleFormatter());
        consoleHandler.setLevel(Level.INFO);
        logger.addHandler(consoleHandler);
        
        logger.setLevel(Level.INFO);
        logger.info("Logger configured!");
    }
    
    public static Logger getLogger() {
    	return logger;
    }
}

