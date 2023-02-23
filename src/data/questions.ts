import { z } from "zod";

export interface Question {
  id: string;
  question: string;
  subtext?: string;
  placeholder?: string;
  dataType: "text" | "select" | "boolean" | "multilinetext";
  checkBoxText?: string;
  options?: string[];
  progressWeight: number;
}

export const questions = [
  {
    id: "firstName",
    question: "Let's start with your first name",
    placeholder: "John",
    dataType: "text",
    progressWeight: 1,
  },
  {
    id: "lastName",
    question: "What is your last name?",
    placeholder: "Doe",
    dataType: "text",
    progressWeight: 1,
  },
  {
    id: "email",
    question: "What is your email address?",
    placeholder: "JohnDoe@example.com",
    dataType: "text",
    progressWeight: 1,
  },
  {
    id: "startupName",
    question: "Great! Tell me the name of your startup.",
    dataType: "text",
    progressWeight: 1,
  },
  {
    id: "startupStatus",
    question: "Status of your startup?",
    dataType: "select",
    options: ["Idea", "In development", "Running operations"],
    progressWeight: 1,
  },
  {
    id: "focusMarket",
    question: "Focus market countries/region?",
    dataType: "text",
    progressWeight: 1,
  },
  {
    id: "problem",
    question: "What problem does your startup solve?",
    subtext: "What is its value proposition?",
    dataType: "text",
    progressWeight: 2,
  },
  {
    id: "mvpFeatures",
    question: "Top 3 MVP features?",
    dataType: "multilinetext",
    progressWeight: 3,
  },
  {
    id: "technology",
    question: "How does your startup incorporate technology?",
    dataType: "multilinetext",
    progressWeight: 3,
  },
  {
    id: "customerSegment",
    question: "Customer segment of your startup?",
    dataType: "text",
    progressWeight: 1,
  },
  {
    id: "businessModel",
    question: "Business model",
    subtext: " How does your startup generate income?",
    dataType: "multilinetext",
    progressWeight: 4,
  },
  {
    id: "foundersProfile",
    question: "Briefly describes the professional profile of the founders",
    dataType: "multilinetext",
    progressWeight: 5,
  },
  {
    id: "investment",
    question: "Did you receive an investment from a VC or angel investor?",
    dataType: "boolean",
    checkBoxText: "Yes, I received an investment",
    progressWeight: 1,
  },
  {
    id: "cto",
    question: "Are you looking for a CTO or technological partner?",
    dataType: "boolean",
    checkBoxText: "Yes, I am looking for a CTO",
    progressWeight: 1,
  },
] as Question[];

export const questionSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  startupName: z.string().min(1),
  startupStatus: z.enum(["Idea", "In development", "Running operations"]),
  focusMarket: z.string().min(1),
  problem: z.string().min(1),
  mvpFeatures: z.string().min(1),
  technology: z.string().min(1),
  customerSegment: z.string().min(1),
  businessModel: z.string().min(1),
  foundersProfile: z.string().min(1),
  investment: z.boolean(),
  cto: z.boolean(),
});
