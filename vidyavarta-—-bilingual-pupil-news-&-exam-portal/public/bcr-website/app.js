(() => {
  'use strict';

  const STORAGE_KEY = 'bcr_current_affairs_state_v1';

  const ARTICLES = [
    {
      id: 'nat-digital-curriculum',
      category: 'national',
      regionEn: 'New Delhi · National',
      regionTe: 'న్యూఢిల్లీ · జాతీయ',
      titleEn: 'National Bilingual STEM & Current Affairs Grid Links 14,000 Public Libraries',
      titleTe: '14,000 ప్రజా గ్రంథాలయాలను అనుసంధానిస్తూ జాతీయ ద్విభాషా STEM వేదిక ప్రారంభం',
      deckEn: 'Synchronized English and Telugu study modules support high school boards, UPSC, APPSC, and TSPSC aspirants.',
      deckTe: 'పాఠశాల విద్యార్థులు, UPSC, APPSC మరియు TSPSC అభ్యర్థుల కోసం తెలుగు, ఇంగ్లీష్ మాడ్యూళ్లు అందుబాటులోకి వచ్చాయి.',
      bodyEn: [
        'The Ministry of Education launched the National Bilingual Knowledge Grid connecting 14,000 district libraries with synchronized current affairs archives.',
        'By removing translation delays between policy releases and regional exam preparation, district study circles gain immediate parity.',
      ],
      bodyTe: [
        'కేంద్ర విద్యా మంత్రిత్వ శాఖ 14,000 జిల్లా గ్రంథాలయాలను అనుసంధానిస్తూ జాతీయ ద్విభాషా విజ్ఞాన వేదికను ప్రారంభించింది.',
        'విధాన పత్రాలు విడుదలైన రోజే తెలుగు, ఇంగ్లీష్ అనువాదాలు రావడం వల్ల గ్రామీణ విద్యార్థులకు సమగ్ర ప్రయోజనం కలుగుతుంది.',
      ],
      examNoteEn: 'GS Paper II: Digital Public Infrastructure & NEP 2020 Multilingual Mandate.',
      examNoteTe: 'GS పేపర్ II: డిజిటల్ పబ్లిక్ ఇన్‌ఫ్రాస్ట్రక్చర్ & NEP 2020.',
      breaking: true,
    },
    {
      id: 'reg-krishna-canal-solar',
      category: 'regional',
      regionEn: 'AP & Telangana · Regional',
      regionTe: 'AP & తెలంగాణ · ప్రాంతీయ',
      titleEn: 'Telangana & Andhra Pradesh Commission 640 MW Krishna Basin Canal-Top Solar Grid',
      titleTe: 'కృష్ణా బేసిన్‌లో 640 MW కాలువ పైకప్పు సౌర విద్యుత్ గ్రిడ్‌ను ప్రారంభించిన తెలంగాణ, AP',
      deckEn: 'Saves 1.8 TMC evaporation annually while powering agricultural lift-irrigation feeders without farmland acquisition.',
      deckTe: 'వ్యవసాయ భూమి సేకరణ లేకుండా ఏటా 1.8 TMC నీటి ఆవిరి నష్టాన్ని తగ్గిస్తూ పగటిపూట విద్యుత్ సరఫరా చేస్తుంది.',
      bodyEn: [
        'Energy and irrigation authorities across Telangana and Andhra Pradesh synchronized Phase I of the canal-top solar corridor.',
        'The project serves as an exam case study for the water–energy–food nexus and interstate basin cooperation.',
      ],
      bodyTe: [
        'తెలంగాణ మరియు ఆంధ్రప్రదేశ్ విద్యుత్, నీటిపారుదల శాఖలు సంయుక్తంగా మొదటి దశ కాలువ పైకప్పు సోలార్ గ్రిడ్‌ను ప్రారంభించాయి.',
        'నీరు–విద్యుత్–ఆహార సమన్వయానికి మరియు అంతర్రాష్ట్ర నదీ సహకారానికి ఇది కీలక ఉదాహరణ.',
      ],
      examNoteEn: 'APPSC & TSPSC Geography: Krishna River Basin & Renewable Energy Corridors.',
      examNoteTe: 'APPSC & TSPSC భూగోళశాస్త్రం: కృష్ణా బేసిన్ & పునరుత్పాదక ఇంధనం.',
      breaking: true,
    },
    {
      id: 'sci-isro-navic-clock',
      category: 'science',
      regionEn: 'Sriharikota · Science & Tech',
      regionTe: 'శ్రీహరికోట · సైన్స్ & టెక్',
      titleEn: 'ISRO Validates Indigenous Rubidium Atomic Clock Aboard NavIC Constellation',
      titleTe: 'నావిక్ ఉపగ్రహ శ్రేణిలో స్వదేశీ రుబీడియం అటామిక్ క్లాక్‌ను పరీక్షించిన ఇస్రో',
      deckEn: 'Precision nanosecond timing sharpens regional satellite positioning across aviation, railways, and agriculture.',
      deckTe: 'నానోసెకండ్ సమయ ఖచ్చితత్వంతో విమానయానం, రైల్వేలు మరియు వ్యవసాయ రంగాల్లో స్థాన నిర్ధారణ మెరుగుపడింది.',
      bodyEn: [
        'Space engineers confirmed nominal orbital drift performance for India’s indigenous Rubidium atomic frequency standard.',
        'Paired with optical cross-links, NavIC improves strategic positioning autonomy across South Asia.',
      ],
      bodyTe: [
        'శ్రీహరికోట, అహ్మదాబాద్ శాస్త్రవేత్తలు స్వదేశీ రుబీడియం అటామిక్ క్లాక్ పనితీరును నిర్ధారించారు.',
        'ఆప్టికల్ క్రాస్-లింకులతో నావిక్ ప్రాంతీయ నావిగేషన్ సామర్థ్యం మరింత బలోపేతమైంది.',
      ],
      examNoteEn: 'Prelims Science: NavIC (IRNSS) & Atomic Clocks.',
      examNoteTe: 'ప్రిలిమ్స్ సైన్స్: NavIC & అటామిక్ గడియారాలు.',
      breaking: true,
    },
    {
      id: 'eco-rbi-cbdc',
      category: 'economy',
      regionEn: 'Mumbai · Economy',
      regionTe: 'ముంబై · ఆర్థికం',
      titleEn: 'RBI Expands Programmable Digital Rupee (e₹) Pilots for Student Scholarships',
      titleTe: 'విద్యార్థి స్కాలర్‌షిప్‌ల కోసం ప్రోగ్రామబుల్ డిజిటల్ రూపాయి పైలట్ విస్తరణ',
      deckEn: 'Purpose-bound CBDC vouchers settle directly on the central bank ledger with real-time compliance.',
      deckTe: 'ప్రత్యేక ప్రయోజన ఈ-రూపాయి వోచర్లు నేరుగా RBI ఖాతాపై తక్షణమే పరిష్కరించబడతాయి.',
      bodyEn: [
        'Unlike commercial UPI rails, CBDC (e₹) is a direct sovereign liability of the Reserve Bank of India.',
        'Programmability helps state treasuries deliver scholarship grants without intermediary delays.',
      ],
      bodyTe: [
        'వాణిజ్య బ్యాంకుల మధ్య జరిగే UPIకి భిన్నంగా, CBDC (e₹) నేరుగా RBI బాధ్యతగా ఉంటుంది.',
        'స్కాలర్‌షిప్‌లు మధ్యవర్తుల జాప్యం లేకుండా విద్యార్థులకు చేరేందుకు ఇది ఉపయోగపడుతుంది.',
      ],
      examNoteEn: 'Indian Economy: Difference between UPI & CBDC (e₹).',
      examNoteTe: 'భారత ఆర్థిక వ్యవస్థ: UPI & CBDC మధ్య తేడా.',
      breaking: false,
    },
    {
      id: 'intl-critical-minerals',
      category: 'international',
      regionEn: 'Geneva · International',
      regionTe: 'జెనీవా · అంతర్జాతీయ',
      titleEn: '18 Indo-Pacific Economies Sign Critical Minerals & Clean Tech Supply Charter',
      titleTe: 'కీలక ఖనిజాల సరఫరాపై 18 ఇండో-పసిఫిక్ దేశాల వ్యూహాత్మక ఒప్పందం',
      deckEn: 'Standardizes lithium and rare-earth traceability while funding urban mining e-waste recovery.',
      deckTe: 'లిథియం, అరుదైన ఖనిజాల శుద్ధి ప్రమాణాలు మరియు ఇ-వ్యర్థాల అర్బన్ మైనింగ్ పరిశోధనలకు నిధులు.',
      bodyEn: [
        'Partner nations including India, Japan, South Korea, and Australia launched joint critical-mineral recovery consortia.',
      ],
      bodyTe: [
        'భారత్, జపాన్, దక్షిణ కొరియా, ఆస్ట్రేలియా దేశాలు సంయుక్తంగా కీలక ఖనిజాల పునరుద్ధరణపై ఒప్పందం కుదుర్చుకున్నాయి.',
      ],
      examNoteEn: 'International Relations: Critical Minerals Security & IPEF.',
      examNoteTe: 'అంతర్జాతీయ సంబంధాలు: కీలక ఖనిజాల భద్రత & IPEF.',
      breaking: false,
    },
  ];

  const MOCK_TESTS = [
    {
      id: 'mock-upsc',
      track: 'UPSC',
      titleEn: 'UPSC & State PSC — Polity, Economy & Current Affairs',
      titleTe: 'UPSC & రాష్ట్ర PSC — పాలిటీ, ఆర్థికం & కరెంట్ అఫైర్స్',
      questions: [
        {
          qEn: 'How does RBI Digital Rupee (e₹) differ from UPI?',
          qTe: 'RBI డిజిటల్ రూపాయి (e₹) మరియు UPI మధ్య ప్రధాన తేడా ఏమిటి?',
          optsEn: [
            'e₹ is a direct liability of the RBI; UPI moves commercial bank deposits.',
            'UPI is printed paper currency.',
            'e₹ requires SWIFT international clearing.',
            'There is no distinction.',
          ],
          optsTe: [
            'e₹ నేరుగా RBI బాధ్యత; UPI వాణిజ్య బ్యాంకు ఖాతాల మధ్య బదిలీ చేస్తుంది.',
            'UPI కాగితపు కరెన్సీ.',
            'e₹కు SWIFT అవసరం.',
            'రెండింటి మధ్య తేడా లేదు.',
          ],
          ans: 0,
          expEn: 'e₹ is sovereign M0 legal tender on the RBI ledger; UPI transfers bank deposits.',
          expTe: 'e₹ అనేది నేరుగా RBI బాధ్యతగా ఉండే లీగల్ టెండర్; UPI బ్యాంకుల మధ్య తక్షణ చెల్లింపు వేదిక.',
        },
        {
          qEn: 'Which Constitutional Schedule divides Union, State, and Concurrent legislative powers?',
          qTe: 'కేంద్ర, రాష్ట్ర మరియు ఉమ్మడి జాబితాలను ఏ రాజ్యాంగ షెడ్యూల్ నిర్దేశిస్తుంది?',
          optsEn: ['Fifth Schedule', 'Seventh Schedule', 'Ninth Schedule', 'Eleventh Schedule'],
          optsTe: ['ఐదవ షెడ్యూల్', 'ఏడవ షెడ్యూల్', 'తొమ్మిదవ షెడ్యూల్', 'పదకొండవ షెడ్యూల్'],
          ans: 1,
          expEn: 'Article 246 & the Seventh Schedule divide legislative powers across three lists.',
          expTe: 'అధికరణం 246 మరియు ఏడవ షెడ్యూల్ అధికారాలను మూడు జాబితాలుగా విభజిస్తాయి.',
        },
        {
          qEn: 'What does "Urban Mining" recover?',
          qTe: '"అర్బన్ మైనింగ్" దేనిని వెలికితీస్తుంది?',
          optsEn: [
            'Coal under metro tracks',
            'Critical minerals and metals from discarded e-waste',
            'River sand',
            'Deep ocean oil',
          ],
          optsTe: [
            'మెట్రో కింద బొగ్గు',
            'ఇ-వ్యర్థాల నుండి కీలక ఖనిజాలు మరియు లోహాలు',
            'నదీ ఇసుక',
            'సముద్రపు చమురు',
          ],
          ans: 1,
          expEn: 'Urban mining recovers lithium, cobalt, silicon, and gold from discarded electronics.',
          expTe: 'ఇ-వ్యర్థాల నుండి లిథియం, కోబాల్ట్, సిలికాన్ వంటి విలువైన ఖనిజాలను వెలికితీస్తారు.',
        },
        {
          qEn: 'Which writ compels a public official to perform a mandatory statutory duty?',
          qTe: 'ప్రభుత్వ అధికారి తన విధిని నిర్వర్తించమని న్యాయస్థానం జారీ చేసే రిట్ ఏది?',
          optsEn: ['Habeas Corpus', 'Mandamus', 'Quo Warranto', 'Certiorari'],
          optsTe: ['హెబియస్ కార్పస్', 'మాండమస్', 'కోవారంటో', 'సెర్షియోరరీ'],
          ans: 1,
          expEn: 'Mandamus ("we command") directs public authorities to execute mandatory duties.',
          expTe: 'మాండమస్ ద్వారా ప్రభుత్వ అధికారులను తమ చట్టబద్ధమైన విధి నిర్వహించమని ఆదేశిస్తారు.',
        },
      ],
    },
    {
      id: 'mock-upsc-science',
      track: 'UPSC',
      titleEn: 'UPSC Prelims — Science, Ecology & Diplomacy',
      titleTe: 'UPSC ప్రిలిమ్స్ — సైన్స్, పర్యావరణం & అంతర్జాతీయ సంబంధాలు',
      questions: [
        {
          qEn: 'Which freshwater lake between the Krishna and Godavari deltas in AP is a Ramsar site?',
          qTe: 'కృష్ణా-గోదావరి డెల్టాల మధ్య ఉన్న ఏ రామ్‌సార్ మంచినీటి సరస్సు APలో ఉంది?',
          optsEn: ['Pulicat Lake', 'Kolleru Lake', 'Chilika Lake', 'Sambhar Lake'],
          optsTe: ['పులికాట్ సరస్సు', 'కొల్లేరు సరస్సు', 'చిలికా సరస్సు', 'సాంబార్ సరస్సు'],
          ans: 1,
          expEn: 'Kolleru Lake in AP is a designated Ramsar Wetland of International Importance.',
          expTe: 'ఆంధ్రప్రదేశ్‌లోని కొల్లేరు సరస్సు రామ్‌సార్ చిత్తడి నేలగా గుర్తింపు పొందింది.',
        },
        {
          qEn: 'How is "Green Hydrogen" produced?',
          qTe: '"గ్రీన్ హైడ్రోజన్"ను ఎలా ఉత్పత్తి చేస్తారు?',
          optsEn: [
            'Water electrolysis powered by renewable solar or wind energy',
            'Direct burning of lignite coal',
            'Adding green dye to natural gas',
            'Nuclear fission alone',
          ],
          optsTe: [
            'సౌర/పవన పునరుత్పాదక విద్యుత్‌తో నీటిని విద్యుద్విశ్లేషణ చేసి',
            'బొగ్గును కాల్చడం ద్వారా',
            'సహజ వాయువుకు రంగు కలపడం ద్వారా',
            'అణు విచ్ఛిత్తి ద్వారా మాత్రమే',
          ],
          ans: 0,
          expEn: 'Renewable-powered electrolysis splits water (H2O) with near-zero carbon emissions.',
          expTe: 'పునరుత్పాదక విద్యుత్‌తో నీటిని విద్యుద్విశ్లేషణ చేసి కర్బన ఉద్గారాలు లేకుండా ఉత్పత్తి చేస్తారు.',
        },
        {
          qEn: 'Which open DPI platform issues verifiable digital academic certificates in India?',
          qTe: 'భారతదేశంలో డిజిటల్ విద్యా ధృవపత్రాలను జారీ చేసే ఓపెన్ ప్లాట్‌ఫారమ్ ఏది?',
          optsEn: ['DigiLocker', 'SWIFTNet', 'FASTag', 'IRDAI Portal'],
          optsTe: ['డిజీలాకర్ (DigiLocker)', 'స్విఫ్ట్‌నెట్', 'ఫాస్టాగ్', 'IRDAI పోర్టల్'],
          ans: 0,
          expEn: 'DigiLocker provides legally verifiable electronic documents from issuers.',
          expTe: 'డిజీలాకర్ డిజిటల్ పబ్లిక్ ఇన్‌ఫ్రాస్ట్రక్చర్ కింద చట్టబద్ధ పత్రాలను అందిస్తుంది.',
        },
      ],
    },
    {
      id: 'mock-appsc-tspsc',
      track: 'APPSC & TSPSC',
      titleEn: 'APPSC & TSPSC — Regional Geography, Economy & Governance',
      titleTe: 'APPSC & TSPSC — ప్రాంతీయ భూగోళశాస్త్రం, ఆర్థికం & పాలన',
      questions: [
        {
          qEn: 'At which confluence does the Pranahita tributary join the Godavari River in Telangana?',
          qTe: 'తెలంగాణలో ప్రాణహిత నది ఏ ప్రదేశం వద్ద గోదావరిలో కలుస్తుంది?',
          optsEn: ['Kaleshwaram', 'Nagarjuna Sagar', 'Srisailam', 'Bhadrachalam'],
          optsTe: ['కాళేశ్వరం', 'నాగార్జునసాగర్', 'శ్రీశైలం', 'భద్రాచలం'],
          ans: 0,
          expEn: 'Pranahita joins the Godavari at Kaleshwaram in Jayashankar Bhupalpally district.',
          expTe: 'కాళేశ్వరం వద్ద ప్రాణహిత ఉపనది గోదావరి నదిలో కలుస్తుంది.',
        },
        {
          qEn: 'Under which Article can Parliament form new states or alter state boundaries?',
          qTe: 'కొత్త రాష్ట్రాల ఏర్పాటు లేదా సరిహద్దుల మార్పుకు సంబంధించిన రాజ్యాంగ అధికరణం ఏది?',
          optsEn: ['Article 1', 'Article 3', 'Article 14', 'Article 356'],
          optsTe: ['అధికరణం 1', 'అధికరణం 3', 'అధికరణం 14', 'అధికరణం 356'],
          ans: 1,
          expEn: 'Article 3 empowers Parliament to form new states and adjust boundaries.',
          expTe: 'అధికరణం 3 పార్లమెంటుకు కొత్త రాష్ట్రాల ఏర్పాటు అధికారాన్ని ఇస్తుంది.',
        },
        {
          qEn: 'Which AP coastal city hosts the Eastern Naval Command headquarters and a deepwater seaport?',
          qTe: 'తూర్పు నావికాదళ కమాండ్ మరియు లోతైన ఓడరేవు ఉన్న AP నగరం ఏది?',
          optsEn: ['Kakinada', 'Visakhapatnam', 'Machilipatnam', 'Krishnapatnam'],
          optsTe: ['కాకినాడ', 'విశాఖపట్నం', 'మచిలీపట్నం', 'కృష్ణపట్నం'],
          ans: 1,
          expEn: 'Visakhapatnam hosts India’s Eastern Naval Command and a major landlocked port.',
          expTe: 'విశాఖపట్నంలో తూర్పు నావికాదళ కమాండ్ మరియు ప్రధాన లోతైన ఓడరేవు ఉన్నాయి.',
        },
      ],
    },
    {
      id: 'mock-appsc-heritage',
      track: 'APPSC & TSPSC',
      titleEn: 'APPSC & TSPSC — Telugu Heritage, History & State Policy',
      titleTe: 'APPSC & TSPSC — తెలుగు వారసత్వం, చరిత్ర & రాష్ట్ర విధానాలు',
      questions: [
        {
          qEn: 'Which Kakatiya UNESCO temple in Mulugu district uses sandbox foundations & floating bricks?',
          qTe: 'శాండ్‌బాక్స్ పునాది మరియు తేలియాడే ఇటుకలతో ప్రసిద్ధి చెందిన కాకతీయ యునెస్కో ఆలయం ఏది?',
          optsEn: ['Ramappa Temple', 'Thousand Pillar Temple', 'Alampur Temple', 'Lepakshi Temple'],
          optsTe: ['రామప్ప ఆలయం', 'వేయి స్తంభాల గుడి', 'ఆలంపూర్ ఆలయం', 'లేపాక్షి ఆలయం'],
          ans: 0,
          expEn: 'Ramappa (Rudreshwara) Temple earned UNESCO World Heritage status in 2021.',
          expTe: 'రామప్ప ఆలయం 2021లో యునెస్కో ప్రపంచ వారసత్వ గుర్తింపు పొందింది.',
        },
        {
          qEn: 'Who authored the classical Telugu epic poem "Amuktamalyada"?',
          qTe: '"ఆముక్తమాల్యద" అనే తెలుగు ప్రబంధాన్ని ఎవరు రచించారు?',
          optsEn: ['Nannayya', 'Sri Krishnadevaraya', 'Pothana', 'Vemana'],
          optsTe: ['నన్నయ', 'శ్రీ కృష్ణదేవరాయలు', 'పోతన', 'వేమన'],
          ans: 1,
          expEn: 'Vijayanagara Emperor Sri Krishnadevaraya composed Amuktamalyada.',
          expTe: 'విజయనగర చక్రవర్తి శ్రీ కృష్ణదేవరాయలు ఆముక్తమాల్యద రచించారు.',
        },
        {
          qEn: 'Which city in Telangana is globally known as India’s "Genome Valley"?',
          qTe: 'భారతదేశపు "జీనోమ్ వ్యాలీ"గా గుర్తింపు పొందిన తెలంగాణ నగరం ఏది?',
          optsEn: ['Hyderabad', 'Warangal', 'Nizamabad', 'Khammam'],
          optsTe: ['హైదరాబాద్', 'వరంగల్', 'నిజామాబాద్', 'ఖమ్మం'],
          ans: 0,
          expEn: 'Hyderabad’s Genome Valley is a leading global vaccine & biotech cluster.',
          expTe: 'హైదరాబాద్ జీనోమ్ వ్యాలీ టీకాలు, బయోటెక్నాలజీలో అగ్రగామి కేంద్రం.',
        },
      ],
    },
    {
      id: 'mock-ssc-ga',
      track: 'SSC & Banking',
      titleEn: 'SSC CGL & Banking — Monetary Policy & General Awareness',
      titleTe: 'SSC CGL & బ్యాంకింగ్ — ద్రవ్య విధానం & జనరల్ అవేర్‌నెస్',
      questions: [
        {
          qEn: 'What is the "Repo Rate" set by the Reserve Bank of India?',
          qTe: 'భారతీయ రిజర్వ్ బ్యాంక్ నిర్ణయించే "రెపో రేటు" అంటే ఏమిటి?',
          optsEn: [
            'Rate at which RBI lends short-term funds to commercial banks against securities',
            'Savings account rate paid by post offices',
            'Corporate income tax rate',
            'Import tariff on gold',
          ],
          optsTe: [
            'వాణిజ్య బ్యాంకులకు RBI ప్రభుత్వ సెక్యూరిటీలపై ఇచ్చే స్వల్పకాలిక రుణ వడ్డీ రేటు',
            'పోస్టాఫీసు పొదుపు వడ్డీ రేటు',
            'కార్పొరేట్ పన్ను రేటు',
            'బంగారం దిగుమతి సుంకం',
          ],
          ans: 0,
          expEn: 'Repo Rate is RBI’s benchmark short-term lending rate to commercial banks.',
          expTe: 'రెపో రేటు ద్వారా RBI బ్యాంకులకు స్వల్పకాలిక ద్రవ్యతను అందిస్తుంది.',
        },
        {
          qEn: 'Which organization operates UPI and RuPay in India?',
          qTe: 'భారతదేశంలో UPI మరియు RuPay వ్యవస్థలను ఏ సంస్థ నిర్వహిస్తుంది?',
          optsEn: ['SEBI', 'NPCI', 'SIDBI', 'IRDAI'],
          optsTe: ['SEBI', 'NPCI', 'SIDBI', 'IRDAI'],
          ans: 1,
          expEn: 'National Payments Corporation of India (NPCI) operates UPI and RuPay.',
          expTe: 'నేషనల్ పేమెంట్స్ కార్పొరేషన్ ఆఫ్ ఇండియా (NPCI) UPIని నిర్వహిస్తుంది.',
        },
        {
          qEn: 'Which statutory body regulates India’s stock exchanges and capital markets?',
          qTe: 'భారత స్టాక్ మార్కెట్లను నియంత్రించే చట్టబద్ధమైన సంస్థ ఏది?',
          optsEn: ['NABARD', 'SEBI', 'TRAI', 'FSSAI'],
          optsTe: ['NABARD', 'SEBI', 'TRAI', 'FSSAI'],
          ans: 1,
          expEn: 'SEBI regulates capital markets, stock exchanges, and mutual funds.',
          expTe: 'సెబీ (SEBI) స్టాక్ ఎక్స్ఛేంజీలు మరియు మ్యూచువల్ ఫండ్లను నియంత్రిస్తుంది.',
        },
      ],
    },
    {
      id: 'mock-ssc-quant',
      track: 'SSC & Banking',
      titleEn: 'SSC & Banking — Quantitative Aptitude & Reasoning',
      titleTe: 'SSC & బ్యాంకింగ్ — క్వాంటిటేటివ్ ఆప్టిట్యూడ్ & రీజనింగ్',
      questions: [
        {
          qEn: 'A fee increases by 20% and then decreases by 20%. What is the net percentage change?',
          qTe: 'ఒక రుసుమును 20% పెంచి, ఆపై 20% తగ్గిస్తే నికర శాతంలో మార్పు ఎంత?',
          optsEn: ['0%', '4% decrease', '4% increase', '2% decrease'],
          optsTe: ['0%', '4% తగ్గుదల', '4% పెరుగుదల', '2% తగ్గుదల'],
          ans: 1,
          expEn: '+20 - 20 + (20 × -20)/100 = -4% (4% decrease).',
          expTe: 'వరుస శాతం మార్పు సూత్రం ప్రకారం 4% నికర తగ్గుదల ఉంటుంది.',
        },
        {
          qEn: 'What is the compound interest on ₹10,000 at 10% p.a. for 2 years annually?',
          qTe: '₹10,000 పై 10% వడ్డీతో 2 సంవత్సరాలకు అయ్యే చక్రవడ్డీ ఎంత?',
          optsEn: ['₹2,000', '₹2,100', '₹2,200', '₹1,900'],
          optsTe: ['₹2,000', '₹2,100', '₹2,200', '₹1,900'],
          ans: 1,
          expEn: '10,000 × 1.1² - 10,000 = 12,100 - 10,000 = ₹2,100.',
          expTe: 'మొత్తం ₹12,100 లో అసలు ₹10,000 తీసివేస్తే చక్రవడ్డీ ₹2,100.',
        },
        {
          qEn: 'Find the next number in the series: 3, 7, 15, 31, 63, ?',
          qTe: 'శ్రేణిలో తదుపరి సంఖ్య ఏది: 3, 7, 15, 31, 63, ?',
          optsEn: ['95', '125', '127', '131'],
          optsTe: ['95', '125', '127', '131'],
          ans: 2,
          expEn: 'Pattern is (prev × 2) + 1: 63 × 2 + 1 = 127.',
          expTe: 'ప్రతి సంఖ్య (మునుపటి సంఖ్య × 2) + 1: 63 × 2 + 1 = 127.',
        },
      ],
    },
    {
      id: 'mock-foundation-scholars',
      track: 'Foundation (9–12)',
      titleEn: 'High School & Inter Scholars — Civics, Space & Environment',
      titleTe: 'పాఠశాల & ఇంటర్ — పౌరశాస్త్రం, అంతరిక్షం & పర్యావరణం',
      questions: [
        {
          qEn: 'Which Article guarantees Free and Compulsory Education for children aged 6–14?',
          qTe: '6–14 ఏళ్ల పిల్లలకు ఉచిత నిర్బంధ విద్యా హక్కును కల్పించే అధికరణం ఏది?',
          optsEn: ['Article 19', 'Article 21A', 'Article 32', 'Article 51'],
          optsTe: ['అధికరణం 19', 'అధికరణం 21A', 'అధికరణం 32', 'అధికరణం 51'],
          ans: 1,
          expEn: 'Inserted by the 86th Amendment (2002), Article 21A makes elementary education a right.',
          expTe: '86వ సవరణ ద్వారా చేర్చిన అధికరణం 21A ప్రాథమిక విద్యను ప్రాథమిక హక్కుగా మార్చింది.',
        },
        {
          qEn: 'Near which lunar region did ISRO’s Chandrayaan-3 Vikram lander touch down?',
          qTe: 'చంద్రయాన్-3 విక్రమ్ ల్యాండర్ చంద్రుని ఏ ప్రాంతం వద్ద దిగింది?',
          optsEn: ['North Pole', 'Lunar South Pole (Shiv Shakti Point)', 'Equator', 'Far-side basin'],
          optsTe: ['ఉత్తర ధ్రువం', 'చంద్రుని దక్షిణ ధ్రువం (శివ శక్తి పాయింట్)', 'భూమధ్యరేఖ', 'దూరపు భాగం'],
          ans: 1,
          expEn: 'India became the first country to land softly near the Lunar South Pole.',
          expTe: 'చంద్రుని దక్షిణ ధ్రువం వద్ద దిగిన మొదటి దేశంగా భారత్ చరిత్ర సృష్టించింది.',
        },
        {
          qEn: 'Which Amendment added Fundamental Duties (Article 51A) in 1976?',
          qTe: '1976లో ప్రాథమిక విధులను (అధికరణం 51A) చేర్చిన రాజ్యాంగ సవరణ ఏది?',
          optsEn: ['24th Amendment', '42nd Amendment', '52nd Amendment', '86th Amendment'],
          optsTe: ['24వ సవరణ', '42వ సవరణ', '52వ సవరణ', '86వ సవరణ'],
          ans: 1,
          expEn: 'The 42nd Amendment Act (1976) inserted Part IV-A (Fundamental Duties).',
          expTe: '42వ రాజ్యాంగ సవరణ (1976) ద్వారా ప్రాథమిక విధులు చేర్చబడ్డాయి.',
        },
      ],
    },
    {
      id: 'mock-foundation-stem',
      track: 'Foundation (9–12)',
      titleEn: 'Classes 9–12 & Olympiad — Mathematics, Physics & STEM',
      titleTe: '9–12 తరగతులు & ఒలింపియాడ్ — గణితం, భౌతిక శాస్త్రం & STEM',
      questions: [
        {
          qEn: 'For any real angle θ, what is the exact value of sin²θ + cos²θ?',
          qTe: 'ఏ కోణం θ కైనా sin²θ + cos²θ విలువ ఎంత?',
          optsEn: ['0', '1', '2', 'tan θ'],
          optsTe: ['0', '1', '2', 'tan θ'],
          ans: 1,
          expEn: 'By the Pythagorean identity on a unit circle, sin²θ + cos²θ = 1.',
          expTe: 'త్రికోణమితి సర్వసమీకరణం ప్రకారం sin²θ + cos²θ = 1.',
        },
        {
          qEn: 'Using Ohm’s Law (V = IR), what current flows from a 12 V battery through a 4 Ω resistor?',
          qTe: 'ఓమ్ నియమం ప్రకారం 12 V బ్యాటరీ 4 Ω నిరోధకం ద్వారా పంపే కరెంట్ ఎంత?',
          optsEn: ['2 A', '3 A', '8 A', '48 A'],
          optsTe: ['2 A', '3 A', '8 A', '48 A'],
          ans: 1,
          expEn: 'I = V / R = 12 / 4 = 3 Amperes.',
          expTe: 'I = V / R = 12 / 4 = 3 ఆంపియర్లు.',
        },
        {
          qEn: 'What is the pH value of strictly neutral pure water at 25°C?',
          qTe: '25°C వద్ద స్వచ్ఛమైన తటస్థ నీటి pH విలువ ఎంత?',
          optsEn: ['0', '5.5', '7', '14'],
          optsTe: ['0', '5.5', '7', '14'],
          ans: 2,
          expEn: 'pH 7 is neutral; below 7 is acidic and above 7 is basic.',
          expTe: 'pH = 7 తటస్థ స్థితిని సూచిస్తుంది.',
        },
      ],
    },
  ];

  const INFOGRAPHICS = [
    {
      titleEn: 'Public Capital Expenditure Share (FY 2026–27)',
      titleTe: 'ప్రజా మూలధన వ్యయ వాటా (FY 2026–27)',
      items: [
        { labelEn: 'Transport & Logistics', labelTe: 'రవాణా & లాజిస్టిక్స్', val: 34, unit: '%' },
        { labelEn: 'Clean Energy & Canal Solar', labelTe: 'స్వచ్ఛ ఇంధనం & కాలువ సోలార్', val: 23, unit: '%' },
        { labelEn: 'Education & Digital Libraries', labelTe: 'విద్య & డిజిటల్ గ్రంథాలయాలు', val: 19, unit: '%' },
        { labelEn: 'Irrigation & Agri-Tech', labelTe: 'నీటిపారుదల & అగ్రి-టెక్', val: 14, unit: '%' },
        { labelEn: 'Space & Telemetry', labelTe: 'అంతరిక్షం & టెలిమెట్రీ', val: 10, unit: '%' },
      ],
    },
  ];

  const GLOSSARY = [
    {
      termEn: 'Repo Rate',
      termTe: 'రెపో రేటు',
      defEn: 'Benchmark rate at which RBI lends short-term funds to commercial banks against government securities.',
      defTe: 'ప్రభుత్వ సెక్యూరిటీలను తాకట్టు పెట్టి వాణిజ్య బ్యాంకులు RBI నుండి స్వల్పకాలిక రుణాలు పొందే వడ్డీ రేటు.',
    },
    {
      termEn: 'Fiscal Deficit',
      termTe: 'కోశ లోటు (Fiscal Deficit)',
      defEn: 'Difference between total government expenditure and total non-borrowed receipts in a fiscal year.',
      defTe: 'ఒక ఆర్థిక సంవత్సరంలో ప్రభుత్వ మొత్తం వ్యయానికి మరియు అప్పులు లేని ఆదాయానికి మధ్య ఉన్న వ్యత్యాసం.',
    },
    {
      termEn: 'NavIC (IRNSS)',
      termTe: 'నావిక్ (NavIC)',
      defEn: 'India’s independent regional satellite navigation system developed by ISRO.',
      defTe: 'ఇస్రో అభివృద్ధి చేసిన భారతదేశ స్వతంత్ర ప్రాంతీయ ఉపగ్రహ నావిగేషన్ వ్యవస్థ.',
    },
    {
      termEn: 'Seventh Schedule',
      termTe: 'ఏడవ షెడ్యూల్',
      defEn: 'Constitutional schedule under Article 246 dividing Union, State, and Concurrent legislative lists.',
      defTe: 'అధికరణం 246 కింద కేంద్ర, రాష్ట్ర, ఉమ్మడి జాబితాలను విభజించే రాజ్యాంగ షెడ్యూల్.',
    },
  ];

  const EXAM_UPDATES = [
    {
      track: 'UPSC',
      date: '2026-11-19',
      titleEn: 'UPSC CSE Current Affairs Focus: Digital Public Infrastructure & Mineral Security',
      titleTe: 'UPSC CSE కరెంట్ అఫైర్స్: డిజిటల్ పబ్లిక్ ఇన్‌ఫ్రాస్ట్రక్చర్ & ఖనిజ భద్రత',
      noteEn: 'Prioritize GS Paper II & III comparative notes on CBDC vs UPI and 7th Schedule.',
      noteTe: 'GS పేపర్ II & III కోసం CBDC vs UPI మరియు 7వ షెడ్యూల్‌పై దృష్టి పెట్టండి.',
    },
    {
      track: 'APPSC & TSPSC',
      date: '2026-11-18',
      titleEn: 'AP & Telangana Group-I/II: Krishna Basin Solar & State Irrigation Telemetry',
      titleTe: 'AP & తెలంగాణ గ్రూప్-I/II: కృష్ణా బేసిన్ సోలార్ & నీటిపారుదల ప్రాజెక్టులు',
      noteEn: 'Review interstate river basin evaporation savings and canal-top solar feeders.',
      noteTe: 'నదీ పరీవాహక ఆవిరి నష్ట నివారణ మరియు కాలువ సోలార్ ప్రాజెక్టులను అధ్యయనం చేయండి.',
    },
    {
      track: 'SSC & Banking',
      date: '2026-11-17',
      titleEn: 'RBI Policy & NavIC Rubidium Atomic Clock Key Prelims Facts',
      titleTe: 'RBI విధానం & నావిక్ రుబీడియం అటామిక్ క్లాక్ ప్రిలిమ్స్ ముఖ్యాంశాలు',
      noteEn: 'Revise Repo Rate, Fiscal Deficit definitions, and ISRO navigation milestones.',
      noteTe: 'రెపో రేటు, కోశ లోటు నిర్వచనాలు మరియు ఇస్రో నావిక్ వివరాలను పునశ్చరణ చేయండి.',
    },
  ];

  const I18N_MAP = {
    en: {
      kicker: 'Bilingual Current Affairs & Exam Desk',
      authHeading: 'Verified bilingual news, regional intelligence, and mock exams.',
      authSub:
        'Sign in with your own email and password, create a new pupil account, or verify once with a one-time passcode. Your study session is strictly scoped to your account.',
      signInHeading: 'Sign In with Your Credentials',
      registerHeading: 'Create Pupil Account',
      enterDetails: 'One-Time Passcode Sign-In',
      pupilNameLabel: 'Pupil Name',
      eduLevelLabel: 'Education Level',
      emailLabel: 'Email Address',
      passwordLabel: 'Password',
      confirmPasswordLabel: 'Confirm Password',
    },
    te: {
      kicker: 'ద్విభాషా కరెంట్ అఫైర్స్ & పరీక్షల వేదిక',
      authHeading: 'ధృవీకరించబడిన ద్విభాషా వార్తలు, ప్రాంతీయ విశ్లేషణ మరియు మాక్ పరీక్షలు.',
      authSub:
        'మీ స్వంత ఇమెయిల్ మరియు పాస్‌వర్డ్‌తో సైన్ ఇన్ చేయండి, కొత్త ఖాతా సృష్టించండి లేదా OTP ద్వారా ప్రవేశించండి. మీ సెషన్ మీ ఖాతాకు మాత్రమే పరిమితం చేయబడింది.',
      signInHeading: 'మీ వివరాలతో సైన్ ఇన్ చేయండి',
      registerHeading: 'కొత్త విద్యార్థి ఖాతాను సృష్టించండి',
      enterDetails: 'వన్-టైమ్ పాస్‌కోడ్ సైన్-ఇన్',
      pupilNameLabel: 'విద్యార్థి పేరు (Pupil Name)',
      eduLevelLabel: 'విద్యార్హత స్థాయి (Education Level)',
      emailLabel: 'ఇమెయిల్ చిరునామా (Email Address)',
      passwordLabel: 'పాస్‌వర్డ్ (Password)',
      confirmPasswordLabel: 'పాస్‌వర్డ్ నిర్ధారించండి (Confirm Password)',
    },
  };

  function escapeHtml(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function safeHttpUrl(raw) {
    if (typeof raw !== 'string') return '';
    try {
      const parsed = new URL(raw.trim());
      return parsed.protocol === 'https:' || parsed.protocol === 'http:' ? parsed.href : '';
    } catch {
      return '';
    }
  }

  const OFFLINE_ACCOUNTS_KEY = 'bcr_standalone_accounts_v1';

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        return {
          lang: parsed.lang || 'bilingual',
          theme: parsed.theme || 'light',
          refreshSec: typeof parsed.refreshSec === 'number' ? parsed.refreshSec : 120,
          sessionToken: typeof parsed.sessionToken === 'string' ? parsed.sessionToken : '',
          deviceToken: typeof parsed.deviceToken === 'string' ? parsed.deviceToken : '',
          activePupil: parsed.activePupil || null,
        };
      }
    } catch {
      // ignore storage errors
    }
    return {
      lang: 'bilingual',
      theme: 'light',
      refreshSec: 120,
      sessionToken: '',
      deviceToken: '',
      activePupil: null,
    };
  }

  let state = loadState();
  let currentTab = 'dispatch';
  let selectedCategory = 'all';
  let pendingOtp = null;
  let countdown = state.refreshSec || 120;
  let tickerPaused = false;
  let quickQuizIdx = 0;
  let quickQuizScore = 0;
  let quickQuizAnswered = false;

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore quota errors
    }
  }

  function applyTheme() {
    document.documentElement.classList.toggle('dark', state.theme === 'dark');
  }

  function isTe() {
    return state.lang === 'te';
  }

  function showDual() {
    return state.lang === 'bilingual';
  }

  function syncLangButtons() {
    document.querySelectorAll('[data-lang]').forEach((btn) => {
      btn.classList.toggle('active', btn.getAttribute('data-lang') === state.lang);
    });
    const brandText =
      state.lang === 'te'
        ? 'BCR కరెంట్ అఫైర్స్'
        : state.lang === 'bilingual'
          ? 'BCR Current Affairs · కరెంట్ అఫైర్స్'
          : 'BCR Current Affairs';
    document.querySelectorAll('.brand-wordmark').forEach((el) => {
      el.textContent = brandText;
    });
    const dict = isTe() ? I18N_MAP.te : I18N_MAP.en;
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (key && dict[key]) {
        el.textContent = dict[key];
      }
    });
  }

  function isHttpOrigin() {
    return window.location.protocol === 'http:' || window.location.protocol === 'https:';
  }

  async function portalApi(path, options = {}) {
    if (!isHttpOrigin()) {
      const err = new Error('Offline mode');
      err.isNetwork = true;
      throw err;
    }
    const headers = { ...(options.headers || {}) };
    if (options.body && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json';
    }
    if (state.sessionToken) {
      headers.Authorization = `Bearer ${state.sessionToken}`;
    }
    if (state.deviceToken) {
      headers['X-Portal-Device'] = state.deviceToken;
    }

    let res;
    try {
      res = await fetch(path, {
        ...options,
        headers,
        credentials: 'include',
        cache: 'no-store',
      });
    } catch {
      const netErr = new Error('Server unreachable');
      netErr.isNetwork = true;
      throw netErr;
    }

    const raw = await res.text();
    let payload = {};
    try {
      payload = raw ? JSON.parse(raw) : {};
    } catch {
      payload = {};
    }
    if (!res.ok) {
      const apiErr = new Error(payload.error || `Request failed (${res.status})`);
      apiErr.status = res.status;
      throw apiErr;
    }
    return payload;
  }

  async function sha256Hex(value) {
    if (window.crypto && window.crypto.subtle) {
      const buf = await window.crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
      return Array.from(new Uint8Array(buf))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
    }
    return value;
  }

  function loadOfflineAccounts() {
    try {
      const raw = localStorage.getItem(OFFLINE_ACCOUNTS_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }

  function saveOfflineAccounts(accounts) {
    try {
      localStorage.setItem(OFFLINE_ACCOUNTS_KEY, JSON.stringify(accounts));
    } catch {
      // ignore storage errors
    }
  }

  function setAuthMode(mode) {
    document.querySelectorAll('[data-auth-mode]').forEach((btn) => {
      btn.classList.toggle('active', btn.getAttribute('data-auth-mode') === mode);
    });
    const signinForm = document.getElementById('signin-form');
    const registerForm = document.getElementById('register-form');
    const detailsForm = document.getElementById('details-form');
    const otpForm = document.getElementById('otp-form');
    const tabs = document.getElementById('auth-mode-tabs');

    if (tabs) tabs.classList.toggle('hidden', mode === 'otp-verify');
    if (signinForm) signinForm.classList.toggle('hidden', mode !== 'signin');
    if (registerForm) registerForm.classList.toggle('hidden', mode !== 'register');
    if (detailsForm) detailsForm.classList.toggle('hidden', mode !== 'otp');
    if (otpForm) otpForm.classList.toggle('hidden', mode !== 'otp-verify');

    ['signin-error', 'register-error', 'auth-error', 'otp-error'].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.classList.add('hidden');
    });
  }

  function showAuthError(elId, message) {
    const el = document.getElementById(elId);
    if (!el) return;
    el.textContent = message;
    el.classList.remove('hidden');
  }

  function completePortalLogin(pupil, sessionToken, deviceToken) {
    state.activePupil = pupil;
    if (typeof sessionToken === 'string' && sessionToken) {
      state.sessionToken = sessionToken;
    }
    if (typeof deviceToken === 'string' && deviceToken) {
      state.deviceToken = deviceToken;
    }
    pendingOtp = null;
    saveState();
    enterPortal();
  }

  let liveFeedArticles = ARTICLES;

  function fetchTextWithXhrFallback(url) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', url, true);
      xhr.timeout = 15000;
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) resolve(xhr.responseText || '');
        else reject(new Error('HTTP ' + xhr.status));
      };
      xhr.onerror = () => reject(new Error('Network error'));
      xhr.ontimeout = () => reject(new Error('Timeout'));
      xhr.send();
    });
  }

  async function syncLiveApiNews(force) {
    const url = `/api/news${force ? '?refresh=1' : ''}`;
    try {
      let raw = '';
      try {
        const res = await fetch(url, { cache: 'no-store' });
        if (res.ok) raw = await res.text();
      } catch {
        // fallback below
      }
      if (!raw || !raw.trim()) {
        raw = await fetchTextWithXhrFallback(url);
      }
      if (!raw || !raw.trim()) return;
      const data = JSON.parse(raw);
      if (Array.isArray(data.articles) && data.articles.length > 0) {
        liveFeedArticles = data.articles.map((a) => ({
          id: a.id,
          category: a.category,
          regionEn: a.regionLabelEn,
          regionTe: a.regionLabelTe,
          titleEn: a.titleEn,
          titleTe: a.titleTe,
          deckEn: a.deckEn,
          deckTe: a.deckTe,
          bodyEn: a.bodyEn || [a.deckEn],
          bodyTe: a.bodyTe || [a.deckTe],
          examNoteEn: a.examRelevanceEn,
          examNoteTe: a.examRelevanceTe,
          breaking: Boolean(a.isBreaking),
          sourceName: a.sourceName,
          externalUrl: a.externalUrl,
          isLiveApi: Boolean(a.isLiveApi),
        }));
        renderTicker();
        renderNews();
      }
    } catch {
      // Keep built-in ARTICLES when opened offline as static HTML
    }
  }

  function updateCountdownLabel() {
    const el = document.getElementById('refresh-countdown');
    if (el) {
      el.textContent = state.refreshSec ? `${countdown}s` : 'Manual';
    }
  }

  function enterPortal() {
    document.getElementById('auth-gate').classList.add('hidden');
    document.getElementById('portal-shell').classList.remove('hidden');
    document.getElementById('account-btn').textContent =
      (state.activePupil && (state.activePupil.pupilName || state.activePupil.name)) || 'Pupil';
    document.getElementById('refresh-select').value = String(state.refreshSec);
    countdown = state.refreshSec || 0;
    updateCountdownLabel();
    renderAll();
    void syncLiveApiNews(false);
  }

  function renderTicker() {
    const track = document.getElementById('ticker-track');
    const breaking = liveFeedArticles.filter((a) => a.breaking);
    const items = breaking.length > 0 ? breaking : liveFeedArticles.slice(0, 3);
    track.innerHTML = '';
    [...items, ...items].forEach((item) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'ticker-item';
      btn.textContent = isTe() ? item.titleTe : item.titleEn;
      btn.addEventListener('click', () => openArticleModal(item));
      track.appendChild(btn);
    });
  }

  function renderCategories() {
    const cats = [
      { id: 'all', en: 'All Editions', te: 'అన్ని విభాగాలు' },
      { id: 'regional', en: 'Regional (AP & TS)', te: 'ప్రాంతీయ' },
      { id: 'national', en: 'National', te: 'జాతీయ' },
      { id: 'international', en: 'International', te: 'అంతర్జాతీయ' },
      { id: 'science', en: 'Science & Tech', te: 'సైన్స్ & టెక్' },
      { id: 'economy', en: 'Economy', te: 'ఆర్థికం' },
    ];
    const row = document.getElementById('category-tabs');
    row.innerHTML = '';
    cats.forEach((c) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `cat-btn ${selectedCategory === c.id ? 'active' : ''}`;
      btn.textContent = isTe() ? c.te : c.en;
      btn.addEventListener('click', () => {
        selectedCategory = c.id;
        renderCategories();
        renderNews();
      });
      row.appendChild(btn);
    });
  }

  function renderNews() {
    const q = document.getElementById('search-input').value.trim().toLowerCase();
    const list = liveFeedArticles.filter((a) => {
      if (selectedCategory !== 'all' && a.category !== selectedCategory) return false;
      if (!q) return true;
      return (
        a.titleEn.toLowerCase().includes(q) ||
        a.titleTe.toLowerCase().includes(q) ||
        a.deckEn.toLowerCase().includes(q) ||
        a.deckTe.toLowerCase().includes(q) ||
        (a.regionEn || '').toLowerCase().includes(q) ||
        (a.regionTe || '').toLowerCase().includes(q) ||
        (a.examNoteEn || '').toLowerCase().includes(q)
      );
    });

    const container = document.getElementById('news-container');
    container.innerHTML = '';
    if (!list.length) {
      container.innerHTML = `<div class="editorial-card"><p class="muted-copy">${
        isTe() ? 'మీ శోధనకు సరిపోయే వార్తలు లేవు.' : 'No dispatches matched your search.'
      }</p></div>`;
      return;
    }

    list.forEach((art) => {
      const card = document.createElement('article');
      card.className = 'editorial-card';
      const safeTitleEn = escapeHtml(art.titleEn);
      const safeTitleTe = escapeHtml(art.titleTe);
      const titleHtml = showDual()
        ? `<h3 class="article-title">${safeTitleEn}</h3><p class="muted-copy"><strong>${safeTitleTe}</strong></p>`
        : `<h3 class="article-title">${isTe() ? safeTitleTe : safeTitleEn}</h3>`;
      const deckText = escapeHtml(isTe() ? art.deckTe : art.deckEn);
      const noteText = escapeHtml(isTe() ? art.examNoteTe : art.examNoteEn);
      const regionText = escapeHtml(isTe() ? art.regionTe : art.regionEn);
      const sourceBadge = art.isLiveApi && art.sourceName ? ` · ${escapeHtml(art.sourceName)}` : '';
      card.innerHTML = `
        <div class="meta-text">${regionText}${sourceBadge}</div>
        ${titleHtml}
        <p class="muted-copy">${deckText}</p>
        <p class="meta-text"><strong>${isTe() ? 'పరీక్షా ముఖ్యాంశం:' : 'Exam Focus:'}</strong> ${noteText}</p>
      `;
      card.querySelector('.article-title').addEventListener('click', () => openArticleModal(art));
      container.appendChild(card);
    });

    document.getElementById('last-updated-label').textContent = `Updated: ${new Date().toLocaleTimeString()}`;
  }

  function openArticleModal(art) {
    document.getElementById('modal-meta').textContent = isTe() ? art.regionTe : art.regionEn;
    const body = document.getElementById('modal-body');
    const enPars = (art.bodyEn || []).map((p) => `<p>${escapeHtml(p)}</p>`).join('');
    const tePars = (art.bodyTe || []).map((p) => `<p>${escapeHtml(p)}</p>`).join('');
    const href = safeHttpUrl(art.externalUrl);
    body.innerHTML = `
      <h2 class="section-title">${escapeHtml(isTe() ? art.titleTe : art.titleEn)}</h2>
      ${showDual() ? `<p class="muted-copy"><strong>${escapeHtml(art.titleTe)}</strong></p>` : ''}
      ${state.lang !== 'te' ? enPars : ''}
      ${state.lang !== 'en' ? tePars : ''}
      <p class="meta-text"><strong>${isTe() ? 'పరీక్షా ప్రాముఖ్యత:' : 'Exam Relevance:'}</strong> ${escapeHtml(
      isTe() ? art.examNoteTe : art.examNoteEn
    )}</p>
      ${
        href
          ? `<p><a href="${escapeHtml(
              href
            )}" target="_blank" rel="noopener noreferrer" style="color:var(--accent);font-size:13px;font-weight:600;">${
              isTe() ? 'మూల వార్త చూడండి →' : 'Read Original Source →'
            }</a></p>`
          : ''
      }
    `;
    document.getElementById('article-modal').classList.remove('hidden');
  }

  let activeExamTrack = 'ALL';

  function renderExams() {
    const testsEl = document.getElementById('mock-tests-list');
    testsEl.innerHTML = '';

    const tracks = ['ALL', 'UPSC', 'APPSC & TSPSC', 'SSC & Banking', 'Foundation (9–12)'];
    const filterBar = document.createElement('div');
    filterBar.className = 'btn-row';
    filterBar.style.marginBottom = '14px';
    filterBar.style.flexWrap = 'wrap';
    tracks.forEach((trk) => {
      const cnt = trk === 'ALL' ? MOCK_TESTS.length : MOCK_TESTS.filter((m) => m.track === trk).length;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = activeExamTrack === trk ? 'primary-btn' : 'secondary-btn';
      btn.textContent = `${trk === 'ALL' ? (isTe() ? 'అన్నీ' : 'All Tracks') : trk} (${cnt})`;
      btn.addEventListener('click', () => {
        activeExamTrack = trk;
        renderExams();
      });
      filterBar.appendChild(btn);
    });
    testsEl.appendChild(filterBar);

    const visibleTests = MOCK_TESTS.filter(
      (t) => activeExamTrack === 'ALL' || t.track === activeExamTrack
    );

    visibleTests.forEach((t) => {
      const card = document.createElement('article');
      card.className = 'editorial-card';
      card.innerHTML = `
        <span class="meta-text mono-num">${escapeHtml(t.track)} · ${t.questions.length} Questions · Bilingual</span>
        <h3 class="article-title">${escapeHtml(isTe() ? t.titleTe : t.titleEn)}</h3>
        <button type="button" class="primary-btn">${isTe() ? 'మాక్ టెస్ట్ ప్రారంభించండి' : 'Start Mock Test'}</button>
      `;
      card.querySelector('button').addEventListener('click', () => startMockRunner(t));
      testsEl.appendChild(card);
    });

    const updatesEl = document.getElementById('exam-updates-grid');
    if (updatesEl) {
      updatesEl.innerHTML = '';
      EXAM_UPDATES.forEach((u) => {
        const card = document.createElement('article');
        card.className = 'editorial-card';
        card.innerHTML = `
          <div class="meta-text mono-num">${escapeHtml(u.track)} · ${escapeHtml(u.date)}</div>
          <h3 class="article-title" style="font-size:1.1rem;cursor:default;">${escapeHtml(
            isTe() ? u.titleTe : u.titleEn
          )}</h3>
          <p class="muted-copy">${escapeHtml(isTe() ? u.noteTe : u.noteEn)}</p>
        `;
        updatesEl.appendChild(card);
      });
    }

    renderQuickQuiz();
  }

  function renderQuickQuiz() {
    const box = document.getElementById('daily-quiz-box');
    const qs = MOCK_TESTS[0].questions;
    if (quickQuizIdx >= qs.length) {
      box.innerHTML = `
        <h3 class="section-title">Daily Quiz Completed</h3>
        <p class="mono-num">Score: ${quickQuizScore} / ${qs.length}</p>
        <button type="button" id="retry-quick" class="secondary-btn">Retake</button>
      `;
      box.querySelector('#retry-quick').addEventListener('click', () => {
        quickQuizIdx = 0;
        quickQuizScore = 0;
        quickQuizAnswered = false;
        renderQuickQuiz();
      });
      return;
    }

    const q = qs[quickQuizIdx];
    const opts = isTe() ? q.optsTe : q.optsEn;
    box.innerHTML = `
      <div class="meta-text mono-num">Quick Quiz · ${quickQuizIdx + 1} / ${qs.length}</div>
      <h3 class="section-title">${escapeHtml(isTe() ? q.qTe : q.qEn)}</h3>
      <div id="qq-opts"></div>
      <button type="button" id="qq-next" class="primary-btn hidden" style="margin-top:12px;">Next</button>
    `;
    const optsWrap = box.querySelector('#qq-opts');
    const nextBtn = box.querySelector('#qq-next');
    opts.forEach((opt, idx) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'option-btn';
      b.textContent = opt;
      b.addEventListener('click', () => {
        if (quickQuizAnswered) return;
        quickQuizAnswered = true;
        if (idx === q.ans) {
          quickQuizScore += 1;
          b.classList.add('correct');
        } else {
          b.classList.add('wrong');
          optsWrap.children[q.ans].classList.add('correct');
        }
        nextBtn.classList.remove('hidden');
      });
      optsWrap.appendChild(b);
    });
    nextBtn.addEventListener('click', () => {
      quickQuizIdx += 1;
      quickQuizAnswered = false;
      renderQuickQuiz();
    });
  }

  function startMockRunner(test) {
    const runner = document.getElementById('exam-runner');
    const hub = document.getElementById('exam-hub-grid');
    hub.classList.add('hidden');
    runner.classList.remove('hidden');

    const answers = {};
    function drawRunner(submitted) {
      let score = 0;
      const htmlQs = test.questions
        .map((q, idx) => {
          const picked = answers[idx];
          if (submitted && picked === q.ans) score += 1;
          const opts = (isTe() ? q.optsTe : q.optsEn)
            .map((opt, oIdx) => {
              let cls = 'option-btn';
              if (submitted) {
                if (oIdx === q.ans) cls += ' correct';
                else if (picked === oIdx) cls += ' wrong';
              } else if (picked === oIdx) {
                cls += ' selected';
              }
              return `<button type="button" class="${cls}" data-q="${idx}" data-o="${oIdx}">${escapeHtml(opt)}</button>`;
            })
            .join('');
          const expHtml =
            submitted && (q.expEn || q.expTe)
              ? `<p class="muted-copy" style="margin-top:10px;font-size:12.5px;">${escapeHtml(
                  isTe() ? q.expTe || q.expEn : q.expEn || q.expTe
                )}</p>`
              : '';
          return `<div class="editorial-card"><strong>${idx + 1}. ${escapeHtml(
            isTe() ? q.qTe : q.qEn
          )}</strong>${opts}${expHtml}</div>`;
        })
        .join('');

      runner.innerHTML = `
        <div class="editorial-card" style="margin-bottom:16px;display:flex;justify-content:space-between;align-items:center;">
          <strong>${escapeHtml(isTe() ? test.titleTe : test.titleEn)}</strong>
          <div class="btn-row">
            ${submitted ? `<span class="mono-num">Score: ${score}/${test.questions.length}</span>` : `<button type="button" id="submit-mock" class="primary-btn">Submit Test</button>`}
            <button type="button" id="exit-mock" class="secondary-btn">Back</button>
          </div>
        </div>
        <div class="stack-gap">${htmlQs}</div>
      `;

      if (!submitted) {
        runner.querySelectorAll('.option-btn').forEach((b) => {
          b.addEventListener('click', () => {
            answers[Number(b.getAttribute('data-q'))] = Number(b.getAttribute('data-o'));
            drawRunner(false);
          });
        });
        runner.querySelector('#submit-mock').addEventListener('click', () => drawRunner(true));
      }
      runner.querySelector('#exit-mock').addEventListener('click', () => {
        runner.classList.add('hidden');
        hub.classList.remove('hidden');
      });
    }
    drawRunner(false);
  }

  function renderInfographics() {
    const list = document.getElementById('infographics-list');
    list.innerHTML = '';
    INFOGRAPHICS.forEach((mod) => {
      const card = document.createElement('section');
      card.className = 'editorial-card';
      const maxVal = Math.max(...mod.items.map((i) => i.val));
      card.innerHTML = `<h3 class="section-title">${isTe() ? mod.titleTe : mod.titleEn}</h3>`;
      mod.items.forEach((item) => {
        const pct = Math.round((item.val / maxVal) * 100);
        const row = document.createElement('div');
        row.style.marginBottom = '14px';
        row.innerHTML = `
          <div style="display:flex;justify-content:space-between;font-size:13px;">
            <span>${isTe() ? item.labelTe : item.labelEn}</span>
            <strong class="mono-num">${item.val}${item.unit}</strong>
          </div>
          <div class="bar-track"><div class="bar-fill" style="width:${pct}%"></div></div>
        `;
        card.appendChild(row);
      });
      list.appendChild(card);
    });
  }

  function renderGlossary() {
    const q = document.getElementById('search-input').value.trim().toLowerCase();
    const grid = document.getElementById('glossary-grid');
    grid.innerHTML = '';
    GLOSSARY.filter(
      (g) =>
        !q ||
        g.termEn.toLowerCase().includes(q) ||
        g.termTe.toLowerCase().includes(q) ||
        g.defEn.toLowerCase().includes(q)
    ).forEach((g) => {
      const card = document.createElement('article');
      card.className = 'editorial-card';
      card.innerHTML = `
        <h3 class="article-title">${g.termEn}</h3>
        <p><strong>${g.termTe}</strong></p>
        <p class="muted-copy">${g.defEn}</p>
        <p class="muted-copy">${g.defTe}</p>
      `;
      grid.appendChild(card);
    });
  }

  function renderAll() {
    syncLangButtons();
    renderTicker();
    renderCategories();
    renderNews();
    renderExams();
    renderInfographics();
    renderGlossary();
  }

  // Event Bindings
  document.querySelectorAll('[data-lang]').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.lang = btn.getAttribute('data-lang');
      saveState();
      syncLangButtons();
      if (state.activePupil) renderAll();
    });
  });

  function toggleTheme() {
    state.theme = state.theme === 'dark' ? 'light' : 'dark';
    saveState();
    applyTheme();
  }
  document.getElementById('auth-theme-toggle').addEventListener('click', toggleTheme);
  document.getElementById('theme-toggle').addEventListener('click', toggleTheme);

  document.querySelectorAll('[data-auth-mode]').forEach((btn) => {
    btn.addEventListener('click', () => {
      setAuthMode(btn.getAttribute('data-auth-mode'));
    });
  });

  document.querySelectorAll('.toggle-pw-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-pw-target');
      const input = targetId ? document.getElementById(targetId) : null;
      if (!input) return;
      const show = input.type === 'password';
      input.type = show ? 'text' : 'password';
      btn.textContent = show ? 'Hide' : 'Show';
    });
  });

  document.getElementById('signin-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('signin-email').value.trim().toLowerCase();
    const password = document.getElementById('signin-password').value;
    const submitBtn = document.getElementById('signin-submit-btn');
    document.getElementById('signin-error').classList.add('hidden');

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || password.length < 8) {
      showAuthError('signin-error', 'Enter a valid email address and password (8+ characters).');
      return;
    }

    submitBtn.disabled = true;
    try {
      const data = await portalApi('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      completePortalLogin(data.pupil, data.sessionToken, data.deviceToken);
    } catch (err) {
      if (err && err.isNetwork) {
        const accounts = loadOfflineAccounts();
        const acct = accounts[email];
        if (!acct) {
          showAuthError('signin-error', 'Offline mode: account not found locally. Create an account first.');
        } else {
          const digest = await sha256Hex(`${acct.salt}:${password}`);
          if (digest !== acct.passwordHash) {
            showAuthError('signin-error', 'Incorrect email or password.');
          } else {
            completePortalLogin(
              { pupilName: acct.pupilName || acct.name, educationLevel: acct.educationLevel, email: acct.email, hasPassword: true, otpVerified: true },
              'offline-session',
              'offline-device'
            );
          }
        }
      } else {
        showAuthError('signin-error', (err && err.message) || 'Sign in failed.');
      }
    } finally {
      submitBtn.disabled = false;
    }
  });

  document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const pupilName = document.getElementById('reg-name').value.trim();
    const level = document.getElementById('reg-level').value;
    const email = document.getElementById('reg-email').value.trim().toLowerCase();
    const password = document.getElementById('reg-password').value;
    const confirm = document.getElementById('reg-confirm').value;
    const submitBtn = document.getElementById('register-submit-btn');
    document.getElementById('register-error').classList.add('hidden');

    if (pupilName.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      showAuthError('register-error', 'Please enter a valid pupil name and email address.');
      return;
    }
    if (password.length < 8) {
      showAuthError('register-error', 'Password must be at least 8 characters.');
      return;
    }
    if (password !== confirm) {
      showAuthError('register-error', 'Passwords do not match.');
      return;
    }

    submitBtn.disabled = true;
    try {
      const data = await portalApi('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ pupilName, educationLevel: level, email, password }),
      });
      completePortalLogin(data.pupil, data.sessionToken, data.deviceToken);
    } catch (err) {
      if (err && err.isNetwork) {
        const accounts = loadOfflineAccounts();
        if (accounts[email]) {
          showAuthError('register-error', 'Offline mode: an account with this email already exists. Use Sign In.');
        } else {
          const salt = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
          const passwordHash = await sha256Hex(`${salt}:${password}`);
          accounts[email] = { pupilName, educationLevel: level, email, salt, passwordHash };
          saveOfflineAccounts(accounts);
          completePortalLogin(
            { pupilName, educationLevel: level, email, hasPassword: true, otpVerified: true },
            'offline-session',
            'offline-device'
          );
        }
      } else {
        showAuthError('register-error', (err && err.message) || 'Registration failed.');
      }
    } finally {
      submitBtn.disabled = false;
    }
  });

  document.getElementById('details-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const pupilName = document.getElementById('pupil-name').value.trim();
    const level = document.getElementById('pupil-level').value;
    const email = document.getElementById('pupil-email').value.trim().toLowerCase();
    const btn = document.getElementById('request-otp-btn');
    document.getElementById('auth-error').classList.add('hidden');

    if (pupilName.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      showAuthError('auth-error', 'Please enter a valid pupil name and email.');
      return;
    }

    btn.disabled = true;
    try {
      const data = await portalApi('/api/auth/request-otp', {
        method: 'POST',
        body: JSON.stringify({ pupilName, educationLevel: level, email }),
      });
      if (data.trustedSkipOtp && data.pupil) {
        completePortalLogin(data.pupil, data.sessionToken, data.deviceToken);
        return;
      }
      pendingOtp = {
        pupilName,
        level,
        email,
        challengeId: data.challengeId || '',
        offline: false,
      };
      document.getElementById('otp-target-note').textContent = `Issued for ${email}`;
      const previewOtp = data.dispatchPreviewOtp || data.otpPreview || '';
      const receiptBox = document.getElementById('otp-receipt-box');
      if (previewOtp) {
        document.getElementById('otp-preview-code').textContent = previewOtp;
        receiptBox.classList.remove('hidden');
      } else {
        receiptBox.classList.add('hidden');
      }
      document.getElementById('otp-code').value = '';
      setAuthMode('otp-verify');
    } catch (err) {
      if (err && err.isNetwork) {
        const code = String(Math.floor(100000 + Math.random() * 900000));
        pendingOtp = { pupilName, level, email, code, offline: true };
        document.getElementById('otp-target-note').textContent = `Offline dispatch for ${email}`;
        document.getElementById('otp-preview-code').textContent = code;
        document.getElementById('otp-receipt-box').classList.remove('hidden');
        document.getElementById('otp-code').value = '';
        setAuthMode('otp-verify');
      } else {
        showAuthError('auth-error', (err && err.message) || 'Could not request passcode.');
      }
    } finally {
      btn.disabled = false;
    }
  });

  document.getElementById('otp-back-btn').addEventListener('click', () => {
    setAuthMode('otp');
  });

  document.getElementById('otp-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const val = document.getElementById('otp-code').value.trim();
    document.getElementById('otp-error').classList.add('hidden');

    if (!pendingOtp) {
      showAuthError('otp-error', 'Session expired. Request a new passcode.');
      return;
    }

    if (pendingOtp.offline) {
      if (val !== pendingOtp.code) {
        showAuthError('otp-error', 'Invalid 6-digit passcode.');
        return;
      }
      completePortalLogin(
        { pupilName: pendingOtp.pupilName, educationLevel: pendingOtp.level, email: pendingOtp.email, otpVerified: true },
        'offline-session',
        'offline-device'
      );
      return;
    }

    try {
      const data = await portalApi('/api/auth/verify-otp', {
        method: 'POST',
        body: JSON.stringify({
          email: pendingOtp.email,
          challengeId: pendingOtp.challengeId,
          otp: val,
        }),
      });
      completePortalLogin(data.pupil, data.sessionToken, data.deviceToken);
    } catch (err) {
      showAuthError('otp-error', (err && err.message) || 'Invalid 6-digit passcode.');
    }
  });

  function switchTab(tabName) {
    currentTab = tabName;
    document.querySelectorAll('[data-tab]').forEach((b) =>
      b.classList.toggle('active', b.getAttribute('data-tab') === tabName)
    );
    document.querySelectorAll('.tab-panel').forEach((p) => p.classList.add('hidden'));
    const panel = document.getElementById(`tab-${tabName}`);
    if (panel) panel.classList.remove('hidden');
  }

  document.getElementById('brand-home').addEventListener('click', () => {
    switchTab('dispatch');
  });

  document.querySelectorAll('[data-tab]').forEach((btn) => {
    btn.addEventListener('click', () => {
      switchTab(btn.getAttribute('data-tab'));
    });
  });

  document.getElementById('search-input').addEventListener('input', () => {
    renderNews();
    renderGlossary();
  });

  document.getElementById('refresh-select').addEventListener('change', (e) => {
    state.refreshSec = Number(e.target.value);
    countdown = state.refreshSec;
    saveState();
    updateCountdownLabel();
  });

  document.getElementById('refresh-now-btn').addEventListener('click', () => {
    countdown = state.refreshSec;
    updateCountdownLabel();
    void syncLiveApiNews(true);
    renderNews();
  });

  document.getElementById('ticker-pause-btn').addEventListener('click', (e) => {
    tickerPaused = !tickerPaused;
    document.getElementById('ticker-track').classList.toggle('paused', tickerPaused);
    e.target.textContent = tickerPaused ? 'Play' : 'Pause';
  });

  function closeArticleModal() {
    document.getElementById('article-modal').classList.add('hidden');
  }

  document.getElementById('modal-close-btn').addEventListener('click', closeArticleModal);
  document.getElementById('article-modal').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) {
      closeArticleModal();
    }
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeArticleModal();
    }
  });

  async function performLogout() {
    try {
      await portalApi('/api/auth/logout', { method: 'POST', body: JSON.stringify({}) });
    } catch {
      // ignore offline logout errors
    }
    state.activePupil = null;
    state.sessionToken = '';
    pendingOtp = null;
    quickQuizIdx = 0;
    quickQuizScore = 0;
    quickQuizAnswered = false;
    selectedCategory = 'all';
    const searchEl = document.getElementById('search-input');
    if (searchEl) searchEl.value = '';
    const runner = document.getElementById('exam-runner');
    const hub = document.getElementById('exam-hub-grid');
    if (runner) {
      runner.classList.add('hidden');
      runner.innerHTML = '';
    }
    if (hub) hub.classList.remove('hidden');
    ['signin-password', 'reg-password', 'reg-confirm', 'otp-code'].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });
    saveState();
    document.getElementById('portal-shell').classList.add('hidden');
    document.getElementById('auth-gate').classList.remove('hidden');
    setAuthMode('signin');
  }

  document.getElementById('account-btn').addEventListener('click', performLogout);
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', performLogout);
  }

  window.setInterval(() => {
    if (!state.activePupil || !state.refreshSec) return;
    countdown -= 1;
    if (countdown <= 0) {
      countdown = state.refreshSec;
      void syncLiveApiNews(true);
      renderNews();
    }
    updateCountdownLabel();
  }, 1000);

  async function initStandalonePortal() {
    applyTheme();
    syncLangButtons();
    if (isHttpOrigin()) {
      try {
        const data = await portalApi('/api/auth/session', { method: 'GET' });
        if (data.authenticated && data.pupil) {
          state.activePupil = data.pupil;
          saveState();
          enterPortal();
          return;
        }
        state.activePupil = null;
        state.sessionToken = '';
        saveState();
        setAuthMode('signin');
        return;
      } catch {
        // Offline or network unreachable — fall through to local check
      }
    }
    if (state.activePupil && !isHttpOrigin()) {
      enterPortal();
    } else {
      state.activePupil = null;
      state.sessionToken = '';
      saveState();
      setAuthMode('signin');
    }
  }

  void initStandalonePortal();
})();
