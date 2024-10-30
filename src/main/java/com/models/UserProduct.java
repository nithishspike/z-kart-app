package com.models;

public class UserProduct {
   private long userId,productId,createdTime,updatedTime;
   private Product product;
   public Product getProduct() {
	   return product;
   }
   
   public void setProduct(Product product) {
	   
	   this.product=product;
   }
   
   public long getUserId() {
	return userId;
}
public void setUserId(long userId) {
	this.userId = userId;
}
public long getProductId() {
	return productId;
}
public void setProductId(long productId) {
	this.productId = productId;
}
public long getCreatedTime() {
	return createdTime;
}
public void setCreatedTime(long createdTime) {
	this.createdTime = createdTime;
}
public long getUpdatedTime() {
	return updatedTime;
}
public void setUpdatedTime(long updatedTime) {
	this.updatedTime = updatedTime;
}
public int getQuantity() {
	return quantity;
}
public void setQuantity(int quantity) {
	this.quantity = quantity;
}
private int quantity;
}
