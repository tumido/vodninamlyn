import type { WeddingInfo } from "./types";

export const WEDDING_INFO: WeddingInfo = {
  couple: {
    groom: "Tom",
    groomPrefixes: ["Toma", "Fan", "Symp", "A"],
    bride: "Jana",
    brideSuffixes: ["peňo", "konda", "tomie", "lýza"],
    heading: "Se berem, abyste věděli",
  },

  date: {
    full: new Date("2026-04-18T14:00:00"),
    display: "18. dubna 2026",
    time: "14:00",
  },

  venue: {
    name: "Dohnalův mlýn",
    address: {
      street: "",
      city: "Zástřizly 87",
      zip: "768 05",
    },
    coordinates: {
      lat: 50.0875,
      lng: 14.4213,
    },
    web: "https://www.dohnaluvmlyn.cz/",
    googleMapsUrl: "https://goo.gl/maps/CPNmRwUxDJ7ELHR6A",
  },

  schedule: [
    {
      day: "Pátek",
      date: "17. dubna 2026",
      items: [
        {
          time: "17:00",
          title: "Příjezd",
          description: "Příjezd prvních hostů",
          icon: "🚗",
        },
        {
          time: "18:00",
          title: "Neformální setkání",
          description: "Posezení u mlýna pro první hosty",
          icon: "☕",
        },
      ],
    },
    {
      day: "Sobota",
      date: "18. dubna 2026",
      items: [
        {
          time: "Dopoledne",
          title: "Brunch",
          description: "Svatební obřad",
          icon: "💒",
        },
        {
          time: "13:00",
          title: "Obřad",
          description: "Svatební obřad",
          icon: "💒",
        },
        {
          time: "Po obřadu",
          title: "Focení",
          description: "Společné fotografování",
          icon: "📷",
        },
        {
          time: "15:00",
          title: "Přípitek",
          description: "Společný přípitek",
          icon: "📷",
        },
        {
          time: "16:00",
          title: "Raut",
          description: "Svatební raut",
          icon: "🍽️",
        },
        {
          time: "20:00",
          title: "Oheň",
          description: "Budeme hořet, hrát a zpívat",
          icon: "💃",
        },
      ],
    },
  ],

  rsvpDeadline: new Date("2026-05-01"),

  contact: {
    email: "svatba@example.cz",
    phone: "+420 123 456 789",
  },
} as const;

export const FLORAL_POSITIONS = [
  {
    top: "10%",
    left: "5%",
    animation: "grow-left" as const,
    delay: 0,
    variant: "flower1",
  },
  {
    top: "40%",
    left: "8%",
    animation: "grow-left" as const,
    delay: 150,
    variant: "branch1",
  },
  {
    top: "15%",
    right: "5%",
    animation: "grow-right" as const,
    delay: 300,
    variant: "leaf1",
  },
  {
    top: "45%",
    right: "8%",
    animation: "grow-right" as const,
    delay: 450,
    variant: "flower2",
  },
  {
    bottom: "20%",
    left: "10%",
    animation: "grow-bottom" as const,
    delay: 600,
    variant: "branch2",
  },
  {
    bottom: "25%",
    right: "10%",
    animation: "grow-bottom" as const,
    delay: 750,
    variant: "leaf2",
  },
] as const;
