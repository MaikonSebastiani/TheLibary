CREATE TABLE "Livro" (
  "Codl" SERIAL NOT NULL,
  "Titulo" VARCHAR(40) NOT NULL,
  "Editora" VARCHAR(40) NOT NULL,
  "Edicao" INTEGER NOT NULL,
  "AnoPublicacao" VARCHAR(4) NOT NULL,
  "Valor" DECIMAL(10, 2) NOT NULL,

  CONSTRAINT "Livro_pkey" PRIMARY KEY ("Codl")
);

CREATE TABLE "Autor" (
  "CodAu" SERIAL NOT NULL,
  "Nome" VARCHAR(40) NOT NULL,

  CONSTRAINT "Autor_pkey" PRIMARY KEY ("CodAu")
);

CREATE TABLE "Assunto" (
  "codAs" SERIAL NOT NULL,
  "Descricao" VARCHAR(20) NOT NULL,

  CONSTRAINT "Assunto_pkey" PRIMARY KEY ("codAs")
);

CREATE TABLE "Livro_Autor" (
  "Livro_Codl" INTEGER NOT NULL,
  "Autor_CodAu" INTEGER NOT NULL,

  CONSTRAINT "Livro_Autor_pkey" PRIMARY KEY ("Livro_Codl", "Autor_CodAu")
);

CREATE TABLE "Livro_Assunto" (
  "Livro_Codl" INTEGER NOT NULL,
  "Assunto_codAs" INTEGER NOT NULL,

  CONSTRAINT "Livro_Assunto_pkey" PRIMARY KEY ("Livro_Codl", "Assunto_codAs")
);

CREATE INDEX "Livro_Autor_Autor_CodAu_idx" ON "Livro_Autor"("Autor_CodAu");

CREATE INDEX "Livro_Assunto_Assunto_codAs_idx" ON "Livro_Assunto"("Assunto_codAs");

ALTER TABLE "Livro_Autor"
  ADD CONSTRAINT "Livro_Autor_Livro_Codl_fkey"
  FOREIGN KEY ("Livro_Codl") REFERENCES "Livro"("Codl")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Livro_Autor"
  ADD CONSTRAINT "Livro_Autor_Autor_CodAu_fkey"
  FOREIGN KEY ("Autor_CodAu") REFERENCES "Autor"("CodAu")
  ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Livro_Assunto"
  ADD CONSTRAINT "Livro_Assunto_Livro_Codl_fkey"
  FOREIGN KEY ("Livro_Codl") REFERENCES "Livro"("Codl")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Livro_Assunto"
  ADD CONSTRAINT "Livro_Assunto_Assunto_codAs_fkey"
  FOREIGN KEY ("Assunto_codAs") REFERENCES "Assunto"("codAs")
  ON DELETE RESTRICT ON UPDATE CASCADE;
