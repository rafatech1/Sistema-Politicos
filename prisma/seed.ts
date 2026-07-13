import 'dotenv/config';
import { prisma } from '../src/lib/prisma';
import { createUser, findUserByEmail } from '../src/lib/services/user.service';
import { upsertSiteSettings } from '../src/lib/services/site-settings.service';

// Seed de DEMONSTRAÇÃO COMERCIAL: parlamentar fictício (modo Mandato) com
// dados fake, populando todas as seções da Home — para uso em vendas/demo.
// NUNCA é disparado automaticamente pelo `npm run setup` (que faz o
// onboarding real de um cliente) — rode manualmente com `npm run db:seed`
// apenas em um banco de demo/dev.
const DEMO_ADMIN_EMAIL = 'demo@candidato.example';
const DEMO_ADMIN_PASSWORD = 'Demo12345!';

const img = (seed: string, w: number, h: number) => `https://picsum.photos/seed/${seed}/${w}/${h}`;

async function main() {
  console.log('Seeding banco de demonstração (modo Mandato)...');

  const existingAdmin = await findUserByEmail(DEMO_ADMIN_EMAIL);
  const admin = existingAdmin
    ? existingAdmin
    : await createUser({
        name: 'Equipe Demo',
        email: DEMO_ADMIN_EMAIL,
        password: DEMO_ADMIN_PASSWORD,
        role: 'ADMIN',
      });

  console.log(
    existingAdmin
      ? 'Usuário admin de demo já existe, pulando.'
      : `Usuário admin de demo criado: ${DEMO_ADMIN_EMAIL} / ${DEMO_ADMIN_PASSWORD}`,
  );

  await upsertSiteSettings(
    {
      mode: 'MANDATE',
      candidateName: 'Rafael Araújo',
      candidateNumber: '45123',
      partyAcronym: 'PDC',
      partyName: 'Partido Democrático do Cidadão',
      position: 'Deputado Estadual',
      slogan: 'Coragem para mudar, compromisso para servir',
      primaryColor: '#0033FF',
      secondaryColor: '#33FFFF',
      accentColor: '#FFCC00',
      profilePhotoUrl: img('carlos-mendes-perfil', 800, 800),
      heroBackgroundImageUrl: img('carlos-mendes-hero', 1920, 1080),
      aboutTagline: 'Cristão, conservador e defensor da família',
      aboutShortText:
        'Advogado, ex-vereador e hoje Deputado Estadual, Carlos dedica seu mandato à segurança pública, à saúde e à defesa da família cearense.',
      aboutFullText:
        '<p>Rafael Araújo nasceu e cresceu em Fortaleza, onde se formou em Direito e iniciou sua trajetória de serviço público como assessor legislativo.</p><p>Eleito vereador em 2016 e reeleito em 2020, chegou à Assembleia Legislativa do Ceará em 2022 com uma das maiores votações do estado, sempre pautado pela defesa da segurança pública, da saúde e da família.</p>',
      officeAddress: 'Assembleia Legislativa do Ceará — Av. Desembargador Moreira, 2807, Fortaleza - CE',
      officeMapEmbedUrl: 'https://maps.google.com/maps?q=Assembleia+Legislativa+do+Cear%C3%A1&output=embed',
      instagramUrl: 'https://instagram.com/carlosmendes45',
      facebookUrl: 'https://facebook.com/carlosmendes45',
      youtubeUrl: 'https://youtube.com/@carlosmendes45',
      twitterUrl: 'https://x.com/carlosmendes45',
      whatsappNumber: '5585999999999',
      whatsappDefaultMessage: 'Olá! Quero saber mais sobre o mandato do Deputado Carlos Mendes.',
      contactEmail: 'contato@carlosmendes45.example',
      campaignCnpj: '00.000.000/0001-00',
      tseIdentification:
        'Material de divulgação de mandato parlamentar — Dep. Carlos Mendes (PDC). Conteúdo de responsabilidade do gabinete.',
      footerText: 'Gabinete Dep. Carlos Mendes',
      privacyPolicyText:
        '<p>Texto de exemplo de política de privacidade (LGPD) para fins de demonstração comercial. Os dados enviados pelos formulários deste site são usados exclusivamente para retorno de contato e não são compartilhados com terceiros.</p>',
      termsOfServiceText:
        '<p>Texto de exemplo de termos de uso para fins de demonstração comercial.</p>',
      electionCountdownEnabled: false,
      metaTitle: 'Dep. Carlos Mendes — Assembleia Legislativa do Ceará',
      metaDescription: 'Site oficial do mandato do Deputado Estadual Carlos Mendes (PDC).',
    },
    admin.id,
  );

  // ---------- Badges do Hero ----------
  const badges = [
    { icon: '🏆', text: 'Deputado mais votado do Ceará em 2022', order: 0 },
    { icon: '📊', text: '49,6% dos votos de Fortaleza', order: 1 },
    { icon: '📜', text: '12 leis de autoria própria aprovadas', order: 2 },
  ];
  for (const badge of badges) {
    const existing = await prisma.achievementBadge.findFirst({ where: { text: badge.text } });
    if (!existing) await prisma.achievementBadge.create({ data: badge });
  }

  // ---------- No que acredito ----------
  const beliefs = [
    {
      title: 'Segurança pública de verdade',
      tagline: 'Cidadão livre. Bandido preso.',
      description: 'Mais efetivo policial nas ruas, câmeras de monitoramento e endurecimento das leis penais.',
      order: 0,
    },
    {
      title: 'Defesa da família',
      tagline: 'A família é a base de uma sociedade forte.',
      description: 'Políticas públicas que fortalecem e protegem a família cearense.',
      order: 1,
    },
    {
      title: 'Saúde que funciona',
      tagline: 'Fim das filas, mais UPAs, mais médicos.',
      description: 'Investimento em atenção básica e ampliação de leitos na rede estadual.',
      order: 2,
    },
    {
      title: 'Educação de qualidade',
      tagline: 'Escola boa muda o destino de uma criança.',
      description: 'Valorização do professor e mais escolas em tempo integral.',
      order: 3,
    },
  ];
  for (const belief of beliefs) {
    const existing = await prisma.beliefValue.findFirst({ where: { title: belief.title } });
    if (!existing) await prisma.beliefValue.create({ data: { ...belief, isActive: true } });
  }

  // ---------- Vídeos em destaque ----------
  const videos = [
    { title: 'Discurso na tribuna: segurança pública', youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', order: 0 },
    { title: 'Visita à UPA do bairro Bom Jardim', youtubeUrl: 'https://www.youtube.com/watch?v=9bZkp7q19f0', order: 1 },
    { title: 'Entrevista: balanço do primeiro ano de mandato', youtubeUrl: 'https://www.youtube.com/watch?v=jNQXAC9IVRw', order: 2 },
  ];
  for (const video of videos) {
    const existing = await prisma.video.findFirst({ where: { title: video.title } });
    if (!existing) await prisma.video.create({ data: video });
  }

  // ---------- Instagram em destaque ----------
  const instagramPosts = [
    { imageUrl: img('ig-post-1', 800, 800), caption: 'Visita à comunidade do Pirambu ontem à tarde.', postUrl: 'https://instagram.com/p/demo1', order: 0 },
    { imageUrl: img('ig-post-2', 800, 800), caption: 'Sessão na Assembleia: aprovação do PL de segurança.', postUrl: 'https://instagram.com/p/demo2', order: 1 },
    { imageUrl: img('ig-post-3', 800, 800), caption: 'Reunião com moradores sobre a emenda da saúde.', postUrl: 'https://instagram.com/p/demo3', order: 2 },
  ];
  for (const post of instagramPosts) {
    const existing = await prisma.instagramHighlight.findFirst({ where: { postUrl: post.postUrl } });
    if (!existing) await prisma.instagramHighlight.create({ data: post });
  }

  // ---------- Categoria de notícias ----------
  const categoria = await prisma.categoria.upsert({
    where: { slug: 'atuacao-parlamentar' },
    update: {},
    create: { name: 'Atuação Parlamentar', slug: 'atuacao-parlamentar', type: 'NOTICIA' },
  });

  // ---------- Notícias ----------
  const posts = [
    {
      slug: 'assembleia-aprova-projeto-de-lei-de-carlos-mendes',
      title: 'Assembleia aprova projeto de lei de Carlos Mendes que endurece penas',
      excerpt: 'Proposta aumenta o tempo mínimo de pena para crimes contra a criança e o adolescente.',
      content:
        '<p>A Assembleia Legislativa do Ceará aprovou nesta semana o projeto de lei de autoria do Dep. Carlos Mendes que endurece as penas para crimes contra crianças e adolescentes.</p><p>O projeto segue agora para sanção do governador.</p>',
      coverImageUrl: img('noticia-1', 1200, 675),
      isFeatured: true,
    },
    {
      slug: 'deputado-destina-emenda-para-saude-de-fortaleza',
      title: 'Deputado destina R$ 3 milhões em emenda para a saúde de Fortaleza',
      excerpt: 'Recursos serão usados na reforma de duas UPAs da capital.',
      content:
        '<p>O Dep. Carlos Mendes destinou R$ 3 milhões em emenda parlamentar para a reforma de unidades de pronto atendimento em Fortaleza.</p>',
      coverImageUrl: img('noticia-2', 1200, 675),
      isFeatured: true,
    },
    {
      slug: 'balanco-do-primeiro-ano-de-mandato',
      title: 'Balanço: veja o que o mandato de Carlos Mendes já entregou',
      excerpt: 'Levantamento reúne leis aprovadas, emendas destinadas e visitas realizadas.',
      content:
        '<p>Em um ano de mandato, o gabinete do Dep. Carlos Mendes já aprovou 4 leis de autoria própria e destinou mais de R$ 9 milhões em emendas.</p>',
      coverImageUrl: img('noticia-3', 1200, 675),
      isFeatured: false,
    },
  ];
  for (const post of posts) {
    await prisma.post.upsert({
      where: { slug: post.slug },
      update: {},
      create: {
        ...post,
        status: 'PUBLISHED',
        publishedAt: new Date(),
        authorId: admin.id,
        categoryId: categoria.id,
      },
    });
  }

  // ---------- Projetos de Lei (modo Mandato) ----------
  const projetosDeLei = [
    {
      number: '601/2023',
      slug: 'pl-601-2023',
      title: 'Endurecimento de penas para crimes contra crianças e adolescentes',
      summary: 'Aumenta o tempo mínimo de pena para crimes de violência contra menores de idade.',
      content:
        '<p>O Projeto de Lei 601/2023 altera o Código Penal estadual para aumentar o tempo mínimo de pena em crimes de violência contra crianças e adolescentes.</p>',
      status: 'APROVADO' as const,
      externalUrl: 'https://al.ce.gov.br',
      coverImageUrl: img('pl-1', 1200, 675),
      isFeatured: true,
    },
    {
      number: '742/2023',
      slug: 'pl-742-2023',
      title: 'Câmeras de monitoramento em escolas públicas estaduais',
      summary: 'Obriga a instalação de câmeras de segurança em todas as escolas da rede estadual.',
      content:
        '<p>O Projeto de Lei 742/2023 obriga a Secretaria de Educação a instalar câmeras de monitoramento em todas as escolas da rede estadual até 2026.</p>',
      status: 'EM_TRAMITACAO' as const,
      externalUrl: 'https://al.ce.gov.br',
      coverImageUrl: img('pl-2', 1200, 675),
      isFeatured: true,
    },
    {
      number: '108/2024',
      slug: 'pl-108-2024',
      title: 'Isenção de IPVA para taxistas e motoristas de aplicativo',
      summary: 'Concede isenção de IPVA para veículos usados em transporte remunerado individual.',
      content:
        '<p>O Projeto de Lei 108/2024 concede isenção de IPVA para taxistas e motoristas de aplicativo cadastrados nos órgãos municipais.</p>',
      status: 'APRESENTADO' as const,
      coverImageUrl: img('pl-3', 1200, 675),
      isFeatured: false,
    },
  ];
  for (const pl of projetosDeLei) {
    await prisma.projetoDeLei.upsert({
      where: { slug: pl.slug },
      update: {},
      create: { ...pl, publishStatus: 'PUBLISHED' },
    });
  }

  // ---------- Emendas Parlamentares ----------
  const emendas = [
    { value: 3000000, area: 'Saúde', municipio: 'Fortaleza', description: 'Reforma de UPAs', status: 'PAGA' as const, year: 2024 },
    { value: 1500000, area: 'Educação', municipio: 'Caucaia', description: 'Reforma de escolas municipais', status: 'EM_EXECUCAO' as const, year: 2024 },
    { value: 4500000, area: 'Infraestrutura', municipio: 'Maracanaú', description: 'Pavimentação de vias', status: 'EMPENHADA' as const, year: 2025 },
  ];
  for (const emenda of emendas) {
    const existing = await prisma.emendaParlamentar.findFirst({
      where: { municipio: emenda.municipio, area: emenda.area, year: emenda.year },
    });
    if (!existing) await prisma.emendaParlamentar.create({ data: emenda });
  }

  // ---------- Comissões ----------
  const comissoes = [
    {
      title: 'Presidente da Comissão de Segurança Pública',
      organization: 'Assembleia Legislativa do Ceará',
      startDate: new Date('2023-02-01'),
      endDate: null,
      description: 'Condução das discussões legislativas sobre segurança pública no estado.',
      order: 0,
    },
    {
      title: 'Membro da Comissão de Saúde',
      organization: 'Assembleia Legislativa do Ceará',
      startDate: new Date('2023-02-01'),
      endDate: null,
      description: null,
      order: 1,
    },
  ];
  for (const comissao of comissoes) {
    const existing = await prisma.comissao.findFirst({ where: { title: comissao.title } });
    if (!existing) await prisma.comissao.create({ data: comissao });
  }

  // ---------- Linha do tempo (biografia) ----------
  const timeline = [
    { year: 2012, title: 'Formação em Direito', description: 'Graduação pela Universidade Federal do Ceará.', order: 0 },
    { year: 2016, title: 'Eleito vereador de Fortaleza', description: 'Primeiro mandato eletivo, focado em segurança e saúde.', order: 1 },
    { year: 2020, title: 'Reeleito vereador com a maior votação do bairro', description: null, order: 2 },
    { year: 2022, title: 'Eleito Deputado Estadual', description: 'Uma das maiores votações do Ceará.', order: 3 },
  ];
  for (const item of timeline) {
    const existing = await prisma.biografiaTimelineItem.findFirst({ where: { title: item.title } });
    if (!existing) await prisma.biografiaTimelineItem.create({ data: item });
  }

  // ---------- Modo Campanha (Propostas/Eixos) — seedado mesmo não aparecendo
  // na Home em modo Mandato, para provar que o toggle de modo funciona. ----------
  const eixoSeguranca = await prisma.eixoTematico.upsert({
    where: { slug: 'seguranca' },
    update: {},
    create: { name: 'Segurança', slug: 'seguranca', order: 0 },
  });
  const eixoSaude = await prisma.eixoTematico.upsert({
    where: { slug: 'saude' },
    update: {},
    create: { name: 'Saúde', slug: 'saude', order: 1 },
  });

  const propostas = [
    {
      slug: 'mais-policiamento-nos-bairros',
      title: 'Mais policiamento nos bairros',
      summary: 'Ampliação do efetivo policial nas regiões de maior vulnerabilidade.',
      content: '<p>Proposta de ampliação do policiamento comunitário nos bairros com maior índice de criminalidade.</p>',
      eixoTematicoId: eixoSeguranca.id,
      isFeatured: true,
    },
    {
      slug: 'zero-fila-nas-upas',
      title: 'Zero fila nas UPAs',
      summary: 'Plano de reforma e ampliação das unidades de pronto atendimento.',
      content: '<p>Proposta de investimento em atenção básica para reduzir as filas nas UPAs estaduais.</p>',
      eixoTematicoId: eixoSaude.id,
      isFeatured: true,
    },
    {
      slug: 'cameras-inteligentes-nas-escolas',
      title: 'Câmeras inteligentes nas escolas',
      summary: 'Monitoramento por câmeras em todas as escolas da rede estadual.',
      content: '<p>Proposta de instalação de câmeras com reconhecimento de imagem nas escolas públicas.</p>',
      eixoTematicoId: eixoSeguranca.id,
      isFeatured: false,
    },
  ];
  for (const proposta of propostas) {
    await prisma.proposta.upsert({
      where: { slug: proposta.slug },
      update: {},
      create: { ...proposta, status: 'PUBLISHED', publishedAt: new Date(), authorId: admin.id },
    });
  }

  console.log('Seed concluído.');
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
