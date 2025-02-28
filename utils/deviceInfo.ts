import * as Network from 'expo-network';

export const getDeviceInfo = async () => {
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('pt-BR');
  const formattedTime = currentDate.toLocaleTimeString('pt-BR');

  const ip = await Network.getIpAddressAsync();

  return {
    date: formattedDate,
    time: formattedTime,
    ip,
  };
};
