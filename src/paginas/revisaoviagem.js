import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'react-native';

export default function RevisaoViagem({ route, navigation }) {
  const {
    usuario,
    destino,
    aeroportoEmbarque,
    horario,
    hospedagem,
    quantidadePassageiros,
    precoTotal,
    numeroVoo,
    duracaoVoo,
    modeloAviao,
    assentos,
    codigoReserva,
    enderecoHospedagem,
    numeroQuarto
  } = route.params;

  const prosseguirPagamento = () => {
    navigation.navigate('Pagamento', {
      usuario,
      destino,
      aeroportoEmbarque,
      horario,
      hospedagem,
      quantidadePassageiros,
      precoTotal,
      numeroVoo,
      duracaoVoo,
      modeloAviao,
      assentos,
      codigoReserva,
      enderecoHospedagem,
      numeroQuarto
    });
  };

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
          <Text style={styles.bemvindo}>Revisão da Viagem</Text>
        </LinearGradient>

        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Detalhes da Viagem</Text>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Destino: {destino}</Text>
            <Text style={styles.cardItem}>Aeroporto de Embarque: {aeroportoEmbarque}</Text>
            <Text style={styles.cardItem}>Horário: {horario}</Text>
            <Text style={styles.cardItem}>Número do Voo: {numeroVoo}</Text>
            <Text style={styles.cardItem}>Duração do Voo: {duracaoVoo}</Text>
            <Text style={styles.cardItem}>Modelo do Avião: {modeloAviao}</Text>
            <Text style={styles.cardItem}>Quantidade de Passageiros: {quantidadePassageiros}</Text>
            <Text style={styles.cardItem}>Assentos: {assentos.join(', ')}</Text>
            {hospedagem && (
              <>
                <Text style={styles.cardItem}>Hospedagem: {hospedagem}</Text>
                <Text style={styles.cardItem}>Endereço: {enderecoHospedagem}</Text>
                <Text style={styles.cardItem}>Número do Quarto: {numeroQuarto}</Text>
              </>
            )}
            <Text style={styles.cardItem}>Código da Reserva: {codigoReserva}</Text>
            <Text style={styles.precoTotal}>Preço Total: R$ {precoTotal.toFixed(2)}</Text>
          </View>

          <TouchableOpacity style={styles.prosseguirBtn} onPress={prosseguirPagamento}>
            <Text style={styles.prosseguirTexto}>Prosseguir para Pagamento</Text>
          </TouchableOpacity>
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
  content: {
    padding: 20,
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
    padding: 15,
    marginBottom: 15,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 10,
  },
  cardItem: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  precoTotal: {
    fontSize: 18,
    fontWeight: '700',
    color: '#d4af37',
    marginTop: 10,
  },
  prosseguirBtn: {
    backgroundColor: '#d4af37',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  prosseguirTexto: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});