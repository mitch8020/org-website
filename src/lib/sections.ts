export type Section = {
  id: string
  label: string
  href: string
  roman: string
  numeral: string
  tagline: string
  filed: string
  accession: string
}

export const SECTIONS: ReadonlyArray<Section> = [
  {
    id: 'about',
    label: 'About Us',
    href: '/about',
    roman: 'I',
    numeral: '01',
    tagline: 'Origin, mandate, principals',
    filed: 'Identity / Charter',
    accession: 'ORG-001.AU',
  },
  {
    id: 'community',
    label: 'Community',
    href: 'https://www.icloud.com/pages/073iADvUsVFbPTTVpWDxNN0UQ#Community',
    roman: 'II',
    numeral: '02',
    tagline: 'Gatherings, members, kinship',
    filed: 'Social / Communion',
    accession: 'ORG-002.CM',
  },
  {
    id: 'beliefs',
    label: 'Beliefs',
    href: 'https://www.icloud.com/pages/061X28mxN48hLJPjs2yM3pbfQ#Beliefs',
    roman: 'III',
    numeral: '03',
    tagline: 'Tenets, doctrine, questions',
    filed: 'Theology / Inquiry',
    accession: 'ORG-003.BL',
  },
  {
    id: 'infrastructure',
    label: 'Infrastructure',
    href: 'https://www.icloud.com/pages/0a1-GHMzTAs8KAJQB6LSU33PQ#Infrastructure',
    roman: 'IV',
    numeral: '04',
    tagline: 'The tower, sanctuaries, sites',
    filed: 'Architecture / Material',
    accession: 'ORG-004.IF',
  },
  {
    id: 'research',
    label: 'Research',
    href: 'https://www.icloud.com/pages/07eGdJgcVdbDKtccJ2sfY9UBQ#Research',
    roman: 'V',
    numeral: '05',
    tagline: 'Studies, findings, methods',
    filed: 'Inquiry / Practice',
    accession: 'ORG-005.RS',
  },
  {
    id: 'legal',
    label: 'Legal',
    href: 'https://www.icloud.com/pages/0d7SeKZ_1IPGDvaHcfnCFxKlw#Legal',
    roman: 'VI',
    numeral: '06',
    tagline: 'Charter, ethics, governance',
    filed: 'Statute / Conduct',
    accession: 'ORG-006.LG',
  },
  {
    id: 'future',
    label: 'Future Ideas',
    href: 'https://www.icloud.com/pages/064hK5gn5hVgdmLoFNagM1UoQ#Future_Ideas',
    roman: 'VII',
    numeral: '07',
    tagline: 'Speculation, horizons, what comes',
    filed: 'Prospectus / Vision',
    accession: 'ORG-007.FT',
  },
  {
    id: 'donations',
    label: 'Gifts & Contributions',
    href: 'https://www.icloud.com/pages/006O_K9mPqEn3NaRNxnEx88Jg#Gifts/Donations',
    roman: 'VIII',
    numeral: '08',
    tagline: 'Offerings, patronage, tithes',
    filed: 'Patronage / Tithe',
    accession: 'ORG-008.GF',
  },
] as const

export const CENTER = {
  id: 'home',
  label: 'ORG',
  href: '/',
  roman: 'IX',
  numeral: '09',
  tagline: 'Octagon Religious Research Group',
  filed: 'Principal Index',
  accession: 'ORG-000.OC',
} as const

export const GRID_ORDER: ReadonlyArray<Section | typeof CENTER> = [
  SECTIONS[0], // I  About
  SECTIONS[1], // II Community
  SECTIONS[2], // III Beliefs
  SECTIONS[3], // IV Infrastructure
  CENTER, //   center
  SECTIONS[4], // V Research
  SECTIONS[5], // VI Legal
  SECTIONS[6], // VII Future
  SECTIONS[7], // VIII Gifts
]
