package com.util;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.Base64;

public class PasswordEncryptor {
	public String generateSalt() {
		SecureRandom sr = new SecureRandom();
		byte[] salt = new byte[16];
		sr.nextBytes(salt);
		return Base64.getEncoder().encodeToString(salt);
	}

	// Hash the password with the salt
	public String hashPasswordWithSalt(String password, String salt) throws NoSuchAlgorithmException {
		String saltedPassword = password + salt;
		MessageDigest md = MessageDigest.getInstance("SHA-256");
		byte[] hashedPassword = md.digest(saltedPassword.getBytes());

		StringBuilder hexString = new StringBuilder();
		for (byte b : hashedPassword) {
			String hex = Integer.toHexString(0xff & b);
			if (hex.length() == 1) {
				hexString.append('0');
			}
			hexString.append(hex);
		}
		return hexString.toString();
	}
}
