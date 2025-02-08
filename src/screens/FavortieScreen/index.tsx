import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Header from "../../components/Header";
import { useTranslation } from "react-i18next";

const FavoriteScreen: React.FC = () => {
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.content}>
        <Text style={styles.text}>{t("favorite")}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 20,
  },
});

export default FavoriteScreen;
