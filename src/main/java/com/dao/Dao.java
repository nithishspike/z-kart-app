package com.dao;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.DbManagement.QueryBuilder;
import com.persist.EntityMapper;

public class Dao {
	private QueryBuilder queryBuilder = new QueryBuilder();
	private EntityMapper persistence = new EntityMapper();

	// FetchRecord method with generics
	public  <T>List<T> FetchRecord(String tableName, Class<T> returnType,HashMap<String, Object> conditionFieldValues,HashMap<String,Object> queryOptions ,
			String... columnToRetrieve) throws Exception {
		QueryBuilder query = queryBuilder.select(columnToRetrieve).from(tableName);
		
		if (conditionFieldValues != null) {
			query.where(conditionFieldValues);
		}
		if(queryOptions!=null) {
		if(queryOptions.containsKey("orderAsc"))
		{
			query.orderBy(queryOptions.get("orderAsc"));
		}
		if(queryOptions.containsKey("orderDesc"))
		{
			query.orderBy(queryOptions.get("orderDesc"),"desc");
		}
		if(queryOptions.containsKey("limit"))
		{
			System.out.println("limit");
			query.limit(queryOptions.get("limit"));
		}
		if(queryOptions.containsKey("offset"))
		{
			query.offset(queryOptions.get("offset"));
		}
		
		}
		return persistence.doPersist(query, returnType);
	}


//	public <T> List<T> FetchJoinRecord(String tableName, List<String[]> joinValues,
//			HashMap<String, Object> conditionFieldValues, Class<T> returnType, String... columnToRetrieve)
//			throws Exception {
//
//		QueryBuilder query = queryBuilder.select(columnToRetrieve).from(tableName);
//		if (conditionFieldValues != null) {
//			query.where(conditionFieldValues);
//		}
//		query.joinValues(joinValues);
//
//		return persistence.doPersist(query, returnType);
//	}

	// getCount method with generics
	public  <T>List<T> getCount(String tableName, Class<T> returnType, Map<String, Object> conditionFieldValues)
			throws Exception {

		QueryBuilder query = queryBuilder.select("count(*)").from(tableName).where(conditionFieldValues);

		return persistence.doPersist(query, returnType);
	}

	// DeleteRecord method with generics
	public <T>List<T> DeleteRecord(String tableName, Class<T> returnType, HashMap<String, Object> conditionFieldValues)
			throws Exception {
		QueryBuilder query = queryBuilder.deleteFrom(tableName);
		if(conditionFieldValues != null) {
			query.where(conditionFieldValues);
		}
		// Execute the query and fetch the results
		return persistence.doPersist(query, returnType);
	}

	// UpdateRecord method with generics
	public <T>List<T> UpdateRecord(String tableName, Class<T> returnType,HashMap<String, Object> conditionFieldValues, 
			Map<String, Object> columnValues,String...returnField) throws Exception {
		QueryBuilder query = queryBuilder.update(tableName).set(columnValues);
		if (conditionFieldValues != null) {
			query.where(conditionFieldValues);
		}
		
		query.returning(returnField);

		// Execute the query and fetch the results
		return persistence.doPersist(query, returnType);
	}

	// InsertRecord method with generics
	public  <T>List<T> InsertRecord(String tableName, List<Map<String, Object>> fieldValues, Class<T> returnType,
			String... returnField) throws Exception {

		QueryBuilder query = queryBuilder.insertInto(tableName, fieldValues);
		if(returnField.length>0)
			query.returning(returnField);
		return persistence.doPersist(query, returnType);
	}

		public  <T>List<T> FetchJoinRecord(String tableName,Class<T> clazz, List<String[]> joinValues,
		HashMap<String, Object> conditionFieldValues, HashMap<String,Object> queryOptions,Map<Class<?>,List<String>> columnToRetrieve)
		throws Exception {
//		System.out.println("userdao");
//			System.out.println(queryOptions);
		QueryBuilder query = queryBuilder.selectJoin(columnToRetrieve).from(tableName).joinValues(joinValues);
		if (conditionFieldValues!=null && !conditionFieldValues.isEmpty()) {
		query.where(conditionFieldValues);
		}
		if(queryOptions!=null) {
		if(queryOptions.containsKey("orderAsc"))
		{
			query.orderBy(queryOptions.get("orderAsc"),"asc");
		}
		if(queryOptions.containsKey("orderDesc"))
		{
			query.orderBy(queryOptions.get("orderDesc"),"desc");
		}
		if(queryOptions.containsKey("limit"))
		{
			query.limit(queryOptions.get("limit"));
		}
		if(queryOptions.containsKey("offset"))
		{
			query.offset(queryOptions.get("offset"));
		}
		}
		return persistence.doPersist(query,clazz);
}
}
// FetchJoinRecord method with generics