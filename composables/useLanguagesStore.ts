const levelsPerLanguage = ref<Record<string, string[]>>({
  allemande: ["A1", "A2", "B1", "B2", "C1", "C2"],
  français: ["A1", "A2", "B1", "B2", "C1", "C2"],
  anglaise: ["A1", "A2", "B1", "B2", "C1", "C2"],
  italien: ["A1", "A2", "B1", "B2", "C1", "C2"],
});

const modulesPerLevel = ref<Record<string, Record<string, string[]>>>({
  allemande: {
    A1: ["A1.1", "A1.2"],
    A2: ["A2.1", "A2.2"],
    B1: ["B1.1", "B1.2"],
    B2: ["B2.1", "B2.2"],
    C1: ["C1.1", "C1.2"],
    C2: ["C2.1", "C2.2"],
  },
  français: {
    A1: ["A1.1", "A1.2"],
    A2: ["A2.1", "A2.2"],
    B1: ["B1.1", "B1.2"],
    B2: ["B2.1", "B2.2"],
    C1: ["C1.1", "C1.2"],
    C2: ["C2.1", "C2.2"],
  },
  anglaise: {
    A1: ["A1.1", "A1.2"],
    A2: ["A2.1", "A2.2"],
    B1: ["B1.1", "B1.2"],
    B2: ["B2.1", "B2.2"],
    C1: ["C1.1", "C1.2"],
    C2: ["C2.1", "C2.2"],
  },
  italien: {
    A1: ["A1.1", "A1.2"],
    A2: ["A2.1", "A2.2"],
    B1: ["B1.1", "B1.2"],
    B2: ["B2.1", "B2.2"],
    C1: ["C1.1", "C1.2"],
    C2: ["C2.1", "C2.2"],
  },
});

const LanguageFlag = ref<Record<string, string>>({
  allemande: "/gm-flag.gif",
  français: "/fr-flag.gif",
  anglaise: "/us-flag.gif",
  italien: "/it-flag.gif",
});

const getAgesFlagsAndPath = () => [
  {
    path: "junior",
    img: "/junior.jpg",
  },
  {
    path: "youth",
    img: "/youth.jpg",
  },
  {
    path: "adults",
    img: "/adults.png",
  },
];

export default function () {
  const getLevels = (lang: string) => levelsPerLanguage.value[lang];
  const getFlag = (lang: string) => LanguageFlag.value[lang];
  const getModules = (lang: string, level: string) =>
    modulesPerLevel.value[lang][level];

  return {
    getAgesFlagsAndPath,
    getModules,
    getLevels,
    getFlag,
  };
}
