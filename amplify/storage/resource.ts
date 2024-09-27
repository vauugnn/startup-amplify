import { defineStorage } from "@aws-amplify/backend";

export const storage = defineStorage({
  name: "acme-notes-app",
  access: (allow) => ({
    "images/*": [allow.authenticated.to(["read", "write", "delete"])],
  }),
});
