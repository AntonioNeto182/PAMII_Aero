import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';

export default function ViagensAgendadas({ route, navigation }) {
  const { usuario } = route.params;
  const [viagens, setViagens] = useState([]);
  const [carregando, setCarregando] = useState(true);

  const api = "http://192.168.0.127/projetos/apireact_usuarios/";

  useEffect(() => {
    carregarViagens();
  }, []);

  const carregarViagens = async () => {
    try {
      const res = await axios.post(api + "listar_viagens.php", { id_usuario: usuario.id });
      if (res.data.success) {
        setViagens(res.data.viagens);
      } else {
        Alert.alert("Erro", "Não foi possível carregar as viagens");
      }
    } catch (error) {
      console.error("Erro ao carregar viagens:", error);
      Alert.alert("Erro", "Erro de conexão ao carregar viagens");
    } finally {
      setCarregando(false);
    }
  };

  const cancelarViagem = async (idViagem) => {
    Alert.alert(
      'Cancelar Viagem',
      'Tem certeza que deseja cancelar esta viagem?',
      [
        { text: 'Não', style: 'cancel' },
        {
          text: 'Sim',
          onPress: async () => {
            try {
              const res = await axios.post(api + "cancelar_viagem.php", { 
                id_viagem: idViagem,
                id_usuario: usuario.id 
              });
              
              if (res.data.success) {
                Alert.alert("Sucesso", "Viagem cancelada com sucesso!");
                carregarViagens(); // Recarrega a lista
              } else {
                Alert.alert("Erro", res.data.message || "Não foi possível cancelar a viagem");
              }
            } catch (error) {
              console.error("Erro ao cancelar viagem:", error);
              Alert.alert("Erro", "Erro de conexão");
            }
          },
        },
      ]
    );
  };

  if (carregando) {
    return (
      <View style={[styles.safeArea, styles.centralizado]}>
        <ActivityIndicator size="large" color="#d4af37" />
        <Text style={styles.textoCarregando}>Carregando viagens...</Text>
      </View>
    );
  }

  return (
    <View style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <LinearGradient colors={['#fffbe6', '#f6e9be']} style={styles.header}>
          <View style={styles.topBar}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>
            <View style={styles.logoRow}>
              <Ionicons name="airplane" size={18} color="#d4af37" />
              <Text style={styles.logoText}>aero</Text>
            </View>
            <View style={styles.placeholder} />
          </View>
          <Text style={styles.bemvindo}>Viagens Agendadas</Text>
          <Text style={styles.data}>{viagens.length} viagem(ns) encontrada(s)</Text>
        </LinearGradient>

        <View style={styles.content}>
          {viagens.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="airplane" size={50} color="#d4af37" />
              <Text style={styles.emptyText}>Nenhuma viagem agendada</Text>
              <TouchableOpacity 
                style={styles.btnAgendar}
                onPress={() => navigation.navigate('AgendarVoos', { usuario })}
              >
                <Text style={styles.btnAgendarText}>Agendar Primeira Viagem</Text>
              </TouchableOpacity>
            </View>
          ) : (
            viagens.map(viagem => (
              <View key={viagem.id} style={styles.viagemCard}>
                <View style={styles.viagemHeader}>
                  <Text style={styles.viagemDestino}>{viagem.destino}</Text>
                  <Text style={styles.codigoReserva}>{viagem.codigo_reserva}</Text>
                </View>
                
                <View style={styles.viagemInfoContainer}>
                  <View style={styles.infoRow}>
                    <Ionicons name="airplane-outline" size={16} color="#666" />
                    <Text style={styles.viagemInfo}>Voo: {viagem.numero_voo}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Ionicons name="time-outline" size={16} color="#666" />
                    <Text style={styles.viagemInfo}>Horário: {viagem.horario}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Ionicons name="location-outline" size={16} color="#666" />
                    <Text style={styles.viagemInfo}>Embarque: {viagem.aeroporto_embarque}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Ionicons name="people-outline" size={16} color="#666" />
                    <Text style={styles.viagemInfo}>Passageiros: {viagem.quantidade_passageiros}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Ionicons name="person-outline" size={16} color="#666" />
                    <Text style={styles.viagemInfo}>Assentos: {viagem.assentos}</Text>
                  </View>
                  {viagem.hospedagem && (
                    <>
                      <View style={styles.infoRow}>
                        <Ionicons name="business-outline" size={16} color="#666" />
                        <Text style={styles.viagemInfo}>Hospedagem: {viagem.hospedagem}</Text>
                      </View>
                      <View style={styles.infoRow}>
                        <Ionicons name="bed-outline" size={16} color="#666" />
                        <Text style={styles.viagemInfo}>Quarto: {viagem.numero_quarto}</Text>
                      </View>
                    </>
                  )}
                </View>

                <TouchableOpacity 
                  style={styles.cancelarBtn}
                  onPress={() => cancelarViagem(viagem.id)}
                >
                  <Ionicons name="close-circle" size={16} color="#fff" />
                  <Text style={styles.cancelarTexto}>Cancelar Viagem</Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>
      </ScrollView>
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
    paddingBottom: 40,
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
  placeholder: {
    width: 24,
  },
  bemvindo: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
  },
  data: {
    color: '#666',
  },
  content: {
    padding: 20,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    marginTop: 10,
    color: '#666',
    fontSize: 16,
    marginBottom: 20,
  },
  btnAgendar: {
    backgroundColor: '#d4af37',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  btnAgendarText: {
    color: '#fff',
    fontWeight: '700',
  },
  viagemCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
  },
  viagemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 10,
  },
  viagemDestino: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  codigoReserva: {
    fontSize: 12,
    color: '#d4af37',
    fontWeight: '600',
    backgroundColor: '#fffbe6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  viagemInfoContainer: {
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  viagemInfo: {
    fontSize: 14,
    color: '#555',
    marginLeft: 8,
  },
  cancelarBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eb5757',
    padding: 12,
    borderRadius: 8,
    marginTop: 5,
  },
  cancelarTexto: {
    color: '#fff',
    fontWeight: '700',
    marginLeft: 5,
  },
});