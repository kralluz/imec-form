import * as Device from 'expo-device';

export const getDetailedDeviceInfo = async () => {
  return {
    isDevice: Device.isDevice,
    brand: Device.brand,
    manufacturer: Device.manufacturer,
    modelName: Device.modelName,
    modelId: Device.modelId,
    osName: Device.osName,
    osVersion: Device.osVersion,
    deviceType: Device.deviceType,
    totalMemory: Device.totalMemory,
  };
};
