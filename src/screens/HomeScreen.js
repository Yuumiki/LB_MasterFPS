import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Home({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.badgeContainer}>
          <Text style={styles.badgeText}>Análise de desempenho</Text>
        </View>

        <Text style={styles.logo}>
          LB-Master<Text style={styles.logoAccent}>FPS</Text>
        </Text>

        <Text style={styles.tagline}>
          Simule a resposta do hardware em cenários de alto processamento gráfico
        </Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.buttonPrimary}
            onPress={() => navigation.navigate("Build")}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonPrimaryText}>NOVO SETUP</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.buttonSecondary}
            onPress={() => navigation.navigate("Saved")}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonSecondaryText}>SETUPS SALVOS</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>APS desenvolvimento de aplicativos móveis</Text>
        <Text style={styles.footerDate}>Build: 2026.04</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a161d",
    justifyContent: "space-between",
    padding: 20,
  },
  content: { flex: 1, justifyContent: "center", alignItems: "center" },
  badgeContainer: {
    backgroundColor: "#2a242e",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#3a343d",
  },
  badgeText: {
    color: "#716876",
    fontSize: 10,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  logo: {
    fontSize: 42,
    fontWeight: "900",
    color: "#bdaec6",
    letterSpacing: -1,
  },
  logoAccent: { color: "#9c8aa5" },
  tagline: {
    color: "#716876",
    fontSize: 15,
    textAlign: "center",
    marginTop: 15,
    paddingHorizontal: 10,
    lineHeight: 22,
  },
  buttonContainer: { width: "100%", marginTop: 50 },
  buttonPrimary: {
    backgroundColor: "#9c8aa5",
    paddingVertical: 18,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 15,
    elevation: 2,
  },
  buttonPrimaryText: {
    color: "#1a161d",
    fontSize: 15,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  buttonSecondary: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#3a343d",
    paddingVertical: 18,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonSecondaryText: {
    color: "#716876",
    fontSize: 13,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  footer: { alignItems: "center", paddingBottom: 10 },
  footerText: { color: "#716876", fontSize: 12, fontWeight: "500" },
  footerDate: { color: "#3a343d", fontSize: 10, marginTop: 4 },
});
