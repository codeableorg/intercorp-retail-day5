import { Button, Container, Section } from "@/components/ui";

import styles from "./page.module.css";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";

export default async function Page() {
  const cart = { items: [], total: 0 };

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
                    <Button type="submit" size="sm-icon" variant="outline">
                      <Trash2 />
                    </Button>
                  </div>
                  <div className={styles["cart__item-footer"]}>
                    <p className={styles["cart__item-price"]}>
                      ${product.price}
                    </p>
                    <div className={styles["cart__item-quantity"]}>
                      <Button
                        type="submit"
                        variant="outline"
                        size="sm-icon"
                        disabled={quantity <= 1}
                      >
                        <Minus />
                      </Button>
                      <span className={styles["cart__item-display"]}>
                        {quantity}
                      </span>

                      <Button type="submit" variant="outline" size="sm-icon">
                        <Plus />
                      </Button>
                    </div>
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
