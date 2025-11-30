import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';

export default function AdminUsuarios({ route, navigation }) {
  const [usuarios, setUsuarios] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const { usuario } = route.params || {};

  const api = "http://192.168.0.127/projetos/apireact_usuarios/";

  useEffect(() => {
    carregarUsuarios();
  }, []);

  async function carregarUsuarios() {
    try {
      const res = await axios.get(api + "listar.php");
      setUsuarios(res.data);
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
      Alert.alert("Erro", "Não foi possível carregar a lista de usuários");
    } finally {
      setCarregando(false);
    }
  }

  if (carregando) {
    return (
      <View style={[styles.safeArea, styles.centralizado]}>
        <ActivityIndicator size="large" color="#d4af37" />
        <Text style={styles.textoCarregando}>Carregando usuários...</Text>
      </View>
    );
  }

  return (
    <View style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>

        <LinearGradient colors={['#fffbe6', '#f6e9be']} style={styles.header}>
          <View style={styles.topBar}>
            <View style={styles.logoRow}>
              <Ionicons name="airplane" size={18} color="#d4af37" />
              <Text style={styles.logoText}>aero</Text>
            </View>
            
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>
          </View>

          <Text style={styles.bemvindo}>Administração de Usuários</Text>
          <Text style={styles.data}>Total de {usuarios.length} usuários cadastrados</Text>
        </LinearGradient>

        {/* === LISTA DE USUÁRIOS === */}
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Todos os Usuários</Text>

          {usuarios.map((user) => (
            <View key={user.id} style={styles.userCard}>
              <View style={styles.userHeader}>
                <Image
                  source={{ uri: user.avatar || 'https://cdn-icons-png.flaticon.com/512/616/616408.png' }}
                  style={styles.userAvatar}
                />
                <View style={styles.userInfo}>
                  <Text style={styles.userName}>{user.nome}</Text>
                  <Text style={styles.userEmail}>{user.email}</Text>
                </View>
                <Text style={styles.userId}>#{user.id}</Text>
              </View>

              <View style={styles.userDetails}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>CPF:</Text>
                  <Text style={styles.detailValue}>{user.cpf || 'Não informado'}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Telefone:</Text>
                  <Text style={styles.detailValue}>{user.telefone || 'Não informado'}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>RG:</Text>
                  <Text style={styles.detailValue}>{user.rg || 'Não informado'}</Text>
                </View>
              </View>
            </View>
          ))}

          {usuarios.length === 0 && (
            <View style={styles.emptyState}>
              <Ionicons name="people-outline" size={50} color="#d4af37" />
              <Text style={styles.emptyText}>Nenhum usuário cadastrado</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* BOTÃO VOLTAR FIXO */}
      <TouchableOpacity 
        style={styles.voltarBtn}
        onPress={() => navigation.navigate('Perfil', { usuario: usuario })}
      >
        <Ionicons name="person" size={20} color="#fff" />
        <Text style={styles.voltarText}>Voltar ao Perfil</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#faf4e6',
  },
  centralizado: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  textoCarregando: {
    marginTop: 15,
    fontSize: 16,
    color: '#666',
  },
  scrollContent: {
    paddingBottom: 80,
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
  bemvindo: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
  },
  data: {
    color: '#666',
    marginBottom: 15,
  },
  content: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#444',
    marginBottom: 15,
  },
  userCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#d4af37',
  },
  userInfo: {
    flex: 1,
    marginLeft: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  userEmail: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  userId: {
    fontSize: 12,
    color: '#d4af37',
    fontWeight: '600',
  },
  userDetails: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 10,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 3,
  },
  detailLabel: {
    color: '#444',
    fontWeight: '600',
    fontSize: 12,
  },
  detailValue: {
    color: '#555',
    fontSize: 12,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    marginTop: 10,
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
  },
  voltarBtn: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#d4af37',
    paddingVertical: 12,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  voltarText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
    marginLeft: 8,
  },
});