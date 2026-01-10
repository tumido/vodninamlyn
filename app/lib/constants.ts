import type { WeddingInfo } from './types';

export const WEDDING_INFO: WeddingInfo = {
  couple: {
    bride: 'Jana Nováková',
    groom: 'Petr Novák',
  },

  date: {
    full: new Date('2026-06-20T14:00:00'),
    display: '20. června 2026',
    time: '14:00',
  },

  venue: {
    ceremony: {
      name: 'Kostel svatého Jakuba',
      address: {
        street: 'Náměstí Republiky 123',
        city: 'Praha 1',
        zip: '110 00',
      },
      coordinates: {
        lat: 50.0875,
        lng: 14.4213,
      },
      googleMapsUrl: 'https://maps.google.com/?q=50.0875,14.4213',
    },
    reception: {
      name: 'Restaurace U Zlatého Lva',
      address: {
        street: 'Malostranské náměstí 10',
        city: 'Praha 1',
        zip: '118 00',
      },
      coordinates: {
        lat: 50.0880,
        lng: 14.4038,
      },
      googleMapsUrl: 'https://maps.google.com/?q=50.0880,14.4038',
    },
  },

  schedule: [
    {
      time: '14:00',
      title: 'Obřad',
      description: 'Svatební obřad v kostele',
      icon: '💒',
    },
    {
      time: '15:30',
      title: 'Focení',
      description: 'Společné fotografování',
      icon: '📷',
    },
    {
      time: '17:00',
      title: 'Hostina',
      description: 'Svatební hostina a oslavy',
      icon: '🍽️',
    },
    {
      time: '20:00',
      title: 'Tanec',
      description: 'První tanec a zábava',
      icon: '💃',
    },
  ],

  rsvpDeadline: new Date('2026-05-01'),

  contact: {
    email: 'svatba@example.cz',
    phone: '+420 123 456 789',
  },
} as const;
