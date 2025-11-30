import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [senhaVisivel, setSenhaVisivel] = useState(false); // ✅ Estado para visibilidade da senha

  const api = "http://192.168.0.127/projetos/apireact_usuarios/";

  async function fazerLogin() {
    if (!email || !senha) {
      Alert.alert("Erro", "Preencha email e senha!");
      return;
    }

    setCarregando(true);

    try {
      const obj = { email, senha };
      console.log("Tentando login:", obj);

      const res = await axios.post(api + "login.php", obj, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000
      });

      console.log("Resposta do login:", res.data);

      if (res.data.success === true) {
        Alert.alert("Sucesso", "Login realizado com sucesso!");

        const usuario = res.data.usuario;
        console.log("Usuário logado:", usuario);

        setEmail('');
        setSenha('');
        navigation.navigate('AgendarVoos', { usuario: usuario });
      } else {
        Alert.alert("Erro", res.data.message || "Não foi possível fazer login.");
      }
    } catch (error) {
      console.error("Erro no login:", error);
      if (error.response) {
        Alert.alert("Erro", error.response.data.message || "Erro no servidor.");
      } else {
        Alert.alert("Erro de conexão", "Não foi possível conectar ao servidor.");
      }
    } finally {
      setCarregando(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <View style={styles.iconContainer}><Text style={styles.icon}>✈️</Text></View>
        <Text style={styles.logo}>aero</Text>
        <Text style={styles.subtitle}>Your gateway to the sky</Text>
        <Text style={styles.heading}>Entrar</Text>
        <Text style={styles.description}>Faça login na sua conta para acessar os serviços</Text>

        <TextInput
          placeholder="Email"
          placeholderTextColor="#555"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        
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

        <TouchableOpacity
          style={[styles.button, carregando && styles.buttonDisabled]}
          onPress={fazerLogin}
          disabled={carregando}
        >
          <Text style={styles.buttonText}>
            {carregando ? "Carregando..." : "Entrar"}
          </Text>
        </TouchableOpacity>

        <View style={styles.bottomTextContainer}>
          <Text>Não tem uma conta? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Create')}>
            <Text style={styles.link}>Criar conta</Text>
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
  buttonDisabled: {
    backgroundColor: '#cccccc',
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