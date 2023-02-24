export interface Propmt {
  title: string;
  prompt: string;
  dependencies?: string[];
  resDependencies?: string[];
}

export const prompts: { [key: string]: Propmt } = {
  res_tech: {
    title: "Technologies",
    prompt:
      "Make a plan of the technologies that you would use for the development of an MVP for web3 or AI with the data provided.",
    dependencies: [
      "focusMarket",
      "technology",
      "mvpFeatures",
      "problem",
      "customerSegment",
      "businessModel",
    ],
  },
  res_budget: {
    title: "Budget",
    prompt:
      "Make an approximate budget based on the data and answers provided for the development of a technological MVP.",
    dependencies: [
      "mvpFeatures",
      "technology",
      "customerSegment",
      "startupStatus",
      "foundersProfile",
      "businessModel",
    ],
    resDependencies: ["res_tech"],
  },
  res_finance: {
    title: "Financing Plan",
    prompt:
      "Develop a financing plan to obtain funds once the MVP is validated in the market and is generating its first sales taking into account different private financing alternatives such as Venture Capitals and angel investors.",
    dependencies: [
      "customerSegment",
      "businessModel",
      "investment",
      "startupStatus",
      "foundersProfile",
    ],
    resDependencies: ["res_budget", "res_launch"],
  },
  res_hr: {
    title: "HR Structure",
    prompt:
      "Develop an ideal minimum HR structure so that the MVP can function as a startup for the first months after launch.",
    dependencies: [
      "technology",
      "foundersProfile",
      "startupStatus",
      "businessModel",
      "technology",
    ],
    resDependencies: ["res_budget"],
  },
  res_community: {
    title: "Community Plan",
    prompt:
      "Develop a community creation and management plan on social media, mainly Twitter and Discord, to ensure a minimum viable community and engage with the early adopters of the product.",
    dependencies: [
      "startupName",
      "problem",
      "focusMarket",
      "mvpFeatures",
      "technology",
      "customerSegment",
    ],
    resDependencies: ["res_launch"],
  },
  res_agenda: {
    title: "Founder Agenda",
    prompt:
      "Develop the ideal agenda of a technology-based MVP founder / CEO to stay focused on the main priorities of scalability, legal and human and financial resource management.",
    dependencies: [
      "problem",
      "focusMarket",
      "mvpFeatures",
      "technology",
      "customerSegment",
      "businessModel",
      "foundersProfile",
    ],
    resDependencies: ["res_hr", "res_finance", "res_community", "res_tech"],
  },
  res_feasibility: {
    title: "Feasibility",
    prompt:
      "Make a detailed analysis of the feasibility and potential impact of the proposed solution.",
    dependencies: [
      "startupName",
      "problem",
      "focusMarket",
      "mvpFeatures",
      "technology",
      "customerSegment",
      "businessModel",
      "foundersProfile",
    ],
    resDependencies: ["res_tech, res_finance", "res_budget"],
  },
  res_resources: {
    title: "Resources",
    prompt:
      "Make a list of resources such as books, conferences or authors that founders can access to increase their chances of success in developing their startup.",
    dependencies: [
      "problem",
      "focusMarket",
      "mvpFeatures",
      "technology",
      "customerSegment",
      "businessModel",
      "foundersProfile",
    ],
    resDependencies: ["res_finance, res_tech"],
  },
};
