/* ==========================================================================
   DANIELS® — SITE CONTENT
   --------------------------------------------------------------------------
   Configuração oficial do portfólio DANIELS®.
   ========================================================================== */

window.SITE = {

  /* ------------------------------------------------------------------ */
  /*  PROFILE & LINKS                                                    */
  /* ------------------------------------------------------------------ */
  profile: {
    name: "DANIELS",
    tagline: "Creative · Audiovisual · Storytelling",
    email: "",
    linkedin: "",
    instagram: "https://www.instagram.com/daniells.png/",
    instagramHandle: "@daniells.png",
    cv: "",
    vimeo: "",
    youtube: ""
  },

  /* ------------------------------------------------------------------ */
  /*  HERO                                                               */
  /* ------------------------------------------------------------------ */
  hero: {
    video: {
      desktop: "",
      mobile: ""
    },
    poster: "assets/img/hero-still.jpg",
    posterAlt: "DANIELS — Cena cinematográfica ao anoitecer",
    focus: { desktop: "62% 50%", mobile: "79% 50%" },
    caption: "Ext. Coastal road — Dusk"
  },

  /* ------------------------------------------------------------------ */
  /*  ABOUT                                                              */
  /* ------------------------------------------------------------------ */
  about: {
    portrait: "", // Espaço para portrait oficial
    portraitAlt: "Portrait de Daniels",
    location: "Brasil",
    disciplines: ["Cinema", "Direção Audiovisual", "Edição & Montagem", "Design & Direção de Arte"],
    experience: [],
    skills: ["Direção Audiovisual", "Montagem e Edição de Vídeo", "Design de Pôster", "Direção de Arte", "Narrativa Visual"]
  },

  /* ------------------------------------------------------------------ */
  /*  ARTURUS                                                            */
  /* ------------------------------------------------------------------ */
  arturus: {
    image: "assets/img/arturus-still.jpg",
    imageAlt: "Sala de cinema escura com facho de projeção cortando a névoa sobre as poltronas de madeira.",
    website: "",
    instagram: ""
  },

  /* ------------------------------------------------------------------ */
  /*  FEATURED FILMS (Cinema showcase cinematográfico)                   */
  /*  Inspirado na referência de cinema/festival: vídeo imersivo,        */
  /*  título sobreposto, laureis/festivais à esquerda, metadata e quotes */
  /*  editoriais à direita, scrubbing e transição sequencial.            */
  /* ------------------------------------------------------------------ */
  featuredFilms: [
    {
      id: "featured-1",
      slug: "my-project-x",
      title: "MY PROJECT X",
      subtitle: "A MOVIE BY DANIELS",
      year: "2024",
      category: "DOCUMENTARY",
      director: "LIMOR PINHASOV",
      role: "DIREÇÃO, FOTOGRAFIA & MONTAGEM",
      poster: "assets/img/featured/film-default-1.jpg",
      detailUrl: "project.html?p=my-project-x",
      externalUrl: "",
      duration: "88",
      laurel: {
        year: "2024",
        event: "NATIONAL COMPETITION OF DOCAVIV",
        category: "DOCUMENTARY",
        logoText: "doc"
      },
      quotes: [
        {
          quote: "A FASCINATING VOYAGE",
          source: "CRITICAL ACCLAIM",
          rating: 0
        },
        {
          quote: "A FILM BASED ON A TRUE STORY",
          source: "CRITICAL ACCLAIM",
          rating: 5
        },
        {
          quote: "RIVETING SOUNDTRACK",
          source: "CRITICAL ACCLAIM",
          rating: 5
        }
      ],
      description: "A documentary exploring memory, visual intimacy and cinematic perspective."
    },
    {
      id: "featured-2",
      slug: "savoy",
      title: "SAVOY",
      subtitle: "A MOVIE BY DANIELS",
      year: "2024",
      category: "DOCUMENTARY",
      director: "DANIELS",
      role: "DIREÇÃO, CONCEPÇÃO VISUAL & EDIÇÃO",
      poster: "assets/img/featured/film-default-2.jpg",
      detailUrl: "project.html?p=savoy",
      externalUrl: "",
      duration: "77",
      laurel: {
        year: "2024",
        event: "OFFICIAL SELECTION OF VENICE",
        category: "CINEMATIC ESSAY",
        logoText: "DOC"
      },
      quotes: [
        {
          quote: "A MASTERCLASS IN ATMOSPHERE AND RHYTHM",
          source: "CRITICAL ACCLAIM",
          rating: 0
        },
        {
          quote: "LIGHT AND SHADOW IN CONTINUOUS DIALOGUE",
          source: "DIRECTOR'S STATEMENT",
          rating: 5
        },
        {
          quote: "HYPNOTIC VISUAL STORYTELLING",
          source: "CRITICAL ACCLAIM",
          rating: 5
        }
      ],
      description: "Uma tentativa autoral de transformar o cotidiano em poesia visual com proporção e luz cinematográfica."
    },
    {
      id: "featured-3",
      slug: "outsider-freud",
      title: "OUTSIDER FREUD",
      subtitle: "A JOURNEY INTO THE MIND",
      year: "2025",
      category: "DOCUMENTARY",
      director: "DANIELS",
      role: "DIREÇÃO DE ARTE & MONTAGEM",
      poster: "assets/img/featured/film-default-3.jpg",
      detailUrl: "project.html?p=outsider-freud",
      externalUrl: "",
      duration: "66",
      laurel: {
        year: "2025",
        event: "CONCEPT SELECTION OF ROTTERDAM",
        category: "ORIGINAL CONCEPT",
        logoText: "LAB"
      },
      quotes: [
        {
          quote: "A JOURNEY INTO ATMOSPHERIC SILENCE",
          source: "CRITICAL ACCLAIM",
          rating: 0
        },
        {
          quote: "UNCOMPROMISING DIRECTORIAL VISION",
          source: "CRITICAL ACCLAIM",
          rating: 5
        },
        {
          quote: "STUNNING CINEMATOGRAPHY",
          source: "CRITICAL ACCLAIM",
          rating: 5
        }
      ],
      description: "Projeto experimental explorando silêncio, luz de sódio e espaço negativo na construção da tensão cênica."
    }
  ],

  /* ------------------------------------------------------------------ */
  /*  SELECTED WORK                                                      */
  /*  - Os 2 projetos reais recentes com imagem e dados (@daniells.png)  */
  /*  - Os outros 4 como cards elegantes de amostra (poster a preencher) */
  /* ------------------------------------------------------------------ */
  projects: [
    {
      slug: "o-som-da-vida",
      sample: false,
      title: "O Som da Vida",
      category: "FILM",
      year: "2026",
      poster: "assets/img/posters/poster-o-som-da-vida.jpg",
      posterAlt: "Pôster do filme O Som da Vida com saxofone e iluminação quente em tom bronze",
      overview: "O som da vida! Um ensaio audiovisual sobre a música e os sentimentos: por que nós, seres humanos mortais, apreciamos tanto a música? Como uma simples melodia resgata memórias, pedaços da vida e emoções guardadas.",
      role: "Direção, Fotografia & Edição",
      instagramUrl: "https://www.instagram.com/reel/DdMOYQuKwU4/",
      video: {
        type: "instagram",
        id: "DdMOYQuKwU4",
        url: "https://www.instagram.com/reel/DdMOYQuKwU4/"
      },
      stills: [
        { src: "assets/img/posters/poster-o-som-da-vida.jpg", caption: "Key visual e cartaz do projeto" }
      ],
      credits: [
        { role: "Direção & Edição", name: "Daniels" },
        { role: "Participação Especial", name: "Arthur P." }
      ]
    },
    {
      slug: "minha-vida-e-um-filme",
      sample: false,
      title: "Minha Vida É Um Filme",
      category: "FILM",
      year: "2026",
      poster: "assets/img/posters/poster-minha-vida-e-um-filme.jpg",
      posterAlt: "Pôster Minha Vida É Um Filme, Daniels com criança nos ombros",
      overview: "Uma tentativa de enxergar a vida de um jeito diferente: porque talvez não sejam necessários grandes cenários para fazer algo parecer um filme. Às vezes, basta olhar com sensibilidade para as pequenas coisas que já estão ao nosso redor.",
      role: "Direção, Concepção Visual & Edição",
      instagramUrl: "https://www.instagram.com/reel/Dc6PHI9qwT4/",
      video: {
        type: "instagram",
        id: "Dc6PHI9qwT4",
        url: "https://www.instagram.com/reel/Dc6PHI9qwT4/"
      },
      stills: [
        { src: "assets/img/posters/poster-minha-vida-e-um-filme.jpg", caption: "Cartaz original — Minha Vida É Um Filme" }
      ],
      credits: [
        { role: "Direção", name: "Daniels" },
        { role: "Participações Especiais", name: "Arthur P. & Carolina P." }
      ]
    },
    {
      slug: "outsider-freud",
      sample: true,
      title: "Outsider Freud",
      category: "DOCUMENTARY",
      year: "2025",
      poster: "assets/img/featured/placeholder-3-backdrop.jpg",
      posterAlt: "Outsider Freud — cena cinematográfica com homem na janela contemplando o mar",
      overview: "Uma jornada psicológica explorando o silêncio, as dimensões do legado humano e o isolamento através de enquadramentos rigorosos e luz natural.",
      role: "Direção de Arte & Montagem",
      video: null,
      stills: [
        { src: "assets/img/featured/placeholder-3-backdrop.jpg", caption: "Frame principal — Outsider Freud" }
      ],
      credits: [
        { role: "Direção de Arte", name: "Daniels" },
        { role: "Montagem", name: "Daniels" }
      ]
    },
    {
      slug: "untitled-04",
      sample: true,
      title: "Untitled No. 4",
      category: "EXPERIMENTAL",
      year: "",
      poster: "",
      posterAlt: "",
      overview: "",
      role: "",
      video: null,
      stills: [],
      credits: []
    },
    {
      slug: "untitled-05",
      sample: true,
      title: "Untitled No. 5",
      category: "FILM",
      year: "",
      poster: "",
      posterAlt: "",
      overview: "",
      role: "",
      video: null,
      stills: [],
      credits: []
    },
    {
      slug: "untitled-06",
      sample: true,
      title: "Untitled No. 6",
      category: "MUSIC VIDEO",
      year: "",
      poster: "",
      posterAlt: "",
      overview: "",
      role: "",
      video: null,
      stills: [],
      credits: []
    }
  ],

  /* ------------------------------------------------------------------ */
  /*  DESIGN & ART DIRECTION                                             */
  /*  - Estrutura editorial preenchida, mas com cards vazios elegantes  */
  /* ------------------------------------------------------------------ */
  design: [
    {
      sample: true,
      title: "Visual identity",
      type: "Identity",
      year: "",
      image: "",
      alt: "",
      ratio: "16/10",
      size: "wide",
      description: "Espaço para marca ou sistema de identidade visual — logotipo, tipografia e aplicações."
    },
    {
      sample: true,
      title: "Poster series",
      type: "Poster design",
      year: "",
      image: "",
      alt: "",
      ratio: "4/5",
      size: "tall",
      description: "Espaço para cartazes e artes gráficas de projetos autorais ou comerciais."
    },
    {
      sample: true,
      title: "Campaign artwork",
      type: "Art direction",
      year: "",
      image: "",
      alt: "",
      ratio: "1/1",
      size: "square",
      description: "Espaço para key visuals de campanha, layouts editoriais e experimentações visuais."
    }
  ]
};
