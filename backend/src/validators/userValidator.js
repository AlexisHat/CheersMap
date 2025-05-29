const z = require("zod");

const registerSchema = z.object({
  vorname: z.string().min(1, "Vorname ist erforderlich"),
  nachname: z.string().min(1, "Nachname ist erforderlich"),
  email: z.string().email("Ungültige E-Mail-Adresse"),
  username: z
    .string()
    .min(3, "Benutzername muss mindestens 3 Zeichen haben")
    .regex(
      /^[a-z0-9.-]+$/,
      "Benutzername darf nur Kleinbuchstaben, Zahlen, Bindestriche und Punkte enthalten"
    ),
  password: z
    .string()
    .min(8, "Passwort muss mindestens 8 Zeichen haben")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
      "Passwort muss mindestens einen Großbuchstaben, einen Kleinbuchstaben und eine Zahl enthalten"
    ),
});

module.exports = {
  registerSchema,
};
