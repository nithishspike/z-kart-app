package com.models;

public class Category {
   private long categoryId,categoryName,createdTime,updatedTime;
   public long getCategoryId() {
	return categoryId;
}
public void setCategoryId(long categoryId) {
	this.categoryId = categoryId;
}
public long getCategoryName() {
	return categoryName;
}
public void setCategoryName(long categoryName) {
	this.categoryName = categoryName;
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
public String getCategoryDescription() {
	return discription;
}
public void setCategoryDescription(String discription) {
	this.discription = discription;
}
public String getUniqueName() {
	return uniqueName;
}
public void setUniqueName(String uniqueName) {
	this.uniqueName = uniqueName;
}
public String getDisplayName() {
	return DisplayName;
}
public void setDisplayName(String DisplayName) {
	this.DisplayName = DisplayName;
}
private String discription,uniqueName,DisplayName;
   
   
}
