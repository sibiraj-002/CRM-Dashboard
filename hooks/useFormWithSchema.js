"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export function useFormWithSchema(schema, options = {}) {
  return useForm({
    resolver: zodResolver(schema),
    ...options,
  });
}
