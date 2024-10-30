package com.emulator;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.HashMap;

import org.apache.tomcat.util.file.ConfigFileLoader;
import org.yaml.snakeyaml.Yaml;

import java.io.FileInputStream;
import java.io.InputStream;

public class Runner {
	public static ThreadLocal<Connection> Tc = new ThreadLocal<>();

	public Connection getConnection() throws Exception {
		if (Tc.get() == null) {
			Tc.set(createConnection(url, username, password));
		}
		return Tc.get();
	}

	static String url;
	static String username;
	static String password;

	static {
		Yaml yaml = new Yaml();
		try (InputStream in = new FileInputStream(
				"/Users/nithish-tt0489/eclipse-workspace/Servers/Tomcat v9.0 Server at localhost-config/DbConfig.yaml")) {
			HashMap<String, String> config = (HashMap<String, String>) yaml.load(in);
			url = config.get("url");
			username = config.get("username");
			password = config.get("password");

		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public static Connection createConnection(String url, String username, String password)
			throws SQLException, ClassNotFoundException {
		Class.forName("org.postgresql.Driver");
		return DriverManager.getConnection(url, username, password);
	}

	public static void closeConnection() throws SQLException {
		Connection conn = Tc.get();

		if (conn != null) {
			conn.close();
			Tc.remove(); // Remove the ThreadLocal reference to avoid memory leaks
		}
	}
}
