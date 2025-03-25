import "@/styles/index.css";

import styles from "./layout.module.css";
import AuthNav from "@/components/layout/auth-nav";
import HeaderMain from "@/components/layout/header-main";
import { Button, Container, Input, Section, Separator } from "@/components/ui";
import Link from "next/link";
import { fetchCart } from "@/lib/data";
import { CartProvider } from "@/components/cart/cart-context";

export const dynamic = "force-dynamic";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cart = await fetchCart();

  return (
    <html lang="es">
      <body>
        <CartProvider initialCart={cart}>
          <div className={styles.root}>
            <header className={styles.root__header}>
              <AuthNav />
              <HeaderMain />
            </header>
            <main className={styles.root__main}>{children}</main>
            <footer className={styles.root__footer}>
              <Container>
                <Section className={styles["root__footer-section"]}>
                  <div className={styles["root__footer-links"]}>
                    <ul className={styles["root__footer-list"]}>
                      <li className={styles["root__footer-title"]}>Tienda</li>
                      <li>
                        <Link href="/polos">Polos</Link>
                      </li>
                      <li>
                        <Link href="/tazas">Tazas</Link>
                      </li>
                      <li>
                        <Link href="/stickers">Stickers</Link>
                      </li>
                    </ul>
                    <ul className={styles["root__footer-list"]}>
                      <li className={styles["root__footer-title"]}>Compañía</li>
                      <li>
                        <Link href="/quienes-somos">Quienes somos</Link>
                      </li>
                      <li>
                        <Link href="/terminos">Términos y condiciones</Link>
                      </li>
                      <li>
                        <Link href="/privacidad">Privacidad</Link>
                      </li>
                    </ul>
                    <ul className={styles["root__footer-list"]}>
                      <li className={styles["root__footer-title"]}>Conecta</li>
                      <li>
                        <Link href="/contacto">Contáctanos</Link>
                      </li>
                      <li>
                        <Link href="https://www.facebook.com/" target="_blank">
                          Facebook
                        </Link>
                      </li>
                      <li>
                        <Link href="https://www.instagram.com/" target="_blank">
                          Instagram
                        </Link>
                      </li>
                    </ul>
                  </div>
                  <div className={styles["root__footer-newsletter"]}>
                    <p className={styles["root__footer-newsletter-title"]}>
                      Suscríbete a nuestro boletín
                    </p>
                    <p className={styles["root__footer-newsletter-text"]}>
                      Recibe las últimas ofertas y descuentos en tu correo
                      semanalmente.
                    </p>
                    <form className={styles["root__footer-form"]}>
                      <Input
                        type="email"
                        aria-label="email"
                        required
                        placeholder="ejemplo@mail.com"
                      />
                      <Button size="lg" variant="secondary" type="submit">
                        Suscribirse
                      </Button>
                    </form>
                  </div>
                </Section>
                <Separator orientation="horizontal" decorative={true} />
                <small className={styles["root__footer-copyright"]}>
                  Todos los derechos reservados © Full Stock
                </small>
              </Container>
            </footer>
          </div>
        </CartProvider>
      </body>
    </html>
  );
}
