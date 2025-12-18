// Complete Kenya Counties and Sub-Counties Data
// New interface for Kenyan location data

export interface Road {
  id: number;
  name: string;
}

export interface SubEstate {
  id: number;
  name: string;
}

export interface Estate {
  id: number;
  name: string;
  subEstates?: SubEstate[];
}

export interface Town {
  id: number;
  name: string;
  estates?: Estate[];
  subEstates?: SubEstate[];
  roads?: Road[];
}

export interface LocationsData {
  towns: Town[];
}

export const HAIR_SERVICES = [
  "Girlfriend experience",
  "Dinner Date",
  "Trip partner",
  "Massage",
  "Lesbian Show",
  "Rimming",
  "Blow job",
  "3 Some",
];

export const ORIENTATIONS = [
  "Straight",
  "Lesbian",
  "Bisexual",
  "Transgender",
  "Asexual",
  "BDSM",
  "Gay",
];

export const KENYA_LOCATIONS: LocationsData[] = [
  {
    towns: [
      {
        id: 1,
        name: "Eldoret",
        estates: [
          {
            id: 101,
            name: "Elgon View",
            subEstates: [
              { id: 1, name: "Elgon View Phase 1" },
              { id: 2, name: "Elgon View Phase 2" },
            ],
          },
          {
            id: 102,
            name: "Pioneer Estate",
            subEstates: [
              { id: 1, name: "Pioneer West" },
              { id: 2, name: "Pioneer East" },
            ],
          },
          {
            id: 103,
            name: "Kapsoya",
            subEstates: [
              { id: 1, name: "Kapsoya Centre" },
              { id: 2, name: "Kapsoya Residential" },
            ],
          },
          {
            id: 104,
            name: "West Indies",
            subEstates: [
              { id: 1041, name: "Kapsoya Road" },
              { id: 1042, name: "Racecourse Area" },
              { id: 1043, name: "Kimumu" },
            ],
          },
          {
            id: 105,
            name: "Langas",
            subEstates: [
              { id: 1051, name: "Jasho Stage" },
              { id: 1052, name: "Lavington Area" },
              { id: 1053, name: "Kapseret Junction" },
              { id: 1054, name: "Arap Moi Street" },
            ],
          },
          {
            id: 106,
            name: "Mwanzo Estate",
            subEstates: [
              { id: 1061, name: "Mwanzo Stage" },
              { id: 1062, name: "Upper Mwanzo" },
              { id: 1063, name: "Lower Mwanzo" },
            ],
          },
          {
            id: 107,
            name: "Huruma Estate",
            subEstates: [
              { id: 1071, name: "Huruma Grounds" },
              { id: 1072, name: "Kambi Turkana" },
              { id: 1073, name: "Railways Area" },
            ],
          },
          {
            id: 110,
            name: "Kenmosa Village",
            subEstates: [
              { id: 1101, name: "Kenmosa Heights" },
              { id: 1102, name: "Kenmosa Valley" },
              { id: 1103, name: "Kenmosa Flats" },
            ],
          },
          {
            id: 111,
            name: "Hillside Estate",
            subEstates: [
              { id: 1111, name: "Upper Hillside" },
              { id: 1112, name: "Lower Hillside" },
              { id: 1113, name: "Hillside Plaza Area" },
            ],
          },
          {
            id: 112,
            name: "Rupa Village",
            subEstates: [
              { id: 1121, name: "Rupa Upper" },
              { id: 1122, name: "Rupa Lower" },
              { id: 1123, name: "Rupa Shopping Centre" },
            ],
          },
        ],
      },
      {
        id: 2,
        name: "Kiambu",
        estates: [
          {
            id: 1,
            name: "Ruiru",
            subEstates: [
              { id: 201, name: "Membley Estate" },
              { id: 202, name: "Tatu City" },
              { id: 203, name: "Kamakis" },
              { id: 204, name: "Varsity Ville" },
              { id: 205, name: "Githurai 45" },
              { id: 206, name: "Kahawa Sukari" },
              { id: 207, name: "Githurai" },
              { id: 208, name: "Murera" },
              { id: 209, name: "Theta" },
            ],
          },
          {
            id: 2,
            name: "Gatundu North",
            subEstates: [
              { id: 201, name: "Kamwangi" },
              { id: 202, name: "Kairi" },
              { id: 203, name: "Makwa" },
              { id: 204, name: "Mang'u" },
            ],
          },
          {
            id: 3,
            name: "Gatundu South",
            subEstates: [
              { id: 301, name: "Kiamwangi" },
              { id: 302, name: "Mutomo" },
              { id: 303, name: "Ndarugo" },
              { id: 304, name: "Kiganjo" },
            ],
          },
          {
            id: 4,
            name: "Githunguri",
            subEstates: [
              { id: 401, name: "Githiga" },
              { id: 402, name: "Ikinu" },
              { id: 403, name: "Komothai" },
              { id: 404, name: "Ngewa" },
            ],
          },
          {
            id: 5,
            name: "Juja",
            subEstates: [
              { id: 501, name: "Juja Farm" },
              { id: 502, name: "Kalimoni" },
              { id: 503, name: "Marembo" },
              { id: 504, name: "Thiririka" },
            ],
          },
          {
            id: 6,
            name: "Kabete",
            subEstates: [
              { id: 601, name: "Uthiru" },
              { id: 602, name: "Wangige" },
              { id: 603, name: "Kikuyu Road" },
              { id: 604, name: "Nyathuna" },
            ],
          },
          {
            id: 7,
            name: "Kiambaa",
            subEstates: [
              { id: 701, name: "Ruaka" },
              { id: 702, name: "Banana" },
              { id: 703, name: "Ndenderu" },
              { id: 704, name: "Muchatha" },
            ],
          },
          {
            id: 8,
            name: "Kiambu",
            subEstates: [
              { id: 801, name: "Ting'ang'a" },
              { id: 802, name: "Kiamumbi" },
              { id: 803, name: "Ndumberi" },
              { id: 804, name: "Kanunga" },
            ],
          },
          {
            id: 9,
            name: "Kikuyu",
            subEstates: [
              { id: 901, name: "Zambezi" },
              { id: 902, name: "Sigona" },
              { id: 903, name: "Ondiri" },
              { id: 904, name: "Gikambura" },
            ],
          },
          {
            id: 10,
            name: "Lari",
            subEstates: [
              { id: 1001, name: "Nyambari" },
              { id: 1002, name: "Kinale" },
              { id: 1003, name: "Kimende" },
              { id: 1004, name: "Kagwe" },
            ],
          },
          {
            id: 11,
            name: "Limuru",
            subEstates: [
              { id: 1101, name: "Ngecha" },
              { id: 1102, name: "Tigoni" },
              { id: 1103, name: "Kabuku" },
              { id: 1104, name: "Murengeti" },
            ],
          },
          {
            id: 12,
            name: "Thika Town",
            subEstates: [
              { id: 1201, name: "Makongeni" },
              { id: 1202, name: "Landless" },
              { id: 1203, name: "Ngoingwa" },
              { id: 1204, name: "Kiganjo" },
            ],
          },
        ],
        roads: [],
      },
      {
        id: 3,
        name: "Meru Town",
        estates: [
          {
            id: 1,
            name: "Tigania East",
            subEstates: [
              { id: 101, name: "Muthara Market" },
              { id: 102, name: "Mikinduri" },
              { id: 103, name: "Kianjai" },
              { id: 104, name: "Mitunguu" },
            ],
          },
          {
            id: 2,
            name: "Tigania West",
            subEstates: [
              { id: 201, name: "Kianjai Market" },
              { id: 202, name: "Athwana" },
              { id: 203, name: "Uringu" },
              { id: 204, name: "Matabithi" },
            ],
          },
          {
            id: 3,
            name: "Igembe North",
            subEstates: [
              { id: 301, name: "Maua Town" },
              { id: 302, name: "Mutuati" },
              { id: 303, name: "Laare" },
              { id: 304, name: "Kangeta" },
            ],
          },
          {
            id: 4,
            name: "Igembe South",
            subEstates: [
              { id: 401, name: "Mikinduri" },
              { id: 402, name: "Athiru Gaiti" },
              { id: 403, name: "Amwathi" },
              { id: 404, name: "Akachiu" },
            ],
          },
          {
            id: 5,
            name: "North Imenti",
            subEstates: [
              { id: 501, name: "Meru Town" },
              { id: 502, name: "Makutano" },
              { id: 503, name: "Kaaga" },
              { id: 504, name: "Nkoune" },
            ],
          },
          {
            id: 6,
            name: "South Imenti",
            subEstates: [
              { id: 601, name: "Nkubu Town" },
              { id: 602, name: "Kanyakine" },
              { id: 603, name: "Mitunguu" },
              { id: 604, name: "Nceke" },
            ],
          },
          {
            id: 7,
            name: "Buuri",
            subEstates: [
              { id: 701, name: "Timau Town" },
              { id: 702, name: "Kiirua" },
              { id: 703, name: "Ruiri" },
              { id: 704, name: "Kibirichia" },
            ],
          },
          {
            id: 8,
            name: "Central Imenti",
            subEstates: [
              { id: 801, name: "Kaongo" },
              { id: 802, name: "Kithirune" },
              { id: 803, name: "Gitimbine" },
              { id: 804, name: "Nthimbiri" },
            ],
          },
          {
            id: 9,
            name: "Igembe Central",
            subEstates: [
              { id: 901, name: "Maua Bypass" },
              { id: 902, name: "Antuambui" },
              { id: 903, name: "Njia" },
              { id: 904, name: "Kangeta North" },
            ],
          },
        ],
      },
      {
        id: 4,
        name: "Nanyuki",
        estates: [
          {
            id: 1,
            name: "Nanyuki",
            subEstates: [
              { id: 101, name: "Nanyuki CBD" },
              { id: 102, name: "Majengo" },
              { id: 103, name: "Muthaiga Estate" },
              { id: 104, name: "Thingithu Area" },
              { id: 105, name: "Airstrip Area" },
            ],
          },
          {
            id: 2,
            name: "Tigithi",
            subEstates: [
              { id: 201, name: "Matanya" },
              { id: 202, name: "Wiyumiririe" },
              { id: 203, name: "Naibor" },
              { id: 204, name: "Mumui" },
            ],
          },
          {
            id: 3,
            name: "Umande",
            subEstates: [
              { id: 301, name: "Mwireri" },
              { id: 302, name: "Muramati" },
              { id: 303, name: "Kiboya" },
              { id: 304, name: "Karaba" },
            ],
          },
          {
            id: 4,
            name: "Ngobit",
            subEstates: [
              { id: 401, name: "Ngobit Centre" },
              { id: 402, name: "Manguo" },
              { id: 403, name: "Ndunyu" },
              { id: 404, name: "Muthaiga Ndogo" },
            ],
          },
          {
            id: 5,
            name: "Thingithu",
            subEstates: [
              { id: 501, name: "Thingithu Market" },
              { id: 502, name: "Nturukuma" },
              { id: 503, name: "Ruring’u" },
              { id: 504, name: "Buuri Border" },
            ],
          },
        ],
      },
      {
        id: 5,
        name: "Naivasha",
        estates: [
          {
            id: 1,
            name: "Mai Mahiu",
            subEstates: [
              { id: 101, name: "Mai Mahiu Town" },
              { id: 102, name: "Satellite" },
              { id: 103, name: "Karima" },
              { id: 104, name: "Longonot" },
            ],
          },
          {
            id: 2,
            name: "Olkaria",
            subEstates: [
              { id: 201, name: "Olkaria Village" },
              { id: 202, name: "KenGen Staff Quarters" },
              { id: 203, name: "Suswa" },
              { id: 204, name: "Moi Ndabi" },
            ],
          },
          {
            id: 3,
            name: "Viwandani",
            subEstates: [
              { id: 301, name: "Industrial Area" },
              { id: 302, name: "Pipeline" },
              { id: 303, name: "Kabati" },
              { id: 304, name: "Kenyatta Estate" },
            ],
          },
          {
            id: 4,
            name: "Naivasha East",
            subEstates: [
              { id: 401, name: "Karagita" },
              { id: 402, name: "Kayole Estate" },
              { id: 403, name: "Kinamba" },
              { id: 404, name: "Ndabibi" },
            ],
          },
          {
            id: 5,
            name: "Lake View",
            subEstates: [
              { id: 501, name: "Lake View Estate" },
              { id: 502, name: "Moi Ndabi Area" },
              { id: 503, name: "Unity" },
              { id: 504, name: "Kabati Estate" },
            ],
          },
          {
            id: 6,
            name: "Biashara",
            subEstates: [
              { id: 601, name: "Naivasha CBD" },
              { id: 602, name: "Kenyatta Avenue" },
              { id: 603, name: "Kariuki Chotara Road" },
              { id: 604, name: "Hospital Area" },
            ],
          },
          {
            id: 7,
            name: "Maela",
            subEstates: [
              { id: 701, name: "Maela Centre" },
              { id: 702, name: "Shalom" },
              { id: 703, name: "Maela Slopes" },
              { id: 704, name: "Lake Naivasha Area" },
            ],
          },
          {
            id: 8,
            name: "Hells Gate",
            subEstates: [
              { id: 801, name: "Elsamere" },
              { id: 802, name: "Kongoni" },
              { id: 803, name: "Moi Ndabi South" },
              { id: 804, name: "Fisherman Area" },
            ],
          },
        ],
      },
      {
        id: 6,
        name: "Mombasa",
        estates: [
          {
            id: 1,
            name: "Changamwe",
            subEstates: [
              { id: 101, name: "Port Reitz" },
              { id: 102, name: "Mikindani" },
              { id: 103, name: "Kipevu" },
              { id: 104, name: "Chaani" },
            ],
          },
          {
            id: 2,
            name: "Jomvu",
            subEstates: [
              { id: 201, name: "Miritini" },
              { id: 202, name: "Magongo" },
              { id: 203, name: "Bangladesh Area" },
              { id: 204, name: "Mikindani East" },
            ],
          },
          {
            id: 3,
            name: "Kisauni",
            subEstates: [
              { id: 301, name: "Bamburi" },
              { id: 302, name: "Utange" },
              { id: 303, name: "Mjambere" },
              { id: 304, name: "Mwandoni" },
              { id: 305, name: "Vikwatani" },
            ],
          },
          {
            id: 4,
            name: "Mvita",
            subEstates: [
              { id: 401, name: "Old Town" },
              { id: 402, name: "Tudor" },
              { id: 403, name: "Makadara" },
              { id: 404, name: "Tononoka" },
              { id: 405, name: "Ganjoni" },
            ],
          },
          {
            id: 5,
            name: "Nyali",
            subEstates: [
              { id: 501, name: "Kongowea" },
              { id: 502, name: "Mkomani" },
              { id: 503, name: "English Point" },
              { id: 504, name: "Nyali Bridge Area" },
              { id: 505, name: "Vescon" },
            ],
          },
        ],
      },
      {
        id: 7,
        name: "Kisumu",
        estates: [
          {
            id: 1,
            name: "Kisumu Central",
            subEstates: [
              { id: 101, name: "Milimani" },
              { id: 102, name: "Tom Mboya Estate" },
              { id: 103, name: "Nyalenda" },
              { id: 104, name: "Manyatta" },
              { id: 105, name: "Kondele" },
              { id: 106, name: "Obunga" },
              { id: 107, name: "Robert Ouko Estate" },
            ],
          },
          {
            id: 2,
            name: "Kisumu East",
            subEstates: [
              { id: 201, name: "Mamboleo" },
              { id: 202, name: "Nyamasaria" },
              { id: 203, name: "Riat Hills" },
              { id: 204, name: "Buoye" },
              { id: 205, name: "Chiga" },
            ],
          },
          {
            id: 3,
            name: "Kisumu West",
            subEstates: [
              { id: 301, name: "Otonglo" },
              { id: 302, name: "Ojolla" },
              { id: 303, name: "Maseno" },
              { id: 304, name: "Holo" },
              { id: 305, name: "Riat" },
            ],
          },
          {
            id: 4,
            name: "Seme",
            subEstates: [
              { id: 401, name: "Holo Market" },
              { id: 402, name: "Akado" },
              { id: 403, name: "Kit Mikayi" },
              { id: 404, name: "Nyahera" },
            ],
          },
          {
            id: 5,
            name: "Muhoroni",
            subEstates: [
              { id: 501, name: "Chemelil" },
              { id: 502, name: "Koru" },
              { id: 503, name: "Fort Ternan" },
              { id: 504, name: "Muhoroni Township" },
            ],
          },
          {
            id: 6,
            name: "Nyando",
            subEstates: [
              { id: 601, name: "Ahero" },
              { id: 602, name: "Awasi" },
              { id: 603, name: "Katito" },
              { id: 604, name: "Kibigori" },
            ],
          },
          {
            id: 7,
            name: "Nyakach",
            subEstates: [
              { id: 701, name: "Pap Onditi" },
              { id: 702, name: "Sondu" },
              { id: 703, name: "West Nyakach" },
              { id: 704, name: "South Nyakach" },
            ],
          },
        ],
      },
      {
        id: 8,
        name: "Ukunda-Diani",
        estates: [
          {
            id: 1,
            name: "Diani Beach",
            subEstates: [
              { id: 101, name: "Diani Centre" },
              { id: 102, name: "Galu Beach" },
              { id: 103, name: "Kinondo" },
              { id: 104, name: "Jadini" },
            ],
          },
          {
            id: 2,
            name: "Ukunda Town",
            subEstates: [
              { id: 201, name: "Ukunda Centre" },
              { id: 202, name: "Ukunda South" },
              { id: 203, name: "Nanyumbu Estate" },
            ],
          },
          {
            id: 3,
            name: "Makongeni",
            subEstates: [
              { id: 301, name: "Makongeni Estate" },
              { id: 302, name: "Maridi" },
              { id: 303, name: "Mwachuma" },
            ],
          },
        ],
      },
      {
        id: 9,
        name: "Malindi",
        estates: [
          {
            id: 1,
            name: "Malindi Town",
            subEstates: [
              { id: 101, name: "Malindi Beach" },
              { id: 102, name: "Malindi Centre" },
              { id: 103, name: "Lamu Road" },
              { id: 104, name: "Shella Drive" },
            ],
          },
          {
            id: 2,
            name: "Mama Ngina Drive",
            subEstates: [
              { id: 201, name: "Tourist Beach" },
              { id: 202, name: "Waterfront Estate" },
              { id: 203, name: "Palace Road" },
            ],
          },
          {
            id: 3,
            name: "Silversands",
            subEstates: [
              { id: 301, name: "Silversands North" },
              { id: 302, name: "Silversands South" },
              { id: 303, name: "Silversands Estate" },
            ],
          },
          {
            id: 4,
            name: "Casuarina",
            subEstates: [
              { id: 401, name: "Casuarina North" },
              { id: 402, name: "Casuarina South" },
              { id: 403, name: "Casuarina Centre" },
            ],
          },
        ],
      },
      {
        id: 10,
        name: "Mtwapa",
        estates: [
          {
            id: 1,
            name: "Mtwapa Town",
            subEstates: [
              { id: 101, name: "Mtwapa Centre" },
              { id: 102, name: "Mtwapa Beach" },
              { id: 103, name: "Mtwapa South" },
            ],
          },
          {
            id: 2,
            name: "Shanzu",
            subEstates: [
              { id: 201, name: "Shanzu Estate" },
              { id: 202, name: "Shanzu North" },
              { id: 203, name: "Shanzu Beach" },
            ],
          },
          {
            id: 3,
            name: "Maisonette",
            subEstates: [
              { id: 301, name: "Maisonette Estate" },
              { id: 302, name: "Maisonette North" },
              { id: 303, name: "Maisonette South" },
            ],
          },
        ],
      },
      {
        id: 11,
        name: "Kilifi",
        estates: [
          {
            id: 1,
            name: "Kilifi Town",
            subEstates: [
              { id: 101, name: "Kilifi Centre" },
              { id: 102, name: "Kilifi Beach" },
              { id: 103, name: "Shimo la Tewa" },
            ],
          },
          {
            id: 2,
            name: "Takaungu",
            subEstates: [
              { id: 201, name: "Takaungu Estate" },
              { id: 202, name: "Takaungu North" },
              { id: 203, name: "Takaungu South" },
            ],
          },
          {
            id: 3,
            name: "Tezo",
            subEstates: [
              { id: 301, name: "Tezo Estate" },
              { id: 302, name: "Tezo North" },
              { id: 303, name: "Tezo Beach" },
            ],
          },
          {
            id: 4,
            name: "Watamu",
            subEstates: [
              { id: 401, name: "Watamu Centre" },
              { id: 402, name: "Watamu Beach" },
              { id: 403, name: "Hemingway Estate" },
            ],
          },
        ],
      },

      {
        id: 12,
        name: "Nakuru",
        estates: [
          {
            id: 1,
            name: "Nakuru Town East",
            subEstates: [
              { id: 101, name: "Section 58" },
              { id: 102, name: "Kivumbini" },
              { id: 103, name: "Bondeni" },
              { id: 104, name: "Rhonda" },
              { id: 105, name: "Lake View" },
            ],
          },
          {
            id: 2,
            name: "Nakuru Town West",
            subEstates: [
              { id: 201, name: "Kaptembwo" },
              { id: 202, name: "London Estate" },
              { id: 203, name: "Shabaab" },
              { id: 204, name: "Free Area" },
              { id: 205, name: "Ponda Mali" },
            ],
          },
          {
            id: 3,
            name: "Naivasha",
            subEstates: [
              { id: 301, name: "Kayole Naivasha" },
              { id: 302, name: "Karagita" },
              { id: 303, name: "Maella" },
              { id: 304, name: "Moi Ndabi" },
            ],
          },
          {
            id: 4,
            name: "Molo",
            subEstates: [
              { id: 401, name: "Elburgon" },
              { id: 402, name: "Keringet" },
              { id: 403, name: "Turi" },
            ],
          },
          {
            id: 5,
            name: "Gilgil",
            subEstates: [
              { id: 501, name: "Elementaita" },
              { id: 502, name: "Eburu" },
              { id: 503, name: "Kasambara" },
            ],
          },
        ],
      },
      {
        id: 9,
        name: "Kericho",
        estates: [
          {
            id: 1,
            name: "Kericho Town",
            subEstates: [
              { id: 101, name: "Kapsoit" },
              { id: 102, name: "Kipchimchim" },
              { id: 103, name: "Kabianga" },
              { id: 104, name: "Brooke" },
            ],
          },
          {
            id: 2,
            name: "Litein",
            subEstates: [
              { id: 201, name: "Kapkatet" },
              { id: 202, name: "Sosiot" },
              { id: 203, name: "Chemoiben" },
            ],
          },
          {
            id: 3,
            name: "Londiani",
            subEstates: [
              { id: 301, name: "Kedowa" },
              { id: 302, name: "Kimasian" },
              { id: 303, name: "Tendeno" },
            ],
          },
        ],
      },
      {
        id: 10,
        name: "Nyeri",
        estates: [
          {
            id: 1,
            name: "Nyeri Town",
            subEstates: [
              { id: 101, name: "Kangemi" },
              { id: 102, name: "Ruring’u" },
              { id: 103, name: "Skuta" },
              { id: 104, name: "Nyaribo" },
            ],
          },
          {
            id: 2,
            name: "Othaya",
            subEstates: [
              { id: 201, name: "Gichiche" },
              { id: 202, name: "Ihururu" },
              { id: 203, name: "Karima" },
            ],
          },
          {
            id: 3,
            name: "Mukuroini",
            subEstates: [
              { id: 301, name: "Kihiu Mwiri" },
              { id: 302, name: "Gatitu" },
              { id: 303, name: "Kamakwa" },
            ],
          },
        ],
      },
      {
        id: 11,
        name: "Embu",
        estates: [
          {
            id: 1,
            name: "Embu Town",
            subEstates: [
              { id: 101, name: "Dallas" },
              { id: 102, name: "Blue Valley" },
              { id: 103, name: "Shauri" },
              { id: 104, name: "Kangaru" },
            ],
          },
          {
            id: 2,
            name: "Runyenjes",
            subEstates: [
              { id: 201, name: "Karurumo" },
              { id: 202, name: "Manyatta" },
              { id: 203, name: "Kianjokoma" },
            ],
          },
          {
            id: 3,
            name: "Siakago",
            subEstates: [
              { id: 301, name: "Mavuria" },
              { id: 302, name: "Nthagaiya" },
              { id: 303, name: "Kanyuambora" },
            ],
          },
        ],
      },
      {
        id: 12,
        name: "Machakos",
        estates: [
          {
            id: 1,
            name: "Machakos Town",
            subEstates: [
              { id: 101, name: "Katoloni" },
              { id: 102, name: "Mulolongo" },
              { id: 103, name: "Mua Hills" },
              { id: 104, name: "Kathiani" },
            ],
          },
          {
            id: 2,
            name: "Kangundo",
            subEstates: [
              { id: 201, name: "Matungulu" },
              { id: 202, name: "Koma Hill" },
              { id: 203, name: "Misyani" },
            ],
          },
          {
            id: 3,
            name: "Mwala",
            subEstates: [
              { id: 301, name: "Masii" },
              { id: 302, name: "Wamunyu" },
              { id: 303, name: "Mbiuni" },
            ],
          },
        ],
      },
      {
        id: 13,
        name: "Garissa",
        estates: [
          {
            id: 1,
            name: "Garissa Town",
            subEstates: [
              { id: 101, name: "Bula Punda" },
              { id: 102, name: "Bula Mzuri" },
              { id: 103, name: "Sankuri" },
              { id: 104, name: "Tana Riverine" },
            ],
          },
          {
            id: 2,
            name: "Madogo",
            subEstates: [
              { id: 201, name: "Madogo Central" },
              { id: 202, name: "Mororo" },
              { id: 203, name: "Sala" },
            ],
          },
          {
            id: 3,
            name: "Balambala",
            subEstates: [
              { id: 301, name: "Modika" },
              { id: 302, name: "Abdisamit" },
              { id: 303, name: "Danyere" },
            ],
          },
        ],
      },
      {
        id: 14,
        name: "Kakamega",
        estates: [
          {
            id: 1,
            name: "Kakamega Town",
            subEstates: [
              { id: 101, name: "Lurambi" },
              { id: 102, name: "Shieywe" },
              { id: 103, name: "Milimani Estate" },
              { id: 104, name: "Mumias Road" },
            ],
          },
          {
            id: 2,
            name: "Mumias",
            subEstates: [
              { id: 201, name: "Shibale" },
              { id: 202, name: "Lusheya" },
              { id: 203, name: "Ekero" },
            ],
          },
          {
            id: 3,
            name: "Malava",
            subEstates: [
              { id: 301, name: "Butali" },
              { id: 302, name: "Shirugu" },
              { id: 303, name: "Kabras" },
            ],
          },
        ],
      },
      {
        id: 15,
        name: "Kisii",
        estates: [
          {
            id: 1,
            name: "Kisii Town",
            subEstates: [
              { id: 101, name: "Daraja Mbili" },
              { id: 102, name: "Mwembe" },
              { id: 103, name: "Jogoo" },
              { id: 104, name: "Nyanchwa" },
            ],
          },
          {
            id: 2,
            name: "Ogembo",
            subEstates: [
              { id: 201, name: "Nyamache" },
              { id: 202, name: "Sameta" },
              { id: 203, name: "Igare" },
            ],
          },
          {
            id: 3,
            name: "Suneka",
            subEstates: [
              { id: 301, name: "Tabaka" },
              { id: 302, name: "Riana" },
              { id: 303, name: "Bomorenda" },
            ],
          },
        ],
      },
      {
        id: 16,
        name: "Kitale",
        estates: [
          {
            id: 1,
            name: "Kitale Town",
            subEstates: [
              { id: 101, name: "Milimani" },
              { id: 102, name: "Matisi" },
              { id: 103, name: "Shanti" },
              { id: 104, name: "Koitogos" },
            ],
          },
          {
            id: 2,
            name: "Endebess",
            subEstates: [
              { id: 201, name: "Chepchoina" },
              { id: 202, name: "Chorlim" },
              { id: 203, name: "Matumbei" },
            ],
          },
          {
            id: 3,
            name: "Kwanza",
            subEstates: [
              { id: 301, name: "Kapomboi" },
              { id: 302, name: "Keiyo" },
              { id: 303, name: "Makutano" },
            ],
          },
        ],
      },
      {
        id: 17,
        name: "Thika",
        estates: [
          {
            id: 1,
            name: "Thika Town",
            subEstates: [
              { id: 101, name: "Biafra" },
              { id: 102, name: "Makongeni" },
              { id: 103, name: "Landless" },
              { id: 104, name: "Kiganjo" },
            ],
          },
          {
            id: 2,
            name: "Ruiru",
            subEstates: [
              { id: 201, name: "Membley" },
              { id: 202, name: "Githurai" },
              { id: 203, name: "Kahawa Sukari" },
              { id: 204, name: "Kahawa Wendani" },
            ],
          },
          {
            id: 3,
            name: "Juja",
            subEstates: [
              { id: 301, name: "Kalimoni" },
              { id: 302, name: "Muthaiga" },
              { id: 303, name: "Weitethie" },
            ],
          },
        ],
      },
      {
        id: 18,
        name: "Kerugoya",
        estates: [
          {
            id: 1,
            name: "Kerugoya Town",
            subEstates: [
              { id: 101, name: "Kutus" },
              { id: 102, name: "Ngurubani" },
              { id: 103, name: "Kagio" },
              { id: 104, name: "Kianyaga" },
            ],
          },
          {
            id: 2,
            name: "Mutira",
            subEstates: [
              { id: 201, name: "Kiamutugu" },
              { id: 202, name: "Mutithi" },
              { id: 203, name: "Kibingoti" },
            ],
          },
          {
            id: 3,
            name: "Mwea",
            subEstates: [
              { id: 301, name: "Thiba" },
              { id: 302, name: "Wamumu" },
              { id: 303, name: "Nguka" },
            ],
          },
        ],
      },
      {
        id: 19,
        name: "Lodwar",
        estates: [
          {
            id: 1,
            name: "Lodwar Town",
            subEstates: [
              { id: 101, name: "Kanamkemer" },
              { id: 102, name: "Kalokol Road" },
              { id: 103, name: "Kerio" },
              { id: 104, name: "Kawalathe" },
            ],
          },
          {
            id: 2,
            name: "Kalokol",
            subEstates: [
              { id: 201, name: "Napuu" },
              { id: 202, name: "Nakalale" },
              { id: 203, name: "Kachoda" },
            ],
          },
          {
            id: 3,
            name: "Kibish",
            subEstates: [
              { id: 301, name: "Lokitaung" },
              { id: 302, name: "Napeikar" },
              { id: 303, name: "Letea" },
            ],
          },
        ],
      },
      {
        id: 20,
        name: "Isiolo",
        estates: [
          {
            id: 1,
            name: "Isiolo Town",
            subEstates: [
              { id: 101, name: "Kambi Garba" },
              { id: 102, name: "Bulapesa" },
              { id: 103, name: "Kiwanjani" },
              { id: 104, name: "Kulamawe" },
            ],
          },
          {
            id: 2,
            name: "Merti",
            subEstates: [
              { id: 201, name: "Bulesa" },
              { id: 202, name: "Chari" },
              { id: 203, name: "Kom" },
            ],
          },
          {
            id: 3,
            name: "Garbatulla",
            subEstates: [
              { id: 301, name: "Kinna" },
              { id: 302, name: "Sericho" },
              { id: 303, name: "Korondille" },
            ],
          },
        ],
      },
      {
        id: 21,
        name: "Marsabit",
        estates: [
          {
            id: 1,
            name: "Marsabit Town",
            subEstates: [
              { id: 101, name: "Dakabaricha" },
              { id: 102, name: "Manyatta Jillo" },
              { id: 103, name: "Sagante" },
              { id: 104, name: "Mountain View" },
            ],
          },
          {
            id: 2,
            name: "Moyale",
            subEstates: [
              { id: 201, name: "Sololo" },
              { id: 202, name: "Odda" },
              { id: 203, name: "Butiye" },
            ],
          },
          {
            id: 3,
            name: "Laisamis",
            subEstates: [
              { id: 301, name: "Kargi" },
              { id: 302, name: "Ngurunit" },
              { id: 303, name: "Loiyangalani" },
            ],
          },
        ],
      },
      {
        id: 22,
        name: "Narok",
        estates: [
          {
            id: 1,
            name: "Narok Town",
            subEstates: [
              { id: 101, name: "Majengo" },
              { id: 102, name: "Olerai" },
              { id: 103, name: "Olorropil" },
              { id: 104, name: "Lenkisem" },
            ],
          },
          {
            id: 2,
            name: "Kilgoris",
            subEstates: [
              { id: 201, name: "Shankoe" },
              { id: 202, name: "Olmelil" },
              { id: 203, name: "Kapsasian" },
            ],
          },
          {
            id: 3,
            name: "Suswa",
            subEstates: [
              { id: 301, name: "Ntulele" },
              { id: 302, name: "Maasai Mara" },
              { id: 303, name: "Ololulunga" },
            ],
          },
        ],
      },
      {
        id: 28,
        name: "Bomet",
        estates: [
          {
            id: 1,
            name: "Bomet Town",
            subEstates: [
              { id: 101, name: "Kaplong" },
              { id: 102, name: "Silibwet" },
              { id: 103, name: "Mutarakwa" },
              { id: 104, name: "Chepng’aina" },
            ],
          },
          {
            id: 2,
            name: "Sotik",
            subEstates: [
              { id: 201, name: "Kapkatet Border" },
              { id: 202, name: "Ndanai" },
              { id: 203, name: "Chemagel" },
            ],
          },
          {
            id: 3,
            name: "Longisa",
            subEstates: [
              { id: 301, name: "Sigor" },
              { id: 302, name: "Kapkoros" },
              { id: 303, name: "Chemaner" },
            ],
          },
        ],
      },
      {
        id: 30,
        name: "Bungoma",
        estates: [
          {
            id: 1,
            name: "Bungoma Town",
            subEstates: [
              { id: 101, name: "Kanduyi" },
              { id: 102, name: "Sango" },
              { id: 103, name: "Sikhendu" },
              { id: 104, name: "Mabanga" },
            ],
          },
          {
            id: 2,
            name: "Webuye",
            subEstates: [
              { id: 201, name: "Mihuu" },
              { id: 202, name: "Lugulu" },
              { id: 203, name: "Ndivisi" },
            ],
          },
          {
            id: 3,
            name: "Kimilili",
            subEstates: [
              { id: 301, name: "Kibingei" },
              { id: 302, name: "Kamukuywa" },
              { id: 303, name: "Malakisi Border" },
            ],
          },
        ],
      },

      {
        id: 32,
        name: "Nairobi",
        estates: [
          {
            id: 1,
            name: "Allsops",
          },
          {
            id: 2,
            name: "Athi River",
            subEstates: [
              { id: 1, name: "Athi River West" },
              { id: 2, name: "Katani" },
              { id: 3, name: "Kinanie/Mathani" },
              { id: 4, name: "Makadara" },
              { id: 5, name: "Muthwani" },
              { id: 6, name: "Sophia" }, // Athi River West, Katani, Kinanie/Mathani, Makadara, Muthwani, and Sophia
            ],
          },
          {
            id: 3,
            name: "Banana",
            subEstates: [
              { id: 1, name: "Githiga" },
              { id: 2, name: "Kibichiku" },
              { id: 3, name: "Kihara" }, // Githiga, Kibichiku, and Kihara
            ],
          },
          {
            id: 4,
            name: "Buru Buru",
            subEstates: [
              { id: 1, name: "Buruburu Phase 1" },
              { id: 2, name: "Buruburu Phase 2" },
              { id: 3, name: "Buruburu Phase 3" },
              { id: 4, name: "Buruburu Phase 4" },
              { id: 5, name: "Buruburu Phase 5" },
            ],
          },
          {
            id: 5,
            name: "Chokaa",
            subEstates: [
              { id: 1, name: "Kiiru" },
              { id: 2, name: "Thigio" },
            ],
          },
          {
            id: 6,
            name: "Dagoretti",
            subEstates: [
              { id: 1, name: "Mutu-ini" },
              { id: 2, name: "Ngando" },
              { id: 3, name: "Riruta" },
              { id: 4, name: "Uthiru/Ruthimitu" },
              { id: 5, name: "Waithaka" },
            ],
          },
          {
            id: 7,
            name: "Dandora",
            subEstates: [
              { id: 1, name: "Dandora Area I" },
              { id: 2, name: "Dandora Area II" },
              { id: 3, name: "Dandora Area III" },
              { id: 4, name: "Dandora Area IV/V" }, // Dandora Area I, Dandora Area II, Dandora Area III, and Dandora Area IV/V
            ],
          },
          {
            id: 8,
            name: "Donholm",
            subEstates: [
              { id: 1, name: "Old Donholm" },
              { id: 2, name: "New Donholm" },
              { id: 3, name: "Phase 5" },
            ],
          },
          {
            id: 9,
            name: "Eastlands",
            subEstates: [
              { id: 1, name: "Savannah" },
              { id: 2, name: "Greenfield" },
              { id: 3, name: "Jacaranda" },
            ],
          },
          {
            id: 10,
            name: "Eastleigh",
            subEstates: [
              { id: 1, name: "Eastleigh Section I" },
              { id: 2, name: "Eastleigh Section II" },
              { id: 3, name: "Eastleigh Section III" },
            ],
          },
          {
            id: 11,
            name: "Embakasi",
            subEstates: [
              { id: 1, name: "Pipeline" },
              { id: 2, name: "Tassia" },
              { id: 3, name: "Fedha Estate" },
              { id: 4, name: "Nyayo Estate" },
            ],
          },
          {
            id: 12,
            name: "Garden City",
            subEstates: [{ id: 1, name: "Garden City Residences" }],
          },
          {
            id: 13,
            name: "Githurai 44",
            subEstates: [
              { id: 1, name: "Mwihoko" },
              { id: 2, name: "Kahawa Wendani Extension" },
            ],
          },
          {
            id: 14,
            name: "Githurai 45",
            subEstates: [
              { id: 1, name: "Kahawa Sukari Border" },
              { id: 2, name: "Kahawa Kimbo" },
            ],
          },
          {
            id: 15,
            name: "Homeland",
            subEstates: [
              { id: 1, name: "Homeland Phase 1" },
              { id: 2, name: "Homeland Phase 2" },
            ],
          },
          {
            id: 16,
            name: "Hurlingham",
            subEstates: [
              { id: 1, name: "Argwings Kodhek" },
              { id: 2, name: "Ring Road Hurlingham" },
            ],
          },
          {
            id: 17,
            name: "Huruma",
            subEstates: [
              { id: 1, name: "Huruma Ngei" },
              { id: 2, name: "Huruma Village" },
              { id: 3, name: "Kiamaiko" },
            ],
          },
          {
            id: 18,
            name: "Imara Daima",
            subEstates: [
              { id: 1, name: "Villa Franca" },
              { id: 2, name: "AA Estate" },
              { id: 3, name: "Imara Estate" },
            ],
          },
          {
            id: 19,
            name: "Jamhuri",
            subEstates: [
              { id: 1, name: "Jamhuri Phase 1" },
              { id: 2, name: "Jamhuri Phase 2" },
            ],
          },
          {
            id: 20,
            name: "Joska",
            subEstates: [
              { id: 1, name: "Kamulu Border" },
              { id: 2, name: "Malaa Junction" },
            ],
          },
          {
            id: 21,
            name: "Juja",
            subEstates: [
              { id: 1, name: "Juja South Estate" },
              { id: 2, name: "Juja Farm" },
              { id: 3, name: "Kalimoni" },
            ],
          },
          {
            id: 22,
            name: "Kabete",
            subEstates: [
              { id: 1, name: "Lower Kabete" },
              { id: 2, name: "Upper Kabete" },
            ],
          },
          {
            id: 23,
            name: "Kahawa Sukari",
            subEstates: [
              { id: 1, name: "Kahawa Sukari Avenue" },
              { id: 2, name: "Kahawa Sukari South" },
            ],
          },
          {
            id: 24,
            name: "Kahawa Wendani",
            subEstates: [
              { id: 1, name: "Kahawa Wendani Stage" },
              { id: 2, name: "Kahawa Heights" },
            ],
          },
          {
            id: 25,
            name: "Kahawa West",
            subEstates: [
              { id: 1, name: "Kamiti Corner" },
              { id: 2, name: "Zimmerman" },
            ],
          },
          {
            id: 26,
            name: "Kamulu",
            subEstates: [
              { id: 1, name: "Kamulu Town" },
              { id: 2, name: "Joska Border" },
            ],
          },
          {
            id: 27,
            name: "Kangemi",
            subEstates: [
              { id: 1, name: "Wanyee" },
              { id: 2, name: "Kangemi Central" },
            ],
          },
          {
            id: 28,
            name: "Karen",
            subEstates: [
              { id: 1, name: "Hardy" },
              { id: 2, name: "Miotoni" },
              { id: 3, name: "Ngong View" },
            ],
          },

          {
            id: 29,
            name: "Kariobangi",
            subEstates: [
              { id: 1, name: "Kariobangi North" },
              { id: 2, name: "Kariobangi South" },
              { id: 3, name: "Kariobangi Light Industries" },
            ],
          },
          {
            id: 30,
            name: "Kasarani",
            subEstates: [
              { id: 1, name: "Sunton" },
              { id: 2, name: "Mwiki" },
              { id: 3, name: "Clay City" },
              { id: 4, name: "Sportsview" },
            ],
          },
          {
            id: 31,
            name: "Kawangware",
            subEstates: [
              { id: 1, name: "Stage 2" },
              { id: 2, name: "Gatina" },
              { id: 3, name: "Riruta Satellite" },
            ],
          },
          {
            id: 32,
            name: "Kayole",
            subEstates: [
              { id: 1, name: "Kayole North" },
              { id: 2, name: "Kayole South" },
              { id: 3, name: "Masimba" },
              { id: 4, name: "Matopeni" },
            ],
          },
          {
            id: 33,
            name: "Kenyatta Road",
            subEstates: [
              { id: 1, name: "Kenyatta Road Estate" },
              { id: 2, name: "Njiru Area" },
            ],
          },
          {
            id: 34,
            name: "Kibera",
            subEstates: [
              { id: 1, name: "Laini Saba" },
              { id: 2, name: "Makina" },
              { id: 3, name: "Kisumu Ndogo" },
              { id: 4, name: "Soweto East" },
              { id: 5, name: "Gatwekera" },
            ],
          },
          {
            id: 35,
            name: "Kikuyu",
            subEstates: [
              { id: 1, name: "Zambezi" },
              { id: 2, name: "Ondiri" },
              { id: 3, name: "Thogoto" },
              { id: 4, name: "Kikuyu Town" },
            ],
          },
          {
            id: 36,
            name: "Kileleshwa",
            subEstates: [
              { id: 1, name: "Kileleshwa North" },
              { id: 2, name: "Kileleshwa South" },
            ],
          },
          {
            id: 37,
            name: "Kilimani",
            subEstates: [
              { id: 1, name: "Kilimani East" },
              { id: 2, name: "Kilimani West" },
            ],
          },
          {
            id: 38,
            name: "Kitengela",
            subEstates: [
              { id: 1, name: "New Valley" },
              { id: 2, name: "Milimani" },
              { id: 3, name: "Acacia" },
              { id: 4, name: "Kapalanga" },
            ],
          },
          {
            id: 39,
            name: "Kitisuru",
            subEstates: [
              { id: 1, name: "Lower Kitisuru" },
              { id: 2, name: "New Kitisuru" },
            ],
          },
          {
            id: 40,
            name: "Komarock",
            subEstates: [
              { id: 1, name: "Komarock Phase 1" },
              { id: 2, name: "Komarock Phase 2" },
              { id: 3, name: "Komarock Phase 3" },
            ],
          },
          {
            id: 41,
            name: "Langata",
            subEstates: [
              { id: 1, name: "Southlands" },
              { id: 2, name: "Onyonka Estate" },
              { id: 3, name: "Otiende" },
              { id: 4, name: "Nairobi West Prison Area" },
            ],
          },
          {
            id: 42,
            name: "Lavington",
            subEstates: [
              { id: 1, name: "James Gichuru Area" },
              { id: 2, name: "Hatheru Road Area" },
              { id: 3, name: "Muthangari" },
            ],
          },
          {
            id: 43,
            name: "Loresho",
            subEstates: [
              { id: 1, name: "Loresho Ridge" },
              { id: 2, name: "Old Loresho" },
            ],
          },
          {
            id: 44,
            name: "Madaraka",
            subEstates: [
              { id: 1, name: "Old Madaraka" },
              { id: 2, name: "New Madaraka" },
            ],
          },
          {
            id: 45,
            name: "Makadara",
            subEstates: [
              { id: 1, name: "Ofafa Jericho" },
              { id: 2, name: "Ofafa Maringo" },
              { id: 3, name: "Hamza" },
            ],
          },
          {
            id: 46,
            name: "Malaa",
            subEstates: [
              { id: 1, name: "Malaa Market Area" },
              { id: 2, name: "Koma Hill Area" },
            ],
          },
          {
            id: 47,
            name: "Mathare",
            subEstates: [
              { id: 1, name: "Mathare 4A" },
              { id: 2, name: "Mathare 4B" },
              { id: 3, name: "Mathare North" },
              { id: 4, name: "Bondeni" },
            ],
          },
          {
            id: 48,
            name: "Milimani",
            subEstates: [
              { id: 1, name: "Upper Milimani" },
              { id: 2, name: "Lower Milimani" },
            ],
          },
          {
            id: 49,
            name: "Mlolongo",
            subEstates: [
              { id: 1, name: "Mlolongo North" },
              { id: 2, name: "Mlolongo South" },
              { id: 3, name: "Sabaki" },
            ],
          },

          {
            id: 50,
            name: "Muthaiga",
            subEstates: [
              { id: 1, name: "Old Muthaiga" },
              { id: 2, name: "New Muthaiga" },
              { id: 3, name: "Muthaiga North" },
            ],
          },
          {
            id: 51,
            name: "Muthangari",
            subEstates: [
              { id: 1, name: "Muthangari Gardens" },
              { id: 2, name: "Muthangari Estate" },
            ],
          },
          {
            id: 52,
            name: "Muthurwa",
            subEstates: [
              { id: 1, name: "Muthurwa Market Area" },
              { id: 2, name: "Muthurwa Residential" },
            ],
          },
          {
            id: 53,
            name: "Mwiki",
            subEstates: [
              { id: 1, name: "Kasarani Mwiki" },
              { id: 2, name: "Githurai Mwiki" },
            ],
          },
          {
            id: 54,
            name: "Nairobi Town",
            subEstates: [
              { id: 1, name: "CBD" },
              { id: 2, name: "Industrial Area" },
              { id: 3, name: "Upper Hill" },
              { id: 4, name: "Westlands" },
            ],
          },
          {
            id: 55,
            name: "Nairobi West",
            subEstates: [
              { id: 1, name: "South C" },
              { id: 2, name: "South B" },
              { id: 3, name: "Wilson Area" },
            ],
          },
          {
            id: 56,
            name: "Ndenderu",
            subEstates: [
              { id: 1, name: "Ndenderu Market" },
              { id: 2, name: "Ndenderu North" },
            ],
          },
          {
            id: 57,
            name: "Ngara",
            subEstates: [
              { id: 1, name: "Ngara East" },
              { id: 2, name: "Ngara West" },
              { id: 3, name: "Fig Tree Area" },
            ],
          },
          {
            id: 58,
            name: "Ngong",
            subEstates: [
              { id: 1, name: "Ngong Town" },
              { id: 2, name: "Karen Ngong Border" },
              { id: 3, name: "Ngong Kibiku" },
            ],
          },
          {
            id: 59,
            name: "Ngumba",
            subEstates: [
              { id: 1, name: "Ngumba Estate Phase 1" },
              { id: 2, name: "Ngumba Estate Phase 2" },
            ],
          },
          {
            id: 60,
            name: "Njiru",
            subEstates: [
              { id: 1, name: "Njiru Market" },
              { id: 2, name: "Njiru Phase 2" },
              { id: 3, name: "Kwa Maji" },
            ],
          },
          {
            id: 61,
            name: "Ongata Rongai",
            subEstates: [
              { id: 1, name: "Kware" },
              { id: 2, name: "Kware Pipeline" },
              { id: 3, name: "Nkoroi" },
              { id: 4, name: "Maasai Lodge Area" },
              { id: 5, name: "Rimpa" },
            ],
          },
          {
            id: 62,
            name: "Pangani",
            subEstates: [
              { id: 1, name: "Pangani Estate" },
              { id: 2, name: "Pangani Police Area" },
            ],
          },
          {
            id: 63,
            name: "Parklands",
            subEstates: [
              { id: 1, name: "1st Parklands" },
              { id: 2, name: "2nd Parklands" },
              { id: 3, name: "3rd Parklands" },
              { id: 4, name: "4th Parklands" },
              { id: 5, name: "5th Parklands" },
            ],
          },
          {
            id: 64,
            name: "Roasters",
            subEstates: [
              { id: 1, name: "Roasters Area" },
              { id: 2, name: "Garden Estate Adjacent" },
            ],
          },
          {
            id: 65,
            name: "Roysambu",
            subEstates: [
              { id: 1, name: "TRM Drive" },
              { id: 2, name: "Zimmerman" },
              { id: 3, name: "Lumumba Drive" },
            ],
          },
          {
            id: 66,
            name: "Ruai",
            subEstates: [
              { id: 1, name: "Ruai Bypass" },
              { id: 2, name: "Ruai Central" },
              { id: 3, name: "Kamulu" },
            ],
          },
          {
            id: 67,
            name: "Ruaka",
            subEstates: [
              { id: 1, name: "Ruaka Market" },
              { id: 2, name: "Joyland" },
              { id: 3, name: "Quickmart Area" },
            ],
          },
          {
            id: 68,
            name: "Ruaraka",
            subEstates: [
              { id: 1, name: "Baba Dogo" },
              { id: 2, name: "Lucky Summer" },
              { id: 3, name: "Utalii" },
            ],
          },
          {
            id: 69,
            name: "Ruiru",
            subEstates: [
              { id: 1, name: "Membley" },
              { id: 2, name: "Gwa Kairu" },
              { id: 3, name: "Kamakis" },
              { id: 4, name: "Mwihoko" },
            ],
          },
          {
            id: 70,
            name: "Runda",
            subEstates: [
              { id: 1, name: "Old Runda" },
              { id: 2, name: "New Runda" },
              { id: 3, name: "Runda Evergreen" },
            ],
          },

          {
            id: 71,
            name: "Saika",
            subEstates: [
              { id: 1, name: "Saika Stage" },
              { id: 2, name: "Saika Estate Phase 1" },
              { id: 3, name: "Saika Estate Phase 2" },
            ],
          },
          {
            id: 72,
            name: "South B",
            subEstates: [
              { id: 1, name: "Hazina Estate" },
              { id: 2, name: "Golden Gate" },
              { id: 3, name: "Mariakani Estate" },
              { id: 4, name: "Kapiti Estate" },
            ],
          },
          {
            id: 73,
            name: "South C",
            subEstates: [
              { id: 1, name: "Akila Estate" },
              { id: 2, name: "Nextgen Area" },
              { id: 3, name: "Wilson Airport Area" },
              { id: 4, name: "Mugoya Estate" },
            ],
          },
          {
            id: 74,
            name: "Syokimau",
            subEstates: [
              { id: 1, name: "Gateway Mall Area" },
              { id: 2, name: "Katani" },
              { id: 3, name: "Sabaki" },
              { id: 4, name: "Mlolongo Border" },
            ],
          },
          {
            id: 75,
            name: "Thika",
            subEstates: [
              { id: 1, name: "Makongeni" },
              { id: 2, name: "Landless" },
              { id: 3, name: "Ziwani" },
              { id: 4, name: "Biafra" },
              { id: 5, name: "Kiganjo" },
            ],
          },
          {
            id: 76,
            name: "Thogoto",
            subEstates: [
              { id: 1, name: "Thogoto Trading Centre" },
              { id: 2, name: "Kikuyu Area" },
              { id: 3, name: "Thogoto Ridge" },
            ],
          },
          {
            id: 77,
            name: "Thome",
            subEstates: [
              { id: 1, name: "Thome 1" },
              { id: 2, name: "Thome 2" },
              { id: 3, name: "Thome 3" },
            ],
          },
          {
            id: 78,
            name: "Umoja",
            subEstates: [
              { id: 1, name: "Umoja 1" },
              { id: 2, name: "Umoja 2" },
              { id: 3, name: "Umoja Innercore" },
              { id: 4, name: "Umoja Tena" },
            ],
          },
          {
            id: 79,
            name: "Upper Hill",
            subEstates: [
              { id: 1, name: "Britam Towers Area" },
              { id: 2, name: "NHIF Area" },
              { id: 3, name: "Hill Park Area" },
            ],
          },
          {
            id: 80,
            name: "Utawala",
            subEstates: [
              { id: 1, name: "Utawala Junction" },
              { id: 2, name: "Utawala GSU Camp Area" },
              { id: 3, name: "Benedicta Area" },
            ],
          },
          {
            id: 81,
            name: "Uthiru",
            subEstates: [
              { id: 1, name: "Uthiru Market" },
              { id: 2, name: "Uthiru Gachie" },
              { id: 3, name: "Uthiru Central" },
            ],
          },
          {
            id: 82,
            name: "Westlands",
            subEstates: [
              { id: 1, name: "Sarit Centre Area" },
              { id: 2, name: "Chiromo" },
              { id: 3, name: "Raphta Road Area" },
              { id: 4, name: "Brookside" },
            ],
          },
        ],

        roads: [
          {
            id: 1,
            name: "James Gichuru Road",
          },
          {
            id: 2,
            name: "Southern Bypass",
          },
          {
            id: 3,
            name: "Gitanga Road",
          },
          {
            id: 4,
            name: "Naivasha Road",
          },
          {
            id: 5,
            name: "Northern Bypass",
          },
          {
            id: 6,
            name: "Eastern Bypass",
          },
          {
            id: 7,
            name: "Manyanja Rd",
          },
          {
            id: 8,
            name: "Waiyaki Way",
          },
          {
            id: 9,
            name: "Kiambu Road",
          },
          {
            id: 10,
            name: "Langata Road",
          },
          {
            id: 11,
            name: "Outering Road",
          },
          {
            id: 12,
            name: "Kangundo Road",
          },
          {
            id: 13,
            name: "Ngong Road",
          },
          {
            id: 14,
            name: "Kamiti Road",
          },
          {
            id: 15,
            name: "Jogoo Road",
          },
          {
            id: 16,
            name: "Mombasa Road",
          },
          {
            id: 17,
            name: "Thika Road",
          },
        ],
      },
    ],
  },
];
// Extract counties list
export const KENYA_TOWNS = KENYA_LOCATIONS.flatMap((loc: LocationsData) =>
  loc.towns.map((t: Town) => t.name)
).sort();

// Get all town names (same as above but wrapped as helper)
export const getTowns = (): string[] => {
  return KENYA_LOCATIONS.flatMap((loc: LocationsData) =>
    loc.towns.map((t: Town) => t.name)
  ).sort();
};

// Get estates for a specific town
export const getEstates = (townName: string): string[] => {
  const town = KENYA_LOCATIONS.flatMap((loc: LocationsData) => loc.towns).find(
    (t: Town) => t.name === townName
  );

  return town?.estates?.map((e: Estate) => e.name) || [];
};

// Get sub-estates for a specific town
export const getSubEstates = (townName: string): string[] => {
  const town = KENYA_LOCATIONS.flatMap((loc: LocationsData) => loc.towns).find(
    (t: Town) => t.name === townName
  );

  return town?.subEstates?.map((s: SubEstate) => s.name) || [];
};

// Get roads for a specific town
export const getRoads = (townName: string): string[] => {
  const town = KENYA_LOCATIONS.flatMap((loc: LocationsData) => loc.towns).find(
    (t: Town) => t.name === townName
  );

  return town?.roads?.map((r: Road) => r.name) || [];
};

// Get full town data
export const getTownData = (townName: string): Town | undefined => {
  return KENYA_LOCATIONS.flatMap((loc: LocationsData) => loc.towns).find(
    (t: Town) => t.name === townName
  );
};
