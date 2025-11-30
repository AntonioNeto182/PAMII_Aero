import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ConfirmacaoCompra({ route, navigation }) {
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

  // Aqui você salvaria a viagem no banco de dados

  const voltarParaInicio = () => {
    navigation.navigate('AgendarVoos', { usuario });
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={true}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Ionicons name="checkmark-circle" size={80} color="#4CAF50" />
          <Text style={styles.modalTitulo}>Viagem agendada com sucesso!</Text>
          <Text style={styles.modalMensagem}>Boa viagem. Confira seu agendamento no seu perfil. 😊</Text>
          
          <TouchableOpacity
            style={styles.modalButton}
            onPress={voltarParaInicio}
          >
            <Text style={styles.modalButtonText}>Voltar ao Início</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
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