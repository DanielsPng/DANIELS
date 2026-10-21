/* ==========================================================================
   DANIELS® — SITE CONTENT (PT / EN)
   --------------------------------------------------------------------------
   Todo o conteúdo do site mora aqui.
   - Textos bilíngues usam { pt: "...", en: "..." }. Texto simples vale para os dois.
   - sample: true  → item de exemplo (aparece com a etiqueta "Exemplo / Sample").
   - Campos vazios ("") aparecem como "Em breve / Coming soon", nunca como erro.
   ========================================================================== */

window.SITE = {

  /* ------------------------------------------------------------------ */
  /*  PERFIL & LINKS                                                     */
  /* ------------------------------------------------------------------ */
  profile: {
    name: "DANIELS",
    email: "",                 // ex.: "contato@daniels.com"
    instagram: "https://www.instagram.com/daniells.png/",
    instagramHandle: "@daniells.png",
    linkedin: "",
    vimeo: "",
    youtube: "",
    letterboxd: "",
    cv: "",                    // ex.: "assets/docs/cv-daniels.pdf"
    location: { pt: "Brasil", en: "Brazil" }
  },

  /* ------------------------------------------------------------------ */
  /*  ABERTURA (HERO)                                                    */
  /* ------------------------------------------------------------------ */
  hero: {
    video: { desktop: "", mobile: "" },   // ex.: "assets/video/reel.mp4" (H.264, sem som)
    poster: "assets/img/hero-still.jpg",
    focus: { desktop: "62% 50%", mobile: "79% 50%" },
    scene: { pt: "Ext. Estrada litorânea — Entardecer", en: "Ext. Coastal road — Dusk" }
  },

  /* ------------------------------------------------------------------ */
  /*  FILMES & TRABALHOS                                                 */
  /*  Um projeto com "featured" aparece também no rolo de filmes (02).   */
  /*  category: film | short | documentary | musicvideo | edit | poster | design
  /* ------------------------------------------------------------------ */
  projects: [
    {
      slug: "o-som-da-vida",
      title: "O Som da Vida",
      category: "film",
      year: "2026",
      duration: "",
      poster: "assets/img/posters/poster-o-som-da-vida.jpg",
      posterAlt: { pt: "Pôster de O Som da Vida — saxofone em luz quente cor de bronze", en: "O Som da Vida poster — a saxophone in warm bronze light" },
      logline: {
        pt: "Por que nós, seres mortais, amamos tanto a música?",
        en: "Why do we, mortal beings, love music so much?"
      },
      overview: {
        pt: "Um ensaio audiovisual sobre a música e os sentimentos. Como uma simples melodia resgata memórias, pedaços da vida e emoções guardadas.",
        en: "An audiovisual essay about music and feeling — how a simple melody brings back memories, fragments of a life and emotions kept inside."
      },
      role: { pt: "Direção, fotografia e edição", en: "Direction, cinematography & editing" },
      video: { type: "instagram", id: "DdMOYQuKwU4" },
      stills: [
        { src: "assets/img/posters/poster-o-som-da-vida.jpg", caption: { pt: "Key visual", en: "Key visual" } }
      ],
      credits: [
        { role: { pt: "Direção & edição", en: "Direction & editing" }, name: "Daniels" },
        { role: { pt: "Participação especial", en: "Special appearance" }, name: "Arthur P." }
      ],
      featured: {
        // TROCAR: still horizontal do filme (ideal 1920×1080). A atual é provisória.
        backdrop: "assets/img/featured/film-default-2.jpg",
        label: { pt: "Ensaio audiovisual", en: "Audiovisual essay" },
        notes: [
          { label: { pt: "Logline", en: "Logline" }, text: { pt: "Uma melodia que resgata memórias", en: "A melody that brings memories back" } },
          { label: { pt: "Formato", en: "Format" }, text: { pt: "Reel vertical", en: "Vertical reel" } },
          { label: { pt: "Função", en: "Role" }, text: { pt: "Direção & edição", en: "Direction & editing" } }
        ]
      }
    },
    {
      slug: "minha-vida-e-um-filme",
      title: "Minha Vida É Um Filme",
      category: "film",
      year: "2026",
      duration: "",
      poster: "assets/img/posters/poster-minha-vida-e-um-filme.jpg",
      posterAlt: { pt: "Pôster de Minha Vida É Um Filme — Daniels com uma criança nos ombros", en: "Minha Vida É Um Filme poster — Daniels carrying a child on his shoulders" },
      logline: {
        pt: "Talvez não sejam necessários grandes cenários para algo parecer um filme.",
        en: "Maybe you don't need grand sets for something to feel like a film."
      },
      overview: {
        pt: "Uma tentativa de enxergar a vida de um jeito diferente. Às vezes, basta olhar com sensibilidade para as pequenas coisas que já estão ao nosso redor.",
        en: "An attempt to see life differently. Sometimes all it takes is to look, with care, at the small things already around us."
      },
      role: { pt: "Direção, concepção visual e edição", en: "Direction, visual concept & editing" },
      video: { type: "instagram", id: "Dc6PHI9qwT4" },
      stills: [
        { src: "assets/img/posters/poster-minha-vida-e-um-filme.jpg", caption: { pt: "Cartaz original", en: "Original poster" } }
      ],
      credits: [
        { role: { pt: "Direção", en: "Direction" }, name: "Daniels" },
        { role: { pt: "Participações especiais", en: "Special appearances" }, name: "Arthur P. & Carolina P." }
      ],
      featured: {
        // TROCAR: still horizontal do filme (ideal 1920×1080). A atual é provisória.
        backdrop: "assets/img/featured/film-default-1.jpg",
        label: { pt: "Curta-metragem", en: "Short film" },
        notes: [
          { label: { pt: "Logline", en: "Logline" }, text: { pt: "O extraordinário no cotidiano", en: "The extraordinary in the everyday" } },
          { label: { pt: "Formato", en: "Format" }, text: { pt: "Reel vertical", en: "Vertical reel" } },
          { label: { pt: "Função", en: "Role" }, text: { pt: "Direção & concepção visual", en: "Direction & visual concept" } }
        ]
      }
    },
    {
      slug: "those-little-moments",
      sample: true,
      title: "Those Little Moments",
      category: "film",
      year: "",
      duration: "",
      poster: "assets/img/posters/poster-those-little-moments.jpg",
      posterAlt: { pt: "Pôster de Those Little Moments", en: "Those Little Moments poster" },
      logline: { pt: "", en: "" },
      overview: { pt: "", en: "" },
      role: { pt: "", en: "" },
      video: null,
      stills: [],
      credits: [],
      featured: {
        // TROCAR: still horizontal do filme (ideal 1920×1080). A atual é provisória.
        backdrop: "assets/img/featured/film-default-3.jpg",
        label: { pt: "Em breve", en: "Coming soon" },
        notes: []
      }
    },
    {
      slug: "dei-uma-distraida",
      sample: true,
      title: "Dei uma Distraída",
      category: "poster",
      year: "",
      poster: "assets/img/posters/poster-dei-uma-distraida.jpg",
      posterAlt: { pt: "Pôster Dei uma Distraída", en: "Dei uma Distraída poster" },
      overview: { pt: "", en: "" },
      role: { pt: "Design de pôster", en: "Poster design" },
      video: null, stills: [], credits: []
    },
    {
      slug: "noite-dos-cuecas",
      sample: true,
      title: "Noite dos Cuecas",
      category: "poster",
      year: "",
      poster: "assets/img/posters/poster-noite-dos-cuecas.jpg",
      posterAlt: { pt: "Pôster Noite dos Cuecas", en: "Noite dos Cuecas poster" },
      overview: { pt: "", en: "" },
      role: { pt: "Design de pôster", en: "Poster design" },
      video: null, stills: [], credits: []
    },
    {
      slug: "untitled-design",
      sample: true,
      title: { pt: "Identidade visual", en: "Visual identity" },
      category: "design",
      year: "",
      poster: "",
      overview: { pt: "", en: "" },
      role: { pt: "Direção de arte", en: "Art direction" },
      video: null, stills: [], credits: []
    }
  ],

  /* ------------------------------------------------------------------ */
  /*  EM DESENVOLVIMENTO                                                 */
  /*  status: idea | writing | preproduction | shooting | post           */
  /* ------------------------------------------------------------------ */
  development: [
    {
      sample: true,
      code: "P-01",
      title: { pt: "Projeto sem título", en: "Untitled project" },
      format: { pt: "Curta-metragem · Ficção", en: "Short film · Fiction" },
      status: "writing",
      logline: {
        pt: "Exemplo de logline: em uma cidade que nunca dorme, um projecionista descobre que os filmes que exibe estão mudando o passado.",
        en: "Sample logline: in a city that never sleeps, a projectionist discovers the films he screens are rewriting the past."
      },
      target: "2027"
    },
    {
      sample: true,
      code: "P-02",
      title: { pt: "Documentário", en: "Documentary" },
      format: { pt: "Documentário · Média-metragem", en: "Documentary · Mid-length" },
      status: "preproduction",
      logline: {
        pt: "Exemplo de logline: o retrato de quem mantém vivos os últimos cinemas de rua do interior.",
        en: "Sample logline: a portrait of the people keeping the last small-town street cinemas alive."
      },
      target: "2027"
    },
    {
      sample: true,
      code: "P-03",
      title: { pt: "Videoclipe", en: "Music video" },
      format: { pt: "Videoclipe", en: "Music video" },
      status: "idea",
      logline: {
        pt: "Exemplo de logline: uma noite, uma música, um único plano-sequência.",
        en: "Sample logline: one night, one song, a single continuous shot."
      },
      target: "2026"
    }
  ],

  /* ------------------------------------------------------------------ */
  /*  DIRECTOR'S STATEMENT                                               */
  /* ------------------------------------------------------------------ */
  statement: {
    portrait: "",              // ex.: "assets/img/portrait.jpg" (retrato vertical 4:5)
    portraitAlt: { pt: "Retrato de Daniels", en: "Portrait of Daniels" },
    lead: {
      pt: "Faço filmes para lembrar o que a gente sente quando ninguém está olhando.",
      en: "I make films to remember what we feel when no one is watching."
    },
    paragraphs: [
      {
        pt: "Sou Daniels, um criativo brasileiro que se move entre cinema, edição, design e direção de arte. Meu caminho é a direção: cada projeto é um passo para contar histórias com mais intenção.",
        en: "I'm Daniels, a Brazilian creative moving between film, editing, design and art direction. My path is directing — every project is a step towards telling stories with more intention."
      },
      {
        pt: "Me interessa o pensamento por trás de cada decisão: como composição, ritmo, som e linguagem visual transformam uma ideia em experiência.",
        en: "I care about the thinking behind every decision — how composition, rhythm, sound and visual language turn an idea into an experience."
      }
    ],
    disciplines: { pt: ["Direção", "Edição & montagem", "Fotografia", "Direção de arte", "Design de pôster"], en: ["Directing", "Editing", "Cinematography", "Art direction", "Poster design"] },
    // Exemplo — troque pelos diretores e filmes que realmente te formaram.
    influences: [
      { name: "Wong Kar-wai", work: "In the Mood for Love" },
      { name: "Denis Villeneuve", work: "Arrival" },
      { name: "Céline Sciamma", work: "Portrait of a Lady on Fire" },
      { name: "Kleber Mendonça Filho", work: "Aquarius" }
    ],
    influencesSample: true
  },

  /* ------------------------------------------------------------------ */
  /*  ARTURUS (produtora)                                                */
  /* ------------------------------------------------------------------ */
  arturus: {
    image: "assets/img/arturus-still.jpg",
    imageAlt: { pt: "Sala de cinema escura com o facho do projetor atravessando a névoa", en: "A dark cinema with the projector beam cutting through the haze" },
    text: {
      pt: "A Arturus é a produtora por trás dos projetos: o espaço onde ideias viram filmes originais, colaborações e experiências visuais.",
      en: "Arturus is the production house behind the work — where ideas become original films, collaborations and visual experiences."
    },
    website: "",
    instagram: ""
  },

  /* ------------------------------------------------------------------ */
  /*  TEXTOS DA INTERFACE                                                */
  /* ------------------------------------------------------------------ */
  ui: {
    pt: {
      "meta.title": "DANIELS® — Direção · Audiovisual · Narrativa",
      "meta.desc": "DANIELS® é um criativo brasileiro a caminho da direção de cinema — filmes, edição, design e direção de arte.",
      "skip": "Pular para o conteúdo",
      "nav.films": "Filmes",
      "nav.development": "Em desenvolvimento",
      "nav.work": "Trabalhos",
      "nav.statement": "Statement",
      "nav.contact": "Contato",
      "nav.menu": "Menu",
      "nav.films_list": "Filmes",
      "nav.home": "Início",
      "lang.label": "Idioma",

      "hero.kicker": "Um filme de",
      "hero.tag": "Histórias em movimento.",
      "hero.sub": "Criativo audiovisual a caminho da direção de cinema.",
      "hero.cta": "Ver filmes",
      "hero.cta2": "Fale comigo",
      "hero.reel": "Reel",
      "hero.pause": "Pausar vídeo",
      "hero.play": "Reproduzir vídeo",

      "films.kicker": "Filmes",
      "films.director": "Direção",
      "films.year": "Ano",
      "films.category": "Categoria",
      "films.explore": "Explorar",
      "films.prev": "Anterior",
      "films.next": "Próximo",

      "dev.kicker": "Em desenvolvimento",
      "dev.title": "Próximas <em>cenas.</em>",
      "dev.intro": "Projetos que estão sendo escritos, planejados e filmados. Para onde o trabalho está indo.",
      "dev.target": "Previsão",
      "dev.status.idea": "Ideia",
      "dev.status.writing": "Roteiro",
      "dev.status.preproduction": "Pré-produção",
      "dev.status.shooting": "Filmagem",
      "dev.status.post": "Pós-produção",

      "work.kicker": "Trabalhos",
      "work.title": "Trabalhos <em>selecionados.</em>",
      "work.intro": "Filmes, edição, pôsteres e direção de arte — o trabalho dentro e em volta da imagem em movimento.",
      "work.all": "Todos",
      "work.empty": "Arte em breve",

      "cat.film": "Filme",
      "cat.short": "Curta-metragem",
      "cat.documentary": "Documentário",
      "cat.musicvideo": "Videoclipe",
      "cat.edit": "Edição",
      "cat.poster": "Pôster",
      "cat.design": "Design",

      "st.kicker": "Director's statement",
      "st.title": "Por que eu <em>filmo.</em>",
      "st.based": "Base",
      "st.disciplines": "Áreas",
      "st.influences": "Influências",
      "st.portrait": "Retrato em breve",
      "st.cv": "Baixar CV",
      "ar.kicker": "Produtora",
      "ar.relation": "Uma produtora de Daniels.",
      "ar.site": "Site",
      "ar.ig": "Instagram",

      "ct.kicker": "Contato",
      "ct.title": "Vamos fazer <em>um filme.</em>",
      "ct.intro": "Aberto a colaborações, produções e projetos audiovisuais.",
      "ct.email": "E-mail",

      "ft.directed": "Dirigido por",
      "ft.edited": "Montagem",
      "ft.art": "Direção de arte",
      "ft.produced": "Produção",
      "ft.end": "Fim",
      "ft.top": "Voltar ao início",
      "ft.rights": "Todos os direitos reservados.",

      "pj.back": "Todos os trabalhos",
      "pj.logline": "Logline",
      "pj.overview": "Sinopse",
      "pj.role": "Função",
      "pj.credits": "Créditos",
      "pj.stills": "Stills",
      "pj.watch": "Assistir",
      "pj.watch_ig": "Assistir no Instagram",
      "pj.next": "Próximo projeto",
      "pj.nf.title": "Este projeto não foi encontrado.",
      "pj.nf.back": "Voltar aos trabalhos",
      "pj.stills_soon": "Stills em breve",

      "sample": "Exemplo",
      "soon": "Em breve",
      "newtab": "(abre em nova aba)"
    },
    en: {
      "meta.title": "DANIELS® — Directing · Audiovisual · Storytelling",
      "meta.desc": "DANIELS® is a Brazilian creative on the way to film directing — films, editing, design and art direction.",
      "skip": "Skip to content",
      "nav.films": "Films",
      "nav.development": "In development",
      "nav.work": "Work",
      "nav.statement": "Statement",
      "nav.contact": "Contact",
      "nav.menu": "Menu",
      "nav.films_list": "Films",
      "nav.home": "Home",
      "lang.label": "Language",

      "hero.kicker": "A film by",
      "hero.tag": "Stories in motion.",
      "hero.sub": "Audiovisual creative on the way to film directing.",
      "hero.cta": "Watch films",
      "hero.cta2": "Get in touch",
      "hero.reel": "Reel",
      "hero.pause": "Pause video",
      "hero.play": "Play video",

      "films.kicker": "Films",
      "films.director": "Director",
      "films.year": "Year",
      "films.category": "Category",
      "films.explore": "Explore",
      "films.prev": "Previous",
      "films.next": "Next",

      "dev.kicker": "In development",
      "dev.title": "Next <em>scenes.</em>",
      "dev.intro": "Projects being written, planned and shot. Where the work is heading.",
      "dev.target": "Target",
      "dev.status.idea": "Idea",
      "dev.status.writing": "Writing",
      "dev.status.preproduction": "Pre-production",
      "dev.status.shooting": "Shooting",
      "dev.status.post": "Post-production",

      "work.kicker": "Work",
      "work.title": "Selected <em>work.</em>",
      "work.intro": "Films, editing, posters and art direction — the work inside and around the moving image.",
      "work.all": "All",
      "work.empty": "Artwork coming soon",

      "cat.film": "Film",
      "cat.short": "Short film",
      "cat.documentary": "Documentary",
      "cat.musicvideo": "Music video",
      "cat.edit": "Editing",
      "cat.poster": "Poster",
      "cat.design": "Design",

      "st.kicker": "Director's statement",
      "st.title": "Why I <em>film.</em>",
      "st.based": "Based in",
      "st.disciplines": "Disciplines",
      "st.influences": "Influences",
      "st.portrait": "Portrait coming soon",
      "st.cv": "Download CV",
      "ar.kicker": "Production house",
      "ar.relation": "A production company by Daniels.",
      "ar.site": "Website",
      "ar.ig": "Instagram",

      "ct.kicker": "Contact",
      "ct.title": "Let's make <em>a film.</em>",
      "ct.intro": "Open to collaborations, productions and audiovisual projects.",
      "ct.email": "Email",

      "ft.directed": "Directed by",
      "ft.edited": "Edited by",
      "ft.art": "Art direction",
      "ft.produced": "Produced by",
      "ft.end": "The End",
      "ft.top": "Back to top",
      "ft.rights": "All rights reserved.",

      "pj.back": "All work",
      "pj.logline": "Logline",
      "pj.overview": "Synopsis",
      "pj.role": "Role",
      "pj.credits": "Credits",
      "pj.stills": "Stills",
      "pj.watch": "Watch",
      "pj.watch_ig": "Watch on Instagram",
      "pj.next": "Next project",
      "pj.nf.title": "This project could not be found.",
      "pj.nf.back": "Back to work",
      "pj.stills_soon": "Stills coming soon",

      "sample": "Sample",
      "soon": "Coming soon",
      "newtab": "(opens in a new tab)"
    }
  }
};
