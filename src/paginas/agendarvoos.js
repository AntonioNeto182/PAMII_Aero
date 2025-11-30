import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import NotificationPopup from './notificationpopup';
import MenuPopup from './menupopup';

export default function AgendarVoos({ route, navigation }) {
  const [usuario, setUsuario] = useState(route.params?.usuario || {});
  const [avatarUrl, setAvatarUrl] = useState('https://cdn-icons-png.flaticon.com/512/616/616408.png');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  // Estados para o agendamento
  const [passo, setPasso] = useState(1);
  const [destino, setDestino] = useState('');
  const [aeroportoEmbarque, setAeroportoEmbarque] = useState('');
  const [horario, setHorario] = useState('');
  const [hospedagem, setHospedagem] = useState('');
  const [quantidadePassageiros, setQuantidadePassageiros] = useState(1);

  // ✅ OBSERVAR MUDANÇAS NOS PARÂMETROS
  useEffect(() => {
    if (route.params?.usuario) {
      setUsuario(route.params.usuario);
      
      // Atualizar avatar também
      const newAvatarUrl = route.params.usuario?.avatar && route.params.usuario.avatar !== '' && route.params.usuario.avatar !== null
        ? route.params.usuario.avatar 
        : 'https://cdn-icons-png.flaticon.com/512/616/616408.png';
      setAvatarUrl(newAvatarUrl);
    }
  }, [route.params?.usuario]);

  // Dados fictícios
  const destinos = [
    { 
      id: 1, 
      nome: 'São Paulo', 
      aeroportos: ['Aeroporto Central', 'Aeroporto Sul'], 
      horarios: ['08:00', '14:00', '20:00'] 
    },
    { 
      id: 2, 
      nome: 'Rio de Janeiro', 
      aeroportos: ['Aeroporto Santos Dumont', 'Aeroporto Galeão'], 
      horarios: ['09:00', '15:00', '21:00'],
      popular: true
    },
    { 
      id: 3, 
      nome: 'Belo Horizonte', 
      aeroportos: ['Aeroporto Confins', 'Aeroporto Pampulha'], 
      horarios: ['10:00', '16:00', '22:00'] 
    },
    { 
      id: 4, 
      nome: 'Brasília', 
      aeroportos: ['Aeroporto Juscelino Kubitschek', 'Aeroporto Base Aérea'], 
      horarios: ['11:00', '17:00', '23:00'] 
    },
    { 
      id: 5, 
      nome: 'Salvador', 
      aeroportos: ['Aeroporto Deputado Luís Eduardo Magalhães', 'Aeroporto Aeroclube'], 
      horarios: ['12:00', '18:00', '00:00'],
      popular: true
    },
  ];

  const hospedagens = [
    { id: 1, destino: 'São Paulo', nome: 'Hotel Paulista', endereco: 'Av. Paulista, 1000' },
    { id: 2, destino: 'São Paulo', nome: 'Ibirapuera Hotel', endereco: 'Av. Ibirapuera, 500' },
    { id: 3, destino: 'Rio de Janeiro', nome: 'Copacabana Palace', endereco: 'Av. Atlântica, 1702' },
    { id: 4, destino: 'Rio de Janeiro', nome: 'Hotel Santa Teresa', endereco: 'Rua Almirante Alexandrino, 660' },
    { id: 5, destino: 'Belo Horizonte', nome: 'Hotel Mercure', endereco: 'Av. do Contorno, 7315' },
    { id: 6, destino: 'Belo Horizonte', nome: 'Ouro Minas Palace', endereco: 'Av. Cristóvão Colombo, 400' },
    { id: 7, destino: 'Brasília', nome: 'Brasília Palace Hotel', endereco: 'SHTN Trecho 1, Conjunto 1B' },
    { id: 8, destino: 'Brasília', nome: 'Royal Tulip Brasília', endereco: 'SHS Quadra 5, Bloco A' },
    { id: 9, destino: 'Salvador', nome: 'Hotel Pestana', endereco: 'Rua Fonte do Boi, 216' },
    { id: 10, destino: 'Salvador', nome: 'Wish Hotel da Bahia', endereco: 'Av. Sete de Setembro, 1537' },
  ];

  const modelosAviao = ['Boeing 737', 'Airbus A320', 'Embraer E195'];

  // Funções para gerar dados aleatórios
  const gerarNumeroVoo = () => {
    const letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numeros = '0123456789';
    let numeroVoo = '';
    for (let i = 0; i < 2; i++) {
      numeroVoo += letras.charAt(Math.floor(Math.random() * letras.length));
    }
    for (let i = 0; i < 4; i++) {
      numeroVoo += numeros.charAt(Math.floor(Math.random() * numeros.length));
    }
    return numeroVoo;
  };

  const gerarDuracao = () => {
    const horas = Math.floor(Math.random() * 5) + 1;
    const minutos = Math.floor(Math.random() * 60);
    return `${horas}h ${minutos}m`;
  };

  const gerarAssentos = (quantidade) => {
    const assentos = [];
    for (let i = 0; i < quantidade; i++) {
      assentos.push(Math.floor(Math.random() * 150) + 1);
    }
    return assentos;
  };

  const gerarCodigoReserva = () => {
    return 'VJG-' + Math.floor(10000 + Math.random() * 90000);
  };

  const gerarNumeroQuarto = () => {
    return Math.floor(Math.random() * 50) + 1;
  };

  // Função para voltar um passo
  const voltarPasso = () => {
    if (passo > 1) {
      setPasso(passo - 1);
    }
  };

  // Função para prosseguir para a revisão
  const prosseguirRevisao = () => {
    if (!destino || !aeroportoEmbarque || !horario) {
      Alert.alert('Atenção', 'Por favor, selecione destino, aeroporto de embarque e horário.');
      return;
    }

    const precoBase = 300 + (destinos.findIndex(d => d.nome === destino) * 50);
    const precoHospedagem = hospedagem ? 200 : 0;
    const precoTotal = (precoBase + precoHospedagem) * quantidadePassageiros;
    const numeroVoo = gerarNumeroVoo();
    const duracaoVoo = gerarDuracao();
    const modeloAviao = modelosAviao[Math.floor(Math.random() * modelosAviao.length)];
    const assentos = gerarAssentos(quantidadePassageiros);
    const codigoReserva = gerarCodigoReserva();
    let enderecoHospedagem = '';
    let numeroQuarto = null;

    if (hospedagem) {
      const hospedagemSelecionada = hospedagens.find(h => h.nome === hospedagem);
      enderecoHospedagem = hospedagemSelecionada.endereco;
      numeroQuarto = gerarNumeroQuarto();
    }

    navigation.navigate('RevisaoViagem', {
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

  // Renderização condicional baseada no passo
  const renderConteudo = () => {
    switch (passo) {
      case 1:
        return (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Destinos disponíveis:</Text>
            {destinos.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[styles.opcao, destino === item.nome && styles.opcaoSelecionada]}
                onPress={() => {
                  setDestino(item.nome);
                  setAeroportoEmbarque('');
                  setHorario('');
                  setPasso(2);
                }}
              >
                <View style={styles.destinoContent}>
                  <Text style={[styles.opcaoTexto, destino === item.nome && styles.opcaoTextoSelecionado]}>
                    {item.nome}
                  </Text>
                  {item.popular && (
                    <View style={styles.popularBadge}>
                      <Ionicons name="flame" size={14} color="#FF6B35" />
                      <Text style={styles.popularText}>Popular</Text>
                    </View>
                  )}
                </View>
                <Ionicons name="chevron-forward" size={20} color={destino === item.nome ? "#fff" : "#666"} />
              </TouchableOpacity>
            ))}
          </View>
        );

      case 2:
        return (
          <View style={styles.card}>
            <View style={styles.cardHeaderWithBack}>
              <TouchableOpacity onPress={voltarPasso} style={styles.backButton}>
                <Ionicons name="arrow-back" size={20} color="#333" />
              </TouchableOpacity>
              <Text style={styles.cardTitle}>Aeroporto de Embarque</Text>
            </View>
            {destinos.find(d => d.nome === destino)?.aeroportos.map((aeroporto, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.opcao, aeroportoEmbarque === aeroporto && styles.opcaoSelecionada]}
                onPress={() => {
                  setAeroportoEmbarque(aeroporto);
                  setHorario('');
                  setPasso(3);
                }}
              >
                <View style={styles.aeroportoContent}>
                  <Ionicons name="airplane" size={18} color={aeroportoEmbarque === aeroporto ? "#fff" : "#d4af37"} />
                  <Text style={[styles.opcaoTexto, aeroportoEmbarque === aeroporto && styles.opcaoTextoSelecionado]}>
                    {aeroporto}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={aeroportoEmbarque === aeroporto ? "#fff" : "#666"} />
              </TouchableOpacity>
            ))}
          </View>
        );

      case 3:
        return (
          <View style={styles.card}>
            <View style={styles.cardHeaderWithBack}>
              <TouchableOpacity onPress={voltarPasso} style={styles.backButton}>
                <Ionicons name="arrow-back" size={20} color="#333" />
              </TouchableOpacity>
              <Text style={styles.cardTitle}>Horário do Voo</Text>
            </View>
            {destinos.find(d => d.nome === destino)?.horarios.map((horarioItem, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.opcao, horario === horarioItem && styles.opcaoSelecionada]}
                onPress={() => {
                  setHorario(horarioItem);
                  setPasso(4);
                }}
              >
                <View style={styles.horarioContent}>
                  <Ionicons name="time" size={18} color={horario === horarioItem ? "#fff" : "#d4af37"} />
                  <Text style={[styles.opcaoTexto, horario === horarioItem && styles.opcaoTextoSelecionado]}>
                    {horarioItem}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={horario === horarioItem ? "#fff" : "#666"} />
              </TouchableOpacity>
            ))}
          </View>
        );

      case 4:
        return (
          <View style={styles.card}>
            <View style={styles.cardHeaderWithBack}>
              <TouchableOpacity onPress={voltarPasso} style={styles.backButton}>
                <Ionicons name="arrow-back" size={20} color="#333" />
              </TouchableOpacity>
              <Text style={styles.cardTitle}>Hospedagem (Opcional)</Text>
            </View>
            <TouchableOpacity
              style={[styles.opcao, hospedagem === '' && styles.opcaoSelecionada]}
              onPress={() => {
                setHospedagem('');
                setPasso(5);
              }}
            >
              <View style={styles.hospedagemContent}>
                <Ionicons name="bed" size={18} color={hospedagem === '' ? "#fff" : "#d4af37"} />
                <Text style={[styles.opcaoTexto, hospedagem === '' && styles.opcaoTextoSelecionado]}>
                  Sem hospedagem
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={hospedagem === '' ? "#fff" : "#666"} />
            </TouchableOpacity>
            {hospedagens.filter(h => h.destino === destino).map((hosp) => (
              <TouchableOpacity
                key={hosp.id}
                style={[styles.opcao, hospedagem === hosp.nome && styles.opcaoSelecionada]}
                onPress={() => {
                  setHospedagem(hosp.nome);
                  setPasso(5);
                }}
              >
                <View style={styles.hospedagemContent}>
                  <Ionicons name="business" size={18} color={hospedagem === hosp.nome ? "#fff" : "#d4af37"} />
                  <Text style={[styles.opcaoTexto, hospedagem === hosp.nome && styles.opcaoTextoSelecionado]}>
                    {hosp.nome}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={hospedagem === hosp.nome ? "#fff" : "#666"} />
              </TouchableOpacity>
            ))}
          </View>
        );

      case 5:
        return (
          <View style={styles.card}>
            <View style={styles.cardHeaderWithBack}>
              <TouchableOpacity onPress={voltarPasso} style={styles.backButton}>
                <Ionicons name="arrow-back" size={20} color="#333" />
              </TouchableOpacity>
              <Text style={styles.cardTitle}>Passageiros</Text>
            </View>
            
            <View style={styles.passageirosContainer}>
              <Text style={styles.passageirosLabel}>Quantidade de Passageiros</Text>
              <View style={styles.quantidadeContainer}>
                <TouchableOpacity
                  style={styles.quantidadeBtn}
                  onPress={() => setQuantidadePassageiros(Math.max(1, quantidadePassageiros - 1))}
                >
                  <Text style={styles.quantidadeTexto}>-</Text>
                </TouchableOpacity>
                <View style={styles.quantidadeDisplay}>
                  <Text style={styles.quantidadeNumber}>{quantidadePassageiros}</Text>
                </View>
                <TouchableOpacity
                  style={styles.quantidadeBtn}
                  onPress={() => setQuantidadePassageiros(quantidadePassageiros + 1)}
                >
                  <Text style={styles.quantidadeTexto}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity style={styles.prosseguirBtn} onPress={prosseguirRevisao}>
              <Text style={styles.prosseguirTexto}>Prosseguir para Revisão</Text>
              <Ionicons name="arrow-forward" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        );
    }
  };

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
              
              <TouchableOpacity onPress={() => navigation.navigate('Perfil', { usuario })}>
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
          <Text style={styles.data}>Agende sua próxima viagem</Text>

          <View style={styles.menuButtons}>
            <TouchableOpacity style={[styles.menuBtn, styles.active]}>
              <Text style={[styles.menuText, styles.activeText]}>Agendar Voos</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.menuBtn} 
              onPress={() => navigation.navigate('Servicos', { usuario })}
            >
              <Text style={styles.menuText}>Serviços</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.menuBtn} 
              onPress={() => navigation.navigate('Aeroporto', { usuario })}
            >
              <Text style={styles.menuText}>Aeroporto</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        <View style={styles.content}>
          <Text style={styles.sectionTitle}>
            {passo === 1 && 'Escolha seu destino'}
            {passo === 2 && 'Selecione o aeroporto'}
            {passo === 3 && 'Escolha o horário'}
            {passo === 4 && 'Adicione hospedagem'}
            {passo === 5 && 'Informações dos passageiros'}
          </Text>
          {renderConteudo()}
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
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
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
  cardHeaderWithBack: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
    marginRight: 10,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    flex: 1,
  },
  opcao: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e8e8e8',
  },
  opcaoSelecionada: {
    backgroundColor: '#d4af37',
    borderColor: '#d4af37',
  },
  destinoContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  aeroportoContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  horarioContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  hospedagemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  opcaoTexto: {
    color: '#333',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 12,
  },
  opcaoTextoSelecionado: {
    color: '#fff',
  },
  popularBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF0E6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 10,
  },
  popularText: {
    fontSize: 12,
    color: '#FF6B35',
    fontWeight: '600',
    marginLeft: 4,
  },
  passageirosContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  passageirosLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
  },
  quantidadeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '70%',
  },
  quantidadeBtn: {
    backgroundColor: '#d4af37',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  quantidadeTexto: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
  },
  quantidadeDisplay: {
    backgroundColor: '#f8f8f8',
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  quantidadeNumber: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
  },
  prosseguirBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#d4af37',
    padding: 18,
    borderRadius: 12,
    elevation: 3,
  },
  prosseguirTexto: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
    marginRight: 8,
  },
});