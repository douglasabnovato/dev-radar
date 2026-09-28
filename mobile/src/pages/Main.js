/*
 * Main.js · mapa com os devs próximos: pede a localização, busca por tecnologias e recebe novos devs em tempo real.
 */
import React, { useState, useEffect } from "react";
import { StyleSheet, Image, View, Text, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";
import MapView, { Marker, Callout } from "react-native-maps";
import { requestForegroundPermissionsAsync, getCurrentPositionAsync } from "expo-location";
import { MaterialIcons } from "@expo/vector-icons";
import api from "../services/api";
import { connect, disconnect, subscribeToNewDevs } from "../services/socket";

/* Tela principal. */
function Main({ navigation }) {
  const [devs, setDevs] = useState([]);
  const [currentRegion, setCurrentRegion] = useState(null);
  const [techs, setTechs] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    /* Pede permissão e centraliza o mapa na posição atual. */
    async function loadInitialPosition() {
      const { granted } = await requestForegroundPermissionsAsync();
      if (!granted) {
        setMessage("Permita o acesso à localização para ver devs perto de você.");
        return;
      }
      const { coords } = await getCurrentPositionAsync({ enableHighAccuracy: true });
      setCurrentRegion({
        latitude: coords.latitude,
        longitude: coords.longitude,
        latitudeDelta: 0.04,
        longitudeDelta: 0.04,
      });
    }
    loadInitialPosition();
    return () => disconnect();
  }, []);

  useEffect(() => {
    subscribeToNewDevs((dev) => setDevs((current) => [...current.filter((d) => d._id !== dev._id), dev]));
  }, []);

  /* Reconecta o WebSocket com a região e as tecnologias atuais. */
  function setupWebsocket() {
    disconnect();
    connect(currentRegion.latitude, currentRegion.longitude, techs);
  }

  /* Busca devs próximos pelas tecnologias digitadas. */
  async function loadDevs() {
    if (!techs.trim()) {
      setMessage("Digite ao menos uma tecnologia, por exemplo: React.");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      const response = await api.get("/search", {
        params: { latitude: currentRegion.latitude, longitude: currentRegion.longitude, techs },
      });
      setDevs(response.data.devs);
      if (response.data.devs.length === 0) setMessage("Nenhum dev com essas tecnologias num raio de 10 km.");
      setupWebsocket();
    } catch (error) {
      setMessage((error.response && error.response.data && error.response.data.error) || "Não foi possível falar com o servidor.");
    } finally {
      setLoading(false);
    }
  }

  /* Guarda a região após o usuário mover o mapa. */
  function handleRegionChanged(region) {
    setCurrentRegion(region);
  }

  if (!currentRegion) {
    return (
      <View style={styles.centered}>
        {message ? <Text style={styles.message}>{message}</Text> : <ActivityIndicator size="large" color="#7D40E7" />}
      </View>
    );
  }

  return (
    <>
      <MapView onRegionChangeComplete={handleRegionChanged} initialRegion={currentRegion} style={styles.map}>
        {devs.map((dev) => (
          <Marker
            key={dev._id}
            coordinate={{ longitude: dev.location.coordinates[0], latitude: dev.location.coordinates[1] }}
          >
            <Image style={styles.avatar} source={{ uri: dev.avatar_url }} accessibilityIgnoresInvertColors />
            <Callout onPress={() => navigation.navigate("Profile", { github_username: dev.github_username })}>
              <View style={styles.callout}>
                <Text style={styles.devName}>{dev.name}</Text>
                <Text style={styles.devBio}>{dev.bio}</Text>
                <Text style={styles.devTechs}>{dev.techs.join(", ")}</Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>
      <View style={styles.searchForm}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar devs por techs..."
          placeholderTextColor="#666"
          autoCapitalize="words"
          autoCorrect={false}
          accessibilityLabel="Tecnologias para buscar, separadas por vírgula"
          value={techs}
          onChangeText={setTechs}
          onSubmitEditing={loadDevs}
          returnKeyType="search"
        />
        <TouchableOpacity onPress={loadDevs} style={styles.loadButton} accessibilityRole="button" accessibilityLabel="Buscar devs próximos">
          {loading ? <ActivityIndicator color="#FFF" /> : <MaterialIcons name="my-location" size={20} color="#FFF" />}
        </TouchableOpacity>
      </View>
      {message ? <Text style={styles.toast} accessibilityLiveRegion="polite">{message}</Text> : null}
    </>
  );
}

const styles = StyleSheet.create({
    centered: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
    },

    message: {
        textAlign: "center",
        color: "#333",
        fontSize: 16,
    },

    toast: {
        position: "absolute",
        bottom: 30,
        left: 20,
        right: 20,
        backgroundColor: "#333",
        color: "#FFF",
        padding: 12,
        borderRadius: 8,
        textAlign: "center",
    },

    map: {
        flex: 1
    },
    avatar: {
        width: 54,
        height: 54,
        borderRadius: 4,
        borderWidth: 4,
        borderColor: "#FFF"
    },

    callout:{
        width:260,
    },

    devName: {
        fontWeight: "bold",
        fontSize: 16,
    },

    devBio: {
        color: "#555",
        marginTop: 5,
    },

    devTechs: {
        marginTop: 5,
    },

    searchForm: {
        position: "absolute",
        top: 20,
        left: 20,
        right:20,
        zIndex: 5,
        flexDirection: "row",
    },

    searchInput: {
        flex:1,
        height: 50,
        backgroundColor: "#fff",
        color: "#333",
        borderRadius: 25,
        paddingHorizontal: 20,
        fontSize: 16,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowOffset:{
            width: 4,
            height: 4,
        },
        elevation: 2,
    },

    loadButton:{
        width:50,
        height: 50,
        backgroundColor: "#8E4DFF",
        borderRadius: 25,
        justifyContent: "center",
        alignItems: "center",
        marginLeft: 15,
    },

});

export default Main;
/* fim de Main.js */
