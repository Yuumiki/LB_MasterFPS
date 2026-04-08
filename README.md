# LB-MasterFPS

O LB-MasterFPS é um simulador de performance de hardware mobile desenvolvido com React Native e Expo. A proposta do aplicativo é permitir que o usuário simule diferentes configurações de hardware (combinando modelos de CPU, GPU e RAM) para estimar o desempenho em FPS de vários jogos, desde títulos de eSports mais leves até jogos Next-Gen mais pesados.

## Tecnologias e Bibliotecas Utilizadas

O desenvolvimento foi focado em utilizar o ecossistema moderno do React Native:

- **React Native & Expo:** Base do aplicativo e ambiente de desenvolvimento.
- **JavaScript (ES6+):** Linguagem principal, utilizando a Context API e Hooks (useState, useMemo, useRef) para o gerenciamento de estado global e regras de negócio.
- **react-native-view-shot:** Implementado para capturar a tela do relatório gerado e transformá-lo em uma imagem exportável.
- **expo-sharing:** Integrado para permitir o compartilhamento nativo do relatório gerado para outros aplicativos (como WhatsApp ou e-mail).

## Estrutura de Dados

Para garantir um funcionamento rápido e offline, a arquitetura do aplicativo dispensa chamadas a APIs externas para a base de dados. Toda a base de componentes (processadores, placas de vídeo, memória e armazenamento) e a lista de jogos com seus respectivos pesos de renderização estão estruturados em um arquivo JSON local estático.

## Principais Funcionalidades

- **Cálculo de Renderização (FPS):** Um algoritmo customizado que cruza a pontuação do hardware selecionado com o "peso" do motor gráfico do jogo escolhido para gerar uma estimativa de quadros por segundo.
- **Análise de Gargalo (Bottleneck):** O sistema calcula a proporção de desempenho entre a CPU e a GPU para alertar o usuário caso um dos componentes esteja limitando o outro.
- **Engenharia Térmica:** Cálculo de TDP máximo e sugestões automáticas de soluções de refrigeração baseadas no consumo de energia.
- **Relatórios Exportáveis:** O usuário pode salvar setups localmente ou exportar um relatório visual completo do hardware montado em formato de imagem.

## Passo a Passo de Uso

Para extrair o máximo das simulações do LB-MasterFPS, siga o fluxo abaixo:

1. **Montagem do Setup:** Na tela inicial, selecione as peças que irão compor o seu computador (Processador, Placa de Vídeo, RAM e Armazenamento) e avance para a geração do relatório.
2. **Seleção de Software:** Na tela de resultados, localize o bloco "Software em Análise" e toque em "Alterar". Um modal será aberto permitindo buscar e selecionar o jogo que você deseja simular.
3. **Ajuste Fino:** Utilize os seletores de "Resolução Alvo" (ex: 1080p, 1440p, 4K) e "Preset Gráfico" (Baixo, Médio, Alto, Ultra) para visualizar o impacto direto na estimativa de FPS.
4. **Interpretação de Dados:** Observe a seção de "Análise de Gargalo" para entender se o sistema está equilibrado ou se há limitação por parte da CPU ou GPU. Consulte também os gráficos de performance e a solução térmica recomendada.
5. **Salvamento e Exportação:** Para registrar a simulação, clique no botão "Exportar Relatório" no topo da tela para gerar uma imagem do documento, ou utilize os botões no final da página para nomear e salvar o setup no histórico do aplicativo.

## Como Executar o Projeto

Para testar o aplicativo na sua máquina, você precisará do Node.js instalado e do aplicativo Expo Go no seu smartphone.

1. Clone este repositório:
   ```bash
   git clone [https://github.com/Yuumiki/LB_MasterFPS.git](https://github.com/Yuumiki/LB_MasterFPS.git)
   ```

2. Acesse a pasta do projeto e instale as dependências:
   ```bash
   cd LB_MasterFPS
   npm install
   ```

3. Inicie o servidor do Expo:
   ```bash
   npx expo start
   ```

4. Abra o aplicativo Expo Go no seu smartphone e escaneie o QR Code que aparecerá no terminal ou no navegador.
