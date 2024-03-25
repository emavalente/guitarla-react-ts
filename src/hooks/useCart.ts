import { useState, useEffect, useMemo } from "react";
import type { CartItem, Guitar } from "../types/";
import { db } from "../data/db";

export const useCart = () => {
  const initialCart = (): CartItem[] => {
    const localStorageCart = localStorage.getItem("cart");
    return localStorageCart ? JSON.parse(localStorageCart) : [];
  };

  const [data] = useState(db);
  const [cart, setCart] = useState(initialCart);

  function addToCart(item: Guitar) {
    const isInCart = cart.some((cartItem) => cartItem.id === item.id);

    if (!isInCart) {
      const newItem = { ...item, quantity: 1 };

      setCart([...cart, newItem]);
    } else {
      const updatedCart = cart.map((cartItem) => {
        if (cartItem.id === item.id && cartItem.quantity < 5) {
          return {
            ...cartItem,
            quantity: cartItem.quantity + 1,
          };
        } else {
          return cartItem;
        }
      });
      setCart(updatedCart);
    }
  }

  function removeFromCart(id: Guitar["id"]) {
    setCart(cart.filter((item) => item.id !== id));
  }

  function increaseQuantity(id: Guitar["id"]) {
    const updatedCart = cart.map((item) => {
      if (item.id === id && item.quantity < 5) {
        return {
          ...item,
          quantity: item.quantity + 1,
        };
      }
      return item;
    });

    setCart(updatedCart);
  }

  function decreaseQuantity(id: Guitar["id"]) {
    const updatedCart = cart.map((item) => {
      if (item.id === id && item.quantity > 1) {
        return { ...item, quantity: item.quantity - 1 };
      }

      return item;
    });
    setCart(updatedCart);
  }

  function cleanCart() {
    setCart([]);
  }

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // State Derivado
  const isEmpty = useMemo(() => cart.length === 0, [cart]);
  const cartTotal = useMemo(
    () => cart.reduce((total, item) => total + item.quantity * item.price, 0),
    [cart]
  );

  return {
    data,
    cart,
    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    cleanCart,
    isEmpty,
    cartTotal,
  };
};
