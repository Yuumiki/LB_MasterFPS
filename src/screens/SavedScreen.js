import { useContext, useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { HardwareContext } from "../context/HardwareContext";

export default function SavedScreen({ navigation }) {
  const {
    savedSetups,
    setSelectedCPU,
    setSelectedGPU,
    setSelectedRAM,
    setSelectedStorage,
    renomearSetup,
    excluirSetup,
    resetarSetup,
  } = useContext(HardwareContext);

  const [modalEditVisible, setModalEditVisible] = useState(false);
  const [setupEmEdicao, setSetupEmEdicao] = useState(null);
  const [novoNome, setNovoNome] = useState("");
  const [modalDeleteVisible, setModalDeleteVisible] = useState(false);
  const [setupToDelete, setSetupToDelete] = useState(null);

  const carregarSetup = (setup) => {
    setSelectedCPU(setup.cpu);
    setSelectedGPU(setup.gpu);
    setSelectedRAM(setup.ram);
    setSelectedStorage(setup.storage);
    navigation.navigate("Result");
  };

  const iniciarEdicao = (setup) => {
    setSetupEmEdicao(setup.id);
    setNovoNome(setup.nome);
    setModalEditVisible(true);
  };

  const salvarEdicao = () => {
    if (novoNome.trim() === "") {
      Alert.alert("Aviso", "O nome não pode ficar vazio.");
      return;
    }
    renomearSetup(setupEmEdicao, novoNome);
    setModalEditVisible(false);
  };

  const handleExcluir = (id) => {
    setSetupToDelete(id);
    setModalDeleteVisible(true);
  };

  const confirmarExclusao = () => {
    if (setupToDelete) excluirSetup(setupToDelete);
    setModalDeleteVisible(false);
    setSetupToDelete(null);
  };

  const iniciarNovaMontagem = () => {
    resetarSetup();
    navigation.navigate("Build");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SETUPS SALVOS</Text>

      <FlatList
        data={savedSetups}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardName}>{item.nome}</Text>
              <Text style={styles.cardDate}>{item.data}</Text>
            </View>
            <View style={styles.divider} />
            <Text style={styles.cardSpec}>CPU: {item.cpu.nome}</Text>
            <Text style={styles.cardSpec}>GPU: {item.gpu.nome}</Text>
            <Text style={styles.cardSpec}>
              RAM: {item.ram?.nome || "Padrão"}
            </Text>

            <View style={styles.actionRow}>
              <TouchableOpacity
                style={styles.btnAcaoMini}
                onPress={() => iniciarEdicao(item)}
              >
                <Text style={styles.btnTextMini}>RENOMEAR</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.btnAcaoMiniDanger}
                onPress={() => handleExcluir(item.id)}
              >
                <Text style={styles.btnTextDanger}>EXCLUIR</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.btnAcaoLoad}
                onPress={() => carregarSetup(item)}
              >
                <Text style={styles.btnTextLoad}>CARREGAR DADOS</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>
            Nenhum registro encontrado no histórico.
          </Text>
        }
      />

      <View style={styles.bottomPanel}>
        <TouchableOpacity
          style={styles.btnPrimary}
          onPress={iniciarNovaMontagem}
        >
          <Text style={styles.btnPrimaryText}>NOVA MONTAGEM</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btnSecondary}
          onPress={() => navigation.navigate("Home")}
        >
          <Text style={styles.btnSecondaryText}>VOLTAR AO MENU</Text>
        </TouchableOpacity>
      </View>

      {/* edição de nome */}
      <Modal visible={modalEditVisible} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>RENOMEAR SETUP</Text>

            <TextInput
              style={styles.modalInput}
              value={novoNome}
              onChangeText={setNovoNome}
              autoFocus={true}
              placeholderTextColor="#716876"
            />

            <View style={styles.modalBtnRow}>
              <TouchableOpacity
                style={styles.modalBtnCancel}
                onPress={() => setModalEditVisible(false)}
              >
                <Text style={styles.modalBtnCancelText}>CANCELAR</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalBtnConfirm}
                onPress={salvarEdicao}
              >
                <Text style={styles.modalBtnConfirmText}>ATUALIZAR</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      {/* exclusão */}
      <Modal
        visible={modalDeleteVisible}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={[styles.modalTitle, { color: "#ff4d4d" }]}>
              CONFIRMAR EXCLUSÃO
            </Text>
            <Text
              style={[
                styles.modalSubtitle,
                { marginBottom: 25, color: "#FFFFFF" },
              ]}
            >
              Tem certeza que deseja apagar permanentemente este setup?
            </Text>

            <View style={styles.modalBtnRow}>
              <TouchableOpacity
                style={styles.modalBtnCancel}
                onPress={() => setModalDeleteVisible(false)}
              >
                <Text style={styles.modalBtnCancelText}>CANCELAR</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtnConfirm, { backgroundColor: "#ff4d4d" }]}
                onPress={confirmarExclusao}
              >
                <Text style={[styles.modalBtnConfirmText, { color: "#fff" }]}>
                  APAGAR
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a161d",
    padding: 20,
    paddingTop: 50,
  },
  title: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    letterSpacing: 1,
  },

  card: {
    backgroundColor: "#2a242e",
    padding: 20,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#3a343d",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardName: {
    color: "#bdaec6",
    fontWeight: "bold",
    fontSize: 14,
    letterSpacing: 1,
    flex: 1,
    marginRight: 10,
  },
  cardDate: { color: "#716876", fontSize: 10, fontWeight: "bold" },
  divider: { height: 1, backgroundColor: "#3a343d", marginVertical: 12 },
  cardSpec: { color: "#fff", fontSize: 11, marginTop: 4, letterSpacing: 0.5 },

  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#3a343d",
    paddingTop: 15,
  },
  btnAcaoMini: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    backgroundColor: "#3a343d",
  },
  btnTextMini: {
    color: "#bdaec6",
    fontSize: 9,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  btnAcaoMiniDanger: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#ff4d4d",
  },
  btnTextDanger: {
    color: "#ff4d4d",
    fontSize: 9,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  btnAcaoLoad: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 4,
    backgroundColor: "#9c8aa5",
  },
  btnTextLoad: {
    color: "#1a161d",
    fontSize: 9,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },

  empty: { color: "#716876", textAlign: "center", marginTop: 50, fontSize: 12 },

  bottomPanel: { paddingTop: 10, borderTopWidth: 1, borderTopColor: "#2a242e" },
  btnPrimary: {
    backgroundColor: "#9c8aa5",
    padding: 18,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  btnPrimaryText: {
    color: "#1a161d",
    fontWeight: "bold",
    letterSpacing: 1,
    fontSize: 12,
  },
  btnSecondary: {
    backgroundColor: "transparent",
    padding: 18,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#3a343d",
  },
  btnSecondaryText: {
    color: "#716876",
    fontWeight: "bold",
    letterSpacing: 1,
    fontSize: 12,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
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
    marginBottom: 20,
  },
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
});
