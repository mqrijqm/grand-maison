export type ArticleCopy = {
  lead: string;
  body: string[];
  uses: string[];
  together: string[];
  tip: string;
};

export const ARTICLE_COPY: Record<string, ArticleCopy> = {
  "GKP-001": {
    lead: "Standardna GKB ploča tipa A za oblaganje zidova i plafona u suhim prostorijama.",
    body: [
      "Ploča dimenzija 2000 × 1250 × 12,5 mm pokriva 2,5 m². Montira se na odgovarajuću potkonstrukciju od profila, a spojevi se obrađuju masom za spojeve.",
      "Prije montaže provjerite da su prostor i konstrukcija suhi i da su profili postavljeni u ravni. Za izbor razmaka profila, vijaka i načina obrade spojeva pratite tehnički list proizvođača."
    ],
    uses: ["Pregradni zidovi u suhim prostorijama", "Spušteni plafoni", "Oblaganje unutrašnjih zidova"],
    together: ["Pocinčani zidni profil CW 75", "Pocinčani vodeći profil UW 75", "Gipsana masa za fugovanje"],
    tip: "Ploče skladištite položene ravno, zaštićene od vlage i oslonjene cijelom površinom."
  },
  "GKP-002": {
    lead: "Impregnirana GKBI ploča tipa H2 namijenjena je prostorijama u kojima se povremeno javlja povećana vlaga.",
    body: [
      "Zeleni karton olakšava prepoznavanje ploče, ali ne zamjenjuje hidroizolaciju niti obezbjeđuje vodonepropusnost. Ploča se ugrađuje na potkonstrukciju, a obrada površine i spojeva bira se prema sistemu i uslovima prostorije.",
      "U kupatilu uskladite oblogu sa predviđenom zonom izlaganja vodi. U zonama koje zahtijevaju hidroizolaciju izvedite je prema tehničkom listu proizvođača sistema."
    ],
    uses: ["Kupatila", "Kuhinje", "Vešernice", "Pregradni zidovi u vlažnijim prostorijama"],
    together: ["Pocinčani zidni profil CW 75", "Pocinčani vodeći profil UW 75", "Gipsana masa za fugovanje"],
    tip: "Ploče čuvajte na suhom i zaštitite odsječene ivice od kvašenja prije ugradnje."
  },
  "GKP-003": {
    lead: "GKF ploča tipa F ima jezgro ojačano staklenim vlaknima i koristi se u oblogama kada projekat traži vatrootpornu gipsanu ploču.",
    body: [
      "Ploča je dimenzija 2000 × 1250 × 12,5 mm i pokriva 2,5 m². Rezultat sistema zavisi od kompletne konstrukcije, uključujući broj slojeva, profile, pričvršćenje i obradu spojeva.",
      "Crveni karton služi za prepoznavanje ploče, ali sam po sebi ne određuje požarnu otpornost gotove pregrade. Uskladite sastav obloge sa projektom i tehničkim listom proizvođača."
    ],
    uses: ["Obloge predviđene projektom za zaštitu od požara", "Pregradni zidovi", "Spušteni plafoni", "Oblaganje konstrukcija prema projektnom rješenju"],
    together: ["Pocinčani zidni profil CW 75", "Pocinčani vodeći profil UW 75", "Gipsana masa za fugovanje"],
    tip: "Prije naručivanja provjerite projektom propisan broj slojeva i tip ploče za svaku stranu konstrukcije."
  },
  "GKP-004": {
    lead: "Tvrda gips-kartonska ploča debljine 12,5 mm namijenjena je oblogama gdje se traži povećana čvrstoća i otpornost na udarce.",
    body: [
      "Ploča dimenzija 2000 × 1250 mm pokriva 2,5 m². Koristi se na zidovima i drugim površinama koje su izložene češćem kontaktu, uz potkonstrukciju i način pričvršćenja prema sistemu.",
      "Povećana čvrstoća ploče ne zamjenjuje izbor odgovarajuće konstrukcije ni pravilno pričvršćenje. Za zvučne i protivpožarne zahtjeve cijelog sklopa provjerite tehnički list proizvođača."
    ],
    uses: ["Zidovi u frekventnim prostorima", "Unutrašnje obloge izložene udarcima", "Pregrade u poslovnim prostorima"],
    together: ["Pocinčani zidni profil CW 75", "Pocinčani vodeći profil UW 75", "Gipsana masa za fugovanje"],
    tip: "Pri krojenju poduprite ploču blizu linije reza kako biste smanjili rizik od oštećenja ivice."
  },
  "PRF-075": {
    lead: "Pocinčani CW 75 je vertikalni profil za potkonstrukciju pregradnih zidova.",
    body: [
      "Profil je dužine 3000 mm, širine 75 mm i izrađen od lima debljine 0,6 mm. Postavlja se u vodeće UW profile, a širina od 75 mm koristi se u zidnim konstrukcijama odgovarajuće debljine.",
      "Razmak profila i način pričvršćenja zavise od visine zida, obloge i zahtjeva sistema. Provjerite projektno rješenje i tehnički list proizvođača prije sklapanja konstrukcije."
    ],
    uses: ["Potkonstrukcije pregradnih zidova", "Oblaganje zidova na konstrukciji", "Unutrašnje suhomontažne pregrade"],
    together: ["Pocinčani vodeći profil UW 75", "Gips-kartonska ploča GKB 12,5 mm", "Kamena vuna u ploči 50 mm"],
    tip: "Profili se mogu rezati na mjeru; rasporedite dužine tako da otpad bude što manji."
  },
  "PRF-UW75": {
    lead: "Pocinčani UW 75 je vodeći profil koji usmjerava i prihvata CW profile u pregradnom zidu.",
    body: [
      "Profil je dužine 4000 mm, širine 75 mm i izrađen od lima debljine 0,6 mm. Uobičajeno se pričvršćuje uz pod i plafon, uz odgovarajuću pripremu podloge.",
      "Prije montaže označite liniju zida i provjerite položaj otvora. Na spoju sa podlogom primijenite detalje pričvršćenja predviđene sistemom i tehničkim listom proizvođača."
    ],
    uses: ["Donja vodilica pregradnog zida", "Gornja vodilica pregradnog zida", "Konstrukcije sa CW 75 profilima"],
    together: ["Pocinčani zidni profil CW 75", "Gips-kartonska ploča GKB 12,5 mm", "Staklena bandaž traka za spojeve"],
    tip: "Prije pričvršćivanja prenesite istu osu zida na pod i plafon."
  },
  "PRF-CD60": {
    lead: "CD 60/27 je noseći i montažni profil za potkonstrukcije spuštenih plafona i obloga.",
    body: [
      "Profil je dužine 4000 mm, dimenzija 60 × 27 mm i izrađen od lima debljine 0,6 mm. Raspored profila i način povezivanja određuju se prema odabranom sistemu plafona.",
      "Konstrukciju poravnajte prije pričvršćivanja ploča. Vrsta i razmak ovjesa, kao i detalji spojeva profila, treba da prate tehnički list proizvođača."
    ],
    uses: ["Spušteni plafoni", "Potkonstrukcije za unutrašnje obloge", "Montažne konstrukcije od gips-kartonskih ploča"],
    together: ["Pocinčani obodni profil UD 28/27", "Direktni ovjes za CD profil 120 mm", "Gips-kartonska ploča GKB 12,5 mm"],
    tip: "Provjerite raspoloživu visinu plafona i trasu instalacija prije određivanja visine konstrukcije."
  },
  "PRF-UD28": {
    lead: "UD 28/27 je obodni profil koji postavlja rub konstrukcije spuštenog plafona uz zid.",
    body: [
      "Profil je dužine 3000 mm i dimenzija 28 × 27 mm. Uz zid prihvata rubove konstrukcije, dok CD profili formiraju glavni dio potkonstrukcije.",
      "Položaj profila odredite prema projektovanoj visini plafona i ravni završne obloge. Za izbor pričvršćenja i razmak oslonaca pratite uputstva sistema."
    ],
    uses: ["Obod spuštenih plafona", "Rubne linije plafonske potkonstrukcije", "Unutrašnje obloge na konstrukciji"],
    together: ["Pocinčani plafonski profil CD 60/27", "Direktni ovjes za CD profil 120 mm", "Gips-kartonska ploča GKB 12,5 mm"],
    tip: "Označite ravnu visinsku liniju po cijelom obodu prije montaže profila."
  },
  "ISO-001": {
    lead: "Kamena vuna u ploči debljine 50 mm služi za toplotnu i zvučnu izolaciju, a spada u negorivu izolaciju.",
    body: [
      "Ploča je dimenzija 1000 × 600 mm i koristi se u sloju izolacije prema predviđenoj konstrukciji. U pregradnom zidu postavlja se između profila, uz prilagođavanje širine polju.",
      "Izolaciju režite tako da popuni predviđeni prostor bez praznina i nepotrebnog sabijanja. Za izbor debljine i detalje ugradnje provjerite projekat i tehnički list proizvođača."
    ],
    uses: ["Ispuna pregradnih zidova", "Zvučna izolacija unutrašnjih konstrukcija", "Toplotna izolacija zidnih sklopova"],
    together: ["Pocinčani zidni profil CW 75", "Pocinčani vodeći profil UW 75", "Gips-kartonska ploča GKB 12,5 mm"],
    tip: "Pri krojenju koristite zaštitu za oči i disajne puteve i složite ploče tako da ostanu suhe."
  },
  "ISO-002": {
    lead: "Kamena vuna u ploči debljine 100 mm koristi se za toplotnu i zvučnu izolaciju zidova i potkrovlja.",
    body: [
      "Ploča je dimenzija 1000 × 600 mm. Kamena vuna je negoriva i doprinosi prigušenju zvuka; način ugradnje zavisi od konstrukcije u koju se postavlja.",
      "Ugradite ploče bez otvorenih spojeva i bez sabijanja koje mijenja predviđeni sloj. Potrebnu debljinu i sastav konstrukcije odredite prema projektu i tehničkom listu proizvođača."
    ],
    uses: ["Toplotna izolacija zidova", "Izolacija potkrovlja", "Ispuna pregradnih konstrukcija"],
    together: ["Pocinčani zidni profil CW 75", "Gips-kartonska ploča GKB 12,5 mm", "Staklena bandaž traka za spojeve"],
    tip: "Za obračun količine računajte površinu izolacije i dodajte rezervu za krojenje prema rasporedu konstrukcije."
  },
  "CHM-001": {
    lead: "Gipsana masa u vreći od 5 kg služi za ispunu spojeva gips-kartonskih ploča prema predviđenom sistemu obrade.",
    body: [
      "Koristi se za obradu spojeva i lokalnih popravki, uz pripremu podloge i miješanje prema uputstvu na pakovanju. Opis proizvoda navodi da se koristi bez trake.",
      "Provjerite da li je masa predviđena za konkretan tip spoja i završnu obradu. Vrijeme rada, pripremu i broj slojeva odredite prema tehničkom listu proizvođača."
    ],
    uses: ["Ispuna spojeva gips-kartonskih ploča", "Lokalne popravke gips-kartonskih obloga", "Završna obrada suhomontažnih radova"],
    together: ["Gips-kartonska ploča GKB 12,5 mm", "Gips-kartonska ploča GKBI 12,5 mm", "Pocinčani zidni profil CW 75"],
    tip: "Zamiješajte samo količinu koju možete ugraditi u vremenu navedenom na pakovanju."
  },
  "CHM-002": {
    lead: "Gipsana masa za fugovanje u vreći od 25 kg predviđena je za obradu spojeva uz bandažnu traku.",
    body: [
      "Masa se koristi za ispunu spojeva između gips-kartonskih ploča i za pripremu površine u okviru suhomontažnog sistema. Podloga i ivice ploča treba da budu pripremljene prije nanošenja.",
      "Traku utisnite u svježu masu i obradite spoj prema uputstvu proizvođača. Potrošnja, vrijeme obrade i broj slojeva zavise od proizvoda i izvedenog spoja."
    ],
    uses: ["Fugovanje gips-kartonskih ploča", "Obrada spojeva sa bandažnom trakom", "Završna obrada pregrada i plafona"],
    together: ["Staklena bandaž traka za spojeve", "Gips-kartonska ploča GKB 12,5 mm", "Gips-kartonska ploča GKBI 12,5 mm"],
    tip: "Vreće držite na paleti, u suhom prostoru i upotrijebite unutar roka trajanja otisnutog na pakovanju."
  },
  "ACC-003": {
    lead: "Samoljepljiva staklena bandaž traka u rolni od 25 m služi za ojačanje spojeva gips-kartonskih ploča.",
    body: [
      "Traka se lijepi preko pripremljenog spoja, a zatim obrađuje masom za fugovanje prema sistemu. Njена širina i položaj treba da omoguće ravnomjernu obradu cijelog spoja.",
      "Provjerite da je površina čista i suha prije lijepljenja. Na spojevima i uglovima primjenjujte rješenje koje odgovara detalju i uputstvu proizvođača."
    ],
    uses: ["Spojevi gips-kartonskih ploča", "Obrada pregrada", "Obrada plafonskih obloga"],
    together: ["Gipsana masa za fugovanje", "Gips-kartonska ploča GKB 12,5 mm", "Gips-kartonska ploča GKBI 12,5 mm"],
    tip: "Traku odmjerite prije lijepljenja i utisnite je ravno, bez nabora i preskakanja spoja."
  },
  "ACC-006": {
    lead: "Direktni ovjes dužine 120 mm služi za montažu CD 60/27 profila u plafonskoj konstrukciji.",
    body: [
      "Pakovanje sadrži 100 komada. Ovjes se pričvršćuje za podlogu, a CD profil povezuje sa konstrukcijom prema odabranom sistemu spuštenog plafona.",
      "Dužina ovjesa bira se prema potrebnom spuštanju i detaljima konstrukcije. Razmak, vrstu pričvršćenja i način povezivanja profila odredite prema projektu i tehničkom listu proizvođača."
    ],
    uses: ["Spušteni plafoni na CD profilima", "Montaža plafonske potkonstrukcije", "Podešavanje položaja CD profila"],
    together: ["Pocinčani plafonski profil CD 60/27", "Pocinčani obodni profil UD 28/27", "Gips-kartonska ploča GKB 12,5 mm"],
    tip: "Prije naručivanja prebrojite ovjese prema rasporedu profila u prostoriji i provjerite podlogu za pričvršćenje."
  }
};

export type GroupCopy = {
  kicker: string;
  title: string;
  intro: string[];
  facts: [string, string][];
};

export const GROUP_COPY: Record<
  "suha-gradnja" | "izolacija" | "veziva" | "oprema" | "zidni-krovni" | "drvni-program" | "sanitarna-oprema",
  GroupCopy
> = {
  "suha-gradnja": {
    kicker: "01 · Ploče, profili, pribor",
    title: "Sistemi suhe gradnje",
    intro: [
      "Ploče i profili služe za unutrašnje pregrade, obloge i spuštene plafone. Izvođači prvo biraju tip ploče prema prostoru i zahtjevu projekta, a zatim širinu profila prema konstrukciji.",
      "GKB je standardna ploča tipa A, GKBI je impregnirana ploča tipa H2, a GKF je ploča tipa F sa jezgrom ojačanim staklenim vlaknima. Profile CW i UW koristite za pregradne zidove, a CD i UD za plafonske konstrukcije; razmake i sastav sklopa odredite prema tehničkom listu proizvođača."
    ],
    facts: [
      ["Za radove", "Pregradni zidovi, plafoni i unutrašnje obloge"],
      ["Izbor ploče", "Prema namjeni prostora i projektnom zahtjevu"],
      ["Provjeriti", "Sastav konstrukcije, razmak profila i obradu spojeva"]
    ]
  },
  izolacija: {
    kicker: "02 · Vuna i fasadne ploče",
    title: "Izolacija i fasade",
    intro: [
      "Grupa obuhvata kamenu i staklenu vunu, bijeli EPS 70 i grafitni EPS za različite sklopove. Izbor počinje namjenom: zid, potkrovlje, kosi krov ili kontaktna fasada.",
      "Kamena vuna je negoriva i prigušuje zvuk, dok se staklena vuna u rolni praktično postavlja u krovna polja. EPS se koristi u kontaktnim fasadama; grafitna ploča ima deklarisano λ = 0,031 W/mK, a izbor debljine i slojeva treba uskladiti s projektom i tehničkim listovima."
    ],
    facts: [
      ["Za radove", "Zidovi, potkrovlja, kosi krovovi i fasade"],
      ["Fasadni sistem", "Ljepilo, ploča, osnovni sloj sa mrežicom, prajmer i malter"],
      ["Provjeriti", "Podlogu, slojeve konstrukcije i potrebnu debljinu"]
    ]
  },
  veziva: {
    kicker: "03 · Mase i fasadna ljepila",
    title: "Veziva i mase",
    intro: [
      "Ovdje su mase za spojeve gips-kartonskih ploča i ljepila za fasadne izolacione ploče. Izaberite masu prema tome obrađuje li se spoj sa trakom ili radite lijepljenje i armiranje fasade.",
      "Za ETICS radove planirajte komponente kao usklađen sistem: ljepilo, izolaciona ploča, osnovni sloj sa mrežicom, prajmer i završni malter. Pripremu, potrošnju i uslove primjene provjerite prema tehničkom listu konkretnog proizvoda."
    ],
    facts: [
      ["Za radove", "Fugovanje ploča i fasadni izolacioni sistemi"],
      ["Uz spojeve", "Odgovarajuća masa i bandaž traka prema sistemu"],
      ["Skladištenje", "Vreće držati na paleti, u suhom prostoru"]
    ]
  },
  oprema: {
    kicker: "04 · Trake i montažni pribor",
    title: "Pribor za montažu",
    intro: [
      "Pribor prati montažu suhomontažnih zidova i plafona. Bandaž traka ojačava spojeve ploča, a direktni ovjes povezuje CD profil sa podlogom u plafonskoj konstrukciji.",
      "Odredite količine prema rasporedu ploča i profila, kao i prema projektnom rješenju. Za pričvršćenje i razmake ovjesa oslonite se na tehnički list sistema."
    ],
    facts: [
      ["Za radove", "Obrada spojeva i montaža plafonske konstrukcije"],
      ["Pribor", "Bandaž traka i direktni ovjesi za CD profile"],
      ["Provjeriti", "Raspored profila i količinu po prostoriji"]
    ]
  },
  "zidni-krovni": {
    kicker: "05 · Zidanje i pokrivanje krova",
    title: "Zidni i krovni program",
    intro: [
      "Program obuhvata pozicije za zidanje i krovne radove koje se naručuju po upitu. Izbor elementa zavisi od projekta, dimenzija zida ili krova i detalja spojeva.",
      "Prije narudžbe uskladite dimenzije, potrebnu količinu i način dopreme sa prodajom. Specifikacije i dostupnost potvrđuje prodaja."
    ],
    facts: [
      ["Za radove", "Zidanje, nadvoji i krovni pokrivači"],
      ["Izbor", "Prema projektu i dimenzijama konstrukcije"],
      ["Naručivanje", "Po upitu; dostupnost potvrđuje prodaja"]
    ]
  },
  "drvni-program": {
    kicker: "06 · Građa i pločasti materijali",
    title: "Drvni program",
    intro: [
      "Drvni program okuplja rezanu građu, elemente za krovnu konstrukciju i pločaste materijale za gradnju i završne radove. Odabir zavisi od namjene elementa i dimenzija iz projekta.",
      "Prije narudžbe utvrdite tražene dužine, presjeke i količinu. Specifikacije i dostupnost potvrđuje prodaja."
    ],
    facts: [
      ["Za radove", "Krovne konstrukcije, obloge i podovi"],
      ["Izbor", "Prema namjeni i dimenzijama iz projekta"],
      ["Naručivanje", "Po upitu; dostupnost potvrđuje prodaja"]
    ]
  },
  "sanitarna-oprema": {
    kicker: "07 · Oprema za kupatilo",
    title: "Sanitarna oprema",
    intro: [
      "Sanitarna oprema obuhvata osnovne elemente za opremanje kupatila. Pri izboru uskladite dimenzije proizvoda, položaj priključaka i raspored prostora.",
      "Prije završetka instalacija provjerite mjere i način ugradnje odabranog artikla. Specifikacije i dostupnost potvrđuje prodaja."
    ],
    facts: [
      ["Za radove", "Oprema i opremanje kupatila"],
      ["Izbor", "Prema prostoru i položaju priključaka"],
      ["Naručivanje", "Po upitu; dostupnost potvrđuje prodaja"]
    ]
  }
};

// Artikli po upitu: samo provjereni proizvođači za Grand Company (Wienerberger mapa prodajnih mjesta:
// "Tondach krovni sistemi | Porotherm zidni sistemi"; Baumalt lista partnera). Nazivi i podaci su
// prepisani sa stranica proizvođača (izvor u `source`), bez cijena; dostupnost potvrđuje prodaja.
export type ProgramItem = {
  id: string;
  program: "krovni-sistemi" | "zidni-blokovi" | "malteri-ljepila";
  brand: string;
  name: string;
  spec: string;
  unit: string;
  lead: string;
  uses: string[];
  image: string;
  source: string;
};

const WB = "https://www.wienerberger.ba/proizvodi";
const BM = "https://baumalt.ba/portfolio";
const ROOF = ["/markets/krovni.webp", "/assortment/krovni.webp"];
const WALL = ["/markets/blokovi.webp", "/assortment/blokovi.webp"];

export const PROGRAM_ITEMS: ProgramItem[] = [
  // ——— Porotherm zidni blokovi (Wienerberger) ———
  { id: "porotherm-25-s", program: "zidni-blokovi", brand: "Porotherm", name: "Porotherm 25 S", spec: "375 × 250 × 238 mm · 10,50 kom/m² · 15,10 kg/kom", unit: "kom", lead: "Opeka za nosive zidove, sa mortnim džepom, za zidanje mortom.", uses: ["Nosivi zidovi"], image: WALL[0], source: `${WB}/zid/porotherm-opeka/porotherm-25-s.html` },
  { id: "porotherm-25-profi", program: "zidni-blokovi", brand: "Porotherm", name: "Porotherm 25 Profi", spec: "375 × 250 × 249 mm · 10,50 kom/m² · 17,60 kg/kom", unit: "kom", lead: "Brušena opeka za zidanje ljepilom Dryfix.extra.", uses: ["Nosivi zidovi"], image: WALL[1], source: `${WB}/zid/porotherm-opeka/porotherm-25-profi.html` },
  { id: "porotherm-30-profi", program: "zidni-blokovi", brand: "Porotherm", name: "Porotherm 30 Profi", spec: "250 × 300 × 249 mm · 16 kom/m² · 14,60 kg/kom", unit: "kom", lead: "Brušena opeka za zid debljine 30 cm.", uses: ["Nosivi zidovi"], image: WALL[0], source: `${WB}/zid/porotherm-opeka/porotherm-30-profi.html` },
  { id: "porotherm-38-izo-profi", program: "zidni-blokovi", brand: "Porotherm", name: "Porotherm 38 IZO Profi", spec: "250 × 380 × 249 mm · 16 kom/m² · 14,70 kg/kom", unit: "kom", lead: "Brušena opeka punjena kamenom vunom, za energetski efikasan spoljni zid.", uses: ["Spoljni zidovi"], image: WALL[1], source: `${WB}/zid/porotherm-opeka/porotherm-38-izo-profi.html` },
  { id: "porotherm-50-izo-profi", program: "zidni-blokovi", brand: "Porotherm", name: "Porotherm 50 IZO Profi", spec: "250 × 500 × 249 mm · 16 kom/m² · 19,30 kg/kom", unit: "kom", lead: "Brušena opeka sa kamenom vunom, za zid debljine 50 cm.", uses: ["Spoljni zidovi"], image: WALL[0], source: `${WB}/zid/porotherm-opeka/porotherm-50-izo-profi.html` },
  { id: "porotherm-20", program: "zidni-blokovi", brand: "Porotherm", name: "Porotherm 20", spec: "375 × 200 × 238 mm · 8 kom/m² · 11,90 kg/kom", unit: "kom", lead: "Opeka za zid debljine 20 cm.", uses: ["Zidovi"], image: WALL[1], source: `${WB}/zid/porotherm-opeka/porotherm-20.html` },
  { id: "porotherm-15", program: "zidni-blokovi", brand: "Porotherm", name: "Porotherm 15", spec: "500 × 150 × 238 mm · 12,05 kg/kom", unit: "kom", lead: "Pregradna opeka debljine 15 cm.", uses: ["Pregradni zidovi"], image: WALL[0], source: `${WB}/zid/porotherm-opeka/porotherm-15.html` },
  { id: "porotherm-10-s", program: "zidni-blokovi", brand: "Porotherm", name: "Porotherm 10 S", spec: "500 × 100 × 238 mm · 8 kom/m² · 8,10 kg/kom", unit: "kom", lead: "Pregradna opeka debljine 10 cm.", uses: ["Pregradni zidovi"], image: WALL[1], source: `${WB}/zid/porotherm-opeka/porotherm-10-s.html` },

  // ——— Tondach krovni sistemi (Wienerberger) ———
  { id: "tondach-continental-12", program: "krovni-sistemi", brand: "Tondach", name: "Tondach Continental 12", spec: "27,2 × 44,5 cm · 12,0–15,5 kom/m² · 3,00 kg/kom", unit: "kom", lead: "Glineni crijep modernog izgleda; standardni nagib krova 27°.", uses: ["Kosi krovovi"], image: ROOF[0], source: `${WB}/krov/tondach-linije-proizvoda/continental-12-siguran-i-moderan-crijep.html` },
  { id: "tondach-traditon-9", program: "krovni-sistemi", brand: "Tondach", name: "Tondach Traditon 9", spec: "29 × 48,5 cm · 9,5–10,5 kom/m² · 4,08 kg/kom", unit: "kom", lead: "Crijep velikog formata sa dva duboka žlijeba; standardni nagib 27°.", uses: ["Kosi krovovi"], image: ROOF[1], source: `${WB}/krov/tondach-linije-proizvoda/traditon-9-crijep-idealan-za-svaki-krov.html` },
  { id: "tondach-twiston-9", program: "krovni-sistemi", brand: "Tondach", name: "Tondach Twiston 9", spec: "30 × 50 cm · 9 kom/m² · 3,50 kg/kom", unit: "kom", lead: "Crijep velikog formata za svaku arhitekturu; standardni nagib 25°.", uses: ["Kosi krovovi"], image: ROOF[0], source: `${WB}/krov/tondach-linije-proizvoda/twiston-9-crijep-za-svaki-objekt.html` },
  { id: "tondach-planoton-10", program: "krovni-sistemi", brand: "Tondach", name: "Tondach Planoton 10", spec: "29 × 48,5 cm · 10,0–11,0 kom/m² · 3,84 kg/kom", unit: "kom", lead: "Ravni moderni crijep; standardni nagib 35°.", uses: ["Kosi krovovi"], image: ROOF[1], source: `${WB}/krov/tondach-linije-proizvoda/planoton-10-moderan-crijep-vrhunske-kvalitete.html` },
  { id: "tondach-contiton-9", program: "krovni-sistemi", brand: "Tondach", name: "Tondach Contiton 9", spec: "29 × 48,5 cm · 9,6–10,6 kom/m² · 4,0 kg/kom", unit: "kom", lead: "Crijep velikog formata; standardni nagib 17°.", uses: ["Kosi krovovi"], image: ROOF[0], source: `${WB}/krov/tondach-linije-proizvoda/contiton-9-crijep-velikog-formata.html` },
  { id: "tondach-veneton-13", program: "krovni-sistemi", brand: "Tondach", name: "Tondach Veneton 13", spec: "27,5 × 44,0 cm · 13,6–14,4 kom/m² · 3,20 kg/kom", unit: "kom", lead: "Mediteranski valoviti crijep; standardni nagib 30°.", uses: ["Kosi krovovi"], image: ROOF[1], source: `${WB}/krov/tondach-linije-proizvoda/veneton-13-mediteranska-elegancija-na-krovu.html` },
  { id: "tondach-biber", program: "krovni-sistemi", brand: "Tondach", name: "Tondach Biber", spec: "19 × 40 cm · 30,40 kom/m² · 1,9 kg/kom", unit: "kom", lead: "Tradicionalni ravni crijep.", uses: ["Kosi krovovi"], image: ROOF[0], source: `${WB}/krov/tondach-linije-proizvoda/biber-tradicionalni-crijep-za-svaki-krov.html` },
  { id: "tondach-fol-s-145", program: "krovni-sistemi", brand: "Tondach", name: "Paropropusna folija FOL S 145 g/m²", spec: "145 g/m²", unit: "rolna", lead: "Sistemska oprema za krov: paropropusna folija ispod pokrivača.", uses: ["Krovna oprema"], image: ROOF[1], source: `${WB}/krov/tondach-sistemska-oprema/paropropusna-folija-fol-s-145-gm2.html` },

  // ——— Baumalt malteri i ljepila ———
  { id: "baumalt-ck-12", program: "malteri-ljepila", brand: "Baumalt", name: "Baumalt CK 12", spec: "Cementno-krečni malter 1,2 mm · cca 14 kg/m²/cm", unit: "vreća", lead: "Za mašinsko i ručno malterisanje unutra i spolja.", uses: ["Malterisanje"], image: "/assortment/masinski-malteri.webp", source: `${BM}/baumalt-ck-12/` },
  { id: "baumalt-ck-20", program: "malteri-ljepila", brand: "Baumalt", name: "Baumalt CK 20", spec: "Cementno-krečni malter 2,0 mm · cca 16 kg/m²/cm", unit: "vreća", lead: "Mašinski cementno-krečni malter.", uses: ["Malterisanje"], image: "/assortment/masinski-malteri.webp", source: `${BM}/baumalt-ck-20/` },
  { id: "baumalt-gk-12", program: "malteri-ljepila", brand: "Baumalt", name: "Baumalt GK 12", spec: "Gipsano-krečni malter, gletani 1,2 mm · 11,0 kg/m²/cm", unit: "vreća", lead: "Za unutrašnje zidove, mašinski ili ručno.", uses: ["Malterisanje"], image: "/assortment/masinski-malteri.webp", source: `${BM}/baumalt-gk-12/` },
  { id: "baumalt-cs-20", program: "malteri-ljepila", brand: "Baumalt", name: "Baumalt CS 20 cementni špric", spec: "Cca 6–8 kg/m²", unit: "vreća", lead: "Vezni sloj prije malterisanja.", uses: ["Malterisanje"], image: "/assortment/masinski-malteri.webp", source: `${BM}/baumalt-cs-20-cementni-spric/` },
  { id: "baumalt-bmcolle-f", program: "malteri-ljepila", brand: "Baumalt", name: "Baumalt BMCOLLE F", spec: "Fleksibilno ljepilo za keramiku · 3,0–4,0 kg/m²", unit: "vreća", lead: "Za unutrašnje i spoljne radove, vodootporno.", uses: ["Polaganje keramike"], image: "/markets/malteri-ljepila.webp", source: `${BM}/baumalt-bmcolle-f-ljepilo-za-keramiku/` },
  { id: "baumalt-bmcolle-s", program: "malteri-ljepila", brand: "Baumalt", name: "Baumalt BMCOLLE S", spec: "Poboljšano ljepilo za keramiku · 3,0–4,0 kg/m²", unit: "vreća", lead: "Za unutrašnje radove.", uses: ["Polaganje keramike"], image: "/assortment/keramicka-ljepila.webp", source: `${BM}/baumalt-bmcolle-s/` },
  { id: "baumalt-bmcolle-f-premium", program: "malteri-ljepila", brand: "Baumalt", name: "Baumalt BMCOLLE F Premium", spec: "Fleksibilno ljepilo sa vlaknima, smanjeno klizanje (EN 12004)", unit: "vreća", lead: "Za keramiku, kamen i podno grijanje.", uses: ["Polaganje keramike"], image: "/markets/malteri-ljepila.webp", source: `${BM}/baumalt-bmcolle-f-premium/` },
  { id: "baumalt-bmcolle-u", program: "malteri-ljepila", brand: "Baumalt", name: "Baumalt BMCOLLE U", spec: "Lijepljenje 3,0–4,0 kg/m² · armiranje cca 4,0 kg/m²", unit: "vreća", lead: "Univerzalno ljepilo za lijepljenje i armiranje EPS-a (termofasada).", uses: ["Fasada"], image: "/assortment/fasadni.webp", source: `${BM}/baumalt-bmcolle-u/` },
  { id: "baumalt-bmedelputz-f15", program: "malteri-ljepila", brand: "Baumalt", name: "Baumalt BMEdelPutz F15", spec: "Ribana tekstura 1,5 mm · 3,0–4,0 kg/m²", unit: "vreća", lead: "Strukturno-dekorativni malter za unutra i spolja.", uses: ["Fasada"], image: "/assortment/fasadni.webp", source: `${BM}/baumalt-bmedelputz-f15/` },
  { id: "baumalt-bmedelputz-r20", program: "malteri-ljepila", brand: "Baumalt", name: "Baumalt BMEdelPutz R20", spec: "Zaribana tekstura 2,0 mm · 3,0–4,0 kg/m²", unit: "vreća", lead: "Strukturno-dekorativni malter.", uses: ["Fasada"], image: "/assortment/fasadni.webp", source: `${BM}/baumalt-bmedelputz-r20/` },
];

