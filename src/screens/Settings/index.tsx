import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";

const Settings: React.FC = () => {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t("settings")}</Text>
      <View style={styles.languageOption}>
        <Text style={styles.text}>{t("language")}:</Text>
        <Button title={t("english")} onPress={() => changeLanguage("en")} />
        <Button title={t("vietnamese")} onPress={() => changeLanguage("vi")} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  languageOption: {
    marginTop: 20,
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    marginBottom: 10,
  },
});

export default Settings;
