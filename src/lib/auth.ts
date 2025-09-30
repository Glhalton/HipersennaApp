import { betterAuth } from "better-auth";
import { username } from "better-auth/plugins";

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  plugins: [
    username({
      schema: {
        user: {
          fields: {
            displayUsername: "display_username",
          },
        },
      },
    }),
  ],
  trustedOrigins: ["myapp://"]
});
