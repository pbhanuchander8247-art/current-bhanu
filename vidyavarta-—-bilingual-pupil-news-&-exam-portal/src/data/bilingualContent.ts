import type {
  EducationLevel,
  ExamUpdate,
  GlossaryTerm,
  InfographicModule,
  LanguageMode,
  MockQuestion,
  MockTest,
  NewsArticle,
  NewsCategory,
} from '../types/portal';

export const IMAGE_ASSETS = {
  heroLead: '/src/assets/images/hero_lead_dispatch_1795049801229.jpg',
  regionalSolarCanal: '/src/assets/images/card_regional_telangana_ap_1795049801100.jpg',
  scienceSpace: '/src/assets/images/card_science_space_isro_1795049801780.jpg',
  economyPolicy: '/src/assets/images/card_economy_policy_1795049801849.jpg',
  examAtlas: '/src/assets/images/card_exam_study_atlas_1795049801478.jpg',
} as const;

export const EDUCATION_LEVEL_LABELS: Record<
  EducationLevel,
  { en: string; te: string; focusEn: string; focusTe: string }
> = {
  high_school: {
    en: 'High School (Classes 9–10)',
    te: 'హై స్కూల్ (9–10 తరగతులు)',
    focusEn: 'Olympiads, NTSE & Civic Foundations',
    focusTe: 'ఒలింపియాడ్స్, NTSE & పౌర శాస్త్ర పునాది',
  },
  intermediate: {
    en: 'Intermediate (Classes 11–12)',
    te: 'ఇంటర్మీడియట్ (11–12 తరగతులు)',
    focusEn: 'JEE / NEET / EAPCET & Board Current Affairs',
    focusTe: 'JEE / NEET / EAPCET & బోర్డు కరెంట్ అఫైర్స్',
  },
  undergraduate: {
    en: 'Undergraduate / Degree',
    te: 'డిగ్రీ / అండర్ గ్రాడ్యుయేట్',
    focusEn: 'SSC CGL, Banking & State Group Services',
    focusTe: 'SSC CGL, బ్యాంకింగ్ & రాష్ట్ర గ్రూప్స్',
  },
  postgraduate: {
    en: 'Postgraduate / Research',
    te: 'పోస్ట్ గ్రాడ్యుయేట్ / పరిశోధన',
    focusEn: 'UGC NET, Policy Analysis & Economic Surveys',
    focusTe: 'UGC NET, విధాన విశ్లేషణ & ఆర్థిక సర్వేలు',
  },
  competitive_aspirant: {
    en: 'Competitive Exam Aspirant',
    te: 'పోటీ పరీక్షల అభ్యర్థి',
    focusEn: 'UPSC CSE, APPSC Group-I/II & TSPSC Tracks',
    focusTe: 'UPSC CSE, APPSC & TSPSC గ్రూప్-I/II',
  },
};

export const CATEGORY_META: Record<
  'all' | NewsCategory,
  { en: string; te: string }
> = {
  all: { en: 'All Editions', te: 'అన్ని విభాగాలు' },
  regional: { en: 'Regional (AP & TS)', te: 'ప్రాంతీయ (AP & TS)' },
  national: { en: 'National', te: 'జాతీయ' },
  international: { en: 'International', te: 'అంతర్జాతీయ' },
  science: { en: 'Science & Tech', te: 'సైన్స్ & టెక్' },
  economy: { en: 'Economy & Policy', te: 'ఆర్థికం & విధానాలు' },
  exams: { en: 'Exam Alerts', te: 'పరీక్షల సమాచారం' },
};

export const NEWS_ARTICLES: NewsArticle[] = [
  {
    id: 'nat-digital-education-mission-2026',
    category: 'national',
    regionLabelEn: 'New Delhi · National Policy',
    regionLabelTe: 'న్యూఢిల్లీ · జాతీయ విధానం',
    titleEn: 'National Digital Curriculum & Bilingual STEM Archive Launches Across 14,000 Public Libraries',
    titleTe: '14,000 ప్రజా గ్రంథాలయాల్లో జాతీయ డిజిటల్ పాఠ్యాంశం, ద్విభాషా STEM ఆర్కైవ్ ప్రారంభం',
    deckEn:
      'The Ministry of Education expands open-access regional language modules for Classes 9–12 and civil services aspirants, integrating real-time parliamentary digests.',
    deckTe:
      '9–12 తరగతుల విద్యార్థులు, సివిల్ సర్వీసెస్ అభ్యర్థుల కోసం ప్రాంతీయ భాషల డిజిటల్ మాడ్యూళ్లను విద్యా మంత్రిత్వ శాఖ విస్తరించింది.',
    bodyEn: [
      'In a landmark push toward equitable academic access, the Union Ministry of Education has formally inaugurated the National Bilingual Knowledge Grid, linking 14,000 district and municipal libraries with curated current affairs archives in Telugu, Tamil, Hindi, Marathi, and English.',
      'Unlike static textbook repositories, the new curriculum framework pairs constitutional debates, Economic Survey chapters, and ISRO mission briefs with structured glossary entries designed for both school boards and competitive examinations such as UPSC, APPSC, and TSPSC.',
      'Education policy analysts note that district-level aspirants frequently face a translation lag between English policy papers and regional exam preparation. By publishing synchronized dual-language dispatches on the day of legislative release, rural study circles gain immediate parity with metropolitan coaching hubs.',
    ],
    bodyTe: [
      'సమాన విద్యావకాశాలను కల్పించే దిశగా కేంద్ర విద్యా మంత్రిత్వ శాఖ 14,000 జిల్లా మరియు పురపాలక గ్రంథాలయాలను అనుసంధానిస్తూ జాతీయ ద్విభాషా విజ్ఞాన వేదికను ప్రారంభించింది. ఇందులో తెలుగు, ఇంగ్లీష్ తదితర భాషల్లో కరెంట్ అఫైర్స్ అందుబాటులో ఉంటాయి.',
      'సాధారణ పాఠ్యపుస్తకాలకు భిన్నంగా, ఈ కొత్త విధానం రాజ్యాంగ చర్చలు, ఆర్థిక సర్వే అధ్యాయాలు మరియు ఇస్రో మిషన్ వివరాలను స్పష్టమైన పదకోశంతో అనుసంధానిస్తుంది. ఇది పాఠశాల విద్యార్థులతో పాటు UPSC, APPSC, TSPSC అభ్యర్థులకు ఉపయోగపడుతుంది.',
      'జిల్లా స్థాయి అభ్యర్థులకు విధాన పత్రాల అనువాదంలో జరిగే ఆలస్యాన్ని తగ్గించడం దీని ప్రధాన ఉద్దేశ్యం. ఒకే రోజు రెండు భాషల్లో విశ్లేషణలు రావడం వల్ల గ్రామీణ విద్యార్థులకు సమగ్ర అవగాహన లభిస్తుంది.',
    ],
    examRelevanceEn:
      'GS Paper II (Governance & Education Policy): Digital Public Infrastructure in Education; NEP 2020 Multilingual Mandate.',
    examRelevanceTe:
      'GS పేపర్ II (పాలన & విద్యా విధానం): విద్యలో డిజిటల్ పబ్లిక్ ఇన్‌ఫ్రాస్ట్రక్చర్; NEP 2020 బహుభాషా లక్ష్యం.',
    examTracks: ['UPSC', 'APPSC_TSPSC', 'FOUNDATION'],
    sourceName: 'BCR Current Affairs Bureau',
    publishedAt: '2026-11-18T15:20:00Z',
    readTimeMin: 4,
    imageUrl: IMAGE_ASSETS.heroLead,
    imageCaptionEn: 'Fig. 1 — Scholars reviewing bilingual policy briefs at a central university courtyard.',
    imageCaptionTe: 'చిత్రం 1 — విశ్వవిద్యాలయ ప్రాంగణంలో ద్విభాషా విధాన పత్రాలను చదువుతున్న విద్యార్థులు.',
    isBreaking: true,
  },
  {
    id: 'reg-ap-ts-solar-irrigation-corridor',
    category: 'regional',
    regionLabelEn: 'Hyderabad & Amaravati · Regional',
    regionLabelTe: 'హైదరాబాద్ & అమరావతి · ప్రాంతీయ',
    titleEn: 'Telangana & Andhra Pradesh Commission Joint Canal-Top Solar Grid Along Krishna Basin',
    titleTe: 'కృష్ణా బేసిన్ వెంట కాలువలపై సౌర విద్యుత్ గ్రిడ్‌ను ప్రారంభించిన తెలంగాణ, ఆంధ్రప్రదేశ్',
    deckEn:
      'The 640 MW dual-state renewable corridor reduces reservoir evaporation while supplying daytime feeder power to lift-irrigation pumps.',
    deckTe:
      '640 మెగావాట్ల సంయుక్త సౌర ప్రాజెక్ట్ ద్వారా నీటి ఆవిరి నష్టాన్ని తగ్గిస్తూ పగటిపూట ఎత్తిపోతల పథకాలకు విద్యుత్ అందించనున్నారు.',
    bodyEn: [
      'Energy and irrigation departments across Telangana and Andhra Pradesh have synchronized Phase I of the Krishna Basin Canal-Top Solar Array, adding 640 MW of clean daytime capacity without acquiring agricultural land.',
      'By mounting photovoltaic panels directly over lined distributary canals across Nalgonda, Suryapet, Guntur, and Krishna districts, engineers estimate an annual water-evaporation saving of nearly 1.8 TMC feet alongside decentralized power for micro-irrigation grids.',
      'For state public service aspirants, the project illustrates India’s water–energy–food nexus strategy and demonstrates how interstate river basin cooperation can lower state electricity subsidy burdens.',
    ],
    bodyTe: [
      'తెలంగాణ మరియు ఆంధ్రప్రదేశ్ విద్యుత్, నీటిపారుదల శాఖలు సంయుక్తంగా కృష్ణా బేసిన్ కాలువ పైకప్పు సౌర విద్యుత్ ప్రాజెక్ట్ మొదటి దశను ప్రారంభించాయి. వ్యవసాయ భూమిని సేకరించకుండానే 640 మెగావాట్ల స్వచ్ఛ విద్యుత్ ఉత్పత్తి అవుతుంది.',
      'నల్గొండ, సూర్యాపేట, గుంటూరు, కృష్ణా జిల్లాల్లోని కాలువలపై సోలార్ ప్యానెళ్లు అమర్చడం ద్వారా ఏటా సుమారు 1.8 టీఎంసీల నీటి ఆవిరిని అరికట్టవచ్చని ఇంజనీర్లు అంచనా వేశారు.',
      'రాష్ట్ర గ్రూప్స్ అభ్యర్థులకు ఇది నీరు–విద్యుత్–ఆహార సమన్వయ నమూనాగా మరియు అంతర్రాష్ట్ర నదీ సహకారానికి కీలక ఉదాహరణగా నిలుస్తుంది.',
    ],
    examRelevanceEn:
      'APPSC & TSPSC Geography / Economy: Krishna River Basin Tributaries, Renewable Energy Targets, Water-Energy Nexus.',
    examRelevanceTe:
      'APPSC & TSPSC భూగోళశాస్త్రం / ఆర్థికం: కృష్ణా నది ఉపనదులు, పునరుత్పాదక ఇంధన లక్ష్యాలు.',
    examTracks: ['APPSC_TSPSC', 'UPSC'],
    sourceName: 'Deccan Regional Desk',
    publishedAt: '2026-11-18T14:40:00Z',
    readTimeMin: 4,
    imageUrl: IMAGE_ASSETS.regionalSolarCanal,
    imageCaptionEn: 'Fig. 2 — Photovoltaic array aligned beside an active irrigation distributary canal.',
    imageCaptionTe: 'చిత్రం 2 — సాగునీటి కాలువ పక్కన ఏర్పాటు చేసిన సౌర విద్యుత్ శ్రేణి.',
    isBreaking: true,
  },
  {
    id: 'sci-isro-quantum-navigation-payload',
    category: 'science',
    regionLabelEn: 'Sriharikota · Science & Space',
    regionLabelTe: 'శ్రీహరికోట · సైన్స్ & అంతరిక్షం',
    titleEn: 'ISRO Validates Indigenous Rubidium Atomic Clock & Optical Inter-Satellite Link in Orbit',
    titleTe: 'కక్ష్యలో స్వదేశీ రుబీడియం అటామిక్ క్లాక్, ఆప్టికల్ లింక్‌ను విజయవంతంగా పరీక్షించిన ఇస్రో',
    deckEn:
      'High-precision timing synchronization sharpens NavIC regional positioning accuracy to sub-meter tolerances for aviation and maritime corridors.',
    deckTe:
      'అత్యంత ఖచ్చితమైన సమయ కొలమానంతో నావిక్ (NavIC) ప్రాంతీయ దిక్సూచి వ్యవస్థ సామర్థ్యం సబ్-మీటర్ స్థాయికి పెరిగింది.',
    bodyEn: [
      'Engineers at the Satish Dhawan Space Centre and Space Applications Centre have confirmed nominal orbital drift performance for India’s latest indigenous Rubidium atomic frequency standard aboard the NVS navigation constellation.',
      'Atomic clocks are the heartbeat of satellite navigation: even a one-microsecond timing error translates into a 300-meter positioning discrepancy on Earth. Paired with a new free-space laser optical cross-link, the constellation reduces dependence on ground-station relays.',
      'The breakthrough strengthens strategic autonomy in precision agriculture, railway signaling, and disaster early-warning telemetry across South Asia.',
    ],
    bodyTe: [
      'సతీష్ ధావన్ అంతరిక్ష కేంద్రం, స్పేస్ అప్లికేషన్స్ సెంటర్ శాస్త్రవేత్తలు NVS నావిగేషన్ ఉపగ్రహ శ్రేణిలోని స్వదేశీ రుబీడియం అటామిక్ క్లాక్ అత్యంత ఖచ్చితంగా పనిచేస్తున్నట్లు నిర్ధారించారు.',
      'ఉపగ్రహ నావిగేషన్‌లో అటామిక్ గడియారాలు అత్యంత కీలకం; ఒక్క మైక్రోసెకండ్ తేడా భూమిపై 300 మీటర్ల స్థాన లోపానికి దారితీస్తుంది. కొత్త ఆప్టికల్ లేజర్ లింక్ ద్వారా ఉపగ్రహాల మధ్య సమాచార మార్పిడి వేగవంతమవుతుంది.',
      'ఈ విజయం ఖచ్చితమైన వ్యవసాయం, రైల్వే సిగ్నలింగ్ మరియు విపత్తు ముందస్తు హెచ్చరిక వ్యవస్థలకు బలం చేకూరుస్తుంది.',
    ],
    examRelevanceEn:
      'Prelims Science & Tech: NavIC (IRNSS) Coverage, Rubidium Atomic Clocks, Optical Laser Communication.',
    examRelevanceTe:
      'ప్రిలిమ్స్ సైన్స్ & టెక్: NavIC (IRNSS) పరిధి, రుబీడియం అటామిక్ క్లాక్స్, ఆప్టికల్ కమ్యూనికేషన్.',
    examTracks: ['UPSC', 'SSC_BANKING', 'FOUNDATION'],
    sourceName: 'Sriharikota Science Wire',
    publishedAt: '2026-11-18T13:15:00Z',
    readTimeMin: 3,
    imageUrl: IMAGE_ASSETS.scienceSpace,
    imageCaptionEn: 'Fig. 3 — Spacecraft payload integration inside the aerospace cleanroom.',
    imageCaptionTe: 'చిత్రం 3 — ఏరోస్పేస్ క్లీన్‌రూమ్‌లో ఉపగ్రహ పేలోడ్ అనుసంధానం.',
    isBreaking: true,
  },
  {
    id: 'eco-rbi-cbdc-fiscal-framework',
    category: 'economy',
    regionLabelEn: 'Mumbai · Economy & Finance',
    regionLabelTe: 'ముంబై · ఆర్థికం & విత్తం',
    titleEn: 'RBI Expands Programmable Digital Rupee Pilots for Direct Scholarship & Agri-Credit Transfers',
    titleTe:
      'విద్యార్థి స్కాలర్‌షిప్‌లు, వ్యవసాయ రుణాల కోసం ప్రోగ్రామబుల్ డిజిటల్ రూపాయి పైలట్‌ను విస్తరించిన RBI',
    deckEn:
      'Purpose-bound e-Rupee vouchers allow state treasuries to verify end-use compliance in real time without intermediary settlement delays.',
    deckTe:
      'ప్రత్యేక ప్రయోజనాల కోసం రూపొందించిన ఈ-రూపాయి వోచర్ల ద్వారా నిధుల వినియోగాన్ని తక్షణమే పర్యవేక్షించవచ్చు.',
    bodyEn: [
      'The Reserve Bank of India has widened its Central Bank Digital Currency (e₹) programmability pilot to cover merit scholarships, textbook grants, and seasonal agricultural input subsidies across six states.',
      'Programmable CBDC allows sovereign funds to carry built-in expiry windows and merchant-category rules while settling instantaneously on RBI’s wholesale ledger—eliminating leakage while preserving recipient privacy at retail point-of-sale.',
      'Monetary economists distinguish programmable CBDC from commercial UPI rails: whereas UPI settles across commercial bank balances, e₹ represents a direct sovereign liability of the central bank.',
    ],
    bodyTe: [
      'భారతీయ రిజర్వ్ బ్యాంక్ (RBI) సెంట్రల్ బ్యాంక్ డిజిటల్ కరెన్సీ (e₹) ప్రోగ్రామబుల్ పైలట్ ప్రాజెక్టును ఆరు రాష్ట్రాల్లో స్కాలర్‌షిప్‌లు, పాఠ్యపుస్తక గ్రాంట్లు మరియు వ్యవసాయ సబ్సిడీలకు విస్తరించింది.',
      'ప్రోగ్రామబుల్ డిజిటల్ రూపాయి ద్వారా నిధులు నిర్దిష్ట ఉద్దేశ్యానికి మాత్రమే ఖర్చయ్యేలా నియంత్రించవచ్చు. ఇది మధ్యవర్తుల జాప్యాన్ని తగ్గిస్తూ పారదర్శకతను పెంచుతుంది.',
      'వాణిజ్య బ్యాంకుల మధ్య జరిగే UPI లావాదేవీలకు భిన్నంగా, e₹ నేరుగా రిజర్వ్ బ్యాంకు బాధ్యతగా (Sovereign Liability) ఉంటుంది.',
    ],
    examRelevanceEn:
      'Indian Economy: Difference between UPI & CBDC (e₹), Monetary Base (M0), Direct Benefit Transfer Architecture.',
    examRelevanceTe:
      'భారత ఆర్థిక వ్యవస్థ: UPI మరియు CBDC మధ్య తేడా, ద్రవ్య స్థావరం (M0), DBT విధానం.',
    examTracks: ['UPSC', 'SSC_BANKING', 'APPSC_TSPSC'],
    sourceName: 'Monetary Policy Desk',
    publishedAt: '2026-11-18T11:50:00Z',
    readTimeMin: 4,
    imageUrl: IMAGE_ASSETS.economyPolicy,
    imageCaptionEn: 'Fig. 4 — Monetary balance and sovereign fiscal ledgers.',
    imageCaptionTe: 'చిత్రం 4 — ద్రవ్య సమతుల్యత మరియు ఆర్థిక విధాన పత్రాలు.',
    isBreaking: false,
  },
  {
    id: 'intl-global-semiconductor-climate-pact',
    category: 'international',
    regionLabelEn: 'Geneva & Tokyo · International',
    regionLabelTe: 'జెనీవా & టోక్యో · అంతర్జాతీయ',
    titleEn: 'Indo-Pacific Clean Tech & Critical Minerals Charter Signed by 18 Partner Economies',
    titleTe: 'క్లీన్ టెక్, కీలక ఖనిజాల సరఫరాపై 18 ఇండో-పసిఫిక్ దేశాల మధ్య వ్యూహాత్మక ఒప్పందం',
    deckEn:
      'The framework standardizes lithium, gallium, and rare-earth refining traceability while financing resilient semiconductor supply chains.',
    deckTe:
      'లిథియం, గాలియం మరియు అరుదైన ఖనిజాల శుద్ధి ప్రమాణాలను ఏకీకృతం చేస్తూ సెమీకండక్టర్ సరఫరా గొలుసును బలోపేతం చేసే ఒప్పందం కుదిరింది.',
    bodyEn: [
      'Trade and science ministers from 18 Indo-Pacific nations, including India, Japan, South Korea, and Australia, finalized a shared Critical Minerals Traceability Protocol aimed at reducing single-geography bottlenecks in battery and chip manufacturing.',
      'Under the accord, joint R&D consortia will fund urban mining—recovering cobalt, neodymium, and silicon from industrial e-waste—while extending concessional climate finance to developing grid operators.',
      'Geopolitical observers highlight India’s dual advantage in both software semiconductor design talent and coastal mineral processing corridors.',
    ],
    bodyTe: [
      'భారత్, జపాన్, దక్షిణ కొరియా, ఆస్ట్రేలియా సహా 18 ఇండో-పసిఫిక్ దేశాలు బ్యాటరీ, చిప్ తయారీకి అవసరమైన కీలక ఖనిజాల సరఫరా భద్రతపై ఉమ్మడి ఒప్పందంపై సంతకాలు చేశాయి.',
      'ఈ ఒప్పందం ప్రకారం, ఇ-వ్యర్థాల నుండి కోబాల్ట్, నియోడిమియం, సిలికాన్ వంటి ఖనిజాలను తిరిగి పొందే "అర్బన్ మైనింగ్" పరిశోధనలకు సంయుక్త నిధులు కేటాయిస్తారు.',
      'సెమీకండక్టర్ డిజైన్ ప్రతిభ మరియు తీరప్రాంత ఖనిజ ప్రాసెసింగ్ కారిడార్ల ద్వారా భారత్‌కు ఇది వ్యూహాత్మక అవకాశంగా నిలుస్తుంది.',
    ],
    examRelevanceEn:
      'International Relations (GS II): Critical Minerals Security, IPEF Supply Chain Pillar, Semiconductor Mission.',
    examRelevanceTe:
      'అంతర్జాతీయ సంబంధాలు (GS II): కీలక ఖనిజాల భద్రత, IPEF సరఫరా గొలుసు, సెమీకండక్టర్ మిషన్.',
    examTracks: ['UPSC', 'SSC_BANKING'],
    sourceName: 'Global Affairs Monitor',
    publishedAt: '2026-11-18T10:05:00Z',
    readTimeMin: 3,
    isBreaking: true,
  },
  {
    id: 'exm-upsc-appsc-calendar-update',
    category: 'exams',
    regionLabelEn: 'Exam Desk · Notifications',
    regionLabelTe: 'పరీక్షల విభాగం · ప్రకటనలు',
    titleEn: 'UPSC & State PSC Revised Prelims Syllabus Weightage: Environment & Regional Economy Surge',
    titleTe:
      'UPSC, రాష్ట్ర PSC ప్రిలిమ్స్ సిలబస్ వెయిటేజీ: పర్యావరణం, ప్రాంతీయ ఆర్థిక అంశాలకు పెరిగిన ప్రాధాన్యం',
    deckEn:
      'Recent paper analysis indicates 38% of General Studies questions now link static constitutional articles with current policy developments.',
    deckTe:
      'ఇటీవలి ప్రశ్నాపత్రాల విశ్లేషణ ప్రకారం 38% ప్రశ్నలు స్థిర రాజ్యాంగ అంశాలను కరెంట్ పాలసీతో అనుసంధానించి అడుగుతున్నాయి.',
    bodyEn: [
      'A five-year audit of UPSC Civil Services Prelims alongside APPSC and TSPSC Group-I/II screening tests reveals a decisive shift away from isolated factual recall toward multi-statement conceptual pairing.',
      'Questions on Fundamental Rights, Finance Commission devolution, and Wetland Conservation increasingly test whether aspirants understand how recent court verdicts or budget notifications alter statutory mechanisms.',
      'Mentors recommend pairing daily current affairs reading with targeted mock tests and bilingual term glossaries to build rapid elimination accuracy under exam time pressure.',
    ],
    bodyTe: [
      'గత ఐదేళ్ల UPSC సివిల్స్ ప్రిలిమ్స్ మరియు APPSC, TSPSC గ్రూప్-I/II ప్రశ్నాపత్రాల విశ్లేషణలో కేవలం జ్ఞాపకశక్తి ఆధారిత ప్రశ్నల కంటే విశ్లేషణాత్మక, బహుళ-వాక్య ప్రశ్నలు పెరిగినట్లు తేలింది.',
      'ప్రాథమిక హక్కులు, ఆర్థిక సంఘం నిధుల పంపిణీ, చిత్తడి నేలల సంరక్షణ వంటి అంశాలను ఇటీవలి కోర్టు తీర్పులు, బడ్జెట్ ప్రకటనలతో జతచేసి అడుగుతున్నారు.',
      'ప్రతిరోజూ ద్విభాషా కరెంట్ అఫైర్స్‌తో పాటు సమయపాలనతో కూడిన మాక్ టెస్టులు సాధన చేయడం ద్వారా అభ్యర్థులు ఖచ్చితత్వాన్ని పెంచుకోవచ్చు.',
    ],
    examRelevanceEn:
      'Exam Strategy: Conceptual Linking of Static Polity/Economy with Dynamic Current Affairs.',
    examRelevanceTe:
      'పరీక్ష వ్యూహం: స్థిర పాలిటీ/ఆర్థిక అంశాలను సమకాలీన వార్తలతో అనుసంధానించడం.',
    examTracks: ['UPSC', 'APPSC_TSPSC', 'SSC_BANKING', 'FOUNDATION'],
    sourceName: 'BCR Exam Desk',
    publishedAt: '2026-11-18T09:00:00Z',
    readTimeMin: 3,
    imageUrl: IMAGE_ASSETS.examAtlas,
    imageCaptionEn: 'Fig. 5 — Structured atlas and syllabus mapping for competitive exam preparation.',
    imageCaptionTe: 'చిత్రం 5 — పోటీ పరీక్షల సన్నద్ధత కోసం వ్యూహాత్మక నోట్స్ మరియు అట్లాస్.',
    isBreaking: false,
  },
];

export const EXAM_UPDATES: ExamUpdate[] = [
  {
    id: 'upd-upsc-cse-2027',
    examBody: 'UPSC',
    track: 'UPSC',
    titleEn: 'Civil Services Prelims — Daily Current Affairs & CSAT Sprint Module',
    titleTe: 'సివిల్ సర్వీసెస్ ప్రిలిమ్స్ — రోజువారీ కరెంట్ అఫైర్స్ & CSAT మాడ్యూల్',
    summaryEn:
      'Focus week covering Constitutional Schedules, Monetary Policy Committee decisions, and Biodiversity Act amendments.',
    summaryTe:
      'రాజ్యాంగ షెడ్యూళ్లు, ద్రవ్య విధాన కమిటీ నిర్ణయాలు మరియు జీవవైవిధ్య చట్ట సవరణలపై ప్రత్యేక సన్నద్ధత.',
    deadlineDate: '2027-02-18',
    stageEn: 'Prelims Prep Window',
    stageTe: 'ప్రిలిమ్స్ సన్నద్ధత దశ',
    eligibleLevels: ['undergraduate', 'postgraduate', 'competitive_aspirant'],
  },
  {
    id: 'upd-appsc-group2',
    examBody: 'APPSC',
    track: 'APPSC_TSPSC',
    titleEn: 'APPSC Group-I & II — Andhra Pradesh Bifurcation, Economy & Welfare Schemes Digest',
    titleTe: 'APPSC గ్రూప్-I & II — ఆంధ్రప్రదేశ్ ఆర్థిక వ్యవస్థ, పునర్విభజన & సంక్షేమ పథకాల విశ్లేషణ',
    summaryEn:
      'Updated bilingual notes on AP industrial corridors, Polavaram hydrology, and state GSDP sectoral growth.',
    summaryTe:
      'పారిశ్రామిక కారిడార్లు, పోలవరం నీటిపారుదల మరియు రాష్ట్ర GSDP వృద్ధి రేటుపై తాజా ద్విభాషా నోట్స్.',
    deadlineDate: '2026-12-20',
    stageEn: 'Mains & Screening Focus',
    stageTe: 'మెయిన్స్ & స్క్రీనింగ్ విభాగం',
    eligibleLevels: ['undergraduate', 'postgraduate', 'competitive_aspirant'],
  },
  {
    id: 'upd-tspsc-group1',
    examBody: 'TSPSC',
    track: 'APPSC_TSPSC',
    titleEn: 'TSPSC Group Services — Telangana Socio-Economic Outlook & River Projects',
    titleTe: 'TSPSC గ్రూప్స్ — తెలంగాణ సామాజిక-ఆర్థిక దృక్పథం & నదీ ప్రాజెక్టులు',
    summaryEn:
      'Comprehensive coverage of Telangana IT exports, Mission Bhagiratha metrics, and Panchayat Raj governance.',
    summaryTe:
      'తెలంగాణ ఐటీ ఎగుమతులు, మిషన్ భగీరథ గణాంకాలు మరియు పంచాయతీరాజ్ పాలనపై సమగ్ర సమాచారం.',
    deadlineDate: '2026-12-28',
    stageEn: 'Active Revision Track',
    stageTe: 'రివిజన్ విభాగం',
    eligibleLevels: ['undergraduate', 'postgraduate', 'competitive_aspirant'],
  },
  {
    id: 'upd-ssc-ibps',
    examBody: 'SSC / IBPS',
    track: 'SSC_BANKING',
    titleEn: 'SSC CGL & IBPS PO — Banking Awareness, Repo Rates & Static GK Rapid Sheet',
    titleTe: 'SSC CGL & IBPS PO — బ్యాంకింగ్ అవగాహన, రెపో రేట్లు & స్టాటిక్ GK షీట్',
    summaryEn:
      'Daily 20-minute drills on RBI instruments, international summits, sports awards, and financial inclusion.',
    summaryTe:
      'RBI సాధనాలు, అంతర్జాతీయ సదస్సులు, క్రీడా పురస్కారాలు మరియు ఆర్థిక సమ్మిళితత్వంపై రోజువారీ సాధన.',
    deadlineDate: '2026-12-15',
    stageEn: 'Tier-I / Prelims Drill',
    stageTe: 'టైర్-I / ప్రిలిమ్స్ సాధన',
    eligibleLevels: ['intermediate', 'undergraduate', 'competitive_aspirant'],
  },
  {
    id: 'upd-foundation-olympiad',
    examBody: 'NCERT / Olympiad',
    track: 'FOUNDATION',
    titleEn: 'High School & Inter Scholars — Science, Space & Civic Constitution Quiz Track',
    titleTe: 'హై స్కూల్ & ఇంటర్ విద్యార్థులు — సైన్స్, అంతరిక్షం & రాజ్యాంగ క్విజ్ ట్రాక్',
    summaryEn:
      'Tailored conceptual foundation covering ISRO missions, fundamental duties, and environmental science.',
    summaryTe:
      'ఇస్రో ప్రయోగాలు, ప్రాథమిక విధులు మరియు పర్యావరణ విజ్ఞానంపై ప్రాథమిక అవగాహన.',
    deadlineDate: '2027-01-10',
    stageEn: 'Scholarship Foundation',
    stageTe: 'స్కాలర్‌షిప్ పునాది',
    eligibleLevels: ['high_school', 'intermediate'],
  },
];

export const MOCK_TESTS: MockTest[] = [
  {
    id: 'mock-upsc-polity-ca',
    track: 'UPSC',
    titleEn: 'UPSC Prelims GS — Polity, Economy & Current Affairs',
    titleTe: 'UPSC ప్రిలిమ్స్ GS — పాలిటీ, ఆర్థికం & కరెంట్ అఫైర్స్',
    subtitleEn: 'Concept-linked multi-statement questions with bilingual explanations.',
    subtitleTe: 'ద్విభాషా వివరణలతో కూడిన విశ్లేషణాత్మక ప్రశ్నలు.',
    durationMinutes: 10,
    questions: [
      {
        id: 'u1',
        subjectEn: 'Indian Economy',
        subjectTe: 'భారత ఆర్థిక వ్యవస్థ',
        questionEn:
          'How does a Sovereign Central Bank Digital Currency (e₹) fundamentally differ from UPI transactions?',
        questionTe:
          'సెంట్రల్ బ్యాంక్ డిజిటల్ కరెన్సీ (e₹) మరియు UPI లావాదేవీల మధ్య ప్రధాన వ్యత్యాసం ఏమిటి?',
        optionsEn: [
          'e₹ is a direct liability of the RBI, whereas UPI settles across commercial bank balances.',
          'UPI works without internet, whereas e₹ requires international SWIFT settlement.',
          'e₹ is issued by private fintech firms, whereas UPI is printed by the Finance Ministry.',
          'There is no legal distinction; both are commercial bank deposits.',
        ],
        optionsTe: [
          'e₹ అనేది నేరుగా RBI యొక్క బాధ్యత, కానీ UPI వాణిజ్య బ్యాంకుల ఖాతాల మధ్య నిధులను బదిలీ చేస్తుంది.',
          'UPI ఇంటర్నెట్ లేకుండా పనిచేస్తుంది, కానీ e₹కు అంతర్జాతీయ SWIFT అవసరం.',
          'e₹ను ప్రైవేట్ ఫిన్‌టెక్ సంస్థలు జారీ చేస్తాయి, UPIను ఆర్థిక శాఖ ముద్రిస్తుంది.',
          'రెండింటి మధ్య ఎటువంటి చట్టపరమైన తేడా లేదు.',
        ],
        correctIndex: 0,
        explanationEn:
          'e₹ (CBDC) is legal tender issued directly on the RBI balance sheet (M0 liability), whereas UPI is an instant payment rail moving commercial bank money.',
        explanationTe:
          'e₹ (CBDC) అనేది నేరుగా RBI బ్యాలెన్స్ షీట్‌పై జారీ అయ్యే లీగల్ టెండర్; UPI అనేది వాణిజ్య బ్యాంకుల మధ్య తక్షణ చెల్లింపు వ్యవస్థ.',
      },
      {
        id: 'u2',
        subjectEn: 'Science & Space',
        subjectTe: 'సైన్స్ & అంతరిక్షం',
        questionEn:
          'Why do satellite navigation constellations like NavIC rely on Rubidium or Cesium atomic clocks?',
        questionTe:
          'NavIC వంటి ఉపగ్రహ నావిగేషన్ వ్యవస్థలు రుబీడియం లేదా సీసియం అటామిక్ గడియారాలపై ఎందుకు ఆధారపడతాయి?',
        optionsEn: [
          'To measure orbital wind resistance in the stratosphere',
          'Because nanosecond-level timing precision is required to compute accurate distance via radio signals',
          'To generate solar photovoltaic power during eclipses',
          'To compress photographic images before transmission',
        ],
        optionsTe: [
          'స్ట్రాటోస్పియర్‌లో గాలి నిరోధకతను కొలవడానికి',
          'రేడియో సంకేతాల ద్వారా ఖచ్చితమైన దూరాన్ని లెక్కించడానికి నానోసెకండ్ స్థాయి సమయ ఖచ్చితత్వం అవసరం',
          'గ్రహణ సమయాల్లో సౌర విద్యుత్ ఉత్పత్తి చేయడానికి',
          'ప్రసారానికి ముందు చిత్రాలను కంప్రెస్ చేయడానికి',
        ],
        correctIndex: 1,
        explanationEn:
          'Light and radio waves travel ~30 cm per nanosecond; even tiny clock drift causes large positioning errors on Earth.',
        explanationTe:
          'రేడియో తరంగాలు నానోసెకండ్‌కు సుమారు 30 సెం.మీ ప్రయాణిస్తాయి కాబట్టి గడియారంలో చిన్న తేడా కూడా పెద్ద స్థాన లోపానికి కారణమవుతుంది.',
      },
      {
        id: 'u3',
        subjectEn: 'Polity & Governance',
        subjectTe: 'పాలిటీ & పాలన',
        questionEn:
          'Which Constitutional Schedule governs the division of legislative powers (Union, State, and Concurrent Lists)?',
        questionTe:
          'కేంద్ర, రాష్ట్ర మరియు ఉమ్మడి జాబితాల మధ్య శాసన అధికారాల విభజనను ఏ రాజ్యాంగ షెడ్యూల్ నిర్దేశిస్తుంది?',
        optionsEn: ['Fifth Schedule', 'Seventh Schedule', 'Ninth Schedule', 'Eleventh Schedule'],
        optionsTe: ['ఐదవ షెడ్యూల్', 'ఏడవ షెడ్యూల్', 'తొమ్మిదవ షెడ్యూల్', 'పదకొండవ షెడ్యూల్'],
        correctIndex: 1,
        explanationEn:
          'Article 246 read with the Seventh Schedule distributes legislative subjects across Union, State, and Concurrent Lists.',
        explanationTe:
          'అధికరణం 246 మరియు ఏడవ షెడ్యూల్ కేంద్ర, రాష్ట్ర, ఉమ్మడి జాబితాల మధ్య అధికారాలను విభజిస్తాయి.',
      },
      {
        id: 'u4',
        subjectEn: 'International Relations',
        subjectTe: 'అంతర్జాతీయ సంబంధాలు',
        questionEn:
          'What does "Urban Mining" refer to in modern critical-minerals and clean-tech policy?',
        questionTe:
          'ఆధునిక క్లీన్-టెక్ విధానంలో "అర్బన్ మైనింగ్" (Urban Mining) అనగానేమి?',
        optionsEn: [
          'Drilling beneath metro railway tunnels for coal',
          'Recovering rare-earth metals, cobalt, and silicon from discarded electronic waste',
          'Constructing underground data centers in smart cities',
          'Taxing municipal construction sand quarries',
        ],
        optionsTe: [
          'మెట్రో రైలు సొరంగాల కింద బొగ్గు తవ్వకం',
          'పాత ఎలక్ట్రానిక్ వ్యర్థాల నుండి కోబాల్ట్, సిలికాన్, అరుదైన లోహాలను తిరిగి పొందడం',
          'స్మార్ట్ సిటీలలో భూగర్భ డేటా సెంటర్ల నిర్మాణం',
          'నగర ఇసుక క్వారీలపై పన్ను విధించడం',
        ],
        correctIndex: 1,
        explanationEn:
          'Urban mining extracts valuable critical minerals (cobalt, lithium, neodymium, gold) from e-waste and end-of-life hardware.',
        explanationTe:
          'ఇ-వ్యర్థాలు మరియు ఉపయోగించిన ఎలక్ట్రానిక్ పరికరాల నుండి విలువైన లోహాలను తిరిగి వెలికితీయడాన్ని అర్బన్ మైనింగ్ అంటారు.',
      },
      {
        id: 'u5',
        subjectEn: 'Environment & Ecology',
        subjectTe: 'పర్యావరణం & జీవావరణం',
        questionEn:
          'What dual ecological benefit do canal-top solar photovoltaic installations provide compared to ground-mounted parks?',
        questionTe:
          'భూమిపై ఏర్పాటు చేసే సోలార్ పార్కులతో పోలిస్తే కాలువలపై ఏర్పాటు చేసే సోలార్ ప్యానెళ్ల ద్వంద్వ ప్రయోజనం ఏమిటి?',
        optionsEn: [
          'Zero land acquisition and reduced surface water evaporation from canals',
          'Increased monsoon rainfall and higher canal salinity',
          'Elimination of all grid transmission transformers',
          'Automatic desalination of brackish groundwater',
        ],
        optionsTe: [
          'వ్యవసాయ భూమి సేకరణ అవసరం లేకపోవడం మరియు కాలువ నీటి ఆవిరి నష్టం తగ్గడం',
          'రుతుపవన వర్షపాతం పెరగడం మరియు నీటి లవణీయత పెరగడం',
          'విద్యుత్ ట్రాన్స్‌ఫార్మర్ల అవసరం పూర్తిగా లేకపోవడం',
          'ఉప్పు నీటిని స్వయంచాలకంగా మంచినీరుగా మార్చడం',
        ],
        correctIndex: 0,
        explanationEn:
          'Canal-top solar arrays conserve fertile land and shade water surfaces, curbing evaporation while cooling panels slightly to boost efficiency.',
        explanationTe:
          'కాలువలపై సోలార్ ప్యానెళ్లు భూమిని ఆదా చేయడంతో పాటు నీటిపై నీడనిచ్చి ఆవిరి నష్టాన్ని గణనీయంగా తగ్గిస్తాయి.',
      },
      {
        id: 'u6',
        subjectEn: 'Constitutional Remedies',
        subjectTe: 'రాజ్యాంగ పరిహార హక్కు',
        questionEn:
          'Which writ is issued by the Supreme Court or High Court to compel a public official to perform an official statutory duty they failed or refused to execute?',
        questionTe:
          'ప్రభుత్వ అధికారి తన చట్టబద్ధమైన విధిని నిర్వహించనప్పుడు దానిని నిర్వర్తించమని సుప్రీంకోర్టు లేదా హైకోర్టు జారీ చేసే రిట్ ఏది?',
        optionsEn: ['Habeas Corpus', 'Mandamus', 'Quo Warranto', 'Certiorari'],
        optionsTe: ['హెబియస్ కార్పస్', 'మాండమస్ (Mandamus)', 'కోవారంటో', 'సెర్షియోరరీ'],
        correctIndex: 1,
        explanationEn:
          'Mandamus ("we command") directs a public official, government body, or lower court to perform a mandatory public duty.',
        explanationTe:
          'మాండమస్ అంటే "మేము ఆదేశిస్తున్నాము". ప్రభుత్వ అధికారి లేదా సంస్థ తన విధిని సక్రమంగా నిర్వహించాలని న్యాయస్థానం దీని ద్వారా ఆదేశిస్తుంది.',
      },
      {
        id: 'u7',
        subjectEn: 'Monetary Governance',
        subjectTe: 'ద్రవ్య పాలన',
        questionEn:
          'How many total members constitute India’s Monetary Policy Committee (MPC), which sets the policy Repo Rate under the RBI Act?',
        questionTe:
          'RBI చట్టం ప్రకారం పాలసీ రెపో రేటును నిర్ణయించే భారత ద్రవ్య విధాన కమిటీ (MPC)లో మొత్తం ఎంత మంది సభ్యులు ఉంటారు?',
        optionsEn: [
          '4 members (all from RBI)',
          '6 members (3 from RBI and 3 appointed by the Central Government)',
          '9 members (Finance Ministers of states)',
          '12 members chaired by the Prime Minister',
        ],
        optionsTe: [
          '4 గురు సభ్యులు (అందరూ RBI నుండే)',
          '6 గురు సభ్యులు (3 RBI నుండి, 3 కేంద్ర ప్రభుత్వ నామినేటెడ్ సభ్యులు)',
          '9 మంది సభ్యులు (రాష్ట్రాల ఆర్థిక మంత్రులు)',
          '12 మంది సభ్యులు (ప్రధానమంత్రి అధ్యక్షతన)',
        ],
        correctIndex: 1,
        explanationEn:
          'Under Section 45ZB of the RBI Act, 1934 (amended in 2016), the 6-member MPC comprises 3 RBI officials (including the Governor with a casting vote) and 3 external members.',
        explanationTe:
          'RBI చట్టం సెక్షన్ 45ZB ప్రకారం MPCలో 6 గురు సభ్యులు (3 RBI అధికారులు, 3 కేంద్ర ప్రభుత్వం నియమించిన ఆర్థిక నిపుణులు) ఉంటారు.',
      },
    ],
  },
  {
    id: 'mock-upsc-science-env',
    track: 'UPSC',
    titleEn: 'UPSC Prelims — Science, Ecology & International Diplomacy',
    titleTe: 'UPSC ప్రిలిమ్స్ — సైన్స్, పర్యావరణం & అంతర్జాతీయ సంబంధాలు',
    subtitleEn: 'Ramsar wetlands, IPEF pillars, green hydrogen, and space telemetry MCQs.',
    subtitleTe: 'రామ్‌సార్ చిత్తడి నేలలు, IPEF, గ్రీన్ హైడ్రోజన్ & అంతరిక్ష టెలిమెట్రీ ప్రశ్నలు.',
    durationMinutes: 12,
    questions: [
      {
        id: 'us1',
        subjectEn: 'Environment & Ramsar Sites',
        subjectTe: 'పర్యావరణం & రామ్‌సార్ సైట్లు',
        questionEn:
          'Which freshwater lake located between the Krishna and Godavari river deltas in Andhra Pradesh is a designated Ramsar Wetland of International Importance?',
        questionTe:
          'ఆంధ్రప్రదేశ్‌లో కృష్ణా మరియు గోదావరి డెల్టాల మధ్య ఉన్న ఏ మంచినీటి సరస్సు రామ్‌సార్ అంతర్జాతీయ చిత్తడి నేలగా గుర్తించబడింది?',
        optionsEn: ['Pulicat Lake', 'Kolleru Lake', 'Chilika Lake', 'Sambhar Lake'],
        optionsTe: ['పులికాట్ సరస్సు', 'కొల్లేరు సరస్సు', 'చిలికా సరస్సు', 'సాంబార్ సరస్సు'],
        correctIndex: 1,
        explanationEn:
          'Kolleru Lake, spanning Krishna and Eluru districts between the Krishna and Godavari deltas, was designated a Ramsar site in 2002.',
        explanationTe:
          'కృష్ణా, గోదావరి డెల్టాల మధ్య ఉన్న కొల్లేరు సరస్సు 2002లో రామ్‌సార్ అంతర్జాతీయ చిత్తడి నేలగా గుర్తింపు పొందింది.',
      },
      {
        id: 'us2',
        subjectEn: 'International Diplomacy',
        subjectTe: 'అంతర్జాతీయ దౌత్యం',
        questionEn:
          'In the Indo-Pacific Economic Framework (IPEF), India actively joined Pillars II, III, and IV. Which area do these pillars cover?',
        questionTe:
          'ఇండో-పసిఫిక్ ఆర్థిక ఫ్రేమ్‌వర్క్ (IPEF)లో భారత్ II, III, IV స్తంభాలలో చేరింది. ఇవి వేటికి సంబంధించినవి?',
        optionsEn: [
          'Nuclear disarmament and border patrol treaties',
          'Supply Chains, Clean Economy, and Fair Economy (Tax & Anti-Corruption)',
          'Exclusive tariff-free agricultural imports',
          'Common Asian single currency union',
        ],
        optionsTe: [
          'అణు నిరాయుధీకరణ ఒప్పందాలు',
          'సరఫరా గొలుసులు, స్వచ్ఛ ఆర్థిక వ్యవస్థ మరియు న్యాయమైన ఆర్థిక వ్యవస్థ (పన్ను పారదర్శకత)',
          'సుంకాలు లేని వ్యవసాయ దిగుమతులు',
          'ఆసియా ఉమ్మడి కరెన్సీ యూనియన్',
        ],
        correctIndex: 1,
        explanationEn:
          'India participates in Pillar II (Supply Chains), Pillar III (Clean Economy), and Pillar IV (Fair Economy), while retaining observer status in Pillar I (Trade).',
        explanationTe:
          'భారత్ IPEFలోని సరఫరా గొలుసులు (II), క్లీన్ ఎకానమీ (III), ఫెయిర్ ఎకానమీ (IV) విభాగాలలో భాగస్వామిగా ఉంది.',
      },
      {
        id: 'us3',
        subjectEn: 'Clean Energy Technology',
        subjectTe: 'స్వచ్ఛ ఇంధన సాంకేతికత',
        questionEn:
          'What distinguishes "Green Hydrogen" from Grey or Blue Hydrogen in national energy transition policies?',
        questionTe:
          'జాతీయ ఇంధన మార్పు విధానాలలో "గ్రీన్ హైడ్రోజన్"ను గ్రే లేదా బ్లూ హైడ్రోజన్ నుండి వేరు చేసే అంశం ఏమిటి?',
        optionsEn: [
          'It is produced by electrolyzing water using renewable solar or wind electricity with near-zero emissions',
          'It is extracted directly from coal seams without water',
          'It is colored green using organic plant dyes for pipeline safety',
          'It is generated solely inside nuclear fusion reactors',
        ],
        optionsTe: [
          'సౌర లేదా పవన పునరుత్పాదక విద్యుత్‌తో నీటిని విద్యుద్విశ్లేషణ (Electrolysis) చేసి కర్బన ఉద్గారాలు లేకుండా ఉత్పత్తి చేస్తారు',
          'నీరు లేకుండా బొగ్గు గనుల నుండి నేరుగా తీస్తారు',
          'పైప్‌లైన్ భద్రత కోసం ఆకుపచ్చ రంగు కలుపుతారు',
          'కేవలం అణు సంలీన రియాక్టర్లలో మాత్రమే తయారు చేస్తారు',
        ],
        correctIndex: 0,
        explanationEn:
          'Green Hydrogen splits water (H2O) via electrolysis powered by renewable energy, supporting India’s National Green Hydrogen Mission.',
        explanationTe:
          'పునరుత్పాదక ఇంధనంతో నీటిని విద్యుద్విశ్లేషణ చేయడం ద్వారా కర్బన ఉద్గారాలు లేకుండా గ్రీన్ హైడ్రోజన్ ఉత్పత్తి అవుతుంది.',
      },
      {
        id: 'us4',
        subjectEn: 'Climate & Monsoon Science',
        subjectTe: 'వాతావరణం & రుతుపవన శాస్త్రం',
        questionEn:
          'What typically happens to the Indian Southwest Monsoon when a strong "Positive Indian Ocean Dipole (IOD)" occurs?',
        questionTe:
          'బలమైన "పాజిటివ్ ఇండియన్ ఓషన్ డైపోల్ (IOD)" ఏర్పడినప్పుడు భారత నైరుతి రుతుపవనాలపై సాధారణంగా ఎటువంటి ప్రభావం ఉంటుంది?',
        optionsEn: [
          'Warmer western Indian Ocean enhances moisture transport and supports stronger monsoon rainfall over India',
          'It permanently freezes Himalayan glaciers in July',
          'It blocks all trade winds across the Arabian Sea',
          'It turns coastal Andhra Pradesh into a polar desert',
        ],
        optionsTe: [
          'పశ్చిమ హిందూ మహాసముద్రం వెచ్చగా మారి తేమ రవాణాను పెంచి భారతదేశంలో మంచి రుతుపవన వర్షాలకు దోహదం చేస్తుంది',
          'జూలైలో హిమాలయ హిమానీనదాలు గడ్డకడతాయి',
          'అరేబియా సముద్రంలో గాలులను పూర్తిగా ఆపుతుంది',
          'తీరాంధ్ర ప్రాంతాన్ని ఎడారిగా మారుస్తుంది',
        ],
        correctIndex: 0,
        explanationEn:
          'During a positive IOD, sea surface temperatures are warmer in the western Indian Ocean than the east, often offsetting El Niño drying over India.',
        explanationTe:
          'పాజిటివ్ IOD సమయంలో పశ్చిమ హిందూ మహాసముద్రం వెచ్చగా ఉండటంతో భారత్‌లో రుతుపవన వర్షపాతం బలపడుతుంది.',
      },
      {
        id: 'us5',
        subjectEn: 'Digital Public Infrastructure',
        subjectTe: 'డిజిటల్ పబ్లిక్ ఇన్‌ఫ్రాస్ట్రక్చర్',
        questionEn:
          'Which open-protocol framework enables verifiable digital issuance and storage of academic certificates and driving licenses in India?',
        questionTe:
          'భారతదేశంలో విద్యా ధృవపత్రాలు మరియు డ్రైవింగ్ లైసెన్సులను డిజిటల్‌గా జారీ చేసి నిల్వ చేయడానికి ఉపయోగించే ఓపెన్ ప్లాట్‌ఫారమ్ ఏది?',
        optionsEn: ['DigiLocker', 'SWIFTNet', 'FASTag Toll', 'SARFAESI'],
        optionsTe: ['డిజీలాకర్ (DigiLocker)', 'స్విఫ్ట్‌నెట్', 'ఫాస్టాగ్', 'సర్ఫేసీ'],
        correctIndex: 0,
        explanationEn:
          'DigiLocker is a flagship Digital Public Infrastructure (DPI) pillar issuing legally valid electronic documents directly from verified issuers.',
        explanationTe:
          'డిజీలాకర్ అనేది భారత డిజిటల్ పబ్లిక్ ఇన్‌ఫ్రాస్ట్రక్చర్ (DPI)లో కీలక భాగం; దీనిలోని పత్రాలకు చట్టబద్ధత ఉంటుంది.',
      },
      {
        id: 'us6',
        subjectEn: 'Biotech & Health Policy',
        subjectTe: 'బయోటెక్ & ఆరోగ్య విధానం',
        questionEn:
          'What is the core objective of the One Health approach endorsed globally by WHO, FAO, and India’s NITI Aayog?',
        questionTe:
          'WHO, FAO మరియు నీతి ఆయోగ్ ఆమోదించిన "వన్ హెల్త్" (One Health) విధానం యొక్క ప్రధాన లక్ష్యం ఏమిటి?',
        optionsEn: [
          'Integrating human, animal, and environmental ecosystem health to prevent zoonotic pandemics and antimicrobial resistance',
          'Replacing all district hospitals with private insurance offices',
          'Banning agricultural crop rotation',
          'Limiting vaccination solely to urban capital cities',
        ],
        optionsTe: [
          'జంతువుల నుండి వచ్చే వ్యాధులు మరియు యాంటీమైక్రోబయల్ నిరోధకతను అరికట్టేందుకు మానవ, జంతు, పర్యావరణ ఆరోగ్యాన్ని సమన్వయం చేయడం',
          'జిల్లా ఆసుపత్రులను ప్రైవేట్ బీమా కార్యాలయాలుగా మార్చడం',
          'పంట మార్పిడిని నిషేధించడం',
          'టీకాలను కేవలం రాజధాని నగరాలకే పరిమితం చేయడం',
        ],
        correctIndex: 0,
        explanationEn:
          'One Health recognizes that human health, livestock/wildlife health, and environmental balance are deeply interconnected.',
        explanationTe:
          'మానవ ఆరోగ్యం, పశు/వన్యప్రాణుల ఆరోగ్యం మరియు పర్యావరణ సమతుల్యత పరస్పరం ముడిపడి ఉన్నాయనేది వన్ హెల్త్ సిద్ధాంతం.',
      },
    ],
  },
  {
    id: 'mock-appsc-tspsc-regional',
    track: 'APPSC_TSPSC',
    titleEn: 'APPSC & TSPSC — Regional Geography, Economy & Governance',
    titleTe: 'APPSC & TSPSC — ప్రాంతీయ భూగోళశాస్త్రం, ఆర్థికం & పాలన',
    subtitleEn: 'Focused on Krishna–Godavari basins, regional corridors, and state finances.',
    subtitleTe: 'కృష్ణా-గోదావరి బేసిన్లు, ప్రాంతీయ కారిడార్లు మరియు రాష్ట్ర ఆర్థిక అంశాలు.',
    durationMinutes: 14,
    questions: [
      {
        id: 'r1',
        subjectEn: 'Regional Geography',
        subjectTe: 'ప్రాంతీయ భూగోళశాస్త్రం',
        questionEn:
          'Which major river basin forms the shared agricultural lifeline across Nalgonda, Suryapet, Guntur, and Krishna districts?',
        questionTe:
          'నల్గొండ, సూర్యాపేట, గుంటూరు మరియు కృష్ణా జిల్లాలకు ప్రధాన వ్యవసాయ ఆధారమైన నదీ పరీవాహక ప్రాంతం ఏది?',
        optionsEn: ['Pennar Basin', 'Krishna Basin', 'Vamsadhara Basin', 'Cauvery Basin'],
        optionsTe: ['పెన్నా బేసిన్', 'కృష్ణా బేసిన్', 'వంశధార బేసిన్', 'కావేరి బేసిన్'],
        correctIndex: 1,
        explanationEn:
          'The Krishna River and its Nagarjuna Sagar / Prakasam Barrage canal networks irrigate these Telangana and Andhra Pradesh districts.',
        explanationTe:
          'కృష్ణా నది మరియు దాని నాగార్జునసాగర్, ప్రకాశం బ్యారేజీ కాలువలు ఈ జిల్లాలకు సాగునీటిని అందిస్తాయి.',
      },
      {
        id: 'r2',
        subjectEn: 'Constitutional Polity',
        subjectTe: 'రాజ్యాంగ పాలిటీ',
        questionEn:
          'Under which Article of the Indian Constitution can Parliament form new states or alter existing state boundaries?',
        questionTe:
          'భారత రాజ్యాంగంలోని ఏ అధికరణం ప్రకారం పార్లమెంటు కొత్త రాష్ట్రాలను ఏర్పాటు చేయవచ్చు లేదా సరిహద్దులను మార్చవచ్చు?',
        optionsEn: ['Article 1', 'Article 3', 'Article 14', 'Article 356'],
        optionsTe: ['అధికరణం 1', 'అధికరణం 3', 'అధికరణం 14', 'అధికరణం 356'],
        correctIndex: 1,
        explanationEn:
          'Article 3 empowers Parliament to form a new state, increase/diminish area, or alter boundaries/names of states.',
        explanationTe:
          'అధికరణం 3 పార్లమెంటుకు కొత్త రాష్ట్రాల ఏర్పాటు, సరిహద్దులు మరియు పేర్లను మార్చే అధికారాన్ని కల్పిస్తుంది.',
      },
      {
        id: 'r3',
        subjectEn: 'State Economy',
        subjectTe: 'రాష్ట్ర ఆర్థిక వ్యవస్థ',
        questionEn:
          'What does GSDP stand for when measuring the economic output of Andhra Pradesh or Telangana?',
        questionTe:
          'ఆంధ్రప్రదేశ్ లేదా తెలంగాణ ఆర్థిక ఉత్పత్తిని కొలిచేటప్పుడు GSDP అంటే ఏమిటి?',
        optionsEn: [
          'Gross State Domestic Product',
          'General Sovereign Debt Percentage',
          'Global Service Distribution Plan',
          'Gross Sectoral Deficit Projection',
        ],
        optionsTe: [
          'స్థూల రాష్ట్ర దేశీయోత్పత్తి (Gross State Domestic Product)',
          'సాధారణ సార్వభౌమ రుణ శాతం',
          'గ్లోబల్ సర్వీస్ డిస్ట్రిబ్యూషన్ ప్లాన్',
          'స్థూల రంగాల లోటు అంచనా',
        ],
        correctIndex: 0,
        explanationEn:
          'GSDP measures the total monetary value of all final goods and services produced within a state during a fiscal year.',
        explanationTe:
          'ఒక ఆర్థిక సంవత్సరంలో రాష్ట్ర పరిధిలో ఉత్పత్తి అయిన తుది వస్తువులు, సేవల మొత్తం విలువను GSDP అంటారు.',
      },
      {
        id: 'r4',
        subjectEn: 'Local Governance',
        subjectTe: 'స్థానిక స్వపరిపాలన',
        questionEn:
          'Which Constitutional Amendment granted constitutional status to Panchayati Raj Institutions across Indian states?',
        questionTe:
          'భారతదేశంలో పంచాయతీరాజ్ సంస్థలకు రాజ్యాంగ హోదా కల్పించిన రాజ్యాంగ సవరణ ఏది?',
        optionsEn: [
          '42nd Amendment Act',
          '73rd Amendment Act',
          '86th Amendment Act',
          '101st Amendment Act',
        ],
        optionsTe: [
          '42వ సవరణ చట్టం',
          '73వ సవరణ చట్టం',
          '86వ సవరణ చట్టం',
          '101వ సవరణ చట్టం',
        ],
        correctIndex: 1,
        explanationEn:
          'The 73rd Constitutional Amendment Act (1992) added Part IX and the 11th Schedule covering 29 functional items for Panchayats.',
        explanationTe:
          '1992 నాటి 73వ రాజ్యాంగ సవరణ చట్టం భాగ IX మరియు 11వ షెడ్యూల్‌ను చేర్చి పంచాయతీలకు రాజ్యాంగ హోదా కల్పించింది.',
      },
      {
        id: 'r5',
        subjectEn: 'Regional Hydrology',
        subjectTe: 'ప్రాంతీయ జల వనరులు',
        questionEn:
          'At which confluence does the Pranahita tributary join the Godavari River in Telangana?',
        questionTe:
          'తెలంగాణలో ప్రాణహిత ఉపనది ఏ ప్రదేశం వద్ద గోదావరి నదిలో కలుస్తుంది?',
        optionsEn: ['Kaleshwaram', 'Nagarjuna Sagar', 'Srisailam', 'Bhadrachalam'],
        optionsTe: ['కాళేశ్వరం', 'నాగార్జునసాగర్', 'శ్రీశైలం', 'భద్రాచలం'],
        correctIndex: 0,
        explanationEn:
          'The Pranahita (formed by Wardha, Wainganga, and Penganga) merges with the Godavari at Kaleshwaram in Jayashankar Bhupalpally district.',
        explanationTe:
          'జయశంకర్ భూపాలపల్లి జిల్లా కాళేశ్వరం వద్ద ప్రాణహిత నది గోదావరిలో కలుస్తుంది.',
      },
      {
        id: 'r6',
        subjectEn: 'Coastal & Port Geography',
        subjectTe: 'తీరప్రాంత & ఓడరేవుల భూగోళశాస్త్రం',
        questionEn:
          'Which city in Andhra Pradesh hosts India’s deepest landlocked major seaport and the Eastern Naval Command headquarters?',
        questionTe:
          'భారతదేశంలోని అత్యంత లోతైన భూపరివేష్టిత ప్రధాన ఓడరేవు మరియు తూర్పు నావికాదళ కమాండ్ ప్రధాన కార్యాలయం ఆంధ్రప్రదేశ్‌లోని ఏ నగరంలో ఉన్నాయి?',
        optionsEn: ['Kakinada', 'Visakhapatnam', 'Machilipatnam', 'Krishnapatnam'],
        optionsTe: ['కాకినాడ', 'విశాఖపట్నం', 'మచిలీపట్నం', 'కృష్ణపట్నం'],
        correctIndex: 1,
        explanationEn:
          'Visakhapatnam Port, sheltered by Dolphin’s Nose hill, is a major deepwater port and the headquarters of the Indian Navy’s Eastern Naval Command.',
        explanationTe:
          'డాల్ఫిన్ నోస్ కొండ రక్షణ కలిగిన విశాఖపట్నం ఓడరేవు దేశంలోని లోతైన ప్రధాన రేవు మరియు తూర్పు నావికాదళ కమాండ్ కేంద్రం.',
      },
      {
        id: 'r7',
        subjectEn: 'Fiscal Federalism',
        subjectTe: 'ఆర్థిక సమాఖ్య విధానం',
        questionEn:
          'Which constitutional body recommends the vertical and horizontal distribution of net tax proceeds between the Union and State Governments?',
        questionTe:
          'కేంద్రం మరియు రాష్ట్ర ప్రభుత్వాల మధ్య పన్నుల పంపిణీని సిఫార్సు చేసే రాజ్యాంగబద్ధమైన సంస్థ ఏది?',
        optionsEn: [
          'Election Commission (Article 324)',
          'Finance Commission (Article 280)',
          'Union Public Service Commission (Article 315)',
          'Delimitation Commission (Article 82)',
        ],
        optionsTe: [
          'ఎన్నికల సంఘం (అధికరణం 324)',
          'ఆర్థిక సంఘం (అధికరణం 280)',
          'యూనియన్ పబ్లిక్ సర్వీస్ కమిషన్ (అధికరణం 315)',
          'డీలిమిటేషన్ కమిషన్ (అధికరణం 82)',
        ],
        correctIndex: 1,
        explanationEn:
          'Constituted every five years under Article 280, the Finance Commission determines tax devolution ratios (e.g., 41% under the 15th FC) and grants-in-aid.',
        explanationTe:
          'అధికరణం 280 ప్రకారం ప్రతి ఐదేళ్లకు ఏర్పాటయ్యే ఆర్థిక సంఘం కేంద్ర-రాష్ట్ర పన్నుల వాటాను సిఫార్సు చేస్తుంది.',
      },
    ],
  },
  {
    id: 'mock-appsc-tspsc-history-culture',
    track: 'APPSC_TSPSC',
    titleEn: 'APPSC & TSPSC — Telugu Heritage, History & State Policy',
    titleTe: 'APPSC & TSPSC — తెలుగు వారసత్వం, చరిత్ర & రాష్ట్ర విధానాలు',
    subtitleEn: 'Satavahanas, Kakatiya architecture, Vijayanagara literature, and AP/TS socio-economic milestones.',
    subtitleTe: 'శాతవాహనులు, కాకతీయ నిర్మాణ కళ, విజయనగర సాహిత్యం & ప్రాంతీయ చరిత్ర.',
    durationMinutes: 12,
    questions: [
      {
        id: 'rh1',
        subjectEn: 'Ancient Deccan History',
        subjectTe: 'ప్రాచీన దక్కన్ చరిత్ర',
        questionEn:
          'Which renowned Buddhist site on the banks of the Krishna River served as an early eastern capital of the Satavahana dynasty?',
        questionTe:
          'కృష్ణా నది ఒడ్డున ఉండి శాతవాహన వంశపు తూర్పు రాజధానిగా మరియు ప్రసిద్ధ బౌద్ధ కేంద్రంగా విరాజిల్లిన ప్రాంతం ఏది?',
        optionsEn: ['Dhanyakataka (Amaravati)', 'Lepakshi', 'Warangal', 'Alampur'],
        optionsTe: ['ధాన్యకటకం (అమరావతి)', 'లేపాక్షి', 'వరంగల్', 'ఆలంపూర్'],
        correctIndex: 0,
        explanationEn:
          'Dhanyakataka (modern Amaravati in Guntur/Palnadu region) was a major Satavahana political center and home to the Mahachaitya Buddhist Stupa.',
        explanationTe:
          'ధాన్యకటకం (నేటి అమరావతి) శాతవాహనుల ముఖ్య రాజధాని మరియు ప్రసిద్ధ మహాచైత్య బౌద్ధ స్థూపానికి నిలయం.',
      },
      {
        id: 'rh2',
        subjectEn: 'UNESCO World Heritage',
        subjectTe: 'యునెస్కో ప్రపంచ వారసత్వం',
        questionEn:
          'The 13th-century Kakatiya Rudreshwara (Ramappa) Temple in Mulugu district is famous for what unique engineering innovation?',
        questionTe:
          'ములుగు జిల్లాలోని 13వ శతాబ్దపు కాకతీయ రుద్రేశ్వర (రామప్ప) ఆలయం ఏ విలక్షణ ఇంజనీరింగ్ ప్రత్యేకతకు ప్రసిద్ధి చెందింది?',
        optionsEn: [
          'Sandbox foundation and lightweight porous floating bricks for the roof vimana',
          'Cast-iron suspension cables imported from Europe',
          'Reinforced Portland cement arches',
          'Wind-turbine ventilation towers',
        ],
        optionsTe: [
          'శాండ్‌బాక్స్ (ఇసుక) పునాది మరియు పైకప్పు విమాన నిర్మాణంలో నీటిపై తేలియాడే తేలికపాటి ఇటుకలు',
          'ఐరోపా నుండి దిగుమతి చేసిన ఇనుప తీగలు',
          'పోర్ట్‌ల్యాండ్ సిమెంట్ ఆర్చ్‌లు',
          'గాలి మరల వెంటిలేషన్ టవర్లు',
        ],
        correctIndex: 0,
        explanationEn:
          'Inscribed as a UNESCO World Heritage Site in 2021, Ramappa Temple uses seismic-cushioning sandbox foundations and floating bricks.',
        explanationTe:
          '2021లో యునెస్కో గుర్తింపు పొందిన రామప్ప ఆలయం భూకంప నిరోధక శాండ్‌బాక్స్ పునాది, నీటిపై తేలే ఇటుకలతో నిర్మించబడింది.',
      },
      {
        id: 'rh3',
        subjectEn: 'Telugu Literary Heritage',
        subjectTe: 'తెలుగు సాహిత్య వారసత్వం',
        questionEn:
          'Who authored the classical Telugu epic poem "Amuktamalyada", which also outlines principles of statecraft and administration?',
        questionTe:
          'రాజనీతి మరియు పరిపాలనా సూత్రాలను కూడా వివరించే ప్రసిద్ధ తెలుగు కావ్యం "ఆముక్తమాల్యద" రచయిత ఎవరు?',
        optionsEn: [
          'Nannayya Bhattaraka',
          'Sri Krishnadevaraya',
          'Pothana',
          'Allasani Peddana',
        ],
        optionsTe: ['నన్నయ భట్టారకుడు', 'శ్రీ కృష్ణదేవరాయలు', 'పోతన', 'అల్లసాని పెద్దన'],
        correctIndex: 1,
        explanationEn:
          'Emperor Sri Krishnadevaraya of the Vijayanagara Empire (Tuluva dynasty) composed Amuktamalyada in classical Telugu.',
        explanationTe:
          'విజయనగర చక్రవర్తి శ్రీ కృష్ణదేవరాయలు తెలుగులో "ఆముక్తమాల్యద" కావ్యాన్ని రచించారు.',
      },
      {
        id: 'rh4',
        subjectEn: 'State Water Heritage',
        subjectTe: 'రాష్ట్ర జల వారసత్వం',
        questionEn:
          'Which medieval Telugu dynasty pioneered interconnected "Chain-of-Tanks" (Golusu Kattu Cheruvulu) across Telangana for drought resilience?',
        questionTe:
          'కరువు నివారణ కోసం తెలంగాణలో ఒకదానికొకటి అనుసంధానించబడిన "గొలుసుకట్టు చెరువుల" వ్యవస్థను నిర్మించిన రాజవంశం ఏది?',
        optionsEn: ['Cholas', 'Kakatiyas', 'Mauryas', 'Guptas'],
        optionsTe: ['చోళులు', 'కాకతీయులు', 'మౌర్యులు', 'గుప్తులు'],
        correctIndex: 1,
        explanationEn:
          'The Kakatiya rulers built thousands of cascading chain tanks such as Ramappa, Pakhal, and Laknavaram to harvest monsoon runoff.',
        explanationTe:
          'కాకతీయ పాలకులు వర్షపు నీటిని నిల్వ చేసేందుకు రామప్ప, పాకాల, లక్నవరం వంటి గొలుసుకట్టు చెరువులను నిర్మించారు.',
      },
      {
        id: 'rh5',
        subjectEn: 'Modern Regional Economy',
        subjectTe: 'ఆధునిక ప్రాంతీయ ఆర్థికం',
        questionEn:
          'Which coastal economic corridor passes through Visakhapatnam, Kakinada, Vijayawada, and Nellore in Andhra Pradesh?',
        questionTe:
          'ఆంధ్రప్రదేశ్‌లోని విశాఖపట్నం, కాకినాడ, విజయవాడ మరియు నెల్లూరు మీదుగా వెళ్లే ప్రధాన పారిశ్రామిక కారిడార్ ఏది?',
        optionsEn: [
          'Visakhapatnam–Chennai Industrial Corridor (VCIC)',
          'Delhi–Mumbai Industrial Corridor (DMIC)',
          'Amritsar–Kolkata Industrial Corridor (AKIC)',
          'Kochi–Coimbatore Freight Loop',
        ],
        optionsTe: [
          'విశాఖపట్నం–చెన్నై పారిశ్రామిక కారిడార్ (VCIC)',
          'ఢిల్లీ–ముంబై పారిశ్రామిక కారిడార్',
          'అమృత్‌సర్–కోల్‌కతా కారిడార్',
          'కొచ్చి–కోయంబత్తూరు లూప్',
        ],
        correctIndex: 0,
        explanationEn:
          'VCIC (part of the East Coast Economic Corridor) links port hubs and industrial nodes across coastal Andhra Pradesh down to Chennai.',
        explanationTe:
          'తూర్పు తీర ఆర్థిక కారిడార్‌లో భాగమైన VCIC తీరాంధ్ర ఓడరేవులు, పారిశ్రామిక కేంద్రాలను చెన్నైతో అనుసంధానిస్తుంది.',
      },
      {
        id: 'rh6',
        subjectEn: 'Regional Science & Industry',
        subjectTe: 'ప్రాంతీయ సైన్స్ & పరిశ్రమలు',
        questionEn:
          'Which city in Telangana is globally recognized as India’s "Genome Valley" and Vaccine Manufacturing Capital?',
        questionTe:
          'భారతదేశపు "జీనోమ్ వ్యాలీ" మరియు టీకా ఉత్పత్తి రాజధానిగా ప్రపంచవ్యాప్తంగా గుర్తింపు పొందిన తెలంగాణ నగరం ఏది?',
        optionsEn: ['Hyderabad', 'Nizamabad', 'Khammam', 'Adilabad'],
        optionsTe: ['హైదరాబాద్', 'నిజామాబాద్', 'ఖమ్మం', 'ఆదిలాబాద్'],
        correctIndex: 0,
        explanationEn:
          'Hyderabad’s Genome Valley cluster hosts over 200 biotechnology, pharmaceutical, and global vaccine manufacturing facilities.',
        explanationTe:
          'హైదరాబాద్‌లోని జీనోమ్ వ్యాలీ ప్రపంచవ్యాప్తంగా టీకాలు మరియు బయోటెక్నాలజీ పరిశోధనలకు ప్రధాన కేంద్రంగా నిలిచింది.',
      },
    ],
  },
  {
    id: 'mock-ssc-banking-ga',
    track: 'SSC_BANKING',
    titleEn: 'SSC CGL & Banking — Monetary Policy & General Awareness',
    titleTe: 'SSC CGL & బ్యాంకింగ్ — ద్రవ్య విధానం & జనరల్ అవేర్‌నెస్',
    subtitleEn: 'High-speed objective test on RBI rates, CRR/SLR, regulators, and national affairs.',
    subtitleTe: 'RBI రేట్లు, CRR/SLR, నియంత్రణ సంస్థలు & జాతీయ అంశాలపై వేగవంతమైన పరీక్ష.',
    durationMinutes: 12,
    questions: [
      {
        id: 's1',
        subjectEn: 'Banking Awareness',
        subjectTe: 'బ్యాంకింగ్ అవగాహన',
        questionEn: 'What is the "Repo Rate" set by the Reserve Bank of India?',
        questionTe: 'భారతీయ రిజర్వ్ బ్యాంక్ (RBI) నిర్ణయించే "రెపో రేటు" అనగానేమి?',
        optionsEn: [
          'The rate at which commercial banks borrow short-term funds from the RBI against government securities',
          'The interest rate paid on savings accounts by post offices',
          'The foreign exchange tariff on imported gold',
          'The corporate income tax rate for public sector banks',
        ],
        optionsTe: [
          'ప్రభుత్వ సెక్యూరిటీలను తాకట్టు పెట్టి వాణిజ్య బ్యాంకులు RBI నుండి స్వల్పకాలిక రుణాలు పొందే వడ్డీ రేటు',
          'పోస్టాఫీసు పొదుపు ఖాతాలపై ఇచ్చే వడ్డీ రేటు',
          'బంగారం దిగుమతులపై విధించే విదేశీ మారకపు సుంకం',
          'ప్రభుత్వ రంగ బ్యాంకులపై విధించే కార్పొరేట్ పన్ను',
        ],
        correctIndex: 0,
        explanationEn:
          'Repo (Repurchase Option) Rate is the policy benchmark rate at which RBI lends short-term liquidity to banks.',
        explanationTe:
          'వాణిజ్య బ్యాంకులకు RBI స్వల్పకాలిక ద్రవ్యతను అందించే వడ్డీ రేటును రెపో రేటు అంటారు.',
      },
      {
        id: 's2',
        subjectEn: 'Digital Infrastructure',
        subjectTe: 'డిజిటల్ మౌలిక వసతులు',
        questionEn: 'Which organization operates the Unified Payments Interface (UPI) in India?',
        questionTe: 'భారతదేశంలో యూనిఫైడ్ పేమెంట్స్ ఇంటర్‌ఫేస్ (UPI)ను ఏ సంస్థ నిర్వహిస్తుంది?',
        optionsEn: ['SEBI', 'NPCI', 'SIDBI', 'IRDAI'],
        optionsTe: ['SEBI', 'NPCI', 'SIDBI', 'IRDAI'],
        correctIndex: 1,
        explanationEn:
          'National Payments Corporation of India (NPCI) operates UPI, RuPay, IMPS, and AePS.',
        explanationTe:
          'నేషనల్ పేమెంట్స్ కార్పొరేషన్ ఆఫ్ ఇండియా (NPCI) UPI, RuPay, IMPS వ్యవస్థలను నిర్వహిస్తుంది.',
      },
      {
        id: 's3',
        subjectEn: 'Current Affairs',
        subjectTe: 'కరెంట్ అఫైర్స్',
        questionEn:
          'Which spaceport in Andhra Pradesh serves as ISRO’s primary orbital launch complex?',
        questionTe:
          'ఆంధ్రప్రదేశ్‌లోని ఏ అంతరిక్ష కేంద్రం ఇస్రో ప్రధాన ఉపగ్రహ ప్రయోగ కేంద్రంగా పనిచేస్తుంది?',
        optionsEn: [
          'Satish Dhawan Space Centre, Sriharikota',
          'Vikram Sarabhai Space Centre, Thiruvananthapuram',
          'U R Rao Satellite Centre, Bengaluru',
          'Space Applications Centre, Ahmedabad',
        ],
        optionsTe: [
          'సతీష్ ధావన్ అంతరిక్ష కేంద్రం, శ్రీహరికోట',
          'విక్రమ్ సారాభాయ్ అంతరిక్ష కేంద్రం, తిరువనంతపురం',
          'యు.ఆర్.రావు శాటిలైట్ సెంటర్, బెంగళూరు',
          'స్పేస్ అప్లికేషన్స్ సెంటర్, అహ్మదాబాద్',
        ],
        correctIndex: 0,
        explanationEn:
          'Satish Dhawan Space Centre (SDSC-SHAR) in Tirupati district, Andhra Pradesh, conducts India’s orbital launches.',
        explanationTe:
          'ఆంధ్రప్రదేశ్‌లోని శ్రీహరికోటలో ఉన్న సతీష్ ధావన్ అంతరిక్ష కేంద్రం (SHAR) ఇస్రో ప్రధాన ప్రయోగ కేంద్రం.',
      },
      {
        id: 's4',
        subjectEn: 'Banking Ratios',
        subjectTe: 'బ్యాంకింగ్ నిష్పత్తులు',
        questionEn:
          'What is the key difference between Cash Reserve Ratio (CRR) and Statutory Liquidity Ratio (SLR)?',
        questionTe:
          'నగదు నిల్వల నిష్పత్తి (CRR) మరియు చట్టబద్ధ ద్రవ్యతా నిష్పత్తి (SLR) మధ్య ప్రధాన తేడా ఏమిటి?',
        optionsEn: [
          'CRR is held purely as cash reserves with the RBI; SLR is maintained by banks themselves in cash, gold, or approved securities',
          'SLR applies only to cooperative societies while CRR applies to airlines',
          'CRR earns 12% interest from RBI whereas SLR is taxed at 30%',
          'Both are deposited exclusively with the World Bank',
        ],
        optionsTe: [
          'CRRను బ్యాంకులు కేవలం నగదు రూపంలో RBI వద్ద ఉంచాలి; SLRను బ్యాంకులు స్వయంగా నగదు, బంగారం లేదా ప్రభుత్వ బాండ్ల రూపంలో ఉంచుతాయి',
          'SLR కేవలం సహకార సంఘాలకే వర్తిస్తుంది',
          'CRRపై RBI 12% వడ్డీ ఇస్తుంది',
          'రెండింటినీ ప్రపంచ బ్యాంకులో జమ చేస్తారు',
        ],
        correctIndex: 0,
        explanationEn:
          'CRR (Section 42 of RBI Act) requires cash deposits with RBI, whereas SLR (Section 24 of Banking Regulation Act) is held by banks in liquid assets.',
        explanationTe:
          'CRR నగదు రూపంలో RBI వద్ద ఉంచబడుతుంది; SLRను బ్యాంకులు తమ వద్దే ద్రవ్య ఆస్తుల రూపంలో నిర్వహిస్తాయి.',
      },
      {
        id: 's5',
        subjectEn: 'Financial Regulators',
        subjectTe: 'ఆర్థిక నియంత్రణ సంస్థలు',
        questionEn: 'Which statutory body regulates stock exchanges, mutual funds, and capital markets in India?',
        questionTe: 'భారతదేశంలో స్టాక్ ఎక్స్ఛేంజీలు, మ్యూచువల్ ఫండ్లు మరియు మూలధన మార్కెట్లను నియంత్రించే సంస్థ ఏది?',
        optionsEn: ['NABARD', 'SEBI', 'TRAI', 'FSSAI'],
        optionsTe: ['నాబార్డ్ (NABARD)', 'సెబీ (SEBI)', 'ట్రాయ్ (TRAI)', 'ఎఫ్‌ఎస్‌ఎస్‌ఏఐ (FSSAI)'],
        correctIndex: 1,
        explanationEn:
          'The Securities and Exchange Board of India (SEBI), headquartered in Mumbai, protects investors and regulates securities markets.',
        explanationTe:
          'ముంబై ప్రధాన కేంద్రంగా పనిచేసే సెబీ (SEBI) భారత స్టాక్ మార్కెట్లను మరియు పెట్టుబడిదారుల ప్రయోజనాలను నియంత్రిస్తుంది.',
      },
      {
        id: 's6',
        subjectEn: 'Constitutional GK',
        subjectTe: 'రాజ్యాంగ సాధారణ జ్ఞానం',
        questionEn:
          'Under which Article of the Constitution is the Comptroller and Auditor General (CAG) of India appointed as guardian of the public purse?',
        questionTe:
          'ప్రజా ధన పరిరక్షకుడిగా భారత కంప్ట్రోలర్ అండ్ ఆడిటర్ జనరల్ (CAG) ఏ రాజ్యాంగ అధికరణం ప్రకారం నియమించబడతారు?',
        optionsEn: ['Article 76', 'Article 148', 'Article 214', 'Article 324'],
        optionsTe: ['అధికరణం 76', 'అధికరణం 148', 'అధికరణం 214', 'అధికరణం 324'],
        correctIndex: 1,
        explanationEn:
          'Article 148 provides for an independent CAG of India to audit Union and State government expenditures and receipts.',
        explanationTe:
          'రాజ్యాంగంలోని అధికరణం 148 ప్రకారం కేంద్ర మరియు రాష్ట్ర ప్రభుత్వ ఖాతాలను ఆడిట్ చేసేందుకు CAG నియమించబడతారు.',
      },
    ],
  },
  {
    id: 'mock-ssc-banking-quant-reasoning',
    track: 'SSC_BANKING',
    titleEn: 'SSC & Banking — Quantitative Aptitude & Logical Reasoning',
    titleTe: 'SSC & బ్యాంకింగ్ — క్వాంటిటేటివ్ ఆప్టిట్యూడ్ & రీజనింగ్',
    subtitleEn: 'Timed speed-math and analytical reasoning drill for SSC CGL/CHSL and IBPS Prelims.',
    subtitleTe: 'SSC మరియు బ్యాంకింగ్ ప్రిలిమ్స్ కోసం వేగవంతమైన గణిత & తార్కిక పరీక్ష.',
    durationMinutes: 15,
    questions: [
      {
        id: 'sq1',
        subjectEn: 'Percentage Change',
        subjectTe: 'శాతాలు (Percentages)',
        questionEn:
          'A library study fee is first increased by 20% and later decreased by 20%. What is the net percentage change?',
        questionTe:
          'ఒక గ్రంథాలయ రుసుమును మొదట 20% పెంచి, ఆపై 20% తగ్గించారు. నికర శాతంలో మార్పు ఎంత?',
        optionsEn: ['No change (0%)', '4% decrease', '4% increase', '2% decrease'],
        optionsTe: ['మార్పు లేదు (0%)', '4% తగ్గుదల', '4% పెరుగుదల', '2% తగ్గుదల'],
        correctIndex: 1,
        explanationEn:
          'Using successive change formula a + b + (ab/100): +20 - 20 + (20 × -20)/100 = -4%, meaning a 4% net decrease.',
        explanationTe:
          'వరుస శాతం మార్పు సూత్రం (+20 - 20 - 400/100) ప్రకారం 4% నికర తగ్గుదల ఉంటుంది.',
      },
      {
        id: 'sq2',
        subjectEn: 'Compound Interest',
        subjectTe: 'చక్రవడ్డీ (Compound Interest)',
        questionEn:
          'What is the compound interest on ₹10,000 at 10% per annum for 2 years, compounded annually?',
        questionTe:
          '₹10,000 పై సంవత్సరానికి 10% వడ్డీ రేటుతో 2 సంవత్సరాలకు అయ్యే చక్రవడ్డీ ఎంత?',
        optionsEn: ['₹2,000', '₹2,100', '₹2,200', '₹1,900'],
        optionsTe: ['₹2,000', '₹2,100', '₹2,200', '₹1,900'],
        correctIndex: 1,
        explanationEn:
          'Amount = 10000 × (1.1)² = 10000 × 1.21 = ₹12,100. Compound Interest = 12,100 - 10,000 = ₹2,100.',
        explanationTe:
          'మొత్తం = 10,000 × (1.1)² = ₹12,100. కావున చక్రవడ్డీ = ₹12,100 - ₹10,000 = ₹2,100.',
      },
      {
        id: 'sq3',
        subjectEn: 'Time, Speed & Distance',
        subjectTe: 'కాలం, వేగం & దూరం',
        questionEn:
          'A train 150 meters long passes an electric pole in 10 seconds. What is its speed in km/h?',
        questionTe:
          '150 మీటర్ల పొడవు గల రైలు ఒక విద్యుత్ స్తంభాన్ని 10 సెకన్లలో దాటితే, దాని వేగం గంటకు ఎన్ని కి.మీ?',
        optionsEn: ['45 km/h', '54 km/h', '60 km/h', '72 km/h'],
        optionsTe: ['45 km/h', '54 km/h', '60 km/h', '72 km/h'],
        correctIndex: 1,
        explanationEn:
          'Speed = 150 / 10 = 15 m/s. Converting to km/h: 15 × (18/5) = 54 km/h.',
        explanationTe:
          'వేగం = 150 / 10 = 15 మీ/సె. దీనిని 18/5 తో గుణించగా 54 కి.మీ/గం వస్తుంది.',
      },
      {
        id: 'sq4',
        subjectEn: 'Ratio & Proportion',
        subjectTe: 'నిష్పత్తి & అనుపాతం',
        questionEn:
          'Two study partners share a scholarship grant of ₹3,500 in the ratio 3 : 4. How much does the second partner receive?',
        questionTe:
          'ఇద్దరు విద్యార్థులు ₹3,500 స్కాలర్‌షిప్‌ను 3 : 4 నిష్పత్తిలో పంచుకుంటే, రెండవ విద్యార్థికి ఎంత వస్తుంది?',
        optionsEn: ['₹1,500', '₹1,750', '₹2,000', '₹2,400'],
        optionsTe: ['₹1,500', '₹1,750', '₹2,000', '₹2,400'],
        correctIndex: 2,
        explanationEn:
          'Total parts = 3 + 4 = 7. One part = 3500 / 7 = ₹500. Second share = 4 × 500 = ₹2,000.',
        explanationTe:
          'మొత్తం భాగాలు = 7. ఒక్కో భాగం = ₹500. రెండవ వాటా = 4 × 500 = ₹2,000.',
      },
      {
        id: 'sq5',
        subjectEn: 'Number Series',
        subjectTe: 'సంఖ్యా శ్రేణి (Number Series)',
        questionEn: 'Find the missing number in the series: 3, 7, 15, 31, 63, ?',
        questionTe: 'ఈ శ్రేణిలో తదుపరి సంఖ్యను కనుగొనండి: 3, 7, 15, 31, 63, ?',
        optionsEn: ['95', '125', '127', '131'],
        optionsTe: ['95', '125', '127', '131'],
        correctIndex: 2,
        explanationEn:
          'Each term follows (previous × 2) + 1: 63 × 2 + 1 = 127 (differences double: +4, +8, +16, +32, +64).',
        explanationTe:
          'ప్రతి సంఖ్య (మునుపటి సంఖ్య × 2) + 1 సూత్రాన్ని అనుసరిస్తుంది: 63 × 2 + 1 = 127.',
      },
      {
        id: 'sq6',
        subjectEn: 'Time & Work',
        subjectTe: 'కాలం & పని',
        questionEn:
          'A can catalog an archive in 12 days and B can do it in 24 days. Working together, in how many days will they finish?',
        questionTe:
          'A ఒక పనిని 12 రోజుల్లో, B అదే పనిని 24 రోజుల్లో పూర్తి చేయగలరు. ఇద్దరూ కలిసి పనిచేస్తే ఎన్ని రోజుల్లో పూర్తవుతుంది?',
        optionsEn: ['6 days', '8 days', '10 days', '18 days'],
        optionsTe: ['6 రోజులు', '8 రోజులు', '10 రోజులు', '18 రోజులు'],
        correctIndex: 1,
        explanationEn:
          'Combined 1-day rate = 1/12 + 1/24 = 3/24 = 1/8. Thus they complete the task in 8 days.',
        explanationTe:
          'ఇద్దరి ఒక రోజు పని = 1/12 + 1/24 = 3/24 = 1/8. కావున పూర్తి కావడానికి 8 రోజులు పడుతుంది.',
      },
    ],
  },
  {
    id: 'mock-foundation-scholars',
    track: 'FOUNDATION',
    titleEn: 'High School & Inter Scholars — Science, Civics & Global Literacy',
    titleTe: 'పాఠశాల & ఇంటర్ విద్యార్థులు — సైన్స్, పౌరశాస్త్రం & ప్రపంచ అవగాహన',
    subtitleEn: 'Designed for Olympiad & scholarship readiness in Classes 9–12.',
    subtitleTe: '9–12 తరగతుల ఒలింపియాడ్, స్కాలర్‌షిప్ సన్నద్ధత కోసం.',
    durationMinutes: 12,
    questions: [
      {
        id: 'f1',
        subjectEn: 'Civics',
        subjectTe: 'పౌరశాస్త్రం',
        questionEn:
          'Which Article of the Indian Constitution guarantees the Right to Free and Compulsory Education for children aged 6 to 14?',
        questionTe:
          '6 నుండి 14 సంవత్సరాల పిల్లలకు ఉచిత, నిర్బంధ విద్యా హక్కును కల్పించే రాజ్యాంగ అధికరణం ఏది?',
        optionsEn: ['Article 19', 'Article 21A', 'Article 32', 'Article 51'],
        optionsTe: ['అధికరణం 19', 'అధికరణం 21A', 'అధికరణం 32', 'అధికరణం 51'],
        correctIndex: 1,
        explanationEn:
          'Inserted by the 86th Constitutional Amendment (2002), Article 21A makes elementary education a Fundamental Right.',
        explanationTe:
          '86వ రాజ్యాంగ సవరణ (2002) ద్వారా చేర్చబడిన అధికరణం 21A ప్రాథమిక విద్యను ప్రాథమిక హక్కుగా మార్చింది.',
      },
      {
        id: 'f2',
        subjectEn: 'Physics & Renewable Energy',
        subjectTe: 'భౌతిక శాస్త్రం & పునరుత్పాదక శక్తి',
        questionEn:
          'What physical phenomenon enables solar photovoltaic cells to convert sunlight directly into electricity?',
        questionTe:
          'సౌర ఫోటోవోల్టాయిక్ కణాలు సూర్యకాంతిని నేరుగా విద్యుత్‌గా మార్చడానికి కారణమైన భౌతిక ప్రక్రియ ఏది?',
        optionsEn: [
          'Electromagnetic induction',
          'Photovoltaic / Photoelectric effect in semiconductors',
          'Nuclear fission',
          'Thermal convection',
        ],
        optionsTe: [
          'విద్యుదయస్కాంత ప్రేరణ',
          'అర్ధవాహకాలలో ఫోటోవోల్టాయిక్ / ఫోటోఎలెక్ట్రిక్ ప్రభావం',
          'అణు విచ్ఛిత్తి',
          'ఉష్ణ సంవహనం',
        ],
        correctIndex: 1,
        explanationEn:
          'Photons excite electrons across a semiconductor p-n junction (typically silicon), creating direct electric current.',
        explanationTe:
          'సూర్యకాంతి ఫోటాన్లు సిలికాన్ వంటి అర్ధవాహకాలలోని ఎలక్ట్రాన్లను ఉత్తేజితం చేయడం ద్వారా విద్యుత్ ప్రవాహం ఏర్పడుతుంది.',
      },
      {
        id: 'f3',
        subjectEn: 'Earth & Environment',
        subjectTe: 'భూమి & పర్యావరణం',
        questionEn: 'Why are wetlands often called the "kidneys of the landscape"?',
        questionTe: 'చిత్తడి నేలలను (Wetlands) ప్రకృతి యొక్క "మూత్రపిండాలు" అని ఎందుకు పిలుస్తారు?',
        optionsEn: [
          'They absorb excess nutrients, trap sediments, and filter pollutants from water',
          'They generate tectonic earthquakes',
          'They prevent all ocean tides',
          'They reflect 100% of solar radiation',
        ],
        optionsTe: [
          'అవి నీటిలోని కలుషితాలను వడపోసి, అధిక పోషకాలను శోషించుకుంటాయి',
          'అవి భూకంపాలను ఉత్పత్తి చేస్తాయి',
          'అవి సముద్రపు అలలను పూర్తిగా ఆపుతాయి',
          'అవి సూర్యరశ్మిని 100% పరావర్తనం చేస్తాయి',
        ],
        correctIndex: 0,
        explanationEn:
          'Wetlands naturally purify runoff water, recharge groundwater aquifers, and buffer seasonal floods.',
        explanationTe:
          'చిత్తడి నేలలు కలుషిత నీటిని సహజంగా శుద్ధి చేసి భూగర్భ జలాలను పెంచుతాయి మరియు వరదలను నియంత్రిస్తాయి.',
      },
      {
        id: 'f4',
        subjectEn: 'Space Science',
        subjectTe: 'అంతరిక్ష విజ్ఞానం',
        questionEn:
          'Which lunar region did ISRO’s Chandrayaan-3 Vikram lander successfully touch down on, making India the first nation to achieve it?',
        questionTe:
          'ఇస్రో చంద్రయాన్-3 విక్రమ్ ల్యాండర్ విజయవంతంగా దిగి భారతదేశానికి ప్రపంచంలోనే మొదటి గుర్తింపు తెచ్చిన చంద్రుని ప్రాంతం ఏది?',
        optionsEn: [
          'Lunar North Pole highlands',
          'Near the Lunar South Pole (Shiv Shakti Point)',
          'Mare Tranquillitatis equator',
          'Far-side volcanic crater rim',
        ],
        optionsTe: [
          'చంద్రుని ఉత్తర ధ్రువం',
          'చంద్రుని దక్షిణ ధ్రువ ప్రాంతం (శివ శక్తి పాయింట్)',
          'మేర్ ట్రాంక్విలిటాటిస్',
          'సుదూర అగ్నిపర్వత బిలం',
        ],
        correctIndex: 1,
        explanationEn:
          'Chandrayaan-3 landed safely near the lunar south pole in August 2023, a region valued for permanently shadowed water-ice potential.',
        explanationTe:
          'ఆగస్టు 2023లో చంద్రయాన్-3 చంద్రుని దక్షిణ ధ్రువం వద్ద సురక్షితంగా దిగి చరిత్ర సృష్టించింది.',
      },
      {
        id: 'f5',
        subjectEn: 'Constitutional Duties',
        subjectTe: 'ప్రాథమిక విధులు',
        questionEn:
          'Which Constitutional Amendment added Fundamental Duties (Part IV-A, Article 51A) to the Constitution of India?',
        questionTe:
          'భారత రాజ్యాంగంలో ప్రాథమిక విధులను (భాగ IV-A, అధికరణం 51A) చేర్చిన రాజ్యాంగ సవరణ ఏది?',
        optionsEn: [
          '24th Amendment Act',
          '42nd Amendment Act (1976)',
          '52nd Amendment Act',
          '91st Amendment Act',
        ],
        optionsTe: [
          '24వ సవరణ చట్టం',
          '42వ సవరణ చట్టం (1976)',
          '52వ సవరణ చట్టం',
          '91వ సవరణ చట్టం',
        ],
        correctIndex: 1,
        explanationEn:
          'Based on the Swaran Singh Committee recommendations, the 42nd Amendment (1976) inserted Part IV-A containing Fundamental Duties.',
        explanationTe:
          'స్వరణ్ సింగ్ కమిటీ సిఫార్సు మేరకు 1976లోని 42వ రాజ్యాంగ సవరణ ద్వారా ప్రాథమిక విధులు చేర్చబడ్డాయి.',
      },
      {
        id: 'f6',
        subjectEn: 'Modern Indian History',
        subjectTe: 'ఆధునిక భారత చరిత్ర',
        questionEn:
          'Which 1930 peaceful civil disobedience march led by Mahatma Gandhi challenged the colonial salt monopoly?',
        questionTe:
          '1930లో బ్రిటిష్ ఉప్పు గుత్తాధిపత్యానికి వ్యతిరేకంగా మహాత్మా గాంధీ నడిపిన శాంతియుత శాసనోల్లంఘన పాదయాత్ర ఏది?',
        optionsEn: [
          'Champaran Indigo Satyagraha',
          'Dandi Salt March',
          'Bardoli Peasant Movement',
          'Quit India Resolution',
        ],
        optionsTe: ['చంపారన్ సత్యాగ్రహం', 'దండి ఉప్పు సత్యాగ్రహం', 'బార్డోలీ ఉద్యమం', 'క్విట్ ఇండియా తీర్మానం'],
        correctIndex: 1,
        explanationEn:
          'Gandhiji marched 240 miles from Sabarmati Ashram to Dandi (March–April 1930), sparking the nationwide Civil Disobedience Movement.',
        explanationTe:
          'సబర్మతి ఆశ్రమం నుండి దండి వరకు 240 మైళ్ల పాదయాత్రతో ఉప్పు సత్యాగ్రహం ప్రారంభమైంది.',
      },
    ],
  },
  {
    id: 'mock-foundation-math-stem',
    track: 'FOUNDATION',
    titleEn: 'Classes 9–12 & Olympiad — Mathematics, Physics & STEM',
    titleTe: '9–12 తరగతులు & ఒలింపియాడ్ — గణితం, భౌతిక శాస్త్రం & STEM',
    subtitleEn: 'Trigonometry, Ohm’s Law, pH chemistry, photosynthesis, and orbital physics practice.',
    subtitleTe: 'త్రికోణమితి, ఓమ్ నియమం, pH రసాయన శాస్త్రం, కిరణజన్య సంయోగక్రియ ప్రశ్నలు.',
    durationMinutes: 12,
    questions: [
      {
        id: 'fm1',
        subjectEn: 'Trigonometry',
        subjectTe: 'త్రికోణమితి (Trigonometry)',
        questionEn: 'For any real angle θ, what is the exact value of sin²θ + cos²θ?',
        questionTe: 'ఏ కోణం θ కైనా sin²θ + cos²θ విలువ ఎంత?',
        optionsEn: ['0', '1', '2', 'tan θ'],
        optionsTe: ['0', '1', '2', 'tan θ'],
        correctIndex: 1,
        explanationEn:
          'Derived from the Pythagorean theorem on a unit circle, sin²θ + cos²θ = 1 for all real angles.',
        explanationTe:
          'పైథాగరస్ సిద్ధాంతం ఆధారంగా ఏ కోణానికైనా sin²θ + cos²θ = 1 అవుతుంది.',
      },
      {
        id: 'fm2',
        subjectEn: 'Electricity & Physics',
        subjectTe: 'విద్యుత్ & భౌతిక శాస్త్రం',
        questionEn:
          'According to Ohm’s Law (V = IR), if a 12 V battery drives current through a 4 Ω resistor, what is the current?',
        questionTe:
          'ఓమ్ నియమం (V = IR) ప్రకారం, 12 V బ్యాటరీ 4 Ω నిరోధకం ద్వారా ప్రవహింపజేసే విద్యుత్ ప్రవాహం ఎంత?',
        optionsEn: ['2 Amperes', '3 Amperes', '8 Amperes', '48 Amperes'],
        optionsTe: ['2 ఆంపియర్లు', '3 ఆంపియర్లు', '8 ఆంపియర్లు', '48 ఆంపియర్లు'],
        correctIndex: 1,
        explanationEn: 'Current I = V / R = 12 V / 4 Ω = 3 Amperes.',
        explanationTe: 'విద్యుత్ ప్రవాహం I = V / R = 12 / 4 = 3 ఆంపియర్లు.',
      },
      {
        id: 'fm3',
        subjectEn: 'Chemistry & Acids',
        subjectTe: 'రసాయన శాస్త్రం',
        questionEn: 'On the 0–14 pH scale at 25°C, what pH value represents a strictly neutral aqueous solution like pure water?',
        questionTe: '25°C వద్ద 0–14 pH స్కేలుపై స్వచ్ఛమైన నీటి వంటి తటస్థ ద్రావణం యొక్క pH విలువ ఎంత?',
        optionsEn: ['0', '5.5', '7', '14'],
        optionsTe: ['0', '5.5', '7', '14'],
        correctIndex: 2,
        explanationEn:
          'pH < 7 indicates acidic solutions, pH = 7 is neutral pure water, and pH > 7 indicates basic/alkaline solutions.',
        explanationTe: 'pH = 7 తటస్థ స్థితిని సూచిస్తుంది; 7 కంటే తక్కువ ఆమ్లం, ఎక్కువ క్షారం.',
      },
      {
        id: 'fm4',
        subjectEn: 'Biology',
        subjectTe: 'జీవశాస్త్రం',
        questionEn:
          'Which cell organelle in green plants captures sunlight to perform photosynthesis?',
        questionTe:
          'ఆకుపచ్చని మొక్కలలో సూర్యరశ్మిని గ్రహించి కిరణజన్య సంయోగక్రియ నిర్వహించే కణాంగం ఏది?',
        optionsEn: ['Mitochondria', 'Chloroplast', 'Ribosome', 'Golgi Apparatus'],
        optionsTe: ['మైటోకాండ్రియా', 'హరితరేణువు (Chloroplast)', 'రైబోజోమ్', 'గాల్జీ సంక్లిష్టం'],
        correctIndex: 1,
        explanationEn:
          'Chloroplasts contain chlorophyll pigments that convert light energy, CO₂, and water into glucose and oxygen.',
        explanationTe:
          'హరితరేణువులోని పత్రహరితం సూర్యకాంతి సహాయంతో ఆహారాన్ని (గ్లూకోజ్) మరియు ఆక్సిజన్‌ను తయారు చేస్తుంది.',
      },
      {
        id: 'fm5',
        subjectEn: 'Algebra',
        subjectTe: 'బీజగణితం (Algebra)',
        questionEn:
          'If a quadratic equation ax² + bx + c = 0 has a discriminant (b² − 4ac) equal to zero, what is the nature of its roots?',
        questionTe:
          'ax² + bx + c = 0 వర్గ సమీకరణం యొక్క విచక్షణి (b² − 4ac) సున్నాకు సమానమైతే, దాని మూలాల స్వభావం ఎలా ఉంటుంది?',
        optionsEn: [
          'Two distinct imaginary roots',
          'Two real and equal roots',
          'No solutions exist',
          'Infinite solutions',
        ],
        optionsTe: [
          'రెండు భిన్నమైన కల్పిత మూలాలు',
          'రెండు వాస్తవ మరియు సమాన మూలాలు',
          'పరిష్కారాలు ఉండవు',
          'అనంతమైన పరిష్కారాలు',
        ],
        correctIndex: 1,
        explanationEn:
          'When Δ = b² − 4ac = 0, both roots equal −b / (2a), giving two real and equal roots.',
        explanationTe:
          'విచక్షణి సున్నా అయితే ఆ వర్గ సమీకరణానికి వాస్తవమైన మరియు సమానమైన రెండు మూలాలు ఉంటాయి.',
      },
      {
        id: 'fm6',
        subjectEn: 'Orbital Mechanics',
        subjectTe: 'కక్ష్యా భౌతిక శాస్త్రం',
        questionEn:
          'What is the approximate orbital period of a Geostationary communication satellite revolving around Earth above the equator?',
        questionTe:
          'భూమధ్యరేఖకు పైన భూమి చుట్టూ తిరిగే భూస్థిర (Geostationary) ఉపగ్రహం యొక్క పరిభ్రమణ కాలం సుమారు ఎంత?',
        optionsEn: ['90 minutes', '12 hours', '24 hours', '365 days'],
        optionsTe: ['90 నిమిషాలు', '12 గంటలు', '24 గంటలు', '365 రోజులు'],
        correctIndex: 2,
        explanationEn:
          'A geostationary satellite orbits at ~35,786 km altitude with a 24-hour period matching Earth’s rotation, appearing stationary overhead.',
        explanationTe:
          'భూస్థిర ఉపగ్రహం భూమి భ్రమణ కాలమైన 24 గంటల్లో ఒక పరిభ్రమణం పూర్తి చేయడం వల్ల ఒకే చోట స్థిరంగా కనిపిస్తుంది.',
      },
    ],
  },
];

export const DAILY_QUICK_QUIZ: MockQuestion[] = [
  MOCK_TESTS[0].questions[0],
  MOCK_TESTS[1].questions[0],
  MOCK_TESTS[2].questions[0],
  MOCK_TESTS[4].questions[0],
  MOCK_TESTS[6].questions[0],
];

export const INFOGRAPHIC_MODULES: InfographicModule[] = [
  {
    id: 'info-union-capex',
    titleEn: 'Public Capital Expenditure & Knowledge Infrastructure Share',
    titleTe: 'ప్రజా మూలధన వ్యయం & విజ్ఞాన మౌలిక వసతుల వాటా',
    subtitleEn:
      'Interactive breakdown of priority development allocations shaping national competitive exam economy questions.',
    subtitleTe:
      'జాతీయ పోటీ పరీక్షల ఆర్థిక విభాగంలో ముఖ్యమైన అభివృద్ధి కేటాయింపుల ఇంటరాక్టివ్ విశ్లేషణ.',
    sourceNote: 'Union Fiscal Summary · FY 2026–27 Estimates',
    chartType: 'bar',
    points: [
      {
        id: 'p1',
        labelEn: 'Transport & Logistics Corridors',
        labelTe: 'రవాణా & లాజిస్టిక్స్ కారిడార్లు',
        value: 34,
        unit: '%',
        detailEn: 'Dedicated freight corridors, regional rail modernization, and port connectivity.',
        detailTe: 'ప్రత్యేక సరుకు రవాణా కారిడార్లు, ప్రాంతీయ రైలు ఆధునీకరణ, పోర్ట్ అనుసంధానం.',
        colorHex: '#1D4ED8',
      },
      {
        id: 'p2',
        labelEn: 'Clean Energy & Canal Solar Grids',
        labelTe: 'స్వచ్ఛ ఇంధనం & కాలువ సోలార్ గ్రిడ్స్',
        value: 23,
        unit: '%',
        detailEn: 'Solar parks, green hydrogen hubs, and interstate battery storage substations.',
        detailTe: 'సోలార్ పార్కులు, గ్రీన్ హైడ్రోజన్ హబ్‌లు, బ్యాటరీ నిల్వ కేంద్రాలు.',
        colorHex: '#0F766E',
      },
      {
        id: 'p3',
        labelEn: 'Education, Digital Libraries & R&D',
        labelTe: 'విద్య, డిజిటల్ గ్రంథాలయాలు & పరిశోధన',
        value: 19,
        unit: '%',
        detailEn: 'Multilingual STEM grids, university research fellowships, and semiconductor labs.',
        detailTe: 'బహుభాషా STEM వేదికలు, విశ్వవిద్యాలయ ఫెలోషిప్‌లు, సెమీకండక్టర్ ల్యాబ్‌లు.',
        colorHex: '#B45309',
      },
      {
        id: 'p4',
        labelEn: 'Rural Irrigation & Agri-Tech',
        labelTe: 'గ్రామీణ నీటిపారుదల & అగ్రి-టెక్',
        value: 14,
        unit: '%',
        detailEn: 'Micro-irrigation canals, cold-chain storage, and soil telemetry clinics.',
        detailTe: 'సూక్ష్మ నీటిపారుదల, కోల్డ్-చైన్ నిల్వ కేంద్రాలు, మట్టి పరీక్షా కేంద్రాలు.',
        colorHex: '#4338CA',
      },
      {
        id: 'p5',
        labelEn: 'Space & Frontier Telemetry',
        labelTe: 'అంతరిక్షం & టెలిమెట్రీ',
        value: 10,
        unit: '%',
        detailEn: 'NavIC atomic clock expansion, deep-space ground stations, and climate satellites.',
        detailTe: 'నావిక్ అటామిక్ క్లాక్ విస్తరణ, వాతావరణ ఉపగ్రహాలు.',
        colorHex: '#64748B',
      },
    ],
  },
  {
    id: 'info-krishna-godavari',
    titleEn: 'AP & Telangana Renewable + Irrigation Synergy Metrics',
    titleTe: 'AP & తెలంగాణ పునరుత్పాదక ఇంధన + సాగునీటి సమన్వయ గణాంకాలు',
    subtitleEn:
      'Click any corridor indicator to inspect regional exam facts across Krishna and Godavari basins.',
    subtitleTe:
      'కృష్ణా, గోదావరి బేసిన్ల ప్రాంతీయ పరీక్షా వివరాలను చూడటానికి ఏదైనా సూచికను క్లిక్ చేయండి.',
    sourceNote: 'Regional Infrastructure Digest · 2026',
    chartType: 'bar',
    points: [
      {
        id: 'kg1',
        labelEn: 'Canal-Top Solar Capacity (Phase I)',
        labelTe: 'కాలువ పైకప్పు సోలార్ సామర్థ్యం',
        value: 640,
        unit: 'MW',
        detailEn: 'Zero agricultural land acquisition across Nalgonda, Suryapet, Guntur, and Krishna.',
        detailTe: 'నల్గొండ, సూర్యాపేట, గుంటూరు, కృష్ణా జిల్లాల్లో వ్యవసాయ భూమి సేకరణ లేకుండానే ఏర్పాటు.',
        colorHex: '#0F766E',
      },
      {
        id: 'kg2',
        labelEn: 'Annual Evaporation Saved (x100 MCFT)',
        labelTe: 'వార్షిక నీటి ఆవిరి పొదుపు (x100 MCFT)',
        value: 180,
        unit: 'units',
        detailEn: 'Equivalent to 1.8 TMC feet of conserved freshwater annually for downstream farmers.',
        detailTe: 'ఏటా 1.8 TMC అడుగుల మంచినీటి పొదుపుకు సమానం.',
        colorHex: '#1D4ED8',
      },
      {
        id: 'kg3',
        labelEn: 'Solar-Powered Lift Feeders',
        labelTe: 'సౌర ఆధారిత ఎత్తిపోతల ఫీడర్లు',
        value: 412,
        unit: 'stations',
        detailEn: 'Supplies daytime feeder power directly to agricultural micro-irrigation pumps.',
        detailTe: 'పగటిపూట వ్యవసాయ పంపులకు నేరుగా నిరంతర విద్యుత్ సరఫరా.',
        colorHex: '#B45309',
      },
    ],
  },
];

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    id: 'gl-cbdc',
    termEn: 'CBDC (Central Bank Digital Currency)',
    termTe: 'సెంట్రల్ బ్యాంక్ డిజిటల్ కరెన్సీ (e₹)',
    pronunciationTe: 'డిజిటల్ రూపాయి (ఇ-రుపీ)',
    domain: 'Economy',
    definitionEn:
      'Digital legal tender issued directly by a nation’s central bank (such as RBI’s e₹), representing a sovereign central bank liability rather than a commercial bank deposit.',
    definitionTe:
      'దేశ కేంద్ర బ్యాంకు (RBI) నేరుగా జారీ చేసే డిజిటల్ చట్టబద్ధమైన కరెన్సీ. ఇది వాణిజ్య బ్యాంకు డిపాజిట్ కాకుండా నేరుగా రిజర్వ్ బ్యాంక్ బాధ్యత.',
    examNoteEn: 'Frequently tested in UPSC Prelims & IBPS PO alongside M0 monetary base.',
    examNoteTe: 'UPSC ప్రిలిమ్స్ మరియు IBPS PO పరీక్షల్లో M0 ద్రవ్య స్థావరంతో కలిపి అడుగుతారు.',
  },
  {
    id: 'gl-repo-rate',
    termEn: 'Repo Rate',
    termTe: 'రెపో రేటు (Repo Rate)',
    pronunciationTe: 'రీపర్చేజ్ ఆప్షన్ రేటు',
    domain: 'Economy',
    definitionEn:
      'The interest rate at which the Reserve Bank of India lends short-term funds to commercial banks against approved government securities to manage liquidity and inflation.',
    definitionTe:
      'ద్రవ్యోల్బణం మరియు ద్రవ్య లభ్యతను నియంత్రించేందుకు RBI వాణిజ్య బ్యాంకులకు ప్రభుత్వ సెక్యూరిటీలపై ఇచ్చే స్వల్పకాలిక రుణ వడ్డీ రేటు.',
    examNoteEn: 'Core Monetary Policy Committee (MPC) instrument under Section 45ZB of the RBI Act.',
    examNoteTe: 'RBI చట్టం సెక్షన్ 45ZB ప్రకారం ద్రవ్య విధాన కమిటీ (MPC) ప్రధాన సాధనం.',
  },
  {
    id: 'gl-fiscal-deficit',
    termEn: 'Fiscal Deficit',
    termTe: 'కోశ లోటు (Fiscal Deficit)',
    pronunciationTe: 'ఫిస్కల్ డెఫిసిట్',
    domain: 'Economy',
    definitionEn:
      'The gap between the government’s total expenditure and its total non-borrowed receipts (revenue + non-debt capital receipts) in a fiscal year.',
    definitionTe:
      'ఒక ఆర్థిక సంవత్సరంలో ప్రభుత్వ మొత్తం వ్యయానికి మరియు అప్పులు లేని మొత్తం ఆదాయానికి మధ్య ఉన్న వ్యత్యాసం.',
    examNoteEn: 'Key metric under the FRBM Act targets in Union & State Budgets.',
    examNoteTe: 'కేంద్ర, రాష్ట్ర బడ్జెట్లలో FRBM చట్ట లక్ష్యాల కింద కీలక సూచిక.',
  },
  {
    id: 'gl-navic',
    termEn: 'NavIC (IRNSS)',
    termTe: 'నావిక్ (NavIC)',
    pronunciationTe: 'నావిగేషన్ విత్ ఇండియన్ కాన్‌స్టెలేషన్',
    domain: 'Science',
    definitionEn:
      'India’s independent regional satellite navigation constellation developed by ISRO, covering India and a 1,500 km perimeter with civilian and strategic positioning.',
    definitionTe:
      'ఇస్రో అభివృద్ధి చేసిన భారతదేశ స్వతంత్ర ప్రాంతీయ ఉపగ్రహ దిక్సూచి వ్యవస్థ. ఇది భారత్ మరియు 1,500 కి.మీ పరిధిలో ఖచ్చితమైన స్థాన సమాచారాన్ని అందిస్తుంది.',
    examNoteEn: 'High-yield UPSC & SSC Science topic; uses Rubidium atomic clocks.',
    examNoteTe: 'UPSC, SSC పరీక్షల్లో ముఖ్య అంశం; ఇందులో రుబీడియం అటామిక్ క్లాక్స్ ఉపయోగిస్తారు.',
  },
  {
    id: 'gl-seventh-schedule',
    termEn: 'Seventh Schedule',
    termTe: 'ఏడవ షెడ్యూల్',
    pronunciationTe: 'అధికారాల విభజన జాబితాలు',
    domain: 'Polity',
    definitionEn:
      'Constitutional framework under Article 246 dividing legislative powers into three lists: Union List (List I), State List (List II), and Concurrent List (List III).',
    definitionTe:
      'అధికరణం 246 కింద శాసన అధికారాలను కేంద్ర జాబితా, రాష్ట్ర జాబితా మరియు ఉమ్మడి జాబితాగా విభజించే రాజ్యాంగ నిబంధన.',
    examNoteEn: 'Essential for Cooperative Federalism, GST, and Education/Water policy questions.',
    examNoteTe: 'సహకార సమాఖ్య విధానం, విద్య మరియు నీటి విధాన ప్రశ్నలకు అత్యంత కీలకం.',
  },
  {
    id: 'gl-delimitation',
    termEn: 'Delimitation',
    termTe: 'నియోజకవర్గాల పునర్విభజన',
    pronunciationTe: 'డీలిమిటేషన్ కమిషన్',
    domain: 'Polity',
    definitionEn:
      'The constitutional process of redrawing boundaries of Lok Sabha and State Assembly constituencies based on recent Census population figures (Article 82).',
    definitionTe:
      'జనాభా లెక్కల ఆధారంగా లోక్‌సభ మరియు రాష్ట్ర అసెంబ్లీ నియోజకవర్గాల సరిహద్దులను పునర్నిర్ణయించే రాజ్యాంగ ప్రక్రియ (అధికరణం 82).',
    examNoteEn: 'Orders of the Delimitation Commission carry the force of law and cannot be challenged in court.',
    examNoteTe: 'డీలిమిటేషన్ కమిషన్ ఆదేశాలకు చట్టబద్ధత ఉంటుంది, వీటిని న్యాయస్థానంలో సవాలు చేయలేము.',
  },
  {
    id: 'gl-urban-mining',
    termEn: 'Urban Mining',
    termTe: 'అర్బన్ మైనింగ్',
    pronunciationTe: 'ఇ-వ్యర్థాల లోహ పునరుద్ధరణ',
    domain: 'Ecology',
    definitionEn:
      'Systematic recovery of critical minerals and rare-earth elements—such as lithium, cobalt, gold, and silicon—from discarded electronics and industrial scrap.',
    definitionTe:
      'పనికిరాని ఎలక్ట్రానిక్ పరికరాలు, పారిశ్రామిక వ్యర్థాల నుండి లిథియం, కోబాల్ట్, బంగారం, సిలికాన్ వంటి కీలక ఖనిజాలను తిరిగి పొందే ప్రక్రియ.',
    examNoteEn: 'Linked to Circular Economy, Critical Minerals Mission, and E-Waste Rules.',
    examNoteTe: 'సర్క్యులర్ ఎకానమీ, కీలక ఖనిజాల మిషన్ మరియు ఇ-వ్యర్థాల నిబంధనలతో అనుసంధానమై ఉంటుంది.',
  },
  {
    id: 'gl-ipef',
    termEn: 'IPEF (Indo-Pacific Economic Framework)',
    termTe: 'ఇండో-పసిఫిక్ ఆర్థిక ఫ్రేమ్‌వర్క్ (IPEF)',
    pronunciationTe: 'ఐపీఈఎఫ్',
    domain: 'Diplomacy',
    definitionEn:
      'A 14-nation economic initiative focused on resilient supply chains, clean energy transition, anti-corruption tax transparency, and trade facilitation.',
    definitionTe:
      'సరఫరా గొలుసు భద్రత, స్వచ్ఛ ఇంధన మార్పు మరియు పన్ను పారదర్శకతపై 14 దేశాలు కలిసి పనిచేసే ఆర్థిక వేదిక.',
    examNoteEn: 'Note India joined Pillars II–IV (Supply Chains, Clean Economy, Fair Economy).',
    examNoteTe: 'భారతదేశం ఇందులోని సరఫరా గొలుసు, క్లీన్ ఎకానమీ, ఫెయిర్ ఎకానమీ విభాగాల్లో భాగస్వామి.',
  },
  {
    id: 'gl-dpi',
    termEn: 'Digital Public Infrastructure (DPI)',
    termTe: 'డిజిటల్ పబ్లిక్ ఇన్‌ఫ్రాస్ట్రక్చర్ (DPI)',
    pronunciationTe: 'డిజిటల్ ప్రజా మౌలిక సదుపాయాలు',
    domain: 'Polity',
    definitionEn:
      'Interoperable, open-protocol digital systems—such as Aadhaar, UPI, DigiLocker, and bilingual open libraries—built as public goods for population-scale access.',
    definitionTe:
      'ఆధార్, UPI, డిజీలాకర్ మరియు డిజిటల్ గ్రంథాలయాల వంటి ఓపెన్ ప్రోటోకాల్ ప్రజా డిజిటల్ వ్యవస్థలు.',
    examNoteEn: 'Central theme of India’s G20 and NEP 2020 governance discussions.',
    examNoteTe: 'భారత G20 మరియు NEP 2020 పాలనా చర్చల్లో ప్రధాన అంశం.',
  },
  {
    id: 'gl-wetlands-ramsar',
    termEn: 'Ramsar Convention',
    termTe: 'రామ్‌సార్ ఒప్పందం',
    pronunciationTe: 'చిత్తడి నేలల సంరక్షణ ఒప్పందం',
    domain: 'Ecology',
    definitionEn:
      'International treaty signed in Ramsar, Iran (1971) for the conservation and wise sustainable use of wetlands of international importance (e.g., Kolleru Lake in AP).',
    definitionTe:
      'అంతర్జాతీయ ప్రాముఖ్యత కలిగిన చిత్తడి నేలల (ఉదా: ఆంధ్రప్రదేశ్‌లోని కొల్లేరు సరస్సు) సంరక్షణ కోసం 1971లో కుదిరిన అంతర్జాతీయ ఒప్పందం.',
    examNoteEn: 'Frequently asked in state PSC and UPSC Environment sections.',
    examNoteTe: 'రాష్ట్ర PSC మరియు UPSC పర్యావరణ విభాగాల్లో తరచుగా అడిగే ప్రశ్న.',
  },
];

export function getUiCopy(lang: LanguageMode) {
  const isTe = lang === 'te';
  const isBi = lang === 'bilingual';

  return {
    brandName: isTe ? 'BCR కరెంట్ అఫైర్స్' : isBi ? 'BCR Current Affairs · కరెంట్ అఫైర్స్' : 'BCR Current Affairs',
    navDispatch: isTe ? 'వార్తలు' : 'Dispatch',
    navExams: isTe ? 'పరీక్షలు' : 'Exam Prep',
    navInfographics: isTe ? 'ఇన్ఫోగ్రాఫిక్స్' : 'Infographics',
    navGlossary: isTe ? 'పదకోశం' : 'Glossary',
    navAiTutor: isTe ? 'AI ట్యూటర్' : 'AI Tutor',
    accountBtn: isTe ? 'విద్యార్థి ఖాతా' : 'Pupil Account',
    breakingLabel: isTe ? 'తాజా వార్తలు' : isBi ? 'BREAKING · తాజా' : 'Breaking',
    searchPlaceholder: isTe
      ? 'వార్తలు, పరీక్షలు లేదా పదకోశం వెతకండి...'
      : 'Search news, exam tracks, or Telugu/English terms...',
    refreshNow: isTe ? 'తాజాకరించు' : 'Refresh',
    liveBriefingBtn: isTe ? 'లైవ్ AI సంక్షిప్త వార్తలు' : 'Live Grounded Briefing',
    readFullStory: isTe ? 'పూర్తి కథనం చదవండి' : 'Read Full Dispatch',
    examRelevanceLabel: isTe ? 'పరీక్షా ప్రాధాన్యత' : 'Exam Relevance',
    askAiAboutStory: isTe ? 'AI ట్యూటర్‌ను అడగండి' : 'Ask AI Tutor',
    generateStoryQuiz: isTe ? 'ఈ వార్తపై క్విజ్ సృష్టించండి' : 'Generate 3-Q Quiz',
    bookmarkSave: isTe ? 'సేవ్ చేయండి' : 'Save',
    bookmarkSaved: isTe ? 'సేవ్ అయింది' : 'Saved',
    startMockTest: isTe ? 'మాక్ టెస్ట్ ప్రారంభించండి' : 'Start Mock Test',
    submitMockTest: isTe ? 'పరీక్ష సమర్పించండి' : 'Submit Test',
    retakeTest: isTe ? 'మళ్లీ ప్రయత్నించండి' : 'Retake Test',
    dailyQuizHeading: isTe ? 'రోజువారీ 5-ప్రశ్నల క్విజ్' : 'Daily 5-Question Quick Quiz',
    signOut: isTe ? 'లాగ్ అవుట్' : 'Sign Out',
  };
}
