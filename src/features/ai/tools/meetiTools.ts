import { tool } from "ai";
import z from "zod";
import { meetiService } from "../../meetis/services/MeetiService";

export const meetiTools = {
  getMeetiBySubject: tool({
    description:
      "Recomienda Meetis cuando el usuario busque o te pregunte sobre un tema en específico",
    inputSchema: z.object({
      query: z.string().describe("Tema de interés del Meeti"),
    }),
    execute: async ({ query }) => {
      const meetis = await meetiService.getMeetiByTopic(query);

      if (!meetis.length) {
        return {
          meetis: [],
          totalFound: 0,
          message: `No encontré meetis relacionados con ${query} ¿Te gustaría intentar con otra búsqueda?`,
        };
      }
      return { meetis, totalFound: meetis.length };
    },
  }),
  getVirtualMeetis: tool({
    description: `
        Usa esta herramienta cuando el usuario pregunta por meetis o eventos virtuales.
        - Si menciona un tema (React, IA, Marketing, Bitcoin, Café, etc), pásalo al query.
        - Si menciona "hoy", inclúyelo dentro del query.
        - Si el usuario solo pregunta por meetis virtuales, query dene ir vacio.
    `,
    inputSchema: z.object({
      query: z
        .string()
        .optional()
        .describe("Tema de interés del usuario sobre el meeti o evento"),
    }),
    execute: async ({ query }) => {
      const meetis = await meetiService.getVirtualMeetis(query);

      if (!meetis.length) {
        return {
          meetis: [],
          totalFound: 0,
          message: `No encontré meetis relacionados con ${query} que sean virtuales ¿Te gustaría intentar con otra búsqueda?`,
        };
      }
      return { meetis, totalFound: meetis.length };
    },
  }),
  getInPersonMeetis: tool({
    description: `
        Usa esta herramienta cuando el usuario pregunta por eventos presenciales.
        Reglas
        - Si el usuario menciona una ciudad, inclúyela en 'city'.
        - Si el usuario menciona un país, inclúyelo en 'country'.
        - Si menciona un tema (React, IA, Marketing, Bitcoin, Café, etc), inclúyelo dentro de query.
        - Si el usuario menciona un hoy, pon 'today' como true.
    `,
    inputSchema: z.object({
      query: z
        .string()
        .optional()
        .describe(
          "Tema de interés del usuario sobre el meeti o evento del usuario",
        ),
      city: z
        .string()
        .optional()
        .describe("Ciudad del Meeti de interés del usuario"),
      country: z
        .string()
        .optional()
        .describe("País del Meeti de interés del usuario"),
      today: z
        .boolean()
        .default(false)
        .describe("El usuario deseea un meeti o evento hoy"),
    }),
    execute: async ({ city, country, query, today }) => {
      const meetis = await meetiService.getInPersonMeetis(
        query,
        city,
        country,
        today,
      );

      if (!meetis.length) {
        return {
          meetis: [],
          totalFound: 0,
          message: `No encontré meetis ${query ? `relacionados con ${query}` : ""} en esta ubicación. ¿Te gustaría intentar con otra búsqueda?`,
        };
      }

      return { meetis, totalFound: meetis.length };
    },
  }),
};

