import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function MenuPopup({ visible, onClose, navigation, usuario }) {
  const menuItems = [
    {
      id: 1,
      icon: 'airplane-outline',
      title: 'Agendar Voos',
      action: () => navigation.navigate('AgendarVoos', { usuario: usuario })
    },
    {
      id: 2,
      icon: 'construct-outline',
      title: 'Serviços',
      action: () => navigation.navigate('Servicos', { usuario: usuario })
    },
    {
      id: 3,
      icon: 'business-outline',
      title: 'Aeroporto',
      action: () => navigation.navigate('Aeroporto', { usuario: usuario })
    },
    {
      id: 4,
      icon: 'person-outline',
      title: 'Perfil',
      action: () => navigation.navigate('Perfil', { usuario: usuario })
    },
    {
      id: 5,
      icon: 'calendar-outline',
      title: 'Minhas Viagens',
      action: () => navigation.navigate('ViagensAgendadas', { usuario: usuario })
    },
  ];

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        style={styles.overlay} 
        activeOpacity={1} 
        onPress={onClose}
      >
        <View style={styles.popupContainer}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={() => {
                item.action();
                onClose();
              }}
            >
              <Ionicons name={item.icon} size={18} color="#333" />
              <Text style={styles.menuText}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 60,
    paddingRight: 10,
  },
  popupContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 8,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    minWidth: 180,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  menuText: {
    marginLeft: 10,
    color: '#333',
    fontSize: 14,
    fontWeight: '500',
  },
});