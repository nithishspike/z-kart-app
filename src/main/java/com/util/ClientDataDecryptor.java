package com.util;

import java.nio.file.Files;
import java.nio.file.Paths;
import java.security.InvalidKeyException;
import java.security.KeyFactory;
import java.security.NoSuchAlgorithmException;
import java.security.PrivateKey;
import java.security.spec.PKCS8EncodedKeySpec;

import javax.crypto.BadPaddingException;
import javax.crypto.Cipher;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import javax.servlet.http.HttpServletResponse;

import com.exception.ApplicationException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.models.Users;

import java.util.Base64;

public class ClientDataDecryptor {

    private PrivateKey privateKey;

    public ClientDataDecryptor(PrivateKey privateKey) {
        this.privateKey = privateKey;
    }

    public String rsaDecryptData(String encryptedData) throws ApplicationException, InvalidKeyException, NoSuchAlgorithmException, NoSuchPaddingException, IllegalBlockSizeException, BadPaddingException {
    	byte[] encryptedBytes;
    	try {
    		System.out.println(encryptedData);
    	    encryptedBytes = Base64.getDecoder().decode(encryptedData);
    	}
    	catch(Exception e) {
    		throw new ApplicationException(HttpServletResponse.SC_NOT_ACCEPTABLE,"Password should be encrupted");
    	}
        Cipher cipher = Cipher.getInstance("RSA");
        cipher.init(Cipher.DECRYPT_MODE, privateKey);
        
		byte[] decryptedBytes = cipher.doFinal(encryptedBytes);
        return new String(decryptedBytes);
    }

    public static Users decryptData(String encryptedData) throws Exception {

        	byte[] keyBytes = Files.readAllBytes(Paths.get("/Users/nithish-tt0489/private_key.pem"));
        	String keyString = new String(keyBytes)
        	        .replace("-----BEGIN PRIVATE KEY-----", "")
        	        .replace("-----END PRIVATE KEY-----", "")
        	        .replaceAll("\\s+", "");
        	byte[] decodedKey = Base64.getDecoder().decode(keyString);
            PKCS8EncodedKeySpec spec = new PKCS8EncodedKeySpec(decodedKey);
            KeyFactory kf = KeyFactory.getInstance("RSA");
            PrivateKey privateKey = kf.generatePrivate(spec);
            ClientDataDecryptor decryptor = new ClientDataDecryptor(privateKey);
            String decryptedData = decryptor.rsaDecryptData(encryptedData);
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode jsonNode = objectMapper.readTree(decryptedData);
            
            Users userObj=new Users();
            if(jsonNode.has("email"))
            {
              String email = jsonNode.get("email").asText();
              userObj.setEmail(email);
            }
            
            if(jsonNode.has("password"))
            {
              String password = jsonNode.get("password").asText();
              userObj.setPassword(password);
            }
            
            
            return userObj;
        
    }
}
