import * as React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Button,
  PermissionsAndroid,
  Platform,
  TextInput,
} from 'react-native';
import { NativeModules } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Main from './Main';

const { NotificationModule, PinCodeModule } = NativeModules;

export default function App() {
  const navigation = useNavigation();
  const [pinCodeInput, setPinCodeInput] = React.useState('');
  const [message, setMessage] = React.useState('');

  React.useEffect(() => {
    // Здесь ваш useEffect
  }, []);

  const checkApplicationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS!
        );
      } catch (error) {}
    }
  };

  

  const signin = () => {
    PinCodeModule.checkPinCode(pinCodeInput)
      .then((isCorrect: any) => {
        if (isCorrect) {
          setMessage('Пин-код верный');
          setPinCodeInput('');
          navigation.navigate('Main'); // TODO скорее всего не работает

          // Разблокируйте приложение или выполните другие необходимые действия
        } else {
          setMessage('Неверный пин-код');
          checkApplicationPermission().then(() => {
            NotificationModule.sendNotification(
              'Пин-код не верный',
              ''
            );
            setPinCodeInput('');
          });
          // Обработка неверного пин-кода
        }
        setPinCodeInput('');
      })
      .catch((error: any) => {
        checkApplicationPermission().then(() => {
          NotificationModule.sendNotification(
            'Ошибка проверки пин-кода',
            error
          );
        });
        setMessage('Ошибка проверки пин-кода: ' + error);
        console.error('Ошибка проверки пин-кода:', error);
        setPinCodeInput('');
      });
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        onChangeText={setPinCodeInput}
        value={pinCodeInput}
        placeholder="Введите пин-код"
        secureTextEntry
        keyboardType="numeric"
        maxLength={4}
      />
      <View style={styles.buttonsContainer}>
        <Button onPress={signin} title="Войти" />
      </View>
      <Text>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    width: '80%',
    height: 40,
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
    marginBottom: 20,
  },
});
