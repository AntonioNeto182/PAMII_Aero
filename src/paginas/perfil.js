import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, StyleSheet, ActivityIndicator, Modal, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import NotificationPopup from './notificationpopup';
import MenuPopup from './menupopup';

export default function Perfil({ route, navigation }) {
  const [usuarioCompleto, setUsuarioCompleto] = useState(route.params?.usuario || {});
  const [carregando, setCarregando] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const api = "http://192.168.0.127/projetos/apireact_usuarios/";

  const avatares = [
    'https://cdn-icons-png.flaticon.com/512/616/616408.png',
    'https://cdn-icons-png.flaticon.com/512/616/616430.png',
    'https://cdn-icons-png.flaticon.com/512/616/616425.png',
    'https://cdn-icons-png.flaticon.com/512/616/616412.png',
    'https://cdn-icons-png.flaticon.com/512/616/616414.png',
    'https://cdn-icons-png.flaticon.com/512/616/616421.png'
  ];

  useEffect(() => {
    const { usuario } = route.params || {};
    console.log("Usuário recebido no Perfil:", usuario);

    if (usuario && usuario.id) {
      buscarDadosCompletos(usuario.id);
    } else {
      setCarregando(false);
    }
  }, []);

  async function buscarDadosCompletos(userId) {
    try {
      const res = await axios.post(api + "perfil.php", { id: userId });

      if (res.data.success) {
        setUsuarioCompleto(res.data.usuario);
      }
    } catch (error) {
      console.error("Erro:", error);
    } finally {
      setCarregando(false);
    }
  }

  async function atualizarAvatar(novoAvatar) {
    try {
      const res = await axios.post(api + "atualizar_avatar.php", {
        id: usuarioCompleto.id,
        avatar: novoAvatar
      });

      if (res.data.success) {
        const usuarioAtualizado = {
          ...usuarioCompleto,
          avatar: novoAvatar
        };

        setUsuarioCompleto(usuarioAtualizado);
        setModalVisible(false);
        Alert.alert("Sucesso", "Avatar atualizado com sucesso!");

        // ✅ ATUALIZAR PARÂMETROS DA ROTA
        navigation.setParams({
          usuario: usuarioAtualizado
        });
      } else {
        Alert.alert("Erro", "Não foi possível atualizar o avatar");
      }
    } catch (error) {
      console.error("Erro ao atualizar avatar:", error);
      Alert.alert("Erro", "Erro de conexão");
    }
  }

  if (carregando) {
    return (
      <View style={[styles.safeArea, styles.centralizado]}>
        <ActivityIndicator size="large" color="#d4af37" />
        <Text style={styles.textoCarregando}>Carregando perfil...</Text>
      </View>
    );
  }

  const dadosExibir = usuarioCompleto || route.params?.usuario;
  const avatarAtual = dadosExibir?.avatar || 'https://cdn-icons-png.flaticon.com/512/616/616408.png';

  return (
    <View style={styles.safeArea}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
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

              <Image
                source={{ uri: avatarAtual }}
                style={styles.avatarPequeno}
              />

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
          <Text style={styles.bemvindo}>Informações do perfil</Text>
        </LinearGradient>

        <View style={styles.content}>
          <View style={styles.profileCard}>
            <Image
              source={{ uri: avatarAtual }}
              style={styles.avatarGrande}
            />

            <Text style={styles.profileName}>{dadosExibir?.nome || 'Nome não disponível'}</Text>
            <Text style={styles.profileEmail}>{dadosExibir?.email || 'Email não disponível'}</Text>

            <TouchableOpacity
              style={styles.alterarImagemBtn}
              onPress={() => setModalVisible(true)}
            >
              <Ionicons name="camera-outline" size={16} color="#d4af37" />
              <Text style={styles.alterarImagemText}>Alterar Imagem</Text>
            </TouchableOpacity>

            <View style={styles.dataCard}>
              <Text style={styles.dataTitle}>Dados de cadastro</Text>

              <View style={styles.dataRow}>
                <Text style={styles.label}>CPF:</Text>
                <Text style={styles.value}>{dadosExibir?.cpf || 'Não cadastrado'}</Text>
              </View>

              <View style={styles.dataRow}>
                <Text style={styles.label}>RG:</Text>
                <Text style={styles.value}>{dadosExibir?.rg || 'Não cadastrado'}</Text>
              </View>

              <View style={styles.dataRow}>
                <Text style={styles.label}>Telefone:</Text>
                <Text style={styles.value}>{dadosExibir?.telefone || 'Não cadastrado'}</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.viagensBtn}
              onPress={() => navigation.navigate('ViagensAgendadas', { usuario: dadosExibir })}
            >
              <Ionicons name="airplane" size={16} color="#d4af37" />
              <Text style={styles.viagensText}>Ver Viagens Agendadas</Text>
            </TouchableOpacity>
          
            <TouchableOpacity
              style={styles.voltarBtn}
              onPress={() => {
                const dadosAtualizados = usuarioCompleto || route.params?.usuario;
                navigation.navigate('AgendarVoos', {
                  usuario: dadosAtualizados
                });
              }}
            >
              <Text style={styles.voltarText}>Voltar</Text>
            </TouchableOpacity>
          </View>
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
            <Text style={styles.modalTitle}>Escolha seu avatar</Text>

            <View style={styles.avataresContainer}>
              {avatares.map((avatar, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.avatarItem,
                    avatarAtual === avatar && styles.avatarSelecionado
                  ]}
                  onPress={() => atualizarAvatar(avatar)}
                >
                  <Image
                    source={{ uri: avatar }}
                    style={styles.avatarMiniatura}
                  />
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={styles.fecharModalBtn}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.fecharModalText}>Fechar</Text>
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
        usuario={dadosExibir}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#faf4e6'
  },
  centralizado: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  textoCarregando: {
    marginTop: 15,
    fontSize: 16,
    color: '#666'
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
  avatarPequeno: {
    width: 35,
    height: 35,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#d4af37',
  },
  avatarGrande: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#d4af37',
    marginBottom: 15,
  },
  bemvindo: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
  },
  content: {
    padding: 20,
    alignItems: 'center',
  },
  profileCard: {
    alignItems: 'center',
    width: '100%'
  },
  profileName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    marginBottom: 5
  },
  profileEmail: {
    color: '#777',
    marginBottom: 20,
    textAlign: 'center'
  },
  alterarImagemBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d4af37',
    marginBottom: 20,
  },
  alterarImagemText: {
    color: '#d4af37',
    fontWeight: '600',
    marginLeft: 5
  },
  dataCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    elevation: 2,
    marginBottom: 15
  },
  dataTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 15,
    color: '#333',
    textAlign: 'center'
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  label: {
    color: '#444',
    fontWeight: '600',
    fontSize: 14
  },
  value: {
    color: '#555',
    fontSize: 14,
    fontWeight: '500'
  },
  adminBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d4af37',
    marginBottom: 15,
  },
  adminText: {
    color: '#d4af37',
    fontWeight: '600',
    marginLeft: 5
  },
  viagensBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d4af37',
    marginBottom: 15,
  },
  viagensText: {
    color: '#d4af37',
    fontWeight: '600',
    marginLeft: 5
  },
  voltarBtn: {
    backgroundColor: '#d4af37',
    paddingVertical: 12,
    borderRadius: 10,
    width: '60%',
    alignItems: 'center',
  },
  voltarText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16
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
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 20,
    color: '#333'
  },
  avataresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },
  avatarItem: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 8,
    backgroundColor: '#f5f5f5',
  },
  avatarSelecionado: {
    borderWidth: 3,
    borderColor: '#d4af37',
    backgroundColor: '#fffbe6',
  },
  avatarMiniatura: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  fecharModalBtn: {
    backgroundColor: '#d4af37',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  fecharModalText: {
    color: '#fff',
    fontWeight: '600',
  },
});