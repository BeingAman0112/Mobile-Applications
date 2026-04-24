// app/index.tsx
import { router } from "expo-router";
import React from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");
const tileSize = (width - 48) / 2; // 2 columns with padding

// Tile data
const features = [
  {
    id: "image-resizer",
    title: "Image Resizer",
    description: "Resize images to any dimension",
    icon: "🖼️",
    color: "#FF6B6B",
    route: "/image-resizer",
  },
  {
    id: "pdf-from-images",
    title: "PDF from Images",
    description: "Convert multiple images to PDF",
    icon: "📄",
    color: "#4ECDC4",
    route: "/pdf-from-images",
  },
  {
    id: "pdf-to-doc",
    title: "PDF to DOC",
    description: "Convert PDF to editable Word document",
    icon: "📝",
    color: "#45B7D1",
    route: "/pdf-to-doc",
  },
  {
    id: "barcode-scanner",
    title: "Barcode Scanner",
    description: "Scan QR codes and barcodes",
    icon: "📷",
    color: "#96CEB4",
    route: "/barcode-scanner",
  },
];

export default function HomeScreen() {
  const handlePress = (route: string) => {
    router.push(route as any);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>🛠️ Toolbox App</Text>
        <Text style={styles.subtitle}>Your complete utility toolkit</Text>
      </View>

      {/* Tiles Grid */}
      <View style={styles.grid}>
        {features.map((feature) => (
          <TouchableOpacity
            key={feature.id}
            style={[styles.tile, { backgroundColor: feature.color }]}
            onPress={() => handlePress(feature.route)}
            activeOpacity={0.8}
          >
            <Text style={styles.tileIcon}>{feature.icon}</Text>
            <Text style={styles.tileTitle}>{feature.title}</Text>
            <Text style={styles.tileDescription}>{feature.description}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Footer Info */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Tap any tool to get started</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    padding: 24,
    paddingTop: 48,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#212529",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#6c757d",
    textAlign: "center",
    marginTop: 8,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 16,
    gap: 16,
  },
  tile: {
    width: tileSize,
    height: tileSize,
    borderRadius: 20,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  tileIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  tileTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 8,
  },
  tileDescription: {
    fontSize: 12,
    color: "#ffffff",
    textAlign: "center",
    opacity: 0.9,
  },
  footer: {
    padding: 24,
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    color: "#6c757d",
  },
});
