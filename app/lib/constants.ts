import type {
  WeddingInfo,
  AttendingStatusValue,
  AccommodationTypeValue,
  DrinkChoiceValue,
} from "./types";

// RSVP Label mappings
export const ATTENDING_LABELS: Record<AttendingStatusValue, string> = {
  yes: "Dorazí",
  no: "Nedorazí",
} as const;

export const ACCOMMODATION_LABELS: Record<AccommodationTypeValue, string> = {
  roof: "Chce střechu",
  "own-tent": "Stan",
  "no-sleep": "Nespím",
} as const;

export const DRINK_LABELS: Record<DrinkChoiceValue, string> = {
  pivo: "Pivo",
  vino: "Víno",
  nealko: "Nealko",
  other: "Jiné",
} as const;

// Form select options derived from label mappings
export const ATTENDING_OPTIONS = [
  { value: "yes", label: "Ano, přijdeme" },
  { value: "no", label: "Bohužel se nemůžeme zúčastnit" },
] as const;

export const ACCOMMODATION_OPTIONS = [
  { value: "roof", label: "Chci spát pod střechou" },
  { value: "own-tent", label: "Přivezu si vlastní střechu" },
  { value: "no-sleep", label: "Nepřespím" },
] as const;

export const DRINK_OPTIONS = [
  { value: "pivo", label: "Pivo" },
  { value: "vino", label: "Víno" },
  { value: "nealko", label: "Nealko" },
  { value: "other", label: "Něco jiného" },
] as const;

export const WEDDING_INFO: WeddingInfo = {
  couple: {
    groom: "Tom",
    bride: "Jana",
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

  details: [
    {
      name: "Místo",
      icon: "globe",
      description:
        "Svatba proběhne na Dohnalově mlýně. Je to samota u vesnice Zástřizly, zde proběhne jak oslava, tak obřad.",
    },
    {
      name: "Termín",
      icon: "clock",
      description:
        "Na místě budeme od pátku 17.4. do neděle 19.4. Kamarády na výpomoc a malou rozlučku se svobodou rádi uvítáme již v pátek. Obřad bude probíhat v sobotu po poledni.",
    },
    {
      name: "Doprava",
      icon: "rocket",
      description:
        "Přijďte pěšky, na kole nebo autem. Odvoz vám nezajistíme, takže se odsud dostanete až po vystřízlivění.",
    },
    {
      name: "Nocleh",
      icon: "tent",
      description:
        "Míst pod střechou je omezené množství, budeme rádi pokud nám svůj zájem o něj dáte vědět v dotazníku. Pro ostatní zde máme spoustu místa pro stany i karavany.",
    },
    {
      name: "Oblečení",
      icon: "jacket",
      description:
        "Přijďte tak, jak vám s námi bude příjemně. Na obřad si prosím vemte oblečení ze společenštější části vašeho šatníku. Později se klidně převlečte do libovolného komfortního oblečení. Obzvláště k ohni to doporučujeme. Na barvy nehrajeme, jen vynechte prosím bílou u šatů. Jinak zvolte klidně všechny.",
    },
    {
      name: "Dary",
      icon: "present",
      description:
        "Netoužíme po věcných darech. Vaše přítomnost je pro nás dar největší. Pokud na tom ale budete trvat, budeme rádi, když nám přispějete na rekonstrukci bytu.",
    },
  ],

  schedule: [
    {
      time: "Pátek od 17:00",
      title: "Malá rozlučka",
      description:
        "Pro kamarády, zahoříme, zazpíváme a třeba i svatbu nachystáme",
      icon: "☕",
    },
    {
      time: "Sobota 11:00",
      title: "Příjezd hostů",
      description: "",
      icon: "💒",
    },
    {
      time: "13:00",
      title: "Obřad",
      icon: "💒",
      highlight: true,
    },
    {
      time: "Po obřadu",
      title: "Focení",
      icon: "📷",
    },
    {
      time: "16:00",
      title: "Raut",
      icon: "🍽️",
    },
    {
      time: "20:00",
      title: "Oheň",
      description: "Budeme hořet, hrát a zpívat",
      icon: "💃",
    },
  ],

  rsvpDeadline: new Date("2026-05-01"),

  contact: {
    email: "tumi-a-jana@vodninamlyn.cz",
    phone: "+420 123 456 789",
  },
} as const;
