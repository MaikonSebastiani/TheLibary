import { prisma } from "../src/lib/prisma";

async function main() {
  await prisma.livroAssunto.deleteMany();
  await prisma.livroAutor.deleteMany();
  await prisma.livro.deleteMany();
  await prisma.assunto.deleteMany();
  await prisma.autor.deleteMany();

  const [machado, clarice, george] = await Promise.all([
    prisma.autor.create({ data: { nome: "Machado de Assis" } }),
    prisma.autor.create({ data: { nome: "Clarice Lispector" } }),
    prisma.autor.create({ data: { nome: "George Orwell" } }),
  ]);

  const [romance, ficcao, politica] = await Promise.all([
    prisma.assunto.create({ data: { descricao: "Romance" } }),
    prisma.assunto.create({ data: { descricao: "Ficcao" } }),
    prisma.assunto.create({ data: { descricao: "Politica" } }),
  ]);

  await prisma.livro.create({
    data: {
      titulo: "Dom Casmurro",
      editora: "Garnier",
      edicao: 1,
      anoPublicacao: "1899",
      valor: "49.90",
      autores: {
        create: [{ autorId: machado.id }],
      },
      assuntos: {
        create: [{ assuntoId: romance.id }],
      },
    },
  });

  await prisma.livro.create({
    data: {
      titulo: "A Hora da Estrela",
      editora: "Rocco",
      edicao: 1,
      anoPublicacao: "1977",
      valor: "39.90",
      autores: {
        create: [{ autorId: clarice.id }],
      },
      assuntos: {
        create: [{ assuntoId: romance.id }, { assuntoId: ficcao.id }],
      },
    },
  });

  await prisma.livro.create({
    data: {
      titulo: "1984",
      editora: "Companhia",
      edicao: 1,
      anoPublicacao: "1949",
      valor: "59.90",
      autores: {
        create: [{ autorId: george.id }],
      },
      assuntos: {
        create: [{ assuntoId: ficcao.id }, { assuntoId: politica.id }],
      },
    },
  });
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
