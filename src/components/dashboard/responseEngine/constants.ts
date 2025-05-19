
import React from "react";
import { MessageSquareText, FileCheck, ThumbsUp, UserRound } from "lucide-react";
import { ResponseTemplateProps, LanguageOption } from "./types";
import { ResponseToneStyle } from "@/types/dashboard";

// Response templates
export const responseTemplates: ResponseTemplateProps[] = [
  {
    type: "empathetic",
    description: "Show understanding while addressing concerns",
    icon: <UserRound className="h-4 w-4" />,
    template: "We understand your concerns about [ISSUE]. Our team is committed to resolving this by [ACTION]. Please reach out directly to [CONTACT] so we can make this right for you."
  },
  {
    type: "correction",
    description: "Correct misinformation with facts",
    icon: <FileCheck className="h-4 w-4" />,
    template: "Thank you for bringing this to our attention. We'd like to clarify that [CORRECT INFORMATION]. Here's our evidence: [LINK/FACTS]. Please let us know if you have any other questions."
  },
  {
    type: "apology",
    description: "Take responsibility with genuine apology",
    icon: <ThumbsUp className="h-4 w-4" />,
    template: "We sincerely apologize for [ISSUE]. This doesn't reflect our standards, and we're taking immediate steps to [SOLUTION]. We'd appreciate the opportunity to make this right for you."
  }
];

// Available tone options
export const toneOptions: ResponseToneStyle[] = [
  "professional", 
  "friendly", 
  "formal", 
  "casual", 
  "humorous", 
  "apologetic", 
  "technical", 
  "empathetic"
];

// Language options
export const languageOptions: LanguageOption[] = [
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "zh", name: "Chinese" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
  { code: "ar", name: "Arabic" },
  { code: "ru", name: "Russian" },
  { code: "pt", name: "Portuguese" }
];

// Default auto-response settings
export const defaultAutoResponseSettings = {
  enabled: false,
  threshold: 'medium' as const,
  reviewRequired: true,
  defaultTone: 'professional' as ResponseToneStyle
};
