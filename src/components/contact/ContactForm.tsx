"use client";

import { useId, useState, type ChangeEvent, type FormEvent } from "react";
import { motion, type Variants } from "framer-motion";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { content } from "@/data/content";
import { EASE_STANDARD } from "@/lib/motion";
import { getWhatsAppUrl } from "@/lib/constants";

interface FormData {
  name: string;
  email: string;
  phone: string;
  course: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  course?: string;
}

type SubmitStatus = "idle" | "loading" | "success" | "error";

const INITIAL_FORM_DATA: FormData = {
  name: "",
  email: "",
  phone: "",
  course: "",
  message: "",
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const fieldVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE_STANDARD } },
};

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
};

/**
 * Envío simulado del formulario (sin backend todavía).
 * TODO: reemplazar por la llamada real al endpoint cuando exista, ej.:
 *   const response = await fetch("/api/contact", {
 *     method: "POST",
 *     headers: { "Content-Type": "application/json" },
 *     body: JSON.stringify(formData),
 *   });
 *   if (!response.ok) throw new Error("Request failed");
 * IMPORTANTE: la validación de este formulario es solo de UX (client-side).
 * El endpoint real DEBE volver a validar y sanear todos los campos en
 * servidor (longitud, formato de email/teléfono, escapado/sanitización
 * antes de persistir o reenviar por email) — nunca confiar en los datos
 * tal y como llegan del cliente.
 */
async function simulateSubmit(): Promise<void> {
  await new Promise<void>((resolve) => {
    setTimeout(resolve, 900);
  });
}

function isValidPhone(phone: string): boolean {
  const digitsOnly = phone.replace(/[^0-9]/g, "");
  return digitsOnly.length >= 9;
}

export function ContactForm() {
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<SubmitStatus>("idle");

  const nameId = useId();
  const emailId = useId();
  const phoneId = useId();
  const courseId = useId();
  const messageId = useId();

  function handleChange(
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
    // Limpia el error inline del campo en cuanto el usuario vuelve a escribir,
    // en vez de esperar al siguiente submit para refrescar el mensaje.
    setErrors((previous) => ({ ...previous, [name]: undefined }));
  }

  function validate(): FormErrors {
    const nextErrors: FormErrors = {};

    if (formData.name.trim().length === 0) {
      nextErrors.name = content.form.name.error;
    }
    if (!EMAIL_PATTERN.test(formData.email.trim())) {
      nextErrors.email = content.form.email.error;
    }
    if (!isValidPhone(formData.phone)) {
      nextErrors.phone = content.form.phone.error;
    }
    if (formData.course.trim().length === 0) {
      nextErrors.course = content.form.course.error;
    }

    return nextErrors;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validate();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setStatus("loading");

    try {
      await simulateSubmit();
      setStatus("success");
      setFormData(INITIAL_FORM_DATA);
    } catch {
      setStatus("error");
    }
  }

  const isLoading = status === "loading";

  return (
    <div>
      <h2 className="font-heading text-3xl font-semibold leading-tight tracking-tight text-white md:text-4xl">
        {content.form.title}
      </h2>
      <p className="mt-4 max-w-md font-body text-base leading-relaxed text-gray-300">
        {content.form.subtitle}
      </p>

      <motion.form
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        onSubmit={handleSubmit}
        noValidate
        className="mt-8 flex flex-col gap-6"
      >
        <motion.div variants={fieldVariants}>
          <label htmlFor={nameId} className="mb-2 block text-xs uppercase tracking-[0.08em] text-gray-300">
            {content.form.name.label}
          </label>
          <input
            id={nameId}
            name="name"
            type="text"
            autoComplete="name"
            maxLength={100}
            value={formData.name}
            onChange={handleChange}
            placeholder={content.form.name.placeholder}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? `${nameId}-error` : undefined}
            className={fieldClassName(Boolean(errors.name))}
          />
          <FieldError id={`${nameId}-error`} message={errors.name} />
        </motion.div>

        <motion.div variants={fieldVariants}>
          <label htmlFor={emailId} className="mb-2 block text-xs uppercase tracking-[0.08em] text-gray-300">
            {content.form.email.label}
          </label>
          <input
            id={emailId}
            name="email"
            type="email"
            autoComplete="email"
            maxLength={254}
            value={formData.email}
            onChange={handleChange}
            placeholder={content.form.email.placeholder}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? `${emailId}-error` : undefined}
            className={fieldClassName(Boolean(errors.email))}
          />
          <FieldError id={`${emailId}-error`} message={errors.email} />
        </motion.div>

        <motion.div variants={fieldVariants}>
          <label htmlFor={phoneId} className="mb-2 block text-xs uppercase tracking-[0.08em] text-gray-300">
            {content.form.phone.label}
          </label>
          <input
            id={phoneId}
            name="phone"
            type="tel"
            autoComplete="tel"
            maxLength={20}
            value={formData.phone}
            onChange={handleChange}
            placeholder={content.form.phone.placeholder}
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? `${phoneId}-error` : undefined}
            className={fieldClassName(Boolean(errors.phone))}
          />
          <FieldError id={`${phoneId}-error`} message={errors.phone} />
        </motion.div>

        <motion.div variants={fieldVariants}>
          <label htmlFor={courseId} className="mb-2 block text-xs uppercase tracking-[0.08em] text-gray-300">
            {content.form.course.label}
          </label>
          <select
            id={courseId}
            name="course"
            value={formData.course}
            onChange={handleChange}
            aria-invalid={Boolean(errors.course)}
            aria-describedby={errors.course ? `${courseId}-error` : undefined}
            className={fieldClassName(Boolean(errors.course))}
          >
            <option value="" disabled>
              {content.form.course.placeholder}
            </option>
            {content.form.course.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <FieldError id={`${courseId}-error`} message={errors.course} />
        </motion.div>

        <motion.div variants={fieldVariants}>
          <label htmlFor={messageId} className="mb-2 block text-xs uppercase tracking-[0.08em] text-gray-300">
            {content.form.message.label}
          </label>
          <textarea
            id={messageId}
            name="message"
            rows={4}
            maxLength={1000}
            value={formData.message}
            onChange={handleChange}
            placeholder={content.form.message.placeholder}
            className={fieldClassName(false)}
          />
        </motion.div>

        <motion.div variants={fieldVariants}>
          <button
            type="submit"
            disabled={isLoading}
            className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-lg bg-red-600 px-8 py-4 text-sm font-semibold uppercase tracking-wide text-white transition-colors duration-200 hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-steel-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black-950 disabled:cursor-not-allowed disabled:opacity-70 lg:w-auto"
          >
            {isLoading && <Loader2 size={16} strokeWidth={2} className="animate-spin" aria-hidden="true" />}
            {content.form.submit}
          </button>
        </motion.div>

        <div aria-live="polite" className="min-h-[1px]">
          {status === "success" && (
            <p className="flex items-center gap-2 font-body text-sm text-white">
              <CheckCircle2 size={20} strokeWidth={1.5} className="flex-none text-steel-400" aria-hidden="true" />
              {content.form.success}
            </p>
          )}
          {status === "error" && (
            <p className="flex items-center gap-2 font-body text-sm text-white">
              <AlertCircle size={20} strokeWidth={1.5} className="flex-none text-red-600" aria-hidden="true" />
              {content.form.error}
              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="text-steel-400 underline underline-offset-4 hover:text-white"
              >
                {content.form.whatsapp}
              </a>
            </p>
          )}
        </div>
      </motion.form>
    </div>
  );
}

function fieldClassName(hasError: boolean): string {
  const base =
    "w-full rounded border bg-gray-800 px-4 py-4 font-body text-base text-white placeholder:text-gray-400 focus:border-steel-400 focus:outline-none focus:ring-2 focus:ring-steel-400";
  return hasError ? `${base} border-red-600` : `${base} border-gray-600`;
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="mt-2 flex items-center gap-2 font-body text-sm text-white">
      <AlertCircle size={16} strokeWidth={1.5} className="flex-none text-red-600" aria-hidden="true" />
      {message}
    </p>
  );
}
