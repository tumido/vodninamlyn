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
    heading: "Bereme se, abyste věděli",
  },

  date: {
    full: new Date("2026-04-18T13:00:00"),
    display: "18. dubna 2026",
    time: "13:00",
    text: "Na místě budeme od pátku 17.4. do neděle 19.4. Kamarády na výpomoc a malou rozlučku se svobodou rádi uvítáme již v pátek. Obřad bude probíhat v sobotu od 13h.",
  },
  leading:
    "Jak již víte, rozhodli jsme se, že od 18. dubna 2026 budeme manželé. Prý to není samo sebou! Je k tomu potřeba svatba. Tak budiž. Našli jsme krásné místo a pozvali vás - naše rodiny a kamarády. Budeme rádi, když budete tento čas trávit a slavit s námi.",
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
    text: "Svatba proběhne na Dohnalově mlýně. Je to samota u vesnice Zástřizly, zde proběhne jak oslava, tak obřad.",
  },

  details: [
    {
      name: "Doprava",
      icon: "rocket",
      description:
        "Přijďte pěšky, na kole nebo autem. Odvoz vám nezajistíme, takže se odsud dostanete až po vystřízlivění.",
    },
    // {
    //   name: "Nocleh",
    //   icon: "tent",
    //   description:
    //     "Míst pod střechou je omezené množství, budeme rádi pokud nám svůj zájem o něj dáte vědět v dotazníku. Pro ostatní zde máme spoustu místa pro stany i karavany.",
    // },
    {
      name: "Oblečení",
      icon: "jacket",
      description:
        "Přijďte tak, jak vám s námi bude příjemně. Na obřad si prosím vemte oblečení ze společenštější části vašeho šatníku. Později se klidně převlečte do libovolného komfortního oblečení. Obzvláště k ohni to doporučujeme. Na barvy nehrajeme, jen vynechte prosím bílou u šatů. Jinak zvolte klidně všechny.",
    },
    {
      name: "Táborák",
      icon: "flame",
      description:
        "Večer hodláme zakončit u táboráku, proto buďte připraveni se všemi svými hudebními nástroji. Budeme rádi, když si společně zazpíváme a zahrajeme. Prosíme vás o jediné, pro dnešní den se vyvarujme písní, které se na svatbu úplně nehodí. Neradi bychom z toho měli cirkus.",
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

  faq: [
    {
      question: "Můžu si přivést partnera/partnerku?",
      answer:
        "Budeme rádi, když přijedou pouze výslovně pozvaní hosté. Pokud máte pochybnosti, kontaktujte nás prosím.",
    },
    {
      question: "Jsou vítány děti a jiná zvířátka?",
      answer:
        "Ano, děti i pejsci (a jim podobní) jsou vítáni! Prostoru je dost a chceme vás tam komplet. Jen nám to prosím dejte vědět v dotazníku.",
    },
    {
      question: "Co když se zpozdím?",
      answer:
        "Obřad začíná v 13:00. Zkuste být prosím na místě okolo 11. hodiny. Pokud víte, že nestíháte, dejte nám prosím vědět.",
    },
    {
      question: "Jaké bude v dubnu počasí? Jak se nachystat?",
      answer:
        "V dubnu můžeme očekávat sníh i tropická vedra. My doufáme v příjemných 20°C. Doporučujeme vzít si s sebou teplé oblečení, zejména na večer u ohně. Většina oslav bude venku, ale máme i krytý prostor. Pro noční vybavení si přečtěte sekci o možnostech přespání.",
    },
    {
      question: "Je na místě Wi-Fi?",
      answer:
        "Ano, Wi-Fi je k dispozici. Heslo vám sdělíme na místě. Ale doporučujeme na chvíli se od telefonů odpojit a užít si přítomnost společně s námi.",
    },
    {
      question: "Můžu přespat ve vlastním autě/karavanu?",
      answer:
        "Ano, je to možné. Máme dostatek prostoru pro parkování a přespání v karavanech či autech. V dotazníku je na to přímo kolonka.",
    },
    {
      question: "Budou nějaká omezení ohledně alkoholu?",
      answer:
        "Alkoholické nápoje budou samozřejmě k dispozici. Protože ale bude potřeba po vystřízlivění dojet domů vlastními silami, doporučujeme pít s rozumem.",
    },
    {
      question: "Co když mám speciální dietu nebo alergii?",
      answer:
        "V dotazníku je pole pro dietní omezení. Pokud máte alergie nebo speciální požadavky, určitě nám dejte vědět a postaráme se o vás nebo se s vámi domluvíme individuálně.",
    },
    {
      question: "Můžu fotit během obřadu?",
      answer:
        "Budeme mít profesionálního fotografa, ale samozřejmě můžete fotit i vy. Jen prosíme, abyste během obřadu byli přítomní a nezakrývali výhled ostatním.",
    },
    {
      question: "Jak funguje dar na byt?",
      answer:
        "Pokud nám chcete přispět na rekonstrukci bytu, budeme vděční. Pro dary v hotovosti budeme mít kasičku a pro jinou formu finančního plnění se nás zeptejte osobně. Úpisy k fyzické práci vyřizujeme přednostně.",
    },
  ],

  rsvpDeadline: "1. dubna 2026",

  contact: {
    email: "tumi-a-jana@vodninamlyn.cz",
    phone: "+420 123 456 789",
  },
} as const;
