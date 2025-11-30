import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import NotificationPopup from './notificationpopup';
import MenuPopup from './menupopup';

export default function Aeroporto({ route, navigation }) {
  const [usuario, setUsuario] = useState(route.params?.usuario || {});
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  // ✅ OBSERVAR MUDANÇAS NOS PARÂMETROS
  useEffect(() => {
    if (route.params?.usuario) {
      setUsuario(route.params.usuario);
    }
  }, [route.params?.usuario]);

  return (
    <View style={styles.safeArea}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        <LinearGradient colors={['#fffbe6', '#f6e9be']} style={styles.header}>
          <View style={styles.topBar}>
            <View style={styles.logoRow}>
              <Ionicons name="airplane" size={18} color="#d4af37" />
              <Text style={styles.logoText}>aero</Text>
            </View>

            <View style={styles.rightIcons}>
              <TouchableOpacity 
                onPress={() => {
                  setShowNotifications(true);
                  setShowMenu(false);
                }}
              >
                <Ionicons name="notifications-outline" size={22} color="#000" style={{ marginRight: 12 }} />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => navigation.navigate('Perfil', { usuario: usuario })}>
                <Image
                  source={{ uri: usuario?.avatar || 'https://cdn-icons-png.flaticon.com/512/616/616408.png' }}
                  style={styles.avatar}
                />
              </TouchableOpacity>

              <TouchableOpacity 
                onPress={() => {
                  setShowMenu(true);
                  setShowNotifications(false);
                }}
              >
                <Ionicons name="menu-outline" size={26} color="#000" style={{ marginLeft: 10 }} />
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.bemvindo}>Bem vindo de volta, {usuario?.nome || 'Viajante'}!</Text>
          <Text style={styles.data}>Hoje é quinta-feira, 25 de setembro de 2025</Text>

          <View style={styles.menuButtons}>
            <TouchableOpacity 
              style={styles.menuBtn} 
              onPress={() => navigation.navigate('AgendarVoos', { usuario: usuario })}
            >
              <Text style={styles.menuText}>Agendar Voos</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.menuBtn} 
              onPress={() => navigation.navigate('Servicos', { usuario: usuario })}
            >
              <Text style={styles.menuText}>Serviços</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.menuBtn, styles.active]}>
              <Text style={[styles.menuText, styles.activeText]}>Aeroporto</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Informações do Aeroporto</Text>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Serviços Disponíveis</Text>
            {[
              ['Wi-Fi Gratuito', 'Disponível'],
              ['Transporte', 'Disponível'],
              ['Duty Free', 'Disponível'],
              ['Cafés e Restaurantes', 'Disponível'],
            ].map(([servico, status]) => (
              <View key={servico} style={styles.serviceRow}>
                <Text style={styles.serviceText}>{servico}</Text>
                <Text style={styles.statusDisponivel}>{status}</Text>
              </View>
            ))}
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Informações Importantes</Text>
            <View style={styles.infoItem}>
              <Text style={styles.infoTitle}>Terminal 2:</Text>
              <Text style={styles.infoText}>Em manutenção das 23h às 5h</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoTitle}>Check-in:</Text>
              <Text style={styles.infoText}>Recomendado 2h antes para voos domésticos</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoTitle}>Segurança:</Text>
              <Text style={styles.infoText}>Tempo médio de espera: 15 minutos</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <NotificationPopup 
        visible={showNotifications} 
        onClose={() => setShowNotifications(false)} 
      />
      
      <MenuPopup 
        visible={showMenu}
        onClose={() => setShowMenu(false)}
        navigation={navigation}
        usuario={usuario}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#faf4e6',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 25,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    elevation: 3,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#d4af37',
    marginLeft: 5,
  },
  rightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 35,
    height: 35,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#d4af37',
  },
  bemvindo: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
  },
  data: {
    color: '#666',
    marginBottom: 15,
  },
  menuButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#f0f0f0',
    borderRadius: 30,
    paddingVertical: 6,
  },
  menuBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 6,
    borderRadius: 20,
  },
  menuText: {
    color: '#666',
    fontWeight: '600',
  },
  active: {
    backgroundColor: '#dcdcdc',
  },
  activeText: {
    color: '#000',
  },
  content: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#444',
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
  },
  cardTitle: {
    fontWeight: '700',
    fontSize: 16,
    marginBottom: 10,
    color: '#333',
  },
  serviceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  serviceText: {
    color: '#444',
  },
  statusDisponivel: {
    color: '#6fcf97',
    fontWeight: '600',
  },
  infoItem: {
    marginBottom: 8,
  },
  infoTitle: {
    fontWeight: '700',
    color: '#222',
  },
  infoText: {
    color: '#444',
    fontSize: 13,
  },
});