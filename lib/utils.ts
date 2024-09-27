import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { createServerRunner } from "@aws-amplify/adapter-nextjs";
import outputs from "../amplify_outputs.json";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const { runWithAmplifyServerContext } = createServerRunner({
  config: outputs,
});

export const UNREACHABLE_ROUTES_WHEN_AUTHENTICATED = ["/", "/auth"];

export const S3_IMAGES_FOLDER = "images";

export const getS3Path = (objectPath: string) =>
  `${S3_IMAGES_FOLDER}/${objectPath}`;
