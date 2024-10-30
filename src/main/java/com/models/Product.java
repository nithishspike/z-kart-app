package com.models;

public class Product {
   private long productId,categoryId,brandId,createdTime,UpdatedTime;
   private Brand brandObj;
   private Category categoryObj;
   public long getProductId() {
	return productId;
}
public void setProductId(long productId) {
	this.productId = productId;
}
public long getCategoryId() {
	return categoryId;
}
public void setCategoryId(long categoryId) {
	this.categoryId = categoryId;
}
public long getBrandId() {
	return brandId;
}
public void setBrandId(long brandId) {
	this.brandId = brandId;
}
public long getCreatedTime() {
	return createdTime;
}
public void setCreatedTime(long createdTime) {
	this.createdTime = createdTime;
}
public long getUpdatedTime() {
	return UpdatedTime;
}
public void setUpdatedTime(long updatedTime) {
	UpdatedTime = updatedTime;
}
public String getSpecification() {
	return specification;
}
public void setSpecification(String specification) {
	this.specification = specification;
}
public String getProductName() {
	return productName;
}
public void setProductName(String productName) {
	this.productName = productName;
}
public double getProductPrice() {
	return productPrice;
}
public void setProductPrice(double productPrice) {
	this.productPrice = productPrice;
}
public int getStock() {
	return stock;
}
public void setStock(int stock) {
	this.stock = stock;
}
public void setBrand(Brand brandObj)
{
	this.brandObj=brandObj;
}
public Brand getBrand()
{
	return brandObj;
}
public void setCategory(Category categoryObj)
{
	this.categoryObj=categoryObj;
}
public Category getCategory() {
	return categoryObj;
}
private String specification,productName;
   private double productPrice;
   private int stock;
   

}
