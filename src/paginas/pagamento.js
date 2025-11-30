import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';

export default function Pagamento({ route, navigation }) {
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

  const [numeroCartao, setNumeroCartao] = useState('');
  const [nomeTitular, setNomeTitular] = useState('');
  const [validade, setValidade] = useState('');
  const [cvv, setCvv] = useState('');
  const [cep, setCep] = useState('');
  const [processando, setProcessando] = useState(false);

  const api = "http://192.168.0.127/projetos/apireact_usuarios/";

  const formatarNumeroCartao = (text) => {
    const cleaned = text.replace(/\D/g, '');
    const formatted = cleaned.replace(/(\d{4})/g, '$1 ').trim();
    setNumeroCartao(formatted);
  };

  const formatarValidade = (text) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length >= 3) {
      const formatted = cleaned.slice(0,2) + '/' + cleaned.slice(2,4);
      setValidade(formatted);
    } else {
      setValidade(cleaned);
    }
  };

  const validarCartao = () => {
    const numeroLimpo = numeroCartao.replace(/\s/g, '');
    
    if (numeroLimpo.length !== 16 || !/^\d+$/.test(numeroLimpo)) {
      Alert.alert('Erro', 'Número do cartão deve ter 16 dígitos.');
      return false;
    }

    if (!nomeTitular || nomeTitular.length < 3) {
      Alert.alert('Erro', 'Nome do titular é obrigatório.');
      return false;
    }

    // Validar validade (MM/AA)
    const [mes, ano] = validade.split('/');
    if (!mes || !ano || mes.length !== 2 || ano.length !== 2) {
      Alert.alert('Erro', 'Data de validade deve estar no formato MM/AA.');
      return false;
    }

    const mesNum = parseInt(mes);
    const anoNum = parseInt(ano);
    const dataAtual = new Date();
    const anoAtual = dataAtual.getFullYear() % 100;
    const mesAtual = dataAtual.getMonth() + 1;

    if (mesNum < 1 || mesNum > 12) {
      Alert.alert('Erro', 'Mês inválido.');
      return false;
    }

    if (anoNum < anoAtual || (anoNum === anoAtual && mesNum < mesAtual)) {
      Alert.alert('Erro', 'Cartão expirado.');
      return false;
    }

    if (cvv.length !== 3 || !/^\d+$/.test(cvv)) {
      Alert.alert('Erro', 'CVV deve ter 3 dígitos.');
      return false;
    }

    if (cep.length !== 8 || !/^\d+$/.test(cep)) {
      Alert.alert('Erro', 'CEP deve ter 8 dígitos.');
      return false;
    }

    return true;
  };

  const finalizarPagamento = async () => {
    if (!validarCartao()) return;

    setProcessando(true);

    try {
      // Salvar viagem no banco
      const viagemData = {
        id_usuario: usuario.id,
        destino,
        aeroporto_embarque: aeroportoEmbarque,
        horario,
        hospedagem: hospedagem || '',
        quantidade_passageiros: quantidadePassageiros,
        preco_total: precoTotal,
        numero_voo: numeroVoo,
        duracao_voo: duracaoVoo,
        modelo_aviao: modeloAviao,
        assentos: assentos.join(','),
        codigo_reserva: codigoReserva,
        endereco_hospedagem: enderecoHospedagem || '',
        numero_quarto: numeroQuarto || null
      };

      const res = await axios.post(api + "salvar_viagem.php", viagemData);
      
      if (res.data.success) {
        navigation.navigate('ConfirmacaoCompra', {
          usuario,
          id_viagem: res.data.id_viagem
        });
      } else {
        Alert.alert('Erro', res.data.message || 'Erro ao salvar viagem.');
      }
    } catch (error) {
      console.error("Erro no pagamento:", error);
      Alert.alert('Erro', 'Erro de conexão ao processar pagamento.');
    } finally {
      setProcessando(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.safeArea}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
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
          
          <View style={styles.headerContent}>
            <Text style={styles.bemvindo}>Finalizar Pagamento</Text>
            <Text style={styles.data}>Total: R$ {precoTotal.toFixed(2)}</Text>
            <Text style={styles.destinoInfo}>Viagem para {destino}</Text>
          </View>
        </LinearGradient>

        <View style={styles.content}>
          <View style={styles.paymentCard}>
            <View style={styles.cardHeader}>
              <Ionicons name="card" size={24} color="#d4af37" />
              <Text style={styles.cardTitle}>Dados do Cartão</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Número do Cartão</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="0000 0000 0000 0000"
                  value={numeroCartao}
                  onChangeText={formatarNumeroCartao}
                  keyboardType="numeric"
                  maxLength={19}
                />
                <Ionicons name="card-outline" size={20} color="#666" />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Nome do Titular</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Como está no cartão"
                  value={nomeTitular}
                  onChangeText={setNomeTitular}
                  autoCapitalize="words"
                />
                <Ionicons name="person-outline" size={20} color="#666" />
              </View>
            </View>

            <View style={styles.row}>
              <View style={[styles.inputGroup, styles.halfInput]}>
                <Text style={styles.inputLabel}>Validade</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="MM/AA"
                    value={validade}
                    onChangeText={formatarValidade}
                    maxLength={5}
                    keyboardType="numeric"
                  />
                  <Ionicons name="calendar-outline" size={20} color="#666" />
                </View>
              </View>

              <View style={[styles.inputGroup, styles.halfInput]}>
                <Text style={styles.inputLabel}>CVV</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="123"
                    value={cvv}
                    onChangeText={setCvv}
                    keyboardType="numeric"
                    maxLength={3}
                    secureTextEntry
                  />
                  <Ionicons name="lock-closed-outline" size={20} color="#666" />
                </View>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>CEP</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="00000-000"
                  value={cep}
                  onChangeText={setCep}
                  keyboardType="numeric"
                  maxLength={8}
                />
                <Ionicons name="location-outline" size={20} color="#666" />
              </View>
            </View>
          </View>

          <View style={styles.resumoCard}>
            <Text style={styles.resumoTitle}>Resumo do Pedido</Text>
            <View style={styles.resumoItem}>
              <Text style={styles.resumoLabel}>Destino:</Text>
              <Text style={styles.resumoValue}>{destino}</Text>
            </View>
            <View style={styles.resumoItem}>
              <Text style={styles.resumoLabel}>Voo:</Text>
              <Text style={styles.resumoValue}>{numeroVoo}</Text>
            </View>
            <View style={styles.resumoItem}>
              <Text style={styles.resumoLabel}>Passageiros:</Text>
              <Text style={styles.resumoValue}>{quantidadePassageiros}</Text>
            </View>
            {hospedagem && (
              <View style={styles.resumoItem}>
                <Text style={styles.resumoLabel}>Hospedagem:</Text>
                <Text style={styles.resumoValue}>{hospedagem}</Text>
              </View>
            )}
            <View style={[styles.resumoItem, styles.totalItem]}>
              <Text style={styles.totalLabel}>Total:</Text>
              <Text style={styles.totalValue}>R$ {precoTotal.toFixed(2)}</Text>
            </View>
          </View>

          <TouchableOpacity 
            style={[styles.pagarBtn, processando && styles.pagarBtnDisabled]}
            onPress={finalizarPagamento}
            disabled={processando}
          >
            <Ionicons name="lock-closed" size={20} color="#fff" />
            <Text style={styles.pagarTexto}>
              {processando ? 'Processando...' : `Confirmar Pagamento`}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.voltarBtn}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.voltarTexto}>Voltar para Revisão</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#faf4e6',
  },
  scrollContent: {
    flexGrow: 1,
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
    marginBottom: 20,
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
  headerContent: {
    alignItems: 'center',
  },
  bemvindo: {
    fontSize: 22,
    fontWeight: '700',
    color: '#000',
    marginBottom: 5,
  },
  data: {
    fontSize: 18,
    color: '#666',
    fontWeight: '600',
    marginBottom: 5,
  },
  destinoInfo: {
    fontSize: 16,
    color: '#d4af37',
    fontWeight: '500',
  },
  content: {
    padding: 20,
    flex: 1,
  },
  paymentCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginLeft: 10,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#444',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    paddingHorizontal: 15,
  },
  input: {
    flex: 1,
    paddingVertical: 15,
    fontSize: 16,
    color: '#333',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  resumoCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  resumoTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  resumoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  resumoLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  resumoValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  totalItem: {
    borderBottomWidth: 0,
    borderTopWidth: 2,
    borderTopColor: '#d4af37',
    marginTop: 10,
    paddingTop: 15,
  },
  totalLabel: {
    fontSize: 16,
    color: '#333',
    fontWeight: '700',
  },
  totalValue: {
    fontSize: 18,
    color: '#d4af37',
    fontWeight: '700',
  },
  pagarBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#d4af37',
    padding: 18,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 3,
  },
  pagarBtnDisabled: {
    backgroundColor: '#cccccc',
  },
  pagarTexto: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
    marginLeft: 10,
  },
  voltarBtn: {
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d4af37',
  },
  voltarTexto: {
    color: '#d4af37',
    fontWeight: '600',
    fontSize: 14,
  },
});