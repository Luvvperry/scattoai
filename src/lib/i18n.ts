export type Language = "es" | "pt" | "en";

export interface I18nTranslations {
  // App Header
  appTitle: string;
  appSubtitle: string;
  languageSelectorLabel: string;
  historyToggleLabel: string;

  // Mode Selector
  selectMode: string;
  modePerson: string;
  modePOV: string;
  modeEdit: string;
  modeFromPhoto: string;
  modeFromText: string;
  modeExistingPrompt: string;

  // Image Upload
  personPhotoTitle: string;
  povPhotoTitle: string;
  uploadPersonPhoto: string;
  uploadPOVPhoto: string;
  uploadFormatSubtext: string;
  removeImage: string;

  // Text Idea
  personIdeaTitle: string;
  povIdeaTitle: string;
  personIdeaPlaceholder: string;
  povIdeaPlaceholder: string;
  quickExamplesLabel: string;
  personExamples: string[];
  povExamples: string[];

  // Edit Mode
  existingPromptLabel: string;
  existingPromptPlaceholder: string;
  requestedChangesLabel: string;
  requestedChangesPlaceholder: string;
  outputLanguageLabel: string;
  updatePromptButton: string;
  updatingPrompt: string;

  // Format Style
  formatStyleTitle: string;
  formatIphoneTitle: string;
  formatIphoneDesc: string;
  formatBlueprintTitle: string;
  formatBlueprintDesc: string;
  formatProRawTitle: string;
  formatProRawDesc: string;

  // Presets
  presetLibraryLabel: string;
  presetSelectPlaceholder: string;

  // Custom Instructions & Identity
  customInstructionsLabel: string;
  customInstructionsPlaceholder: string;
  identitySectionTitle: string;
  strictLightingTitle: string;
  strictLightingDesc: string;
  includeTattoosTitle: string;
  includeTattoosDesc: string;

  // Buttons & Actions
  generateButtonLoading: string;
  generatePersonPhoto: string;
  generatePersonText: string;
  generatePOVPhoto: string;
  generatePOVText: string;

  // Output Card
  generatedPromptHeader: string;
  verticalBadge: string;
  copyPrompt: string;
  copiedPrompt: string;
  waitingStateTitle: string;
  waitingStateDesc: string;
  generatingStateTitle: string;

  // History Drawer
  historyTitle: string;
  clearHistory: string;
  emptyHistory: string;
  openHistory: string;
}

export const TRANSLATIONS: Record<Language, I18nTranslations> = {
  es: {
    appTitle: "GENERADOR DE PROMPTS HIPERREALISTAS",
    appSubtitle: "Motor de ingeniería de prompts de precisión fotográfica para iPhone, selfies, POV y escenas ultra realistas.",
    languageSelectorLabel: "Idioma de la App y Prompts",
    historyToggleLabel: "Historial",

    selectMode: "Selecciona la Modalidad",
    modePerson: "Persona",
    modePOV: "POV / Objetos",
    modeEdit: "Editar",
    modeFromPhoto: "Desde Foto",
    modeFromText: "Desde Idea (Texto)",
    modeExistingPrompt: "Prompt Existente",

    personPhotoTitle: "Foto de Referencia de Persona",
    povPhotoTitle: "Foto de Referencia del Objeto / Entorno",
    uploadPersonPhoto: "Subir Foto de Persona",
    uploadPOVPhoto: "Subir Foto de Objeto / Espacio",
    uploadFormatSubtext: "PNG, JPG, WEBP O SVG",
    removeImage: "Remover imagen",

    personIdeaTitle: "Describe tu Idea de la Persona o Escena",
    povIdeaTitle: "Describe tu Idea de Objeto, Espacio o Toma POV",
    personIdeaPlaceholder: "Ejemplo: Hombre en un carro de lujo de noche viendo su celular mientras un amigo le toma una foto sin avisar...",
    povIdeaPlaceholder: "Ejemplo: Una caja de chocolates abierta sobre las sábanas de una cama desordenada con luz cálida de lámpara de noche...",
    quickExamplesLabel: "Ejemplos Rápidos:",
    personExamples: [
      "Hombre en auto de lujo nocturno viendo su celular casualmente",
      "Mujer tomando un café en cafetería moderna estilo selfie en espejo",
      "Chico caminando por la calle de noche con chaqueta oversize y luz urbana",
      "Chica en la playa al atardecer riendo desprevenida con un amigo"
    ],
    povExamples: [
      "Vista POV sosteniendo un vaso de café en el escritorio desordenado",
      "IPhone en la mesa de noche junto a un vaso de agua y llaves",
      "Tenis urbanos sobre el asfalto mojado con reflejos de neón",
      "Plato de pasta casera en mesa de madera con copa de vino de fondo"
    ],

    existingPromptLabel: "Prompt Existente",
    existingPromptPlaceholder: "Pega aquí el prompt que deseas modificar...",
    requestedChangesLabel: "Cambios o Modificaciones a Realizar",
    requestedChangesPlaceholder: "Ejemplo: Cambiar la camisa a una sudadera negra con capucha y agregar un vaso de café en la mesa...",
    outputLanguageLabel: "Idioma de Salida",
    updatePromptButton: "Actualizar y Ajustar Prompt",
    updatingPrompt: "Actualizando Prompt...",

    formatStyleTitle: "Estilo de Formato del Prompt",
    formatIphoneTitle: "iPhone Realista",
    formatIphoneDesc: "Sintaxis canónica con tags (él viste, él está, alrededor, acción, sensor 24mm f/1.8).",
    formatBlueprintTitle: "Blueprint Técnico",
    formatBlueprintDesc: "Estructura [DEFINE] con Aspect Ratio 9:16 + [REFERENCE BLUEPRINT] + [MASTER PROMPT].",
    formatProRawTitle: "iPhone ProRAW Ultra-Realista",
    formatProRawDesc: "Micro-física óptica de iPhone ProRAW, imperfecciones de sensor, textura dérmica RAW, luz ambiental orgánica y narrativa espontánea no posada.",

    presetLibraryLabel: "Librería de Presets de Fotografía",
    presetSelectPlaceholder: "-- Selecciona un Preset Estilo iPhone / Fotográfico --",

    customInstructionsLabel: "Instrucciones Adicionales (Detalles Específicos)",
    customInstructionsPlaceholder: "Detalles que quieras añadir, como ropa específica, accesorios, luces o marcas...",
    identitySectionTitle: "Preservación de Identidad",
    strictLightingTitle: "Iluminación Exacta",
    strictLightingDesc: "Extraer luz ambiente o flash exacto",
    includeTattoosTitle: "Tatuajes",
    includeTattoosDesc: "Incluir tatuajes visibles",

    generateButtonLoading: "Generando Prompt...",
    generatePersonPhoto: "Generar Prompt de Persona (desde Foto)",
    generatePersonText: "Generar Prompt de Persona (desde Idea)",
    generatePOVPhoto: "Generar Prompt POV / Objetos (desde Foto)",
    generatePOVText: "Generar Prompt POV / Objetos (desde Idea)",

    generatedPromptHeader: "Prompt Generado",
    verticalBadge: "9:16 Vertical",
    copyPrompt: "Copiar Prompt",
    copiedPrompt: "Copiado",
    waitingStateTitle: "Esperando Datos de Entrada",
    waitingStateDesc: "Selecciona una modalidad a la izquierda, proporciona una foto o una idea en texto para generar el prompt realista.",
    generatingStateTitle: "Analizando y Construyendo Prompt...",

    historyTitle: "Historial",
    clearHistory: "Limpiar Historial",
    emptyHistory: "No hay prompts guardados",
    openHistory: "Abrir Historial",
  },

  pt: {
    appTitle: "GERADOR DE PROMPTS HIPER-REALISTAS",
    appSubtitle: "Mecanismo de engenharia de prompts de precisão fotográfica para iPhone, selfies, POV e cenas ultra-realistas.",
    languageSelectorLabel: "Idioma do Aplicativo e dos Prompts",
    historyToggleLabel: "Histórico",

    selectMode: "Selecione a Modalidade",
    modePerson: "Pessoa",
    modePOV: "POV / Objetos",
    modeEdit: "Editar",
    modeFromPhoto: "A partir de Foto",
    modeFromText: "A partir de Ideia (Texto)",
    modeExistingPrompt: "Prompt Existente",

    personPhotoTitle: "Foto de Referência da Pessoa",
    povPhotoTitle: "Foto de Referência do Objeto / Ambiente",
    uploadPersonPhoto: "Enviar Foto da Pessoa",
    uploadPOVPhoto: "Enviar Foto de Objeto / Espaço",
    uploadFormatSubtext: "PNG, JPG, WEBP OU SVG",
    removeImage: "Remover imagem",

    personIdeaTitle: "Descreva sua Ideia da Pessoa ou Cena",
    povIdeaTitle: "Descreva sua Ideia de Objeto, Espaço ou Foto POV",
    personIdeaPlaceholder: "Exemplo: Homem num carro de luxo à noite olhando para o celular enquanto um amigo tira uma foto sem avisar...",
    povIdeaPlaceholder: "Exemplo: Uma caixa de chocolates aberta sobre os lençóis de uma cama desarrumada com luz quente de abajur...",
    quickExamplesLabel: "Exemplos Rápidos:",
    personExamples: [
      "Homem em carro de luxo à noite olhando casualmente o celular",
      "Mulher tomando café em cafeteria moderna estilo selfie no espelho",
      "Rapaz caminhando pela rua à noite com jaqueta oversize e luz urbana",
      "Garota na praia ao pôr do sol rindo espontaneamente com um amigo"
    ],
    povExamples: [
      "Visão POV segurando um copo de café em mesa de trabalho movimentada",
      "iPhone na mesa de cabeceira ao lado de um copo de água e chaves",
      "Tênis urbanos no asfalto molhado com reflexos de néon",
      "Prato de massa caseira na mesa de madeira com taça de vinho ao fundo"
    ],

    existingPromptLabel: "Prompt Existente",
    existingPromptPlaceholder: "Cole aqui o prompt que deseja modificar...",
    requestedChangesLabel: "Mudanças ou Modificações a Realizar",
    requestedChangesPlaceholder: "Exemplo: Mudar a camisa para um moletom preto com capuz e adicionar um copo de café na mesa...",
    outputLanguageLabel: "Idioma de Saída",
    updatePromptButton: "Atualizar e Ajustar Prompt",
    updatingPrompt: "Atualizando Prompt...",

    formatStyleTitle: "Estilo de Formato do Prompt",
    formatIphoneTitle: "iPhone Realista",
    formatIphoneDesc: "Sintaxe canônica com tags (ele veste, ele está, ao redor, ação, sensor 24mm f/1.8).",
    formatBlueprintTitle: "Blueprint Técnico",
    formatBlueprintDesc: "Estrutura [DEFINE] com Aspect Ratio 9:16 + [REFERENCE BLUEPRINT] + [MASTER PROMPT].",
    formatProRawTitle: "iPhone ProRAW Ultra-Realista",
    formatProRawDesc: "Micro-física óptica de iPhone ProRAW, imperfeições de sensor, textura dérmica RAW, iluminação ambiente orgânica e narrativa espontânea sem pose.",

    presetLibraryLabel: "Biblioteca de Presets de Fotografia",
    presetSelectPlaceholder: "-- Selecione um Preset Estilo iPhone / Fotográfico --",

    customInstructionsLabel: "Instruções Adicionais (Detalhes Específicos)",
    customInstructionsPlaceholder: "Detalhes que você queira adicionar, como roupas específicas, acessórios, luzes ou marcas...",
    identitySectionTitle: "Preservação de Identidade",
    strictLightingTitle: "Iluminação Exata",
    strictLightingDesc: "Extrair luz ambiente ou flash exato",
    includeTattoosTitle: "Tatuagens",
    includeTattoosDesc: "Incluir tatuagens visíveis",

    generateButtonLoading: "Gerando Prompt...",
    generatePersonPhoto: "Gerar Prompt de Pessoa (a partir de Foto)",
    generatePersonText: "Gerar Prompt de Pessoa (a partir de Ideia)",
    generatePOVPhoto: "Gerar Prompt POV / Objetos (a partir de Foto)",
    generatePOVText: "Gerar Prompt POV / Objetos (a partir de Ideia)",

    generatedPromptHeader: "Prompt Gerado",
    verticalBadge: "9:16 Vertical",
    copyPrompt: "Copiar Prompt",
    copiedPrompt: "Copiado",
    waitingStateTitle: "Aguardando Dados de Entrada",
    waitingStateDesc: "Selecione uma modalidade à esquerda, forneça uma foto ou uma ideia em texto para gerar o prompt realista.",
    generatingStateTitle: "Analisando e Construindo Prompt...",

    historyTitle: "Histórico",
    clearHistory: "Limpar Histórico",
    emptyHistory: "Nenhum prompt salvo",
    openHistory: "Abrir Histórico",
  },

  en: {
    appTitle: "HYPER-REALISTIC PROMPT GENERATOR",
    appSubtitle: "Precision photographic prompt engineering engine for iPhone snapshots, selfies, POV, and ultra-realistic scenes.",
    languageSelectorLabel: "App & Prompt Output Language",
    historyToggleLabel: "History",

    selectMode: "Select Mode",
    modePerson: "Person",
    modePOV: "POV / Objects",
    modeEdit: "Edit",
    modeFromPhoto: "From Photo",
    modeFromText: "From Idea (Text)",
    modeExistingPrompt: "Existing Prompt",

    personPhotoTitle: "Person Reference Photo",
    povPhotoTitle: "Object / Environment Reference Photo",
    uploadPersonPhoto: "Upload Person Photo",
    uploadPOVPhoto: "Upload Object / Space Photo",
    uploadFormatSubtext: "PNG, JPG, WEBP OR SVG",
    removeImage: "Remove image",

    personIdeaTitle: "Describe your Person or Scene Idea",
    povIdeaTitle: "Describe your Object, Space, or POV Idea",
    personIdeaPlaceholder: "Example: Man in a luxury car at night casually checking his phone while a friend candidly snaps a photo...",
    povIdeaPlaceholder: "Example: An open box of chocolates resting on messy bedsheets illuminated by warm nightstand lamp light...",
    quickExamplesLabel: "Quick Examples:",
    personExamples: [
      "Man in a luxury car at night casually looking at his phone",
      "Woman drinking coffee in a modern cafe mirror selfie style",
      "Guy walking down a night street wearing an oversize jacket under urban streetlights",
      "Girl at the beach at sunset laughing candidly with a friend"
    ],
    povExamples: [
      "POV shot holding a coffee cup at a cluttered wooden desk",
      "iPhone resting on a nightstand beside a glass of water and keys",
      "Urban sneakers resting on wet asphalt reflecting neon lights",
      "Plate of homemade pasta on a rustic wooden table with a wine glass in the background"
    ],

    existingPromptLabel: "Existing Prompt",
    existingPromptPlaceholder: "Paste the prompt you want to modify here...",
    requestedChangesLabel: "Changes or Modifications Needed",
    requestedChangesPlaceholder: "Example: Change the shirt to a black hoodie and add a coffee cup on the table...",
    outputLanguageLabel: "Output Language",
    updatePromptButton: "Update & Refine Prompt",
    updatingPrompt: "Updating Prompt...",

    formatStyleTitle: "Prompt Format Style",
    formatIphoneTitle: "Realistic iPhone",
    formatIphoneDesc: "Canonical tag syntax (he is wearing, he is at, around, action, 24mm f/1.8 sensor).",
    formatBlueprintTitle: "Technical Blueprint",
    formatBlueprintDesc: "[DEFINE] structure with 9:16 Aspect Ratio + [REFERENCE BLUEPRINT] + [MASTER PROMPT].",
    formatProRawTitle: "iPhone ProRAW Ultra-Realistic",
    formatProRawDesc: "Maximum iPhone ProRAW optical micro-physics, authentic sensor artifacts, RAW dermal texture, organic ambient lighting, and spontaneous unposed narrative.",

    presetLibraryLabel: "Photography Preset Library",
    presetSelectPlaceholder: "-- Select an iPhone / Photographic Preset --",

    customInstructionsLabel: "Additional Instructions (Specific Details)",
    customInstructionsPlaceholder: "Details you want to add, such as specific clothes, accessories, lighting, or brands...",
    identitySectionTitle: "Identity Preservation",
    strictLightingTitle: "Exact Lighting",
    strictLightingDesc: "Extract exact ambient or flash light",
    includeTattoosTitle: "Tattoos",
    includeTattoosDesc: "Include visible tattoos",

    generateButtonLoading: "Generating Prompt...",
    generatePersonPhoto: "Generate Person Prompt (from Photo)",
    generatePersonText: "Generate Person Prompt (from Idea)",
    generatePOVPhoto: "Generate POV / Object Prompt (from Photo)",
    generatePOVText: "Generate POV / Object Prompt (from Idea)",

    generatedPromptHeader: "Generated Prompt",
    verticalBadge: "9:16 Vertical",
    copyPrompt: "Copy Prompt",
    copiedPrompt: "Copied",
    waitingStateTitle: "Awaiting Input Data",
    waitingStateDesc: "Select a mode on the left, provide a photo or text idea to generate your realistic prompt.",
    generatingStateTitle: "Analyzing & Building Prompt...",

    historyTitle: "History",
    clearHistory: "Clear History",
    emptyHistory: "No saved prompts",
    openHistory: "Open History",
  }
};

export const PRESET_CATEGORIES_TRANSLATIONS: Record<Language, Array<{ label: string; options: string[] }>> = {
  es: [
    {
      label: "Candid & Espontáneas",
      options: [
        "Foto Infraganti", "Instantánea Casual", "Retrato sin Posar",
        "Tomada por un Amigo", "Foto Accidental", "Infraganti a Distancia",
        "Infraganti de Cerca", "Foto POV", "Historia de Redes Sociales"
      ]
    },
    {
      label: "Selfies",
      options: [
        "Selfie en Espejo", "Selfie Clásica", "Selfie de Cuerpo Entero",
        "Selfie de Outfit", "Selfie en Espejo de Baño", "Selfie en el Coche", "Selfie en la Cama",
        "Selfie Ocultando la Cara"
      ]
    },
    {
      label: "Poses & Ángulos",
      options: [
        "Sobre el Hombro", "Perfil Lateral", "Retrato de Tres Cuartos", "Sentado Casual",
        "Acostado", "Pose Inclinada"
      ]
    },
    {
      label: "Acciones & Miradas",
      options: [
        "Mirando a Otro Lado", "Mirando Hacia Atrás", "Instantánea Caminando", "En Plena Acción",
        "Mirando el Teléfono", "Arreglando el Cabello", "Ajustando la Ropa", "Hablando",
        "Atrapado Riendo", "Manos en los Bolsillos"
      ]
    },
    {
      label: "Cámara & Iluminación",
      options: [
        "Foto Cruda de Smartphone", "Instantánea con Flash", "Instantánea Nocturna", "Instantánea Granulada",
        "Foto con Desenfoque de Movimiento", "Cámara Digital de los 2000s", "Estilo de Cámara Desechable"
      ]
    }
  ],
  pt: [
    {
      label: "Candid & Espontâneas",
      options: [
        "Foto Espontânea", "Instantânea Casual", "Retrato Sem Pose",
        "Tirada por um Amigo", "Foto Acidental", "Espontânea à Distância",
        "Espontânea de Perto", "Foto POV", "Story de Rede Social"
      ]
    },
    {
      label: "Selfies",
      options: [
        "Selfie no Espelho", "Selfie Clássica", "Selfie de Corpo Inteiro",
        "Selfie de Look/Outfit", "Selfie no Espelho do Banheiro", "Selfie no Carro", "Selfie na Cama",
        "Selfie Escondendo o Rosto"
      ]
    },
    {
      label: "Poses & Ângulos",
      options: [
        "Sobre o Ombro", "Perfil Lateral", "Retrato Três Quartos", "Sentado Casual",
        "Deitado", "Pose Inclinada"
      ]
    },
    {
      label: "Ações & Olhares",
      options: [
        "Olhando para Longe", "Olhando para Trás", "Instantânea Caminhando", "Em Plena Ação",
        "Olhando o Celular", "Arrumando o Cabelo", "Ajustando a Roupa", "Falando",
        "Pego Rindo", "Mãos nos Bolsos"
      ]
    },
    {
      label: "Câmera & Iluminação",
      options: [
        "Foto Bruta de Smartphone", "Instantânea com Flash", "Instantânea Noturna", "Instantânea Granulada",
        "Foto com Desfoque de Movimento", "Câmera Digital dos Anos 2000", "Estilo Câmera Descartável"
      ]
    }
  ],
  en: [
    {
      label: "Candid & Spontaneous",
      options: [
        "Candid Photo", "Casual Snapshot", "Unposed Portrait",
        "Friend Took This", "Accidental Shot", "Distant Candid",
        "Close Candid", "POV Photo", "Social Media Story"
      ]
    },
    {
      label: "Selfies",
      options: [
        "Mirror Selfie", "Classic Selfie", "Full-Body Selfie",
        "Outfit Selfie", "Bathroom Mirror Selfie", "Car Selfie", "Bed Selfie",
        "Phone-Blocking Selfie"
      ]
    },
    {
      label: "Poses & Angles",
      options: [
        "Over-the-Shoulder", "Side Profile", "Three-Quarter Portrait", "Seated Casual",
        "Lying Down", "Leaning Pose"
      ]
    },
    {
      label: "Actions & Gazes",
      options: [
        "Looking Away", "Looking Back", "Walking Snapshot", "Mid-Action",
        "Looking At Phone", "Fixing Hair", "Adjusting Clothes", "Talking",
        "Caught Laughing", "Hands in Pockets"
      ]
    },
    {
      label: "Camera & Lighting",
      options: [
        "Raw Smartphone Photo", "Flash Snapshot", "Nighttime Snapshot", "Grainy Snapshot",
        "Motion-Blurry Photo", "2000s Digital Camera", "Disposable Camera Style"
      ]
    }
  ]
};
