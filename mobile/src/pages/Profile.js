/*
 * Profile.js · perfil do dev no GitHub dentro do app.
 */
import React from "react";
import { WebView } from "react-native-webview";

/* Abre https://github.com/<usuario>. */
function Profile({ navigation }) {
  const githubUsername = navigation.getParam("github_username");
  return <WebView style={{ flex: 1 }} source={{ uri: `https://github.com/${githubUsername}` }} />;
}

export default Profile;
/* fim de Profile.js */
