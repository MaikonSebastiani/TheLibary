import { prisma } from "../src/lib/prisma";

type LivroSeed = {
  titulo: string;
  editora: string;
  edicao: number;
  anoPublicacao: string;
  valor: string;
  autorIds: number[];
  assuntoIds: number[];
};

async function createLivro(data: LivroSeed) {
  return prisma.livro.create({
    data: {
      titulo: data.titulo,
      editora: data.editora,
      edicao: data.edicao,
      anoPublicacao: data.anoPublicacao,
      valor: data.valor,
      autores: {
        create: data.autorIds.map((autorId) => ({ autorId })),
      },
      assuntos: {
        create: data.assuntoIds.map((assuntoId) => ({ assuntoId })),
      },
    },
  });
}

async function main() {
  await prisma.livroAssunto.deleteMany();
  await prisma.livroAutor.deleteMany();
  await prisma.livro.deleteMany();
  await prisma.assunto.deleteMany();
  await prisma.autor.deleteMany();

  const [
    machado,
    clarice,
    orwell,
    huxley,
    tolkien,
    gaiman,
    pratchett,
    dumas,
    maquet,
  ] = await Promise.all([
    prisma.autor.create({ data: { nome: "Machado de Assis" } }),
    prisma.autor.create({ data: { nome: "Clarice Lispector" } }),
    prisma.autor.create({ data: { nome: "George Orwell" } }),
    prisma.autor.create({ data: { nome: "Aldous Huxley" } }),
    prisma.autor.create({ data: { nome: "J.R.R. Tolkien" } }),
    prisma.autor.create({ data: { nome: "Neil Gaiman" } }),
    prisma.autor.create({ data: { nome: "Terry Pratchett" } }),
    prisma.autor.create({ data: { nome: "Alexandre Dumas" } }),
    prisma.autor.create({ data: { nome: "Auguste Maquet" } }),
  ]);

  const [romance, ficcao, politica, fantasia, distopia, aventura, suspense] =
    await Promise.all([
      prisma.assunto.create({ data: { descricao: "Romance" } }),
      prisma.assunto.create({ data: { descricao: "Ficcao" } }),
      prisma.assunto.create({ data: { descricao: "Politica" } }),
      prisma.assunto.create({ data: { descricao: "Fantasia" } }),
      prisma.assunto.create({ data: { descricao: "Distopia" } }),
      prisma.assunto.create({ data: { descricao: "Aventura" } }),
      prisma.assunto.create({ data: { descricao: "Suspense" } }),
    ]);

  await Promise.all([
    createLivro({
      titulo: "Dom Casmurro",
      editora: "Garnier",
      edicao: 1,
      anoPublicacao: "1899",
      valor: "49.90",
      autorIds: [machado.id],
      assuntoIds: [romance.id],
    }),
    createLivro({
      titulo: "Memorias Postumas de Bras Cubas",
      editora: "Penguin",
      edicao: 2,
      anoPublicacao: "1881",
      valor: "54.90",
      autorIds: [machado.id],
      assuntoIds: [romance.id, ficcao.id],
    }),
    createLivro({
      titulo: "A Hora da Estrela",
      editora: "Rocco",
      edicao: 1,
      anoPublicacao: "1977",
      valor: "39.90",
      autorIds: [clarice.id],
      assuntoIds: [romance.id, ficcao.id],
    }),
    createLivro({
      titulo: "Agua Viva",
      editora: "Rocco",
      edicao: 3,
      anoPublicacao: "1973",
      valor: "44.90",
      autorIds: [clarice.id],
      assuntoIds: [romance.id],
    }),
    createLivro({
      titulo: "1984",
      editora: "Companhia das Letras",
      edicao: 1,
      anoPublicacao: "1949",
      valor: "59.90",
      autorIds: [orwell.id],
      assuntoIds: [ficcao.id, politica.id, distopia.id],
    }),
    createLivro({
      titulo: "A Revolucao dos Bichos",
      editora: "Companhia das Letras",
      edicao: 1,
      anoPublicacao: "1945",
      valor: "42.90",
      autorIds: [orwell.id],
      assuntoIds: [politica.id, ficcao.id],
    }),
    createLivro({
      titulo: "Admiravel Mundo Novo",
      editora: "Globo",
      edicao: 2,
      anoPublicacao: "1932",
      valor: "47.50",
      autorIds: [huxley.id],
      assuntoIds: [ficcao.id, distopia.id],
    }),
    createLivro({
      titulo: "O Senhor dos Aneis",
      editora: "HarperCollins",
      edicao: 4,
      anoPublicacao: "1954",
      valor: "129.90",
      autorIds: [tolkien.id],
      assuntoIds: [fantasia.id, aventura.id],
    }),
    createLivro({
      titulo: "Boas Presagios",
      editora: "Bertrand Brasil",
      edicao: 1,
      anoPublicacao: "1990",
      valor: "69.90",
      autorIds: [gaiman.id, pratchett.id],
      assuntoIds: [fantasia.id, ficcao.id],
    }),
    createLivro({
      titulo: "O Conde de Monte Cristo",
      editora: "Zahar",
      edicao: 1,
      anoPublicacao: "1844",
      valor: "89.90",
      autorIds: [dumas.id, maquet.id],
      assuntoIds: [aventura.id, suspense.id, romance.id],
    }),
  ]);

  console.log("Seed concluido:");
  console.log("  - 9 autores");
  console.log("  - 7 assuntos");
  console.log("  - 10 livros (2 com co-autoria)");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
