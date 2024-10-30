package com.DbManagement;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;

import java.io.FileInputStream;
import java.io.InputStream;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.HashMap;

import javax.sql.DataSource;

import org.yaml.snakeyaml.Yaml;

public class DatabaseConfig {
    private static HikariDataSource dataSource;
    static String url;
	static String username;
	static String password;

	static {
		Yaml yaml = new Yaml();
		try (InputStream in = new FileInputStream(
				"/Users/nithish-tt0489/eclipse-workspace/Servers/Tomcat v9.0 Server at localhost-config/DbConfig.yaml")) {
			HashMap<String, String> config =yaml.load(in);
			url = config.get("url");
			username = config.get("username");
			password = config.get("password");

		} catch (Exception e) {
			e.printStackTrace();
		}
	}
    static {
        HikariConfig config = new HikariConfig();
        config.setJdbcUrl(url);
        config.setUsername(username);
        config.setPassword(password);
        config.setDriverClassName("org.postgresql.Driver");
        config.setMaximumPoolSize(11); // Set your desired pool size
        config.setConnectionTimeout(30000); // 30 seconds
        // Optional HikariCP settings
        config.addDataSourceProperty("cachePrepStmts", "true");
        config.addDataSourceProperty("prepStmtCacheSize", "250");
        config.addDataSourceProperty("prepStmtCacheSqlLimit", "2048");

        dataSource = new HikariDataSource(config);
    }

    public static DataSource getDataSource() {
        return dataSource;
    }
    
    public  static Connection getConnection() throws SQLException {
    		 return dataSource.getConnection();
    }
    
    public static void closeDataSource() {
        if (dataSource != null && !dataSource.isClosed()) {
            dataSource.close();
            System.out.println("HikariCP Connection Pool closed.");
        }
    }
}
