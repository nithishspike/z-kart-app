package com.models;

public class UserDiscounts {
  private long discountId,userId,createdTime,updatedTime,UserDiscountId;
  private Discounts discount;
  public void setDiscounts(Discounts discount) {
		this.discount = discount;
	}
public Discounts getDiscounts() {
	return discount;
}
  public long getUserDiscountId() {
		return UserDiscountId;
	}
	public void setUserDiscountId(long UserDiscountId) {
		this.UserDiscountId = UserDiscountId;
	}
  public long getDiscountId() {
	return discountId;
}
public void setDiscountId(long discountId) {
	this.discountId = discountId;
}
public long getUserId() {
	return userId;
}
public void setUserId(long userId) {
	this.userId = userId;
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
public int getStatus() {
	return status;
}
public void setStatus(int status) {
	this.status = status;
}
private int status;
  

}
