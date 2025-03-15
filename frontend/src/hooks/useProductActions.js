import { useState } from 'react';
import { deleteProduct, hideProduct } from "../services/product";

export const useProductActions = () => {

    const handleDeleteProduct = async (productId, setProductList = null) => {
        try {
            if (setProductList !== null) {
                setProductList(prev => prev.map(product => product.id === productId ? {
                    ...product,
                    status: 'removed',
                } : product))
            }

            await deleteProduct(productId);
        } catch (e) {
            console.error(e);
        }
    }

    const handleHideProduct = async (productId, setProductList = null) => {
        try {
            if (setProductList !== null) {
                setProductList(prevList =>
                    prevList.map(product =>
                        product.id === productId
                            ? {
                                ...product,
                                status: product.status === "available" ? "discontinued" : "available",
                            }
                            : product
                    )
                );
            }

            await hideProduct(productId);
        } catch (e) {
            console.error(e);
        }
    }

    return {
        handleDeleteProduct,
        handleHideProduct,
    }
}
