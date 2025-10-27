
document.addEventListener("DOMContentLoaded", () => {
  fetch("/api/auth/aluno")
    .then((res) => {
      if (!res.ok) {
        throw new Error("Erro na requisição dos dados");
      }
      return res.json();
    })
    .then((data) => {
      console.log("Dados recebidos:", data); 
      const aluno = data.aluno;
      const raElemento = document.getElementById("ra");
      const cursoElemento = document.getElementById("curso");
      const nomeAluno = document.getElementById("nome_aluno");

      if (aluno) {
        raElemento.innerHTML = aluno.REG_ACADEMICO;
        cursoElemento.innerHTML = aluno.NOME_CURSO;
        nomeAluno.innerHTML = aluno.NOME_COMPLETO;
      } else {
        raElemento.innerHTML = "Erro";
        cursoElemento.innerHTML = "Erro";
        nomeAluno.innerHTML = "Erro";
      }

      const disciplinas = data.disciplinas;
      const tabelaBody = document.getElementById("tabela-disciplinas");

      tabelaBody.innerHTML = "";

      if (Array.isArray(disciplinas) && disciplinas.length > 0) {
        disciplinas.forEach((disciplina) => {
          const tr = document.createElement("tr");

          tr.innerHTML = `
                        <td>${disciplina.NOME}</td>
                        <td>${disciplina.CARGA_HORARIA}</td>
                        <td>${disciplina.QUANTIDADE_FALTAS}</td>
                        
                        `;

          tabelaBody.appendChild(tr);
        });
      } else {
        // Caso não venha nenhuma disciplina
        tabelaBody.innerHTML =
          '<tr><td colspan="4">Nenhuma disciplina encontrada.</td></tr>';
      }
    })
    .catch((error) => {
      console.error("Erro no fetch:", error);
      document.getElementById("ra").innerHTML = "Erro";
      document.getElementById("curso").innerHTML = "Erro";
      document.getElementById("tabela-disciplinas").innerHTML =
        '<tr><td colspan="4">Erro ao carregar disciplinas.</td></tr>';
    });
});
