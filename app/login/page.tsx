"use client";

import { Container, InputField, Section } from "@/components/ui";
import { SubmitButton } from "@/components/ui/submit-button";
import Link from "next/link";
import styles from "./page.module.css";
import { login } from "@/lib/actions";
import { useFormState } from "react-dom";

export default function Page() {
  const [state, loginAction] = useFormState(login, { error: "" });
  const { error } = state;

  return (
    <Section>
      <Container className={styles.login}>
        <h1 className={styles.login__title}>Inicia sesión en tu cuenta</h1>
        <form className={styles.login__form} action={loginAction}>
          <InputField
            label="Correo electrónico"
            name="email"
            type="email"
            required
            autoComplete="email"
          />
          <InputField
            label="Contraseña"
            name="password"
            type="password"
            required
            autoComplete="current-password"
          />
          <SubmitButton
            loadingText="Iniciando..."
            size="lg"
            className={styles.login__submit}
          >
            Iniciar sesión
          </SubmitButton>
          {error && <p className={styles.login__error}>{error}</p>}
        </form>
        <div className={styles.login__footer}>
          <span className={styles.login__footer_text}>
            ¿Aún no tienes cuenta?
          </span>
          <Link href="/signup" className={styles.login__footer_link}>
            Crea una cuenta
          </Link>
        </div>
      </Container>
    </Section>
  );
}
