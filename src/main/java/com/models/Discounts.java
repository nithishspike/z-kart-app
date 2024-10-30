package com.models;

public class Discounts {
	private long discount_id;
	public long getDiscountId() {
		return discount_id;
	}
	public void setDiscountId(long discount_id) {
		this.discount_id = discount_id;
	}
	public boolean isisEnabled() {
		return isenabled;
	}
	public void setisEnabled(boolean isenabled) {
		this.isenabled = isenabled;
	}
	public String getDiscountCode() {
		return discountCode;
	}
	public void setDiscountCode(String discountCode) {
		this.discountCode = discountCode;
	}
	public int getPercentage() {
		return percentage;
	}
	public void setPercentage(int percentage) {
		this.percentage = percentage;
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
	private boolean isenabled;
	private String discountCode;
	private int percentage;
	private long createdTime,updatedTime;
	
}
