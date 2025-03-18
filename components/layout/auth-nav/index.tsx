import { Button, Container } from "@/components/ui";

import styles from "./styles.module.css";
import Link from "next/link";

type User = null | {
  name: string;
  email: string;
};

export default function AuthNav() {
  const user: User | null = null;

  return (
    <div className={styles["auth-nav"]}>
      <Container className={styles["auth-nav__container"]}>
        <nav aria-label="Autenticación de usuario">
          <ul className={styles["auth-nav__list"]}>
            {user ? (
              <>
                <li className={styles["auth-nav__item"]}>
                  Bienvenido {user.name || user.email}
                </li>
                <li className={styles["auth-nav__item"]}>
                  <Button
                    variant="ghost"
                    className={styles["auth-nav__button"]}
                  >
                    Cerrar sesión
                  </Button>
                </li>
              </>
            ) : (
              <>
                <li className={styles["auth-nav__item"]}>
                  <Link href="/login" className={styles["auth-nav__link"]}>
                    Iniciar sesión
                  </Link>
                </li>
                <li className={styles["auth-nav__item"]}>
                  <Link href="/signup" className={styles["auth-nav__link"]}>
                    Crear una cuenta
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </Container>
    </div>
  );
}
