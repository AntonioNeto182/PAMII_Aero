import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

export default function Create({ navigation }) {
  const [nome, setNome] = useState('');
  const [senha, setSenha] = useState('');
  const [cpf, setCpf] = useState('');
  const [rg, setRg] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [senhaVisivel, setSenhaVisivel] = useState(false); // ✅ Estado para visibilidade da senha

  const api = "http://192.168.0.127/projetos/apireact_usuarios/";

  async function criarPerfil() {
    if (!nome || !senha || !cpf || !rg || !email || !telefone) {
      Alert.alert("Erro", "Preencha todos os campos!");
      return;
    }

    try {
      const obj = { nome, senha, cpf, rg, email, telefone };
      const res = await axios.post(api + "add.php", obj);

      if (res.data.success === true) {
        Alert.alert("Sucesso", "Perfil criado com sucesso!");
        setNome('');
        setSenha('');
        setCpf('');
        setRg('');
        setEmail('');
        setTelefone('');
        navigation.navigate('Login');
      } else {
        Alert.alert("Erro", res.data.message || "Não foi possível criar o perfil.");
      }
    } catch (error) {
      console.error("Erro detalhado:", error);
      console.error("URL tentada:", api + "add.php");
      Alert.alert("Erro de conexão", "Não foi possível conectar ao servidor.");
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <View style={styles.iconContainer}><Text style={styles.icon}>👤</Text></View>
        <Text style={styles.logo}>aero</Text>
        <Text style={styles.subtitle}>Crie seu perfil e embarque!</Text>
        <Text style={styles.heading}>Cadastro</Text>
        <Text style={styles.description}>Preencha os dados abaixo</Text>

        <TextInput placeholder="Nome completo" placeholderTextColor="#555" style={styles.input} value={nome} onChangeText={setNome} />
        
        {/* ✅ CAMPO DE SENHA COM ÍCONE DE OLHO */}
        <View style={styles.senhaContainer}>
          <TextInput
            placeholder="Senha"
            placeholderTextColor="#555"
            style={styles.senhaInput}
            secureTextEntry={!senhaVisivel} // ✅ Alterna entre texto normal e pontilhado
            value={senha}
            onChangeText={setSenha}
          />
          <TouchableOpacity 
            style={styles.olhoBtn}
            onPress={() => setSenhaVisivel(!senhaVisivel)}
          >
            <Ionicons 
              name={senhaVisivel ? "eye" : "eye-off"} 
              size={20} 
              color="#666" 
            />
          </TouchableOpacity>
        </View>

        <TextInput placeholder="CPF" placeholderTextColor="#555" style={styles.input} value={cpf} onChangeText={setCpf} />
        <TextInput placeholder="RG" placeholderTextColor="#555" style={styles.input} value={rg} onChangeText={setRg} />
        <TextInput placeholder="Email" placeholderTextColor="#555" style={styles.input} value={email} onChangeText={setEmail} />
        <TextInput placeholder="Telefone" placeholderTextColor="#555" style={styles.input} value={telefone} onChangeText={setTelefone} />

        <TouchableOpacity style={styles.button} onPress={criarPerfil}>
          <Text style={styles.buttonText}>Criar Perfil</Text>
        </TouchableOpacity>

        <View style={styles.bottomTextContainer}>
          <Text>Já tem uma conta? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.link}>Entrar</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.footer}>© 2025 Aero. Todos os direitos reservados.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fdf7eb',
    paddingVertical: 20,
  },
  card: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
  },
  iconContainer: {
    backgroundColor: '#d4af37',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  icon: {
    fontSize: 28,
  },
  logo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#d4af37',
  },
  subtitle: {
    fontSize: 14,
    color: '#777',
    marginBottom: 25,
    textAlign: 'center',
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  description: {
    fontSize: 12,
    color: '#777',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    padding: 12,
    marginBottom: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  // ✅ NOVOS ESTILOS PARA O CAMPO DE SENHA
  senhaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#eee',
    marginBottom: 15,
  },
  senhaInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
  },
  olhoBtn: {
    padding: 10,
  },
  button: {
    backgroundColor: '#d4af37',
    padding: 12,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  bottomTextContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  link: {
    color: '#d4af37',
    fontWeight: 'bold',
  },
  footer: {
    fontSize: 10,
    color: '#aaa',
    textAlign: 'center',
    marginTop: 10,
  },
});