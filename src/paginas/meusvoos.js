import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import NotificationPopup from './notificationpopup';
import MenuPopup from './menupopup';

export default function MeusVoos({ route, navigation }) {
  const [usuario, setUsuario] = useState(route.params?.usuario || {});
  const [avatarUrl, setAvatarUrl] = useState('https://cdn-icons-png.flaticon.com/512/616/616408.png');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    if (route.params?.usuario) {
      const user = route.params.usuario;
      setUsuario(user);
      
      const newAvatarUrl = user?.avatar && user.avatar !== '' && user.avatar !== null
        ? user.avatar 
        : 'https://cdn-icons-png.flaticon.com/512/616/616408.png';
      
      setAvatarUrl(newAvatarUrl);
    }
  }, [route.params]);

  const voosProximos = [
    {
      codigo: 'Q3 1234',
      companhia: 'Qatar Linhas Aéreas',
      origem: 'GRU',
      destino: 'SDU',
      horaSaida: '14:30',
      horaChegada: '14:30',
      status: 'Embarque',
      cor: '#f2c94c',
    },
    {
      codigo: 'LA 3456',
      companhia: 'LATAM Airlines',
      origem: 'SDU',
      destino: 'SSA',
      horaSaida: '18:45',
      horaChegada: '14:30',
      status: 'No horário',
      cor: '#6fcf97',
    },
  ];

  const voosHoje = [
    {
      codigo: 'AD 7890',
      companhia: 'Azul Linhas Aéreas',
      origem: 'SDU',
      destino: 'GRU',
      horaSaida: '09:15',
      horaChegada: '11:45',
      status: 'No horário',
      cor: '#6fcf97',
    },
    {
      codigo: 'LA 3456',
      companhia: 'LATAM Airlines',
      origem: 'SDU',
      destino: 'SSA',
      horaSaida: '18:45',
      horaChegada: '14:30',
      status: 'Atrasado',
      cor: '#eb5757',
    },
  ];

  const renderVoo = (voo) => (
    <View key={voo.codigo} style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.codigo}>{voo.codigo}</Text>
        <View style={[styles.status, { backgroundColor: voo.cor }]}>
          <Text style={styles.statusText}>{voo.status}</Text>
        </View>
      </View>
      <Text style={styles.companhia}>{voo.companhia}</Text>

      <View style={styles.infoRow}>
        <View style={styles.col}>
          <Ionicons name="airplane-outline" size={16} color="#555" />
          <Text style={styles.infoText}>{voo.origem}</Text>
          <Text style={styles.time}>{voo.horaSaida}</Text>
        </View>

        <Ionicons name="arrow-forward-outline" size={20} color="#999" />

        <View style={styles.col}>
          <Ionicons name="pin-outline" size={16} color="#555" />
          <Text style={styles.infoText}>{voo.destino}</Text>
          <Text style={styles.time}>{voo.horaChegada}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.safeArea}>
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={{ paddingBottom: 50 }}
        showsVerticalScrollIndicator={false}
      >

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
                  source={{ uri: avatarUrl }}
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
            <TouchableOpacity style={[styles.menuBtn, styles.active]}>
              <Text style={[styles.menuText, styles.activeText]}>Meus voos</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.menuBtn} 
              onPress={() => navigation.navigate('Servicos', { usuario: usuario })}
            >
              <Text style={styles.menuText}>Serviços</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.menuBtn} 
              onPress={() => navigation.navigate('Aeroporto', { usuario: usuario })}
            >
              <Text style={styles.menuText}>Aeroporto</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Próximas viagens</Text>
          {voosProximos.map(renderVoo)}

          <Text style={styles.sectionTitle}>Voos de Hoje</Text>
          {voosHoje.map(renderVoo)}
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
  scrollContainer: {
    flex: 1,
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
    paddingHorizontal: 20,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#444',
    marginVertical: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  codigo: {
    fontWeight: '700',
    fontSize: 16,
    color: '#222',
  },
  status: {
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  companhia: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  col: {
    alignItems: 'center',
  },
  infoText: {
    fontSize: 14,
    color: '#333',
    marginTop: 4,
  },
  time: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
  },
});