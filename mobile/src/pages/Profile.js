/*
 * Profile.js · perfil do dev no GitHub dentro do app.
 */
import React from "react";
import { WebView } from "react-native-webview";
import { githubProfileUrl } from "../config";

/* Abre https://github.com/<usuario> (o nome chega pelos parâmetros da rota). */
function Profile({ route }) {
  return <WebView style={{ flex: 1 }} source={{ uri: githubProfileUrl(route.params?.github_username) }} />;
}

export default Profile;
/* fim de Profile.js */
