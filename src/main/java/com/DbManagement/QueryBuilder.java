package com.DbManagement;
import com.emulator.CRUD;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.sql.Connection;
import java.sql.PreparedStatement;
import com.util.SnakeCaseUtil;
import java.sql.SQLException;

public class QueryBuilder {

    private StringBuilder query;
    private List<Object> parameters;
    private boolean whereClauseAdded = false,joinApplied=false;
    private CRUD Operation;
    private Map<Class<?>,List<String>> classWithcolumns;

    public QueryBuilder() {
        query = new StringBuilder();
        parameters = new ArrayList<>();
    }
    // Build the SELECT part of the query
    public QueryBuilder select(String... columns) {
    	joinApplied=false;
        Operation=CRUD.READ;
        System.out.println(columns.length);
    	query.append("SELECT ");
        if (columns.length == 0) {
        	System.out.println("Retrieving every data from data base");
            query.append("* ");
        } else {
            query.append(String.join(", ", columns) + " ");
        }
        return this;
    }
    public <T> QueryBuilder selectJoin(Map<Class<?>, List<String>> columnToRetrieve) {
        // StringBuilder to hold the select clause part of the query
    	Operation=CRUD.READ;
    	joinApplied=true;
    	classWithcolumns=columnToRetrieve;
        StringBuilder selectClause = new StringBuilder("SELECT ");
        // Iterate over the list of maps
        System.out.println(columnToRetrieve);

            // For each map, iterate over the entries to get the class and its associated columns
            for (Entry<Class<?>, List<String>> entry : columnToRetrieve.entrySet()) {
                Class<?> clazz =  entry.getKey();  // Get the class
                List<String> columns = entry.getValue();  // Get the columns for this class

                // Append ClassName.ColumnName for each column in the class
                for (int j = 0; j < columns.size(); j++) {
                    selectClause.append(SnakeCaseUtil.camelToSnakeRegex(clazz.getSimpleName())).append(".").append(columns.get(j));

                    // Append comma after each column except for the last one
                    selectClause.append(", ");
            }
        }
        // Remove the last comma and append a space
        if (selectClause.toString().endsWith(", ")) {
            selectClause.setLength(selectClause.length() - 2);
        }
//        System.out.println(selectClause.toString());
        // Append the select clause to the query StringBuilder
        this.query.append(selectClause.toString()).append(" ");
        
        return this;
    }

  
    public QueryBuilder insertInto(String tableName, List<Map<String, Object>> fieldValuesList) {
        if (fieldValuesList == null || fieldValuesList.isEmpty()) {
            throw new IllegalArgumentException("Field values list cannot be null or empty.");
        }
        joinApplied=false;
        Operation = CRUD.INSERT;
        // Start the INSERT INTO statement
        query.append("INSERT INTO ").append(tableName).append(" (");
        List<String> columns = new ArrayList<>(fieldValuesList.get(0).keySet());
        // Add the column names to the query
        query.append(String.join(", ", columns)).append(") VALUES ");

        // For each map in the list, create a set of placeholders and add corresponding values
        for (int i = 0; i < fieldValuesList.size(); i++) {
            Map<String, Object> fieldValues = fieldValuesList.get(i);
            if (i > 0) {
                query.append(", ");  // Add a comma between each set of values
            }
            
            String[] placeholders = new String[columns.size()];
            query.append("(");
            
            for (int j = 0; j < columns.size(); j++) {
                placeholders[j] = "?"; // Add a placeholder for each column
                parameters.add(fieldValues.get(columns.get(j))); // Add the corresponding value to the parameters list
            }
            
            query.append(String.join(", ", placeholders)).append(")");
        }
        
        return this; // Return the current QueryBuilder object for chaining
    }


    public QueryBuilder columns(String... columns) {
	    if(columns.length>0)
	   {
        query.append("(").append(String.join(", ", columns)).append(") ");
        query.append("VALUES (");
        String[] placeholders = new String[columns.length];
        for (int i = 0; i < columns.length; i++) {
            placeholders[i] = "?";
        }
        query.append(String.join(", ", placeholders)).append(") ");// Store the columns for validation later
        
	   }
	   return this;
	   
    }

    public QueryBuilder update(String tableName) {
    	joinApplied=false;
    	Operation=CRUD.UPDATE;
        query.append("UPDATE ").append(tableName).append(" ");
        return this;
    }

    // Build the DELETE part of the query
    public QueryBuilder deleteFrom(String tableName) {
    	joinApplied=false;
    	Operation=CRUD.DELETE;
        query.append("DELETE FROM ").append(tableName).append(" ");
        return this;
    }

    // Specify the table for SELECT queries
    public QueryBuilder from(String tableName) {
        query.append("FROM ").append(tableName).append(" ");
        return this;
    }
    
    // Add SET clause for UPDATE queries with placeholders (?)
    public QueryBuilder set(Map<String, Object> fieldValues) {
        query.append("SET ");
        List<String> setFields = new ArrayList<>();
        
        for (String field : fieldValues.keySet()) {
            setFields.add(field + " = ?"); 
            parameters.add(fieldValues.get(field));// Add placeholders for each field
        }
        
        query.append(String.join(", ", setFields)).append(" ");  // Join fields with comma
        return this;
    }
    public QueryBuilder joinValues(List<String[]> joinFields)
    {
    	joinApplied=true;
    	for(int i=0;i<joinFields.size();i++)
    	{
    		String JoinType=joinFields.get(i)[0];
    		String TableName=joinFields.get(i)[1];
    		String Column1=joinFields.get(i)[2];
    		String Column2=joinFields.get(i)[3];
    		query.append(JoinType+" ").append(TableName).append(" ON ").append(Column1).append("=").append(Column2).append(" ");
    	}
		return this;
    
    }
    public QueryBuilder join(String joinType, String tableName, String joinCondition) {
    	
        query.append(joinType).append(" JOIN ").append(tableName).append(" ON ").append(joinCondition).append(" ");
        return this;
    }

    public QueryBuilder innerJoin(String tableName, String joinCondition) {
        return join("INNER", tableName, joinCondition);
    }

    public QueryBuilder leftJoin(String tableName, String joinCondition) {
        return join("LEFT", tableName, joinCondition);
    }

    public QueryBuilder rightJoin(String tableName, String joinCondition) {
        return join("RIGHT", tableName, joinCondition);
    }
    public QueryBuilder returning(String... columns )
    {
    	 Operation=CRUD.READ;
    	 query.append("RETURNING "+(columns.length==0?"*":String.join(", ", columns)) );
    	 return this;
    }
    
    // Add WHERE clause with placeholders (?)
    public QueryBuilder where(Map<String, Object> conditionFieldValues) {
        if (!whereClauseAdded) {
            query.append(" WHERE ");
            whereClauseAdded = true;
        } else {
            query.append(" AND ");
        }
        int count = 0; // To keep track of condition appending
        for (Map.Entry<String, Object> entry : conditionFieldValues.entrySet()) {
            if (count > 0 ) {
                if(entry.getKey().contains("like"))
                	query.append(" OR ");
                else
                	query.append(" AND "); // Add "AND" between multiple conditions
            }
            query.append(entry.getKey()).append("  ? ");
            // You can add the actual value to a list of parameters for prepared statement execution
            parameters.add(entry.getValue());
            count++;
        }
        return this;
    }
    public QueryBuilder whereJoin(Map<String, Object> conditionFieldValues) {
        if (!whereClauseAdded) {
            query.append(" WHERE ");
            whereClauseAdded = true;
        } else {
            query.append(" AND ");
        }
        int count = 0; // To keep track of condition appending
        for (Map.Entry<String, Object> entry : conditionFieldValues.entrySet()) {
            if (count > 0) {
                query.append(" AND "); // Add "AND" between multiple conditions
            }
            query.append(entry.getKey()).append(entry.getValue());
            // You can add the actual value to a list of parameters for prepared statement execution
            count++;
        }
        return this;
    }

    // Add WHERE clause with OR condition
    public QueryBuilder orWhere(String field) {
        if (!whereClauseAdded) {
            query.append("WHERE ");
            whereClauseAdded = true;
        } else {
            query.append("OR ");
        }
        query.append(field).append(" = ? ");
        return this;
    }

    // Add WHERE clause with AND condition (useful for chaining AND)
//    public QueryBuilder andWhere(String field) {
//        return where(field); // AND is the default behavior in where()
//    }

    // Add WHERE clause with a comparison operator
    private QueryBuilder whereWithOperator(String field, String operator) {
        if (!whereClauseAdded) {
            query.append("WHERE ");
            whereClauseAdded = true;
        } else {
            query.append("AND ");
        }
        query.append(field).append(" ").append(operator).append(" ? ");
        return this;
    }

    // Add support for "greater than" (>)
    public QueryBuilder whereGreaterThan(String field) {
        return whereWithOperator(field, ">");
    }

    // Add support for "less than" (<)
    public QueryBuilder whereLessThan(String field) {
        return whereWithOperator(field, "<");
    }

    // Add support for "greater than or equal to" (>=)
    public QueryBuilder whereGreaterThanOrEqualTo(String field) {
        return whereWithOperator(field, ">=");
    }

    // Add support for "less than or equal to" (<=)
    public QueryBuilder whereLessThanOrEqualTo(String field) {
        return whereWithOperator(field, "<=");
    }

    // Bind values to parameters (to be used in prepared statement)
    public QueryBuilder setValues(Object... values) {
        for (Object value : values) {
            parameters.add(value);
        }
        return this;
    }

    // Add LIMIT clause to the SELECT query
    public QueryBuilder limit(Object object) {
        query.append(" LIMIT ").append(object).append(" ");
        return this;
    }

    // Add OFFSET clause to the SELECT query
    public QueryBuilder offset(Object number) {
        query.append(" OFFSET ").append(number).append(" ");
        return this;
    }
    public QueryBuilder like(String condition) {
        query.append(" like ").append(condition).append(" ");
        return this;
    }
    public QueryBuilder orderBy(Object column,String...order) {
    	query.append(" ORDER BY ").append(column).append(" ").append(order[0]);
    	return this;
    }
    // Finalize and return the built query
    public String build() {
    	
    	String Query=query.toString().trim()+";";
    	query= new StringBuilder();
        whereClauseAdded = false;
        return Query;
    }
    public boolean isJoinApplied() {
    	return joinApplied;
    }
    public CRUD getoperation() {
    	return Operation;
    }
    public  Map<Class<?>, List<String>> getJoinClassMap()
    {
    	return classWithcolumns;
    }

    // Prepare and bind values using PreparedStatement to avoid SQL injection
    public PreparedStatement prepareStatement(Connection connection) throws SQLException {
    	PreparedStatement preparedStatement=null;
       
        preparedStatement = connection.prepareStatement(build());
        for (int i = 0; i < parameters.size(); i++) {
            preparedStatement.setObject(i + 1, parameters.get(i));
        }
        System.out.println(preparedStatement);
        parameters = new ArrayList<>();
        return preparedStatement;
      
    }
    
	

	
}
   
    //select("name").from("table_name").andwhere("age").orwhere("name").limit().offset().setValues("20","spike",10,1).values("");
