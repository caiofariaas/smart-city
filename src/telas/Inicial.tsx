import {StyleSheet, View, ImageBackground} from 'react-native'
import {Cabecalho} from '../componentes/Cabecalho'
import { Botao } from '../componentes/Botao';
import { 
  requestForegroundPermissionsAsync, 
  getCurrentPositionAsync, 
  LocationObject, 
  watchPositionAsync,
  LocationAccuracy} from 'expo-location';
import { useEffect, useState, useRef } from 'react';
import MapView, { Marker } from 'react-native-maps';

export const Inicial = () => {
  const [location, setLocation] = useState<LocationObject | null>(null);


  const mapRef = useRef<MapView>(null);

async function requestLocationPermission(){
  const {granted} = await requestForegroundPermissionsAsync();

  if(granted){
    const currentPosition = await getCurrentPositionAsync();
    setLocation(currentPosition);

   
  }
  
}

useEffect(()=>{
  requestLocationPermission();

},[]);

useEffect(() => {
  watchPositionAsync({
    accuracy: LocationAccuracy.Highest,
    timeInterval:1000,
    distanceInterval:1
  }, (response) =>{
    setLocation(response);
    mapRef.current?.animateCamera({
      pitch: 70,
      center: response.coords
    })

  });
}, []);

  return (
    <View style={estilos.conteiner}>

      {
          location &&
            <MapView
            ref={mapRef}
            style={estilos.map}
            initialRegion={{
              latitude:location.coords.latitude,
              longitude:location.coords.longitude,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005
        }}
        >
          <Marker
            coordinate={{
              latitude:location.coords.latitude,
              longitude:location.coords.longitude,
            }}
          />
          </MapView>
      }
     

    </View>
  );
}

const estilos = StyleSheet.create({
  conteiner: {
    flex: 1,
    backgroundColor: '#080a0c'
  },
  fundo: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    resizeMode: 'cover'
},
  map:{
    flex:1,
    width:'100%',
  }
});

