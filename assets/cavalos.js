/* ==========================================================================
   HARAS TERRA BRASILIS · DADOS DO CATÁLOGO
   Este é o único arquivo que você precisa mexer para trocar os cavalos.

   Para adicionar um cavalo: copie um bloco { ... } inteiro, cole no fim da
   lista e troque os dados. O "id" precisa ser único (só letras minúsculas,
   números e hífen), porque ele vira o link da ficha: site.com/#cavalo/id
   ========================================================================== */

window.HARAS = {
  /* Contato do haras. Preencha e o site inteiro passa a usar. */
  contato: {
    whatsapp: '',          // DDI + DDD + número, só dígitos. Ex.: '5511999999999'. Vazio = o formulário manda por e-mail
    telefone: '11 4482 2271',
    instagram: '',         // só o usuário, sem @
    email: 'haras@harasterrabrasilis.com.br',
    endereco: 'Rua Doná Maria Nunes, 300',
    cidade: 'Mairiporã, SP',
    mapa: 'https://goo.gl/maps/W6NRyd5FHBDwTtxu8',
    site: 'https://harasterrabrasilis.com.br'
  },

  /* Vídeo do topo (toca uma vez e para na pose final). false = só a imagem parada. */
  videoNoTopo: true
};

/* Base do Koda. As cópias abaixo usam os mesmos dados só para você ver
   o catálogo cheio. Troque cada uma pelo cavalo de verdade. */
const KODA = {
  nome: 'KODA TB (IA)',
  apelido: 'Koda',
  status: 'Vivo',
  disponivel: true,                   // false mostra o selo "Reservado"
  registro: '0022980-BH',
  ueln: '076001000022980',
  microchip: '985111000881424',
  nascimento: '2016-09-12',           // ano-mês-dia
  sexo: 'Macho',                      // 'Macho' ou 'Fêmea'
  raca: 'Brasileiro de Hipismo',
  pelagem: 'Castanha',
  metodo: 'Monta natural com TE',
  dna: 'LGEV102865',
  criador: 'Haras Terra Brasilis',
  proprietario: 'Haras Terra Brasilis',
  localNascimento: 'Haras Terra Brasilis',
  foto: 'assets/img/koda.jpg',
  fotoCard: 'assets/img/koda-card.jpg',
  fotoCredito: 'CLAC',
  youtube: 'aL7u5PE0ZXc',             // só o código do vídeo, o que vem depois de youtu.be/
  abcch: 'https://abcch.com.br/animal/42F3732C-CE24-4FE5-A38F-8117BCE6C3E6',
  resumo: 'Castanho de salto, filho de Etoulon VDL e neto de Toulon. Sangue de pista dos dois lados, criado e registrado no Haras Terra Brasilis.',
  genealogia: {
    pai: 'ETOULON VDL',
    mae: 'BELLA DONNA TB (IA)',
    // avós: pai do pai, mãe do pai, pai da mãe, mãe da mãe
    avos: ['TOULON', 'UTAREUSA', 'EMILION', 'LISETTE JMEN'],
    // bisavós, na mesma ordem (de cima para baixo da ficha da ABCCH)
    bisavos: ['HEARTBREAKER', 'NIKITA', 'CALVADOS', 'BRIGITTE',
              'WELLINGTON', 'RAMIRHA', 'LAMOUREUX II', 'PRINZESSIN'],
    // trisavós, na mesma ordem
    trisavos: ['NIMMERDOR', 'BACAROLE', 'JOKINAL DE BORNIVAL', 'HAYLAND-L',
               'URIEL', 'GOLD ROSE', 'LE MEXICO', 'TERUSA',
               'NIMMERDOR', 'PATTY', 'FARNESE', 'FIANCE',
               'LANDADEL', 'ST.PT.ST. REBECKA', 'PILOT', 'FEUERLADY']
  }
};

window.HARAS.cavalos = [
  { id: 'koda-tb', ...KODA },
  { id: 'cavalo-2', ...KODA },
  { id: 'cavalo-3', ...KODA },
  { id: 'cavalo-4', ...KODA },
  { id: 'cavalo-5', ...KODA },
  { id: 'cavalo-6', ...KODA }
];
