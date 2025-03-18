"use client";

import { Container, InputField, Section } from "@/components/ui";
import { SubmitButton } from "@/components/ui/submit-button";
import Link from "next/link";
import styles from "./page.module.css";
import { signUp } from "@/lib/actions";
import { useFormState } from "react-dom";

export default function Page() {
  const [state, signUpAction] = useFormState(signUp, { error: "" });
  const { error } = state;

  return (
    <Section>
      <Container className={styles.signup}>
        <h1 className={styles.signup__title}>Crea una cuenta</h1>
        <form className={styles.signup__form} action={signUpAction}>
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
            size="lg"
            className={styles.signup__submit}
            loadingText="Creando..."
          >
            Crear cuenta
          </SubmitButton>
          {error && <p className={styles.signup__error}>{error}</p>}
        </form>
        <div className={styles.signup__footer}>
          <span className={styles.signup__footer_text}>
            ¿Ya tienes una cuenta?
          </span>
          <Link href="/login" className={styles.signup__footer_link}>
            Inicia sesión
          </Link>
        </div>
      </Container>
    </Section>
  );
}
