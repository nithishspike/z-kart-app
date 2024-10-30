package com.util;

import java.util.HashMap;
import java.util.List;
import java.util.Random;

import com.dao.Dao;
import com.models.Discounts;

public class GenerateDiscount {
    public static HashMap<String,Object> RandomDiscountGenerator() throws Exception {
    	Random random = new Random();
    	HashMap<String,Object> discount=new HashMap<>();
    	int randomNumber = 20 + random.nextInt(11);
    	Dao daoObj=new Dao();
    	HashMap<String,Object> conditionField=new HashMap<>();
    	conditionField.put("percentage=",randomNumber);
    	List<Discounts> obj=daoObj.FetchRecord("discounts", Discounts.class,conditionField, null);
    	discount.put("discount_code",obj.get(0).getDiscountCode());
    	discount.put("discount_id", obj.get(0).getDiscountId());
    	discount.put("percentage", randomNumber);
    	return discount;
    }
}
