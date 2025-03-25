"use client";

import { Button, Container, Section } from "@/components/ui";

import styles from "./page.module.css";
import Link from "next/link";
import { RemoveButton } from "@/components/cart/remove-button";
import { QuantityControl } from "@/components/cart/quantity-control";
import { useCart } from "@/components/cart/cart-context";

export default function Page() {
  const { cart } = useCart();

  return (
    <Section>
      <Container>
        <div className={styles.cart}>
          <h1 className={styles.cart__title}>Carrito de compras</h1>
          <div className={styles.cart__container}>
            {cart?.items?.map(({ product, quantity, id }) => (
              <div key={product.id} className={styles.cart__item}>
                <div className={styles["cart__item-image"]}>
                  <img
                    src={product.img_src}
                    alt={product.alt || product.title}
                    className={styles["cart__item-image-content"]}
                  />
                </div>
                <div className={styles["cart__item-details"]}>
                  <div className={styles["cart__item-header"]}>
                    <h2 className={styles["cart__item-title"]}>
                      {product.title}
                    </h2>
                    <RemoveButton itemId={id} />
                  </div>
                  <div className={styles["cart__item-footer"]}>
                    <p className={styles["cart__item-price"]}>
                      ${product.price}
                    </p>
                    <QuantityControl itemId={id} quantity={quantity} />
                  </div>
                </div>
              </div>
            ))}
            <div className={styles.cart__total}>
              <p>Total</p>
              <p>${(cart?.total || 0).toFixed(2)}</p>
            </div>
            <div className={styles.cart__action}>
              <Button
                size="lg"
                className={styles["cart__action-button"]}
                asChild
              >
                {cart?.items && cart.items.length > 0 ? (
                  <Link href="/checkout">Continuar Compra</Link>
                ) : (
                  <Link href="/">Ir a la tienda</Link>
                )}
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
