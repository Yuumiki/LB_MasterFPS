import { Audio } from "expo-av";
import * as Sharing from "expo-sharing";
import { useContext, useMemo, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import ViewShot from "react-native-view-shot";
import { HardwareContext } from "../context/HardwareContext";
import hardware from "../data/hardware.json";

const { width, height } = Dimensions.get("window");

export default function Result({ navigation }) {
  const {
    calcularTDP,
    calcularFPS,
    calcularPrecoTotal,
    salvarSetupAtual,
    selectedGame,
    setSelectedGame,
    selectedCPU,
    selectedGPU,
    selectedRAM,
    selectedStorage,
    resolucao,
    setResolucao,
    preset,
    setPreset,
    getInfoArquitetura,
  } = useContext(HardwareContext);

  const viewShotRef = useRef();

  const [modalJogosVisible, setModalJogosVisible] = useState(false);
  const [modalSucessoVisible, setModalSucessoVisible] = useState(false);
  const [searchJogo, setSearchJogo] = useState("");
  const [modalSaveVisible, setModalSaveVisible] = useState(false);
  const [nomeSetup, setNomeSetup] = useState("");
  const [isRed, setIsRed] = useState(false);

  const fps = calcularFPS ? calcularFPS() : 0;
  const precoTotal = calcularPrecoTotal ? calcularPrecoTotal() : 0;
  const custoPorFps = fps > 0 ? (precoTotal / fps).toFixed(2) : 0;

  const glitchAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const dispararEasterEggNier = () => {
    Alert.alert(
      "SYSTEM ERROR",
      "Gestalt Process Interrupted...",
      [
        {
          text: "OK",
          onPress: async () => {
            try {
              setIsRed(true);
              await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
              const { sound } = await Audio.Sound.createAsync(
                require("../assets/nier_start.mp3"),
              );
              await sound.playAsync();

              Animated.parallel([
                Animated.sequence([
                  Animated.timing(glitchAnim, {
                    toValue: -40,
                    duration: 20,
                    useNativeDriver: false,
                  }),
                  Animated.timing(glitchAnim, {
                    toValue: 45,
                    duration: 20,
                    useNativeDriver: false,
                  }),
                  Animated.timing(glitchAnim, {
                    toValue: -25,
                    duration: 20,
                    useNativeDriver: false,
                  }),
                  Animated.timing(glitchAnim, {
                    toValue: 30,
                    duration: 20,
                    useNativeDriver: false,
                  }),
                  Animated.timing(glitchAnim, {
                    toValue: 0,
                    duration: 20,
                    useNativeDriver: false,
                  }),
                ]),
                Animated.sequence([
                  Animated.timing(opacityAnim, {
                    toValue: 0.2,
                    duration: 30,
                    useNativeDriver: false,
                  }),
                  Animated.timing(opacityAnim, {
                    toValue: 1,
                    duration: 30,
                    useNativeDriver: false,
                  }),
                  Animated.timing(opacityAnim, {
                    toValue: 0.3,
                    duration: 30,
                    useNativeDriver: false,
                  }),
                  Animated.timing(opacityAnim, {
                    toValue: 1,
                    duration: 30,
                    useNativeDriver: false,
                  }),
                ]),
                Animated.sequence([
                  Animated.timing(scaleAnim, {
                    toValue: 1.2,
                    duration: 40,
                    useNativeDriver: false,
                  }),
                  Animated.timing(scaleAnim, {
                    toValue: 1,
                    duration: 40,
                    useNativeDriver: false,
                  }),
                ]),
              ]).start(() => setIsRed(false));
            } catch (error) {
              console.log("Erro no Glitch: ", error);
              setIsRed(false);
            }
          },
        },
      ],
      { cancelable: false },
    );
  };

  const infoArq = getInfoArquitetura
    ? getInfoArquitetura(selectedCPU?.socket)
    : { chipset: "GENÉRICO", status: "N/A" };

  const getRefrigeracao = (tdp) => {
    if (!tdp) return { texto: "N/A", cor: "#716876" };
    if (tdp > 105) return { texto: "Water cooler 240MM+", cor: "#ff4d4d" };
    if (tdp > 65) return { texto: "Air cooler torre", cor: "#ff9800" };
    return { texto: "Cooler box padrão", cor: "#4CAF50" };
  };
  const refrigeracaoSugerida = getRefrigeracao(selectedCPU?.tdp);

  const bottleneck = (() => {
    if (!selectedCPU || !selectedGPU)
      return {
        status: "Aguardando",
        cor: "#716876",
        desc: "Selecione os componentes.",
      };
    const ratio = selectedGPU.score / selectedCPU.score;
    if (ratio > 1.5)
      return {
        status: "Gargalo de processador",
        cor: "#ff9800",
        desc: "A CPU limitará o potencial máximo da Placa de Vídeo.",
      };
    if (ratio < 0.6)
      return {
        status: "Gargalo de vídeo",
        cor: "#ff9800",
        desc: "A GPU é muito fraca para acompanhar este Processador.",
      };
    return {
      status: "Sistema equilibrado",
      cor: "#4CAF50",
      desc: "Os componentes operam em harmonia de processamento.",
    };
  })();

  const jogosFiltrados = useMemo(() => {
    if (!searchJogo) return hardware.jogos;
    return hardware.jogos.filter((j) =>
      j.nome.toLowerCase().includes(searchJogo.toLowerCase().trim()),
    );
  }, [searchJogo]);

  const handleSelectGame = (jogo) => {
    setSelectedGame(jogo);
    setModalJogosVisible(false);
    setSearchJogo("");
    if (jogo.nome.toLowerCase().includes("replicant")) {
      dispararEasterEggNier();
    }
  };

  const confirmarSalvamento = () => {
    if (nomeSetup.trim() === "") {
      Alert.alert("Aviso", "Por favor, digite um nome para o seu setup.");
      return;
    }
    salvarSetupAtual(nomeSetup);
    setModalSaveVisible(false);
    setNomeSetup("");
    setModalSucessoVisible(true);
  };

  const handleCompartilhar = async () => {
    try {
      const uri = await viewShotRef.current.capture();
      await Sharing.shareAsync(uri, {
        dialogTitle: "Relatório de Performance LB-MasterFPS",
      });
    } catch (error) {
      Alert.alert("Erro", "Não foi possível gerar o relatório.");
    }
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isRed ? "#600" : "#1a161d" },
      ]}
    >
      <Animated.View
        style={{
          flex: 1,
          opacity: opacityAnim,
          transform: [{ translateX: glitchAnim }, { scale: scaleAnim }],
        }}
      >
        <View style={styles.topNav}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.navButton}
          >
            <Text style={styles.navIcon}>VOLTAR</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleCompartilhar}
            style={styles.navButtonHighlight}
          >
            <Text style={styles.navIconHighlight}>EXPORTAR RELATÓRIO</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <ViewShot ref={viewShotRef} options={{ format: "png", quality: 0.9 }}>
            <View style={{ backgroundColor: "#1a161d", paddingBottom: 20 }}>
              <View style={styles.header}>
                <Text style={styles.headerSubtitle}>
                  Relatório de engenharia de hardware
                </Text>
              </View>

              <View style={styles.mainCard}>
                <Text style={styles.tierTitle}>Estimativa de renderização</Text>
                <View style={styles.fpsWrapper}>
                  <Text style={styles.fpsNumber}>{fps}</Text>
                  <Text style={styles.fpsText}>FPS</Text>
                </View>

                <TouchableOpacity
                  style={styles.gameSelectorBtn}
                  onPress={() => setModalJogosVisible(true)}
                >
                  <View>
                    <Text style={styles.gameSelectorLabel}>
                      SOFTWARE EM ANÁLISE
                    </Text>
                    <Text style={styles.gameSelectorValue}>
                      {selectedGame?.nome || "Clique para selecionar"}
                    </Text>
                  </View>
                  <Text style={styles.gameSelectorIcon}>Alterar</Text>
                </TouchableOpacity>

                <View style={styles.divider} />

                <View style={styles.budgetRow}>
                  <View>
                    <Text style={styles.budgetLabel}>ORÇAMENTO ESTIMADO</Text>
                    <Text style={styles.budgetValue}>
                      R$ {precoTotal.toLocaleString("pt-BR")}
                    </Text>
                  </View>
                  <View style={{ alignItems: "flex-end" }}>
                    <Text style={styles.budgetLabel}>Custo-benefício</Text>
                    <Text style={styles.budgetValue}>
                      R$ {custoPorFps} / FPS
                    </Text>
                  </View>
                </View>
              </View>

              <Text style={styles.sectionLabel}>
                ANÁLISE DE GARGALO (BOTTLENECK)
              </Text>
              <View
                style={[styles.bottleneckBox, { borderColor: bottleneck.cor }]}
              >
                <Text
                  style={[styles.bottleneckStatus, { color: bottleneck.cor }]}
                >
                  {bottleneck.status}
                </Text>
                <Text style={styles.bottleneckDesc}>{bottleneck.desc}</Text>
              </View>

              <Text style={styles.sectionLabel}>AJUSTES DE RENDERIZAÇÃO</Text>
              <View style={styles.graphicsBox}>
                <Text style={styles.graphicsLabel}>RESOLUÇÃO ALVO</Text>
                <View style={styles.toggleRow}>
                  {["1080p", "1440p", "4K"].map((res) => (
                    <TouchableOpacity
                      key={res}
                      onPress={() => setResolucao(res)}
                      style={[
                        styles.toggleBtn,
                        resolucao === res && styles.toggleBtnActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.toggleText,
                          resolucao === res && styles.toggleTextActive,
                        ]}
                      >
                        {res}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <Text style={[styles.graphicsLabel, { marginTop: 15 }]}>
                  PRESET GRÁFICO
                </Text>
                <View style={styles.toggleRow}>
                  {["Baixo", "Médio", "Alto", "Ultra"].map((p) => (
                    <TouchableOpacity
                      key={p}
                      onPress={() => setPreset(p)}
                      style={[
                        styles.toggleBtn,
                        preset === p && styles.toggleBtnActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.toggleText,
                          preset === p && styles.toggleTextActive,
                        ]}
                      >
                        {p.toUpperCase()}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <Text style={styles.sectionLabel}>PERFORMANCE DE HARDWARE</Text>
              <View style={styles.chartBox}>
                <View style={styles.chartRow}>
                  <Text style={styles.chartLabel}>
                    Processamento bruto (CPU)
                  </Text>
                  <View style={styles.barBg}>
                    <View
                      style={[
                        styles.barFill,
                        {
                          width: `${Math.min((selectedCPU?.score || 0) / 4, 100)}%`,
                        },
                      ]}
                    />
                  </View>
                </View>
                <View style={styles.chartRow}>
                  <Text style={styles.chartLabel}>
                    Renderização gráfica (GPU)
                  </Text>
                  <View style={styles.barBg}>
                    <View
                      style={[
                        styles.barFill,
                        {
                          width: `${Math.min((selectedGPU?.score || 0) / 6, 100)}%`,
                        },
                      ]}
                    />
                  </View>
                </View>
              </View>

              <Text style={styles.sectionLabel}>
                ESPECIFICAÇÕES E ARQUITETURA
              </Text>
              <View style={styles.specsBox}>
                <View style={styles.specRow}>
                  <Text style={styles.specKey}>CPU</Text>
                  <Text style={styles.specVal}>
                    {selectedCPU?.nome || "N/A"}
                  </Text>
                </View>
                <View style={styles.specRow}>
                  <Text style={styles.specKey}>GPU</Text>
                  <Text style={styles.specVal}>
                    {selectedGPU?.nome || "N/A"}
                  </Text>
                </View>
                <View style={styles.specRow}>
                  <Text style={styles.specKey}>RAM</Text>
                  <Text style={styles.specVal}>
                    {selectedRAM?.nome || "N/A"}
                  </Text>
                </View>
                <View style={styles.specRow}>
                  <Text style={styles.specKey}>TDP máximo</Text>
                  <Text style={styles.specVal}>{calcularTDP()}W</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.specRow}>
                  <Text style={styles.specKey}>Chipset indicado</Text>
                  <Text style={styles.specVal}>{infoArq.chipset}</Text>
                </View>
                <View style={styles.specRow}>
                  <Text style={styles.specKey}>Solução térmica</Text>
                  <Text
                    style={[
                      styles.specVal,
                      { color: refrigeracaoSugerida.cor, fontWeight: "bold" },
                    ]}
                  >
                    {refrigeracaoSugerida.texto}
                  </Text>
                </View>
              </View>
            </View>
          </ViewShot>

          <View style={styles.actionButtonsRow}>
            <TouchableOpacity
              style={styles.btnSaveHalf}
              onPress={() => setModalSaveVisible(true)}
            >
              <Text style={styles.btnSaveText}>SALVAR SETUP</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btnViewSaved}
              onPress={() => navigation.navigate("Saved")}
            >
              <Text style={styles.btnSaveText}>VER SALVOS</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Animated.View>

      <Modal visible={modalSaveVisible} transparent={true} animationType="fade">
        <View style={styles.modalCenteredOverlay}>
          <View style={styles.modalCenteredContainer}>
            <Text style={styles.modalTitle}>NOMEAR SETUP</Text>
            <Text style={styles.modalSubtitle}>
              Como você quer chamar essa máquina?
            </Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Ex: Meu PC"
              placeholderTextColor="#716876"
              value={nomeSetup}
              onChangeText={setNomeSetup}
              autoFocus={true}
            />
            <View style={styles.modalBtnRow}>
              <TouchableOpacity
                style={styles.modalBtnCancel}
                onPress={() => setModalSaveVisible(false)}
              >
                <Text style={styles.modalBtnCancelText}>CANCELAR</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalBtnConfirm}
                onPress={confirmarSalvamento}
              >
                <Text style={styles.modalBtnConfirmText}>SALVAR</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={modalSucessoVisible}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalCenteredOverlay}>
          <View style={styles.modalCenteredContainer}>
            <Text
              style={[
                styles.modalTitle,
                { color: "#4CAF50", textAlign: "center" },
              ]}
            >
              SUCESSO!
            </Text>
            <Text
              style={[
                styles.modalSubtitle,
                { textAlign: "center", marginBottom: 25 },
              ]}
            >
              Setup salvo no banco de dados.
            </Text>
            <TouchableOpacity
              style={[
                styles.modalBtnConfirm,
                { width: "100%", alignItems: "center" },
              ]}
              onPress={() => setModalSucessoVisible(false)}
            >
              <Text style={styles.modalBtnConfirmText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={modalJogosVisible}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.bottomSheetOverlay}>
          <TouchableOpacity
            style={styles.bottomSheetDismiss}
            onPress={() => setModalJogosVisible(false)}
          />
          <View style={styles.bottomSheetContainer}>
            <View style={styles.bottomSheetHeader}>
              <Text style={styles.bottomSheetTitle}>SELECIONAR SOFTWARE</Text>
              <TouchableOpacity onPress={() => setModalJogosVisible(false)}>
                <Text style={styles.closeIcon}>FECHAR</Text>
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.searchBar}
              placeholder="Pesquisar jogo..."
              placeholderTextColor="#716876"
              value={searchJogo}
              onChangeText={setSearchJogo}
            />
            <FlatList
              data={jogosFiltrados}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.gameListItem,
                    selectedGame?.id === item.id && styles.gameListItemActive,
                  ]}
                  onPress={() => handleSelectGame(item)}
                >
                  <View>
                    <Text
                      style={[
                        styles.gameListText,
                        selectedGame?.id === item.id &&
                          styles.gameListTextActive,
                      ]}
                    >
                      {item.nome}
                    </Text>
                    <Text
                      style={[
                        styles.gameListCategory,
                        selectedGame?.id === item.id &&
                          styles.gameListTextActive,
                      ]}
                    >
                      {item.categoria}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1a161d" },
  topNav: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    paddingTop: 40,
    borderBottomWidth: 1,
    borderBottomColor: "#2a242e",
  },
  navButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#2a242e",
    borderRadius: 4,
  },
  navIcon: {
    color: "#716876",
    fontSize: 10,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  navButtonHighlight: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#9c8aa5",
    borderRadius: 4,
  },
  navIconHighlight: {
    color: "#1a161d",
    fontSize: 10,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  scrollContent: { paddingBottom: 40 },
  header: { padding: 20, alignItems: "center" },
  headerSubtitle: {
    color: "#716876",
    fontSize: 10,
    fontWeight: "bold",
    letterSpacing: 2,
  },
  mainCard: {
    margin: 20,
    marginTop: 0,
    backgroundColor: "#2a242e",
    padding: 25,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#3a343d",
  },
  tierTitle: {
    color: "#bdaec6",
    fontSize: 9,
    fontWeight: "bold",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  fpsWrapper: {
    flexDirection: "row",
    alignItems: "baseline",
    marginVertical: 5,
  },
  fpsNumber: {
    color: "#fff",
    fontSize: 70,
    fontWeight: "900",
    letterSpacing: -2,
  },
  fpsText: {
    color: "#9c8aa5",
    fontSize: 16,
    marginLeft: 8,
    fontWeight: "bold",
  },
  gameSelectorBtn: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#1a161d",
    padding: 15,
    borderRadius: 6,
    marginTop: 5,
    borderWidth: 1,
    borderColor: "#3a343d",
  },
  gameSelectorLabel: {
    color: "#716876",
    fontSize: 9,
    fontWeight: "bold",
    letterSpacing: 1,
    marginBottom: 2,
  },
  gameSelectorValue: { color: "#fff", fontSize: 14, fontWeight: "bold" },
  gameSelectorIcon: {
    color: "#9c8aa5",
    fontSize: 10,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  divider: {
    height: 1,
    width: "100%",
    backgroundColor: "#3a343d",
    marginVertical: 15,
  },
  budgetRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 5,
  },
  budgetLabel: {
    color: "#716876",
    fontSize: 9,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  budgetValue: {
    color: "#4CAF50",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 4,
  },
  sectionLabel: {
    color: "#716876",
    fontSize: 11,
    fontWeight: "bold",
    marginLeft: 20,
    marginBottom: 15,
    marginTop: 10,
    letterSpacing: 1,
  },
  bottleneckBox: {
    backgroundColor: "#2a242e",
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 8,
    marginBottom: 25,
    borderWidth: 1,
    borderLeftWidth: 6,
  },
  bottleneckStatus: {
    fontSize: 12,
    fontWeight: "bold",
    letterSpacing: 1,
    marginBottom: 5,
  },
  bottleneckDesc: { color: "#bdaec6", fontSize: 11, lineHeight: 16 },
  graphicsBox: {
    backgroundColor: "#2a242e",
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 8,
    marginBottom: 25,
  },
  graphicsLabel: {
    color: "#716876",
    fontSize: 9,
    fontWeight: "bold",
    letterSpacing: 1,
    marginBottom: 10,
  },
  toggleRow: { flexDirection: "row", justifyContent: "space-between" },
  toggleBtn: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#3a343d",
    alignItems: "center",
  },
  toggleBtnActive: { backgroundColor: "#9c8aa5", borderColor: "#9c8aa5" },
  toggleText: { color: "#716876", fontSize: 10, fontWeight: "bold" },
  toggleTextActive: { color: "#1a161d" },
  chartBox: {
    backgroundColor: "#2a242e",
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 8,
    marginBottom: 25,
  },
  chartRow: { marginBottom: 15 },
  chartLabel: {
    color: "#bdaec6",
    fontSize: 9,
    fontWeight: "bold",
    letterSpacing: 1,
    marginBottom: 6,
  },
  barBg: {
    height: 8,
    backgroundColor: "#1a161d",
    borderRadius: 4,
    overflow: "hidden",
  },
  barFill: { height: "100%", backgroundColor: "#9c8aa5" },
  specsBox: {
    backgroundColor: "#2a242e",
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 8,
    marginBottom: 20,
  },
  specRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#3a343d",
    paddingVertical: 10,
  },
  specKey: {
    color: "#716876",
    fontSize: 11,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  specVal: { color: "#fff", fontSize: 11, flex: 1, textAlign: "right" },
  actionButtonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginBottom: 20,
  },
  btnSaveHalf: {
    flex: 0.48,
    backgroundColor: "#3a343d",
    padding: 18,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#716876",
  },
  btnViewSaved: {
    flex: 0.48,
    backgroundColor: "#2a242e",
    padding: 18,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#3a343d",
  },
  btnSaveText: {
    color: "#bdaec6",
    fontWeight: "bold",
    letterSpacing: 1,
    fontSize: 11,
  },
  modalCenteredOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalCenteredContainer: {
    backgroundColor: "#2a242e",
    width: "85%",
    padding: 25,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#3a343d",
  },
  modalTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  modalSubtitle: { color: "#716876", fontSize: 11, marginBottom: 20 },
  modalInput: {
    backgroundColor: "#1a161d",
    color: "#fff",
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#3a343d",
    marginBottom: 25,
  },
  modalBtnRow: { flexDirection: "row", justifyContent: "flex-end", gap: 15 },
  modalBtnCancel: { padding: 12 },
  modalBtnCancelText: { color: "#716876", fontWeight: "bold", fontSize: 12 },
  modalBtnConfirm: {
    backgroundColor: "#9c8aa5",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  modalBtnConfirmText: { color: "#1a161d", fontWeight: "bold", fontSize: 12 },
  bottomSheetOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "flex-end",
  },
  bottomSheetDismiss: { flex: 1 },
  bottomSheetContainer: {
    backgroundColor: "#1a161d",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    height: height * 0.75,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#3a343d",
  },
  bottomSheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  bottomSheetTitle: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  closeIcon: { color: "#9c8aa5", fontSize: 10, fontWeight: "bold" },
  searchBar: {
    backgroundColor: "#2a242e",
    color: "#fff",
    padding: 15,
    borderRadius: 8,
    fontSize: 14,
    borderWidth: 1,
    borderColor: "#3a343d",
    marginBottom: 15,
  },
  gameListItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#2a242e",
  },
  gameListItemActive: {
    backgroundColor: "#3a343d",
    paddingHorizontal: 10,
    borderRadius: 6,
    borderBottomWidth: 0,
  },
  gameListText: { color: "#fff", fontSize: 14, fontWeight: "bold" },
  gameListTextActive: {
    color: "#bdaec6",
    fontSize: 10,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  gameListCategory: { color: "#716876", fontSize: 10, marginTop: 4 },
});
