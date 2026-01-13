import type { WeddingInfo } from "./types";

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
      day: "Pátek",
      date: "17. dubna 2026",
      items: [
        {
          time: "od 17:00",
          title: "Posezení u ohně",
          description:
            "Pro kamarády, zahoříme, zazpíváme a třeba i něco nachystáme",
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
