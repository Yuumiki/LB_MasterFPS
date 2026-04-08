import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useEffect, useState } from "react";

export const HardwareContext = createContext();

export const HardwareProvider = ({ children }) => {
  const [selectedCPU, setSelectedCPU] = useState(null);
  const [selectedGPU, setSelectedGPU] = useState(null);
  const [selectedRAM, setSelectedRAM] = useState(null);
  const [selectedStorage, setSelectedStorage] = useState(null);
  const [selectedGame, setSelectedGame] = useState(null);

  const [resolucao, setResolucao] = useState("1080p");
  const [preset, setPreset] = useState("Ultra");

  const [savedSetups, setSavedSetups] = useState([]);

  //Esta função carrega o tudo ao Abrir o App
  useEffect(() => {
    const carregarDoCelular = async () => {
      try {
        const dadosSalvos = await AsyncStorage.getItem("@lb_setups");
        if (dadosSalvos !== null) {
          setSavedSetups(JSON.parse(dadosSalvos)); // Joga pro state
        }
      } catch (error) {
        console.error("Erro ao buscar do celular:", error);
      }
    };

    carregarDoCelular();
  }, []);
  //Esta função salva a lista atualizada no celular
  const persistirNoCelular = async (novaLista) => {
    try {
      await AsyncStorage.setItem("@lb_setups", JSON.stringify(novaLista));
    } catch (error) {
      console.error("Erro ao salvar no celular:", error);
    }
  };

  const regrasArquitetura = {
    AM5: {
      chipset: "B650 / X670",
      status: "ATIVA (SUPORTE ATÉ 2027+)",
      ram: ["DDR5"],
    },
    AM4: {
      chipset: "B550 / X570",
      status: "FIM DE VIDA (ALTA DISPONIBILIDADE)",
      ram: ["DDR4"],
    },
    LGA1700: {
      chipset: "B760 / Z790",
      status: "ATIVA (LIMITE DE GERAÇÃO)",
      ram: ["DDR4", "DDR5"],
    },
    LGA1200: { chipset: "B560 / Z590", status: "DESCONTINUADA", ram: ["DDR4"] },
    LGA1151v2: {
      chipset: "B365 / Z390",
      status: "DESCONTINUADA",
      ram: ["DDR4"],
    },
    "AM3+": { chipset: "970 / 990FX", status: "LEGACY", ram: ["DDR3"] },
    Mobile: {
      chipset: "INTEGRADO",
      status: "N/A (NOTEBOOK)",
      ram: ["DDR4", "DDR5"],
    },
  };

  const getInfoArquitetura = (socket) =>
    regrasArquitetura[socket] || {
      chipset: "GENÉRICO",
      status: "N/A",
      ram: ["DDR4"],
    };

  const calcularTDP = () => {
    let tdpTotal = 50;
    if (selectedCPU) tdpTotal += selectedCPU.tdp;
    if (selectedGPU) tdpTotal += selectedGPU.tdp;
    if (selectedRAM) tdpTotal += selectedRAM.tdp;
    if (selectedStorage) tdpTotal += selectedStorage.tdp;
    return tdpTotal;
  };

  const calcularFPS = () => {
    if (!selectedCPU || !selectedGPU || !selectedGame) return 0;
    const forcaBruta = selectedGPU.score * 0.75 + selectedCPU.score * 0.25;
    let fpsBase = forcaBruta / selectedGame.peso;

    let multRes = 1.0;
    if (resolucao === "1440p") multRes = 0.65;
    if (resolucao === "4K") multRes = 0.4;

    let multPreset = 1.0;
    if (preset === "Alto") multPreset = 1.15;
    if (preset === "Médio") multPreset = 1.35;
    if (preset === "Baixo") multPreset = 1.6;

    return Math.round(fpsBase * multRes * multPreset);
  };

  const calcularPrecoTotal = () => {
    let total = 450;
    if (selectedCPU) total += selectedCPU.preco || selectedCPU.score * 7.5;
    if (selectedGPU) total += selectedGPU.preco || selectedGPU.score * 11.2;
    if (selectedRAM) total += selectedRAM.preco || 250;
    if (selectedStorage) total += selectedStorage.preco || 300;
    return Math.round(total);
  };

  // salva nome personalizado
  const salvarSetupAtual = (nome) => {
    if (!selectedCPU || !selectedGPU) return false;
    const novoSetup = {
      id: Date.now().toString(),
      nome: nome,
      cpu: selectedCPU,
      gpu: selectedGPU,
      ram: selectedRAM,
      storage: selectedStorage,
      data: new Date().toLocaleDateString("pt-BR"),
    };
    const novaLista = [novoSetup, ...savedSetups];
    setSavedSetups(novaLista);
    persistirNoCelular(novaLista);
    return true;
  };

  // Funções de editar e apagar
  const renomearSetup = (id, novoNome) => {
    const novaLista = savedSetups.map((setup) =>
      setup.id === id ? { ...setup, nome: novoNome } : setup,
    );
    setSavedSetups(novaLista);
    persistirNoCelular(novaLista);
  };

  const excluirSetup = (id) => {
    const novaLista = savedSetups.filter((setup) => setup.id !== id);
    setSavedSetups(novaLista);
    persistirNoCelular(novaLista);
  };

  const resetarSetup = () => {
    setSelectedCPU(null);
    setSelectedGPU(null);
    setSelectedRAM(null);
    setSelectedStorage(null);
    setSelectedGame(null);
    setResolucao("1080p");
    setPreset("Ultra");
  };

  return (
    <HardwareContext.Provider
      value={{
        selectedCPU,
        setSelectedCPU,
        selectedGPU,
        setSelectedGPU,
        selectedRAM,
        setSelectedRAM,
        selectedStorage,
        setSelectedStorage,
        selectedGame,
        setSelectedGame,
        resolucao,
        setResolucao,
        preset,
        setPreset,
        calcularTDP,
        calcularFPS,
        calcularPrecoTotal,
        savedSetups,
        salvarSetupAtual,
        getInfoArquitetura,
        renomearSetup,
        excluirSetup,
        resetarSetup,
      }}
    >
      {children}
    </HardwareContext.Provider>
  );
};
