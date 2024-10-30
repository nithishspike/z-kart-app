package com.persist;

import com.DbManagement.QueryBuilder;
import com.DbManagement.DbManager;
import com.util.PojoMapper;

import java.util.*;
import com.util.JoinPojoMapper;

public class EntityMapper {

	public  <T>List<T> doPersist(QueryBuilder queryBuilder, Class<T> clazz) throws Exception {
		DbManager DbObj = new DbManager();
		List<Map<String, Object>> resultList =  DbObj.executeQuery(queryBuilder);
		if (queryBuilder.isJoinApplied()) {
//					// Get the join class map for mapping POJOs in the case of a join
			Map<Class<?>, List<String>> classMapList = queryBuilder.getJoinClassMap(); // Assuming getJoinClassMap() returns the map of classes to columns for the join
//
//					// Use JoinPojoMapper to map the result list to nested POJOs
			return JoinPojoMapper.mapListToPojoList(classMapList, resultList,clazz);
		}
		else 
		   {
					// If no join, use the standard PojoMapper
			return  PojoMapper.mapListToPojoList(resultList, clazz);
		   }
	}
	
}
