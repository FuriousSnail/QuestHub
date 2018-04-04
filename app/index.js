import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, FlatList } from 'react-native';
import Meteor, { createContainer } from 'react-native-meteor';
import SignIn from './components/SignIn';

const SERVER_URL = 'ws://192.168.20.5:3000/websocket';

Meteor.connect(SERVER_URL);

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            input: '',
            signedIn: false,
            user: null,
            text: 'Content coming'
        };
    }
    
    handlePress = () => {
        const description = this.state.input;
        Meteor.call('Quests.createQuest', {description}, (error, result) => {
            const message = error ? error : result;
            this.setState({text: message});
        });
    }

    handleInputChange = (text) => {
        this.setState({input: text});
    }

    signInSuccess = (data) => {
        if (data) {
            const {accessToken, email, familyName, givenName, id, idToken, name, serverAuthCode} = data;
            const user = {accessToken, email, familyName, givenName, id, idToken, name, serverAuthCode};
            console.log('---------------------logging in as ' + JSON.stringify(user));
            this.setState({
                user: user,
                signedIn: true
            });
            Meteor.call('login', {google: user}, (error, result) => {
                const message = error ? JSON.stringify(error) : JSON.stringify(result);
                this.setState({text: message});
            });
        }
    }

    render() {
        if (!this.state.signedIn) {
            return (
                <SignIn
                    successCallback={this.signInSuccess}
                />
            );
        }
        let data = [];
        for (let i = 0; i < this.props.quests.length; i++) {
            data.push({
                key: this.props.quests[i]._id,
                description: this.props.quests[i].description
            });
        }
        return (
            <View style={styles.container}>
                <Text style={styles.welcome}>This is QuestHub App!</Text>
                <FlatList
                    data={data}
                    renderItem={({ item }) => <Text style={styles.instructions}>{item.key + ': ' + item.description}</Text>}
                />
                <Text style={styles.instructions}>{this.state.text}</Text>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        onChangeText={this.handleInputChange}
                        value={this.state.input}
                    />
                </View>
                <TouchableOpacity style={styles.button} onPress={this.handlePress}>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
    inputContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 15,
    },
    input: {
        height: 40,
        width: 100,
        borderColor: 'gray',
        borderWidth: 1
    },
    button: {
        padding: 10,
        width: 50,
        backgroundColor: '#c5c5c5',
      }
});

export default createContainer(() => {
    Meteor.subscribe('quests');
    return {
        quests: Meteor.collection('quests').find()
    }
}, App)
