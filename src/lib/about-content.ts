// Structured content for the /about page, transcribed from the ORG
// "About Us / Contact" founding document. The source is a deeply nested legal
// outline (Articles I–IX). Each node keeps its literal outline marker so the
// hierarchy renders faithfully.
//   m = marker (e.g. "A.", "1.", "a)", "(1)", "(a)", "i)")
//   t = text
//   c = children

export type OutlineNode = {
  m: string
  t: string
  c?: ReadonlyArray<OutlineNode>
}

export type Article = {
  id: string
  roman: string
  eyebrow: string
  lead: string
  body: ReadonlyArray<OutlineNode>
}

export const ARTICLES: ReadonlyArray<Article> = [
  {
    id: 'article-1',
    roman: 'I',
    eyebrow: 'Identity & Name',
    lead: '“ORG” and “The ORG” symbolize “The Octagon Religious-Research Group and Spirituality Centers,” which operates as a 508(c)(1)(A) religious/spiritual organization and as a 501(c)(3) non-profit.',
    body: [
      {
        m: 'A.',
        t: 'Although ORG fits the classification/requirements of a church, we aim to avoid all stigmatization and terms associated with classical “Churches” and prefer to be recognized simply as a Spiritual Organization.',
        c: [{ m: '1.', t: 'See Legal for more.' }],
      },
      {
        m: 'B.',
        t: 'The name was chosen based on years of entheogenic visions from The Universal Creator.',
        c: [
          {
            m: '1.',
            t: 'Over time, the name and the idea have evolved, and we are not opposed to the name changing in the future if we vote on a more favorable name.',
          },
        ],
      },
    ],
  },
  {
    id: 'article-2',
    roman: 'II',
    eyebrow: 'Our Mission',
    lead: 'ORG aims to improve the Universe through advances in the human understanding of spirituality and science.',
    body: [
      {
        m: 'A.',
        t: 'We plan to achieve this by building octagon-shaped spiritual temples that will provide a safe place for spiritualists to connect, use entheogens, and experience theophany.',
        c: [{ m: '1.', t: 'See Infrastructure for more.' }],
      },
      {
        m: 'B.',
        t: 'Some of our locations will also be for scientists to research anything that will improve the Universe.',
        c: [{ m: '1.', t: 'For examples of this, see Research.' }],
      },
      {
        m: 'C.',
        t: 'A major part of improving the Universe requires strengthening the public’s understanding and respect for individualized spirituality.',
        c: [
          {
            m: '1.',
            t: 'For spiritualists who desire Community, we plan to incorporate a way to match-make members who share similar spiritual beliefs and to offer the option for Churches to join with their own “Set of Beliefs” profile, thus allowing ORG to be a central hub for spiritualists to find community.',
            c: [
              {
                m: 'a)',
                t: 'The matchmaking process will have options to:',
                c: [
                  {
                    m: '(1)',
                    t: 'Sort by relevance (majority of shared beliefs) and/or distance, etc.',
                  },
                  { m: '(2)', t: 'Allow members to rate and review churches.' },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'article-3',
    roman: 'III',
    eyebrow: 'Governance by Vote',
    lead: 'ORG rapidly adapts to the ever-changing world through operating on a majority-rules voting system, and we will do our best to eliminate any hierarchy.',
    body: [
      {
        m: 'A.',
        t: 'This includes allowing for the organization’s Beliefs to change rapidly with discoveries in science and/or to change alongside public perception over time.',
      },
      {
        m: 'B.',
        t: 'Most votes, like those for each belief, will have an infinite timeline and will be subject to change at any time.',
      },
      {
        m: 'C.',
        t: 'The biggest challenge of a voting system is to decide how much time must be allowed for voting during times of urgency.',
        c: [
          { m: '1.', t: 'This requires great foresight.' },
          {
            m: '2.',
            t: 'Example: If the stock market were crashing, how long would we allow for a vote before ORG sold all of our investment stock (if we had any)?',
            c: [
              {
                m: 'a)',
                t: 'We could have a continuous vote for one (or several people) to be in charge of making quick decisions on behalf of our investment stock, but in doing so, we could vote out any one person relatively quickly if they started making decisions that the majority disagreed with.',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'article-4',
    roman: 'IV',
    eyebrow: 'Names of the Creator',
    lead: 'ORG respects all names that show respect towards The Universal Creator.',
    body: [
      {
        m: 'A.',
        t: 'The Universal Creator is the currently preferred name for use in official documents, though this is subject to change at any time by means of a vote.',
        c: [{ m: '1.', t: 'See Beliefs for more.' }],
      },
    ],
  },
  {
    id: 'article-5',
    roman: 'V',
    eyebrow: 'Entheogens, Freely Given',
    lead: 'The Universal Creator intends for all entheogens (psychedelic and non-psychedelic) to be freely used by all interested humans.',
    body: [
      {
        m: 'A.',
        t: 'This is regardless of whatever their initial intentions were/are, as spiritual beliefs are inevitable after enough breakthrough experiences.',
        c: [
          {
            m: 'a)',
            t: 'Breakthrough experiences are more common with higher purity, dose, and efficacious entheogens.',
          },
          {
            m: '2.',
            t: 'The Universal Creator intended for these visions to guide scientific discoveries leading to better/longer lives of all living beings and, more importantly, to provide better definitions of what The Universal Creator is and its purpose for creating all within the universe. This means that this document (and later the website) will be updated regularly as new knowledge is obtained and as our beliefs change and/or improve.',
          },
        ],
      },
      {
        m: 'B.',
        t: 'ORG has in the past offered entheogens to members and intends to return to doing so in the coming months/years.',
        c: [
          {
            m: '1.',
            t: 'It is our goal to offer entheogens for free to all members.',
            c: [
              {
                m: 'a)',
                t: 'To achieve this goal, we must make enough through regular optional donations.',
              },
            ],
          },
        ],
      },
      {
        m: 'C.',
        t: 'A major goal of ORG is to increase the legal access and approved uses of psychedelics to all who seek them, as we are aware that with enough breakthrough experiences, the vast majority of people will start using psychedelics as entheogens.',
      },
    ],
  },
  {
    id: 'article-6',
    roman: 'VI',
    eyebrow: 'An Open Document',
    lead: 'We encourage all who read any of our documents to offer suggestions (via the comment section or private messaging to an existing member) on ways to improve/re-word any of the ORG pages and beliefs, regardless of membership status!',
    body: [],
  },
  {
    id: 'article-7',
    roman: 'VII',
    eyebrow: 'What Members Can Do',
    lead: 'Members who join will be able to:',
    body: [
      {
        m: 'A.',
        t: 'Create a personal account/page with a bio/blog where they can state their individual spiritual beliefs and/or research interests.',
        c: [
          {
            m: '1.',
            t: 'It may be beneficial to have the date associated with when each belief was officially posted to their page.',
          },
        ],
      },
      {
        m: 'B.',
        t: 'Participate in Voting.',
        c: [
          {
            m: '1.',
            t: 'Spiritual beliefs',
            c: [
              {
                m: 'a)',
                t: 'Beliefs held by ≥50% of members (with n≥2) will be copied to the home page and be considered to be a collective ORG belief.',
                c: [
                  {
                    m: '(1)',
                    t: 'It would then be ideal for the website programming to automatically change the pronouns of the belief from 1st-person singular to 1st-person plural upon pasting it to the home page.',
                    c: [
                      { m: '(a)', t: 'I → we' },
                      { m: '(b)', t: 'Me → us' },
                      { m: '(c)', t: 'My → our' },
                    ],
                  },
                ],
              },
              {
                m: 'b)',
                t: 'Members will be able to comment on beliefs with reasons why they voted whichever way they did, as well as to petition any alterations/re-wording of a belief to then be voted upon again.',
              },
              {
                m: 'c)',
                t: 'Agreed beliefs can be organized on the website’s “Beliefs” page in an order that reflects their overall approval rating (e.g., “75% of ORG members who have voted on this belief agree with it. Note: only 80% of ORG members have voted on this belief”).',
              },
            ],
          },
          {
            m: '2.',
            t: 'Vote on how to allocate energy and resources (like funding/money).',
            c: [
              {
                m: 'a)',
                t: 'Examples:',
                c: [
                  { m: '(1)', t: 'Investments' },
                  { m: '(2)', t: 'Programs' },
                  { m: '(3)', t: 'Research (see the Research section)' },
                ],
              },
            ],
          },
          {
            m: '3.',
            t: 'Vote on new members’ admittance (maybe?).',
            c: [
              {
                m: 'a)',
                t: 'This would only be necessary to prevent malicious attacks from other organizations.',
              },
            ],
          },
          {
            m: '4.',
            t: 'Vote on whether or not we should be allowed to vote to remove an existing member and/or if certain events would cause immediate removal, and if so, what degree of proof is needed for such removal.',
            c: [
              {
                m: 'a)',
                t: 'Situations where a member would be considered for automatic or democratic removal would be:',
                c: [
                  { m: '(1)', t: 'Failing to respect the beliefs of others' },
                  {
                    m: '(2)',
                    t: 'Abuse towards others, especially toward innocents like children and animals',
                  },
                  { m: '(3)', t: 'Physical violence' },
                  {
                    m: '(4)',
                    t: 'Etc. (Please don’t hesitate to bring any other scenarios needing to be addressed.)',
                  },
                ],
              },
            ],
          },
          {
            m: '5.',
            t: 'Vote on whether voters’ names should be 100% public, limited to only other members, or anonymous, even to other members.',
            c: [
              {
                m: 'a)',
                t: 'If either of the last two options wins, then we would need to spend careful thought into how the website would be built to keep user privacy.',
                c: [
                  {
                    m: '(1)',
                    t: 'This may be where a web3 DAO would come into play.',
                  },
                ],
              },
            ],
          },
          { m: '6.', t: 'Submit ideas to be voted on for anything else.' },
          {
            m: '7.',
            t: 'Majority Rules All (unless the majority votes against this rule).',
          },
          {
            m: '8.',
            t: 'Vote on changing or improving any of the above or below.',
          },
          {
            m: '9.',
            t: 'All voting should be continuous so future members can vote on previous items, potentially swaying previous votes to the alternate option.',
          },
          {
            m: '10.',
            t: 'All voting percentages should be made public (unless voted against).',
          },
        ],
      },
      {
        m: 'C.',
        t: 'Meet regularly (in person and/or over video chat) to connect with others to discuss their/our beliefs as well as to commune with entheogenic sacrament alongside others.',
      },
      {
        m: 'D.',
        t: 'Acquire entheogens (currently on hold) and use them on their own (safe) accord.',
        c: [
          {
            m: '1.',
            t: 'This is only for members who have proved a reasonable amount of:',
            c: [
              {
                m: 'a)',
                t: 'Sincerity',
                c: [
                  {
                    m: '(1)',
                    t: 'This is achieved by making a profile page and including beliefs that align with the spiritual/religious use of psychedelics (as entheogens).',
                  },
                ],
              },
              {
                m: 'b)',
                t: 'Safety',
                c: [
                  {
                    m: '(1)',
                    t: 'For the safety aspect, we currently partner with Entheo Community, which handles the safety training and certification, as they have a very impressive program that includes the knowledge needed to handle each entheogen safely.',
                    c: [
                      {
                        m: '(a)',
                        t: 'To satisfy the requirements of the Safety portion, one must read their Minister of Sacrament Handbook and complete a comprehension test that is specific to each entheogen(s) the member wishes to acquire.',
                      },
                      {
                        m: '(b)',
                        t: 'Contact Tripp for the link to the certification test(s).',
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            m: '2.',
            t: 'It is a major goal of ours to be able to provide our offerings for FREE to members.',
            c: [
              {
                m: 'a)',
                t: 'Offerings: Entheogens, services, and other gifts.',
              },
              {
                m: 'b)',
                t: 'This also extends to non-members (when there is a clear, legal route to do so).',
              },
              {
                m: 'c)',
                t: 'This goal requires us to have faith that The Universal Creator will provide us with enough members who willingly donate what is needed for the ORG to survive and grow so that we do not need to require a “minimum donation.”',
                c: [
                  {
                    m: '(1)',
                    t: 'Many entheogenic churches require the minimum donation, and that is fine. We understand the necessity of funding and that our “free to those in need” mentality is very much a spiritual experiment that we pray is successful.',
                  },
                ],
              },
              {
                m: 'd)',
                t: 'Part of how we will achieve this is to be fully transparent about how much time, money, or other resources go into acquiring each offering.',
                c: [
                  {
                    m: '(1)',
                    t: 'It will thus be obvious if we do not have a donation income that meets or exceeds the cost of obtaining the entheogen or offering the service.',
                    c: [
                      {
                        m: '(a)',
                        t: 'We would eventually run out of entheogens and won’t be able to gift anymore.',
                        c: [
                          {
                            m: 'i)',
                            t: 'This absence would last until enough donations are received and the time necessary for obtaining, making, or growing more entheogens has been satisfied.',
                          },
                        ],
                      },
                    ],
                  },
                  {
                    m: '(2)',
                    t: 'Examples of what could be clearly stated alongside each entheogen:',
                    c: [
                      {
                        m: '(a)',
                        t: 'LSD',
                        c: [
                          {
                            m: 'i)',
                            t: 'Acquired from a third party for $2,000 / 1,000× 150µg.',
                          },
                        ],
                      },
                      {
                        m: '(b)',
                        t: 'DMT',
                        c: [
                          { m: 'i)', t: 'Chemist’s salary of $60,000/yr' },
                          { m: 'ii)', t: 'Materials: $10,000/yr' },
                          { m: 'iii)', t: 'Laboratory: $200,000' },
                          { m: 'iv)', t: 'Yearly yield = 1 kg DMT' },
                        ],
                      },
                      {
                        m: '(c)',
                        t: 'Psilocybin Mushrooms',
                        c: [
                          { m: 'i)', t: 'Mycologist’s salary of $40,000/yr' },
                          { m: 'ii)', t: 'Materials/year = $20,000' },
                          { m: 'iii)', t: 'Dry yield = 30 kg' },
                        ],
                      },
                      {
                        m: '(d)',
                        t: 'General Costs:',
                        c: [
                          {
                            m: 'i)',
                            t: 'Analytical (purity and safety) analysis of entheogens',
                          },
                          {
                            m: 'ii)',
                            t: 'Postage costs',
                            c: [
                              { m: '(1)', t: 'Packaging staff' },
                              { m: '(2)', t: 'Shipping fees' },
                              { m: '(3)', t: 'PO Box subscription' },
                            ],
                          },
                          { m: 'iii)', t: 'Website maintenance' },
                          {
                            m: 'iv)',
                            t: 'Designing/building our spiritual centers',
                          },
                          { m: 'v)', t: 'Research costs' },
                          { m: 'vi)', t: 'Etc.' },
                        ],
                      },
                    ],
                  },
                  {
                    m: '(3)',
                    t: 'As one can see, it will quickly get difficult to determine what a minimum donation price should be in order to keep the ORG afloat.',
                    c: [
                      {
                        m: '(a)',
                        t: 'It therefore seems most logical that we assume people will donate what they would normally pay to someone for the entheogens that they acquire, AND then donate an additional amount based on what they feel they can afford in order to support The ORG’s other goals, like building, researching, and offering entheogens to those who are in a situation where donating would be a financial burden.',
                        c: [
                          {
                            m: 'i)',
                            t: 'If you can afford to purchase an offering from someone else, then we would prefer you donate to us with every request for free offerings.',
                          },
                        ],
                      },
                    ],
                  },
                  {
                    m: '(4)',
                    t: 'An added benefit of the cost-transparency method is that if any of our members know of a source for sacrament that is cheaper than our own, we will quickly become aware of it and then can develop a partnership that will ensure we are operating as efficiently as possible and effectively lowering the cost burden for all members’ access to entheogens.',
                    c: [
                      {
                        m: '(a)',
                        t: 'We would prefer that all entheogens are acquired through partnerships with ORG or our members, but in cases where the sharer of entheogens does not wish to be a member or partner of ORG, it would be unwise to burden our members by not acquiring higher-quality (or same-quality but cheaper-price) entheogens.',
                      },
                      {
                        m: '(b)',
                        t: 'Therefore, we will still make an effort to acquire from better sources, but much thought should be put into this to ensure that we are not putting them at risk.',
                        c: [
                          {
                            m: 'i)',
                            t: 'Minimum requirements for record-keeping on our end need to be figured out.',
                            c: [
                              {
                                m: '(1)',
                                t: 'As a spiritual organization, we should not be required to keep any records, but I think acting on this would be far too risky until proven in court.',
                                c: [
                                  {
                                    m: '(a)',
                                    t: 'The logic for this is based on previous religious persecutions, and giving a government an easily accessible route to a spiritual organization’s documents is bound to put all of their members at risk in the very real case that a “once just” government can quickly switch to being unjust. It has happened many times.',
                                  },
                                  {
                                    m: '(b)',
                                    t: 'Entheogenic religions/spiritualities are already being persecuted, and it could certainly get worse at any random point in time.',
                                  },
                                ],
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        m: 'E.',
        t: 'Lead ceremonies.',
        c: [
          {
            m: '1.',
            t: 'This is a much further-away goal, but we would again partner with Entheo Community to certify and train Entheo Community Ministers of Fellowship to lead a group of Ministers of Sacrament.',
            c: [{ m: 'a)', t: 'Minister of Fellowship Training.' }],
          },
          {
            m: '2.',
            t: 'Even further-away goals are to support people becoming an Entheo Community Minister of Ceremony so that they can lead ceremonies for any spiritualist, including those who are not ordained as Ministers of Sacrament and/or are not part of a formal church.',
          },
        ],
      },
      {
        m: 'F.',
        t: 'Direct Access to our Resources.',
        c: [
          {
            m: '1.',
            t: 'Entheogenic Lawyers',
            c: [{ m: 'a)', t: 'See Legal.' }],
          },
          {
            m: '2.',
            t: 'Psychedelic-Friendly Doctors',
            c: [{ m: 'a)', t: 'See Medical.' }],
          },
        ],
      },
    ],
  },
  {
    id: 'article-8',
    roman: 'VIII',
    eyebrow: 'Becoming a Member',
    lead: 'To become a (public or private) member:',
    body: [
      { m: '1.', t: 'Go to Community.' },
      {
        m: '2.',
        t: 'Click on and read through several members’ pages to get an idea of what to share on your own page.',
        c: [
          {
            m: 'a)',
            t: 'Feel free to leave (respectful) comments on their pages for any of the following:',
            c: [
              { m: '(1)', t: 'Agree / Disagree' },
              { m: '(2)', t: 'Suggestions on how to reword for clarity' },
              { m: '(3)', t: 'Any questions you have' },
              { m: '(4)', t: 'Spelling/grammar corrections' },
              {
                m: '(5)',
                t: 'Reinforcing the validity of their experiences through sharing your own similar experiences',
              },
              { m: '(6)', t: 'Etc.' },
            ],
          },
        ],
      },
      {
        m: '3.',
        t: 'See the section called “How To Join?” at the end of the Members list.',
      },
    ],
  },
]

export const CONTACT = {
  roman: 'IX',
  eyebrow: 'Contact Us',
  channels: [
    { label: 'Telegram', handle: '@Tripp_ORG', href: 'https://t.me/Tripp_ORG' },
    { label: 'Signal', handle: '@Tripp_ORG.99', href: null },
  ],
} as const
