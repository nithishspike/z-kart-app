package com.util;


import com.models.Product;
import com.models.UserProduct;
import com.dao.Dao;
import com.enums.DatabaseTable;
import com.exception.ApplicationException;

import java.util.HashMap;
import java.util.List;

import javax.servlet.http.HttpServletResponse;

public class CartUtil {

    // Method to check if the product is available in stock
    public static List<Product> checkProductStock(Dao dao, long productId, int quantity) throws Exception {
        List<Product> listProduct = dao.FetchRecord(
            DatabaseTable.PRODUCT.getTableName(),
            Product.class,
            createHashMap("product_id" + "=", productId, "stock" + ">=", quantity),
            null
        );
        if (listProduct.isEmpty()) {
            throw new ApplicationException(
                HttpServletResponse.SC_NOT_MODIFIED,
                "Sorry, the product is unavailable or quantity exceeds stock"
            );
        }
        return listProduct;
    }

    // Method to check if the product exists in the user's cart
    public static boolean isProductInCart(Dao dao, long userId, long productId) throws Exception {
        List<UserProduct> userProductList = dao.FetchRecord(
            DatabaseTable.USER_PRODUCT.getTableName(),
            UserProduct.class,
            createHashMap("user_id" + "=", userId, "product_id" + "=", productId),
            null
        );
        return !userProductList.isEmpty();
    }

    // Method to update the product quantity in the user's cart
    public static void updateProductInCart(Dao dao, long userId, long productId, int quantity) throws Exception {
        if (quantity == 0) {
            // Delete product if quantity is zero
            dao.DeleteRecord(
                DatabaseTable.USER_PRODUCT.getTableName(),
                UserProduct.class,
                createHashMap("product_id" + "=", productId, "user_id" + "=", userId)
            );
        } else {
            // Update product quantity in cart
            dao.UpdateRecord(
                DatabaseTable.USER_PRODUCT.getTableName(),
                UserProduct.class,
                createHashMap("user_id" + "=", userId, "product_id" + "=", productId),
                createHashMap("quantity", quantity),
                "user_id"
            );
        }
    }

    // Helper method to create a HashMap with conditions
    public static HashMap<String, Object> createHashMap(Object... keyValues) {
        HashMap<String, Object> map = new HashMap<>();
        for (int i = 0; i < keyValues.length; i += 2) {
            map.put((String) keyValues[i], keyValues[i + 1]);
        }
        return map;
    }
}
