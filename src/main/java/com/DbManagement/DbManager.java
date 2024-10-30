package com.DbManagement;
import com.emulator.CRUD;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


public class DbManager {

	public List<Map<String, Object>> executeQuery(QueryBuilder queryBuilder) throws SQLException  {
		ResultSet rs = null;
		Connection connection = DatabaseConfig.getConnection();
		PreparedStatement query = queryBuilder.prepareStatement(connection);
		if (CRUD.READ.equals(queryBuilder.getoperation())) {
			rs=query.executeQuery();
			List<Map<String, Object>> resultList=mapResultSet(rs);
			connection.close();
			query.close();
			return resultList;
		} 
		else {
			query.executeUpdate();
			connection.close();
			query.close();
		}
	    
		return null;
	}
	public List<Map<String, Object>> mapResultSet(ResultSet rs) throws SQLException {
		List<Map<String, Object>> resultList = new ArrayList<>();
		if (rs == null) {
			System.out.println("No ResultSet returned (non-SELECT query or error occurred).");
//			return resultList;
		}
		ResultSetMetaData metaData = rs.getMetaData();
		int columnCount = metaData.getColumnCount();
		while (rs.next()) {
			Map<String, Object> rowMap = new HashMap<>();
			for (int i = 1; i <= columnCount; i++) {
				String columnName = metaData.getColumnName(i);
				Object columnValue = rs.getObject(i);
				if (columnValue != null)
					rowMap.put(columnName, columnValue);
			}
			resultList.add(rowMap);
		}
		System.out.println("result List is "+resultList);
		rs.close();
//		System.out.println("resultlist;"+resultList);
		return resultList;
		
	}
}
