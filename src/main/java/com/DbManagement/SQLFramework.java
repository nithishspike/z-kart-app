package com.DbManagement;
import java.sql.*;
public class SQLFramework {

    private Connection connection;
    public SQLFramework(String dbUrl, String username, String password) throws SQLException {
        this.connection = DriverManager.getConnection(dbUrl, username, password);
        
    }

    

	public ResultSet executeSelectQuery(String query, Object... params) throws SQLException {
        PreparedStatement pstmt = connection.prepareStatement(query);
        setParameters(pstmt, params);
        return pstmt.executeQuery();
    }

    public int executeUpdateQuery(String query, Object... params) throws SQLException {
        try (PreparedStatement pstmt = connection.prepareStatement(query)) {
            setParameters(pstmt, params);
            return pstmt.executeUpdate();
        }
    }

//    public void executeMultipleSelectQueries(String... queries) throws SQLException {
//        for (String query : queries) {
//            ResultSet rs = executeSelectQuery(query);
//            printResultSet(rs);
//        }
//    }

    private void setParameters(PreparedStatement pstmt, Object... params) throws SQLException {
        for (int i = 0; i < params.length; i++) {
            pstmt.setObject(i + 1, params[i]);
        }
    }
    
    public void closeConnection() throws SQLException {
        if (connection != null && !connection.isClosed()) {
            connection.close();
        }
        System.out.println("closed");
    }
}
