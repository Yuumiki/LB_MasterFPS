import { useContext, useMemo, useState } from "react";
import {
  FlatList,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { HardwareContext } from "../context/HardwareContext";
import hardware from "../data/hardware.json";

export default function Build({ navigation }) {
  const {
    selectedCPU,
    setSelectedCPU,
    selectedGPU,
    setSelectedGPU,
    selectedRAM,
    setSelectedRAM,
    selectedStorage,
    setSelectedStorage,
    getInfoArquitetura,
  } = useContext(HardwareContext);

  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("cpus");
  const [marcaFilter, setMarcaFilter] = useState("Todas");

  const categories = [
    { id: "cpus", label: "CPU", selected: selectedCPU },
    { id: "gpus", label: "GPU", selected: selectedGPU },
    { id: "rams", label: "RAM", selected: selectedRAM },
    { id: "armazenamento", label: "DISCO", selected: selectedStorage },
  ];

  const filteredData = useMemo(() => {
    let data = hardware[activeTab] || [];

    data = data.filter((item) => {
      const matchSearch = item.nome
        .toLowerCase()
        .includes(search.toLowerCase().trim());
      const matchMarca =
        marcaFilter === "Todas" || item.marca === marcaFilter || !item.marca;
      return matchSearch && matchMarca;
    });

    if (activeTab === "rams" && selectedCPU && getInfoArquitetura) {
      const info = getInfoArquitetura(selectedCPU.socket);
      if (info && info.ram) {
        data = data.filter((ram) =>
          info.ram.some((tipo) => ram.nome.includes(tipo)),
        );
      }
    }

    return data;
  }, [search, activeTab, marcaFilter, selectedCPU, getInfoArquitetura]);

  const handleSelect = (item) => {
    if (activeTab === "cpus") {
      setSelectedCPU(item);

      if (selectedRAM && getInfoArquitetura) {
        const novaInfo = getInfoArquitetura(item.socket);
        if (novaInfo && novaInfo.ram) {
          const aindaCompativel = novaInfo.ram.some((tipo) =>
            selectedRAM.nome.includes(tipo),
          );
          if (!aindaCompativel) {
            setSelectedRAM(null);
          }
        }
      }
    }
    if (activeTab === "gpus") setSelectedGPU(item);
    if (activeTab === "rams") setSelectedRAM(item);
    if (activeTab === "armazenamento") setSelectedStorage(item);
  };

  const itensSelecionados = [
    selectedCPU,
    selectedGPU,
    selectedRAM,
    selectedStorage,
  ].filter(Boolean).length;
  const isPronto = selectedCPU && selectedGPU;

  return (
    <SafeAreaView style={styles.container}>
      {/* proteção para a StatusBar */}
      <StatusBar barStyle="light-content" backgroundColor="#1a161d" />

      <View style={styles.header}>
        <TextInput
          style={styles.searchBar}
          placeholder={`Pesquisar...`}
          placeholderTextColor="#716876"
          value={search}
          onChangeText={setSearch}
        />

        {(activeTab === "cpus" || activeTab === "gpus") && (
          <View style={styles.filterContainer}>
            {["Todas", "AMD", "Intel", "NVIDIA"].map((marca) => {
              if (activeTab === "cpus" && marca === "NVIDIA") return null;
              if (activeTab === "gpus" && marca === "Intel") return null;

              return (
                <TouchableOpacity
                  key={marca}
                  style={[
                    styles.filterPill,
                    marcaFilter === marca && styles.filterPillActive,
                  ]}
                  onPress={() => setMarcaFilter(marca)}
                >
                  <Text
                    style={[
                      styles.filterText,
                      marcaFilter === marca && styles.filterTextActive,
                    ]}
                  >
                    {marca}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </View>

      <View style={styles.tabContainer}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            onPress={() => {
              setActiveTab(cat.id);
              setSearch("");
              setMarcaFilter("Todas");
            }}
            style={[styles.tab, activeTab === cat.id && styles.tabActive]}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === cat.id && styles.tabTextActive,
              ]}
            >
              {cat.label}
            </Text>
            {cat.selected && <View style={styles.dotIndicator} />}
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        initialNumToRender={15}
        renderItem={({ item }) => {
          const isSelected =
            selectedCPU?.id === item.id ||
            selectedGPU?.id === item.id ||
            selectedRAM?.id === item.id ||
            selectedStorage?.id === item.id;
          return (
            <TouchableOpacity
              style={[styles.card, isSelected && styles.cardSelected]}
              onPress={() => handleSelect(item)}
              activeOpacity={0.7}
            >
              <View style={styles.cardContent}>
                <Text
                  style={[styles.cardTitle, isSelected && styles.textSelected]}
                >
                  {item.nome}
                </Text>
                <Text
                  style={[
                    styles.cardDetails,
                    isSelected && styles.textSelected,
                  ]}
                >
                  TDP: {item.tdp}W {item.vram ? `| VRAM: ${item.vram}` : ""}{" "}
                  {item.socket ? `| ${item.socket}` : ""}
                </Text>
              </View>
              <View
                style={[
                  styles.radioCircle,
                  isSelected && styles.radioCircleSelected,
                ]}
              >
                {isSelected && <View style={styles.radioDot} />}
              </View>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            Nenhum registro encontrado no JSON.
          </Text>
        }
      />

      <View style={styles.footer}>
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>Status da Montagem:</Text>
          <Text style={styles.progressValue}>{itensSelecionados}/4 Peças</Text>
        </View>
        <TouchableOpacity
          style={[styles.btnNext, !isPronto && styles.btnDisabled]}
          onPress={() => navigation.navigate("Result")}
          disabled={!isPronto}
        >
          <Text style={styles.btnNextText}>PROCESSAR DADOS</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a161d",
    // proteção para Android caso o SafeAreaView falhe
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  header: { padding: 20, paddingBottom: 10 },
  searchBar: {
    backgroundColor: "#2a242e",
    color: "#fff",
    padding: 15,
    borderRadius: 8,
    fontSize: 14,
    borderWidth: 1,
    borderColor: "#3a343d",
  },
  filterContainer: { flexDirection: "row", marginTop: 15, gap: 10 },
  filterPill: {
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#3a343d",
    backgroundColor: "transparent",
  },
  filterPillActive: { backgroundColor: "#3a343d", borderColor: "#716876" },
  filterText: { color: "#716876", fontSize: 11, fontWeight: "bold" },
  filterTextActive: { color: "#bdaec6" },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#2a242e",
    marginBottom: 10,
    paddingHorizontal: 10, // respiro nas laterais
  },
  tab: { alignItems: "center", flex: 1, paddingBottom: 12 },
  tabActive: { borderBottomColor: "#9c8aa5", borderBottomWidth: 2 },
  tabText: {
    color: "#716876",
    fontWeight: "bold",
    fontSize: 11,
    letterSpacing: 0.5,
  },
  tabTextActive: { color: "#bdaec6" },
  dotIndicator: {
    width: 4,
    height: 4,
    backgroundColor: "#9c8aa5",
    borderRadius: 2,
    position: "absolute",
    bottom: 4,
  },
  listContent: { paddingHorizontal: 20, paddingBottom: 20 },
  card: {
    backgroundColor: "#2a242e",
    padding: 18,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "transparent",
  },
  cardSelected: { backgroundColor: "#bdaec6", borderColor: "#fff" },
  cardContent: { flex: 1 },
  cardTitle: { color: "#fff", fontSize: 14, fontWeight: "bold" },
  cardDetails: { color: "#716876", fontSize: 11, marginTop: 4 },
  textSelected: { color: "#1a161d" },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#716876",
    alignItems: "center",
    justifyContent: "center",
  },
  radioCircleSelected: { borderColor: "#1a161d" },
  radioDot: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: "#1a161d",
  },
  emptyText: {
    color: "#716876",
    textAlign: "center",
    marginTop: 40,
    fontSize: 12,
  },
  footer: {
    backgroundColor: "#2a242e",
    padding: 20,
    // elevação do footer para barras de navegação virtuais
    paddingBottom: Platform.OS === "android" ? 30 : 20,
    borderTopWidth: 1,
    borderTopColor: "#3a343d",
  },
  progressContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  progressText: { color: "#716876", fontSize: 12, fontWeight: "bold" },
  progressValue: { color: "#bdaec6", fontSize: 12, fontWeight: "bold" },
  btnNext: {
    backgroundColor: "#9c8aa5",
    padding: 18,
    borderRadius: 8,
    alignItems: "center",
  },
  btnDisabled: { backgroundColor: "#3a343d" },
  btnNextText: {
    color: "#1a161d",
    fontWeight: "bold",
    fontSize: 14,
    letterSpacing: 1,
  },
});
