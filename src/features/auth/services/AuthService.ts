import { auth } from "@/src/lib/auth";
import {
  ForgotPasswordInput,
  SetPasswordInput,
  SignInInput,
  SignUpInput,
} from "../schemas/authSchema";
import { authRepository, IAuthRepository } from "./AuthRepository";
import { headers } from "next/headers";
import { APIError, success } from "better-auth";

class AuthService {
  constructor(private authRepository: IAuthRepository) {}

  // async register(credentials: SignUpInput) {
  //   const { name, email, password } = credentials;
  //   // Revisar su el usuario ya existe
  //   const user = await this.authRepository.userExists(email);
  //   if (user) {
  //     return {
  //       error: "Este e-mail ya está registrado",
  //       success: "",
  //     };
  //   }

  //   // Manejar el registro
  //   await auth.api.signUpEmail({
  //     body: {
  //       name,
  //       email,
  //       password,
  //       callbackURL: "/dashboard",
  //     },
  //     headers: await headers(),
  //   });
  //   return {
  //     error: "",
  //     success: "Cuenta creada correctamente, revisa tu e-mail",
  //   };
  // }
  async register(credentials: SignUpInput) {
    const { name, email, password } = credentials;

    const user = await this.authRepository.userExists(email);

    if (user) {
      return {
        error: "Este e-mail ya está registrado",
        success: "",
      };
    }

    try {
      await auth.api.signUpEmail({
        body: {
          name,
          email,
          password,
          callbackURL: "/dashboard",
        },
        headers: await headers(),
      });

      return {
        error: "",
        success: "Cuenta creada correctamente, revisa tu e-mail",
      };
    } catch (error) {
      console.error("[register]", error);

      if (error instanceof APIError) {
        return {
          error: error.message || "Error al crear la cuenta",
          success: "",
        };
      }

      return {
        error: "No se pudo crear la cuenta",
        success: "",
      };
    }
  }
  async login(credentials: SignInInput) {
    const { email, password } = credentials;
    // Revisar su el usuario ya existe
    const user = await this.authRepository.userExists(email);
    if (!user) {
      return {
        error: "El usuario no existe",
        success: "",
      };
    }

    // verificar su password y si confirmo su cuenta
    try {
      await auth.api.signInEmail({
        body: {
          email,
          password,
          callbackURL: "/dashboard",
        },
        headers: await headers(),
      });
      return {
        error: "",
        success: "Sesión iniciada correctamete",
      };
    } catch (error) {
      if (error instanceof APIError) {
        const messages: Record<number, string> = {
          401: "Password incorrecto",
          403: "Tu cuenta no ha sido verificada, hemos enviado un email",
        };

        const errorMessage = messages[error.statusCode];

        if (errorMessage) {
          return {
            error: errorMessage,
            success: "",
          };
        }
      }
    }

    return {
      error: "",
      success: "",
    };
  }

  async resetPasswordReset(input: ForgotPasswordInput) {
    const user = await this.authRepository.userExists(input.email);
    if (!user) {
      return {
        error: "El usuario no existe",
        success: "",
      };
    }

    await auth.api.requestPasswordReset({
      body: {
        email: input.email,
      },
    });

    return {
      error: "",
      success: "Hemos enviado un email con instrucciones",
    };
  }

  async confirmPasswordReset(input: SetPasswordInput, token: string) {
    try {
      await auth.api.resetPassword({
        body: {
          newPassword: input.newPassword,
          token,
        },
      });
      return {
        error: "",
        success: "Password reestablecido correctamente",
      };
    } catch (error) {
      if (error instanceof APIError) {
        return {
          error: "Token no válido o Expirado",
          success: "",
        };
      }
    }
    return {
      error: "",
      success: "",
    };
  }
}

export const authService = new AuthService(authRepository);

