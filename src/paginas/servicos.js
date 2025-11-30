import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, StyleSheet, Modal, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import NotificationPopup from './notificationpopup';
import MenuPopup from './menupopup';

export default function Servicos({ route, navigation }) {
  const [usuario, setUsuario] = useState(route.params?.usuario || {});
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitulo, setModalTitulo] = useState('');
  const [modalMensagem, setModalMensagem] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  // ✅ OBSERVAR MUDANÇAS NOS PARÂMETROS
  useEffect(() => {
    if (route.params?.usuario) {
      setUsuario(route.params.usuario);
    }
  }, [route.params?.usuario]);

  const mostrarPopup = (titulo, mensagem) => {
    setModalTitulo(titulo);
    setModalMensagem(mensagem);
    setModalVisible(true);
  };

  const servicos = [
    {
      id: 1,
      icon: 'airplane-outline',
      titulo: 'Check-in Online',
      descricao: 'Faça seu Check-in e escolha seu assento',
      botao: 'Fazer Check-in',
      acao: () => mostrarPopup(
        'Check-in Online', 
        'Check-in Online indisponivel, atualmente apenas presencial.'
      )
    },
    {
      id: 3,
      icon: 'ticket-outline',
      titulo: 'Gerenciar Reservas',
      descricao: 'Visualize e modifique suas reservas',
      botao: 'Ver Reservas',
      acao: () => navigation.navigate('ViagensAgendadas', { usuario: usuario })
    },
    {
      id: 4,
      icon: 'person-circle-outline',
      titulo: 'Perfil de Passageiro',
      descricao: 'Gerencie seus dados',
      botao: 'Ver Perfil',
      acao: () => navigation.navigate('Perfil', { usuario: usuario })
    },
  ];

  const renderServico = (item) => (
    <View key={item.id} style={styles.card}>
      <Ionicons name={item.icon} size={30} color="#d4af37" style={{ marginBottom: 10 }} />
      <Text style={styles.cardTitle}>{item.titulo}</Text>
      <Text style={styles.cardDesc}>{item.descricao}</Text>

      <TouchableOpacity 
        style={styles.cardButton}
        onPress={item.acao}
      >
        <Text style={styles.cardButtonText}>{item.botao}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.safeArea}>
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={{ paddingBottom: 60 }}
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
            
            <TouchableOpacity style={[styles.menuBtn, styles.active]}>
              <Text style={[styles.menuText, styles.activeText]}>Serviços</Text>
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
          <Text style={styles.sectionTitle}>Serviços disponíveis</Text>
          {servicos.map(renderServico)}
        </View>
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Ionicons name="information-circle-outline" size={50} color="#d4af37" />
            <Text style={styles.modalTitulo}>{modalTitulo}</Text>
            <Text style={styles.modalMensagem}>{modalMensagem}</Text>
            
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Entendido</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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
    elevation: 2,
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
    marginBottom: 15,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    alignItems: 'center',
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 5,
  },
  cardDesc: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
  },
  cardButton: {
    backgroundColor: '#d4af37',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  cardButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    width: '80%',
    elevation: 5,
  },
  modalTitulo: {
    fontSize: 18,
    fontWeight: '700',
    marginVertical: 15,
    color: '#333',
    textAlign: 'center'
  },
  modalMensagem: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20
  },
  modalButton: {
    backgroundColor: '#d4af37',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 10,
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16
  },
});