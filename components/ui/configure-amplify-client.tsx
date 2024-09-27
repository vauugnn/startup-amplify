// configure-amplify-client.tsx
"use client";

import outputs from "/home/vauugnn/projects/aws-workshop/startup-amplify/amplify_outputs.json";
import { Amplify } from "aws-amplify";
Amplify.configure(outputs, {
 ssr: true,
});
export default function ConfigureAmplifyClient() {
 return null;
}