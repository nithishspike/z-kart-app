package com.listeners;
import com.DbManagement.DatabaseConfig;
import com.config.LoggerConfig;

import java.sql.Driver;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.Enumeration;
import java.util.logging.Logger;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

public class AppContextListener implements ServletContextListener {

    public void contextInitialized(ServletContextEvent sce) {
      try {
    	LoggerConfig.configureLogger();  
        Logger logger = Logger.getLogger(AppContextListener.class.getName());
        logger.info("Application started.");
        new DatabaseConfig();
        System.out.println("Application started");
      }
      catch(Exception e)
      {
    	  e.printStackTrace();
      }
    }

    @Override
    public void contextDestroyed(ServletContextEvent sce) {
    	DatabaseConfig.closeDataSource();
        Enumeration<Driver> drivers = DriverManager.getDrivers();
        while (drivers.hasMoreElements()) {
            Driver driver = drivers.nextElement();
            try {
                DriverManager.deregisterDriver(driver);
                System.out.println("Deregistered JDBC driver: " + driver);
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
    }
}
