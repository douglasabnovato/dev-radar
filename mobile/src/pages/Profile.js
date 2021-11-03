import React from "react";
import { WebView } from "react-native";

function Profile({ navigation }){

    const githubUsername = navigation.getParam("github_username")

    return <WebView style={{ flex: 1 }} source={{ uri: `http://github.com/${githubUsername}` }}/>  

}

export default Profile;