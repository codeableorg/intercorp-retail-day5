import { Button, Container } from "@/components/ui";

import styles from "./styles.module.css";
import Link from "next/link";
import { cookies } from "next/headers";
import { getCurrentUser } from "@/lib/data";
import { logout } from "@/lib/actions";

export default async function AuthNav() {
  const token = cookies().get("auth_token")?.value;
  const user = token ? await getCurrentUser(token) : null;

  return (
    <div className={styles["auth-nav"]}>
      <Container className={styles["auth-nav__container"]}>
        <nav aria-label="Autenticación de usuario">
          <ul className={styles["auth-nav__list"]}>
            {user ? (
              <>
                <li className={styles["auth-nav__item"]}>
                  Bienvenido {user.email}
                </li>
                <li className={styles["auth-nav__item"]}>
                  <form action={logout}>
                    <Button
                      variant="ghost"
                      type="submit"
                      className={styles["auth-nav__button"]}
                    >
                      Cerrar sesión
                    </Button>
                  </form>
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
