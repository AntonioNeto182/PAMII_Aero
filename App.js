import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Login from './src/paginas/login';
import Create from './src/paginas/create';
import AgendarVoos from './src/paginas/agendarvoos';
import Servicos from './src/paginas/servicos';
import Aeroporto from './src/paginas/aeroporto';
import Perfil from './src/paginas/perfil';
import AdminUsuarios from './src/paginas/adminusuarios';
import RevisaoViagem from './src/paginas/revisaoviagem';
import Pagamento from './src/paginas/pagamento';
import ConfirmacaoCompra from './src/paginas/confirmacaocompra';
import ViagensAgendadas from './src/paginas/viagensagendadas';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Login"
        screenOptions={{ 
          headerShown: false,
          cardStyle: { backgroundColor: '#faf4e6' }
        }}
      >
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Create" component={Create} />
        <Stack.Screen name="AgendarVoos" component={AgendarVoos} />
        <Stack.Screen name="Servicos" component={Servicos} />
        <Stack.Screen name="Aeroporto" component={Aeroporto} />
        <Stack.Screen name="Perfil" component={Perfil} />
        <Stack.Screen name="AdminUsuarios" component={AdminUsuarios} />
        <Stack.Screen name="RevisaoViagem" component={RevisaoViagem} />
        <Stack.Screen name="Pagamento" component={Pagamento} />
        <Stack.Screen name="ConfirmacaoCompra" component={ConfirmacaoCompra} />
        <Stack.Screen name="ViagensAgendadas" component={ViagensAgendadas} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}