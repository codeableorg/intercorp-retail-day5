import Link from "next/link";
import styles from "./styles.module.css";
import { Product } from "@/lib/types";
import Image from "next/image";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/products/${product.id}`} className={styles["product-card"]}>
      <div className={styles["product-card__container"]}>
        <div className={styles["product-card__image-container"]}>
          <Image
            src={product.img_src}
            alt={product.title}
            className={styles["product-card__image"]}
          />
        </div>
        <div className={styles["product-card__content"]}>
          <h2 className={styles["product-card__title"]}>{product.title}</h2>
          <p className={styles["product-card__description"]}>
            {product.description}
          </p>
          <p className={styles["product-card__price"]}>${product.price}</p>
        </div>
        {product.is_on_sale && (
          <span className={styles["product-card__sale-badge"]}>🚀 Oferta</span>
        )}
      </div>
    </Link>
  );
}
