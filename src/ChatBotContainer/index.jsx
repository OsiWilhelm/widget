import React, { useEffect, useState } from "react";
import { OpenInNew } from "@mui/icons-material";
import { Link } from "@mui/material";
import ChatBoot from "../ChatBoot";
import axios from "axios";

const baseURL = "http://serradata.herokuapp.com/intencoes/";

export default function ChatBotContainer() {
  const [intencoes, setIntencoes] = useState([]);
  let steps = [];

  useEffect(() => {
    axios.get(baseURL).then((res) => {
      setIntencoes(res.data);
    });
  }, []);

  const criarFluxo = (intencaoId = 1) => {
    let intencao = [];
    let opcoes = [];

    if (intencoes.length > 0) {
      intencao = intencoes.filter((i) => i.id == intencaoId);

      steps.push({
        id: intencaoId,
        message: intencao[0].titulo,
        trigger: `${intencaoId}-opcoes`,
      });

      if (intencao[0].opcoes) {
        intencao[0].opcoes.forEach((opcao, i) => {
          if (opcao.proximaIntencao != null) {
            opcoes.push({
              value: i + 1,
              label: opcao.descricao,
              trigger: opcao.proximaIntencao.id,
            });

            if (steps.filter((i) => i.id == opcao.proximaIntencao.id) == 0) {
              criarFluxo(opcao.proximaIntencao.id);
            }
          } else {
            opcoes.push({
              value: i + 1,
              label: opcao.descricao,
              trigger: `solucao${intencaoId}-${i + 1}`,
            });

            steps.push({
              id: `solucao${intencaoId}-${i + 1}`,
              component: (
                <div>
                  {" "}
                  {opcao.solucao.href}:{" "}
                  <Link href={opcao.solucao.href}>
                    <OpenInNew />
                  </Link>
                </div>
              ),
              end: true,
            });
          }
        });
      }

      steps.push({
        id: `${intencaoId}-opcoes`,
        options: opcoes,
      });
    }
  };

  const criarChatBot = () => {
    criarFluxo();
    return (
      <ChatBoot
        headerTitle="SerraData"
        floating
        placeholder="Digite aqui..."
        botAvatar="https://preview.redd.it/788khtqa7c551.png?width=960&crop=smart&auto=webp&s=a1f107f8f7af82ff61c2b9db3a511f7f81d3715c"
        steps={steps}
      />
    );
  };

  return <>{intencoes.length > 0 ? criarChatBot() : null}</>;
}
