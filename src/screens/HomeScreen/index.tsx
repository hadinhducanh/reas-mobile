import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next'; // Import hook useTranslation
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const HomeScreen: React.FC = () => {
  // Sử dụng hook useTranslation để lấy hàm t() và đối tượng i18n
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.content}>
        {/* Sử dụng t() để hiển thị văn bản dịch từ các file JSON */}
        <Text style={styles.text}>{t('welcome')}</Text>
      </View>
      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
  },
});

export default HomeScreen;
