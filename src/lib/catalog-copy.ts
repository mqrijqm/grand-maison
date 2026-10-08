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
  "ISO-003": {
    lead: "Staklena vuna u rolni debljine 100 mm namijenjena je izolaciji kosih krovova i potkrovlja.",
    body: [
      "Rolna pokriva oko 6 m², a deklarisana toplotna provodljivost je λ = 0,035 W/mK. Rolna se kroji prema poljima konstrukcije i postavlja kao sloj izolacije.",
      "Prije ugradnje provjerite detalje slojeva krova, naročito položaj parne brane i način ventilacije. Za razmake, preklapanja i druge tehničke zahtjeve pratite projekat i tehnički list proizvođača."
    ],
    uses: ["Kosi krovovi", "Potkrovlja", "Toplotna izolacija krovne konstrukcije"],
    together: ["Gips-kartonska ploča GKB 12,5 mm", "Pocinčani plafonski profil CD 60/27", "Direktni ovjes za CD profil 120 mm"],
    tip: "Rolne držite zatvorene i suhe do ugradnje, a površinu za izolovanje izmjerite prije krojenja."
  },
  "ISO-004": {
    lead: "Bijeli EPS 70 debljine 80 mm je fasadna ploča za kontaktne fasade.",
    body: [
      "Ploča dimenzija 1000 × 500 mm koristi se kao dio ETICS sistema. Uobičajeni redoslijed radova obuhvata ljepilo, izolacionu ploču, osnovni sloj sa mrežicom, prajmer i završni malter.",
      "Slojevi i način pričvršćenja moraju odgovarati izabranom fasadnom sistemu i podlozi. Potrošnju materijala i detalje ugradnje provjerite prema tehničkom listu proizvođača."
    ],
    uses: ["Kontaktne fasade", "Toplotna izolacija spoljašnjih zidova", "Fasadni radovi na porodičnim i poslovnim objektima"],
    together: ["Ceresit CT 83 ljepilo za stiropor", "Ceresit CT 85 ljepilo i masa za armiranje"],
    tip: "Prije naručivanja obračunajte neto površinu fasade, otvore i dodatke za krojenje."
  },
  "ISO-006": {
    lead: "Sivi grafitni EPS debljine 100 mm namijenjen je fasadnoj izolaciji kada se bira grafitna ploča.",
    body: [
      "Deklarisana toplotna provodljivost iznosi λ = 0,031 W/mK. Ploča se ugrađuje u kontaktni fasadni sistem uz ljepilo, armirani osnovni sloj sa mrežicom, prajmer i završni malter.",
      "Zaštitite ploče od jakog direktnog sunca tokom skladištenja i ugradnje prema uputstvima proizvođača. Provjerite kompatibilnost svih slojeva i način pričvršćenja za konkretnu podlogu."
    ],
    uses: ["Kontaktne fasade", "Toplotna izolacija spoljašnjih zidova", "Fasadni sistemi sa grafitnim EPS-om"],
    together: ["Ceresit CT 83 ljepilo za stiropor", "Ceresit CT 85 ljepilo i masa za armiranje"],
    tip: "Ploče čuvajte pokrivene i izbjegavajte duže izlaganje direktnom suncu prije ugradnje."
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
  "CHM-003": {
    lead: "Ceresit CT 83 je ljepilo za lijepljenje polistirenskih izolacionih ploča na fasadnu podlogu.",
    body: [
      "Isporučuje se u vreći od 25 kg. Koristi se kao dio fasadnog sistema, uz pripremu podloge i način nanošenja predviđen tehničkim listom proizvoda.",
      "Ljepilo za ploče nije završni sloj fasade. Uskladite ga s izolacijom, osnovnim armiranim slojem i ostalim komponentama sistema; potrošnju i primjenu provjerite prema tehničkom listu proizvođača."
    ],
    uses: ["Lijepljenje EPS ploča na fasadu", "Ugradnja bijelog EPS-a", "Ugradnja grafitnog EPS-a prema sistemu"],
    together: ["Fasadni stiropor EPS 70, bijeli", "Grafitni stiropor EPS, sivi", "Ceresit CT 85 ljepilo i masa za armiranje"],
    tip: "Prije početka rada provjerite čvrstoću i čistoću podloge, kao i uslove primjene navedene na vreći."
  },
  "CHM-004": {
    lead: "Ceresit CT 85 je ljepilo i masa za armiranje fasadnih izolacionih ploča, sa vlaknima.",
    body: [
      "Proizvod se isporučuje u vreći od 25 kg i koristi se za lijepljenje ploča i izradu armiranog sloja sa fasadnom mrežicom. Priprema i nanošenje treba da prate uputstvo za proizvod.",
      "Uskladite ga sa vrstom izolacije i ostalim slojevima fasadnog sistema. Potrošnju i detalje rada provjerite prema tehničkom listu proizvođača."
    ],
    uses: ["Lijepljenje fasadnih izolacionih ploča", "Armiranje fasadne mrežice", "Izrada osnovnog sloja kontaktne fasade"],
    together: ["Fasadni stiropor EPS 70, bijeli", "Grafitni stiropor EPS, sivi", "Ceresit CT 83 ljepilo za stiropor"],
    tip: "Mrežicu ugradite u svježi osnovni sloj prema uputstvu sistema i ne ostavljajte je izloženu bez završne obrade."
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

export type ProgramItem = {
  id: string;
  program: "zidni-krovni" | "drvni-program" | "sanitarna-oprema";
  name: string;
  spec: string;
  unit: string;
  lead: string;
  uses: string[];
};

export const PROGRAM_ITEMS: ProgramItem[] = [
  {
    id: "glineni-blok-250",
    program: "zidni-krovni",
    name: "Šuplji glineni blok",
    spec: "Dimenzije 250 × 190 × 190 mm, šuplji blok",
    unit: "kom",
    lead: "Zidni blok za zidanje unutrašnjih i spoljašnjih zidova prema projektu.",
    uses: ["Zidanje zidova", "Ispuna zidnih polja"]
  },
  {
    id: "krovni-crijep",
    program: "zidni-krovni",
    name: "Krovni crijep",
    spec: "Profilisani crijep, izbor boje i dimenzije po upitu",
    unit: "kom",
    lead: "Element krovnog pokrivača za kose krovove.",
    uses: ["Pokrivanje kosih krovova", "Zamjena oštećenih elemenata pokrivača"]
  },
  {
    id: "sljemenjak-crijep",
    program: "zidni-krovni",
    name: "Sljemenjak za crijep",
    spec: "Profilisani element za završetak sljemena, izbor po upitu",
    unit: "kom",
    lead: "Krovni element za završetak sljemena u sklopu odgovarajućeg pokrivača.",
    uses: ["Završetak sljemena", "Krovni detalji uz odgovarajući crijep"]
  },
  {
    id: "puna-opeka",
    program: "zidni-krovni",
    name: "Puna opeka",
    spec: "Dimenzije približno 250 × 120 × 65 mm, puna opeka",
    unit: "kom",
    lead: "Puna opeka za zidarske radove i elemente predviđene projektom.",
    uses: ["Zidanje manjih elemenata", "Zidarski detalji"]
  },
  {
    id: "betonski-nadvoj",
    program: "zidni-krovni",
    name: "Betonski nadvoj",
    spec: "Dužine i presjek po upitu, armirani betonski element",
    unit: "kom",
    lead: "Nadvoj za premošćavanje otvora u zidu prema projektnom rješenju.",
    uses: ["Nadvoj iznad vrata", "Nadvoj iznad prozora"]
  },
  {
    id: "rezana-gradja",
    program: "drvni-program",
    name: "Rezana građa",
    spec: "Presjek i dužina po upitu, građa za konstrukcijske radove",
    unit: "m³",
    lead: "Rezani drveni elementi za građevinske radove prema dimenzijama iz projekta.",
    uses: ["Krovne konstrukcije", "Pomoćni građevinski radovi"]
  },
  {
    id: "krovna-letva",
    program: "drvni-program",
    name: "Krovna letva",
    spec: "Presjek 30 × 50 mm, dužina po upitu",
    unit: "kom",
    lead: "Letva za izradu podkonstrukcije krovnog pokrivača.",
    uses: ["Krovna podkonstrukcija", "Montaža crijepa prema sistemu"]
  },
  {
    id: "lamelirana-greda",
    program: "drvni-program",
    name: "Lamelirana drvena greda",
    spec: "Presjek i dužina po upitu",
    unit: "kom",
    lead: "Lamelirana greda za konstrukcijske namjene prema projektu.",
    uses: ["Krovne konstrukcije", "Drveni noseći elementi prema projektu"]
  },
  {
    id: "osb-ploca",
    program: "drvni-program",
    name: "OSB ploča",
    spec: "Dimenzije 2500 × 1250 mm, debljina po upitu",
    unit: "m²",
    lead: "Pločasti materijal za oblaganje i konstrukcijske namjene prema projektu.",
    uses: ["Oblaganje zidova i krovova", "Podloge i privremene zaštite"]
  },
  {
    id: "podna-daska",
    program: "drvni-program",
    name: "Podna daska",
    spec: "Širina i dužina po upitu, profilisana daska",
    unit: "m²",
    lead: "Profilisana daska za drvene podove i obloge.",
    uses: ["Drveni podovi", "Unutrašnje obloge"]
  },
  {
    id: "umivaonik",
    program: "sanitarna-oprema",
    name: "Umivaonik",
    spec: "Širina i način ugradnje po upitu",
    unit: "kom",
    lead: "Umivaonik za ugradnju u kupatilo, prema rasporedu prostora i priključaka.",
    uses: ["Oprema kupatila", "Ugradnja uz odgovarajuću slavinu"]
  },
  {
    id: "wc-solja",
    program: "sanitarna-oprema",
    name: "WC šolja",
    spec: "Podna ili konzolna izvedba, priključak po upitu",
    unit: "kom",
    lead: "Sanitarni element za kupatilo koji se bira prema odvodu i načinu ugradnje.",
    uses: ["Oprema kupatila", "Zamjena postojeće WC šolje"]
  },
  {
    id: "tus-kada",
    program: "sanitarna-oprema",
    name: "Tuš kada",
    spec: "Dimenzije i oblik po upitu",
    unit: "kom",
    lead: "Tuš kada za uređenje tuš zone prema raspoloživom prostoru.",
    uses: ["Tuš zone u kupatilu", "Rekonstrukcija kupatila"]
  },
  {
    id: "kupatilska-slavina",
    program: "sanitarna-oprema",
    name: "Kupatilska slavina",
    spec: "Izvedba za umivaonik, završna obrada po upitu",
    unit: "kom",
    lead: "Slavina za umivaonik, izabrana prema priključcima i odabranom sanitarnom elementu.",
    uses: ["Ugradnja uz umivaonik", "Zamjena postojeće slavine"]
  },
  {
    id: "kupatilski-ormaric",
    program: "sanitarna-oprema",
    name: "Kupatilski ormarić",
    spec: "Širina i izvedba po upitu",
    unit: "kom",
    lead: "Ormarić za odlaganje u kupatilu, samostalno ili uz umivaonik prema odabranoj izvedbi.",
    uses: ["Oprema kupatila", "Odlaganje uz umivaonik"]
  }
];
