package com.models;

public class Invoice {
  private long invoiceId,discountId,userId,createdTime;
  private InvoiceItems invoiceItems;
  private Discounts discount;
  private Users user;
	  public Users getUsers() {
		return user;
	}


	public void setUsers(Users user) {
		this.user = user;
	}
	
	
	public Discounts getDiscounts() {
		return discount;
	  }
  
	
	public void setDiscounts(Discounts discount) {
		this.discount = discount;
	}
	
	public Product getProduct() {
		return product;
	}
	
	public void setProduct(Product product) {
		this.product = product;
	}

private Product product; 
  
	  public InvoiceItems getInvoiceItems() {
		return invoiceItems;
	}
	  
	public void setInvoiceItems(InvoiceItems invoiceItems) {
		this.invoiceItems = invoiceItems;
	}
	
	public long getInvoiceId() {
		return invoiceId;
	}
	
	public void setInvoiceId(long invoiceId) {
		this.invoiceId = invoiceId;
	}
	
	public String getInvoiceNumber() {
		return invoiceNumber;
	}
	
	public void setInvoiceNumber(String invoiceNumber) {
		this.invoiceNumber = invoiceNumber;
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
	
	public double getTotalAmount() {
		return totalAmount;
	}
	
	public void setTotalAmount(double totalAmount) {
		this.totalAmount = totalAmount;
	}
	
	public int getPaymentMode() {
		return paymentMode;
	}
	
	public void setPaymentMode(int paymentMode) {
		this.paymentMode = paymentMode;
	}
	
	public String getShippingAddress() {
		return shippingAddress;
	}
	
	public void setShippingAddress(String shippingAddress) {
		this.shippingAddress = shippingAddress;
	}
	
	private double totalAmount;
	  private int paymentMode;
	  private String shippingAddress,invoiceNumber;
}
