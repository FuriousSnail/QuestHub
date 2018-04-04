import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, FlatList } from 'react-native';
import { GoogleSignin, GoogleSigninButton } from 'react-native-google-signin';
import { webClientId } from '../config/config';

export default class SignIn extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null
        };
    }

    componentDidMount() {
        this.setupGoogleSignIn();
    }

    setupGoogleSignIn = async () => {
        try {
            await GoogleSignin.hasPlayServices({
                autoResolve: true
            });
            // if offlineAccess = true then serverAuthCode is not null but idToken will be null
            await GoogleSignin.configure({
                webClientId: webClientId
            });
            const user = await GoogleSignin.currentUserAsync();
            if (user) {
                this.setState({
                    user: user
                });
                this.props.successCallback(user);
                console.log(user);
            }   
        } catch (error) {
            console.log(error);
        }

    }

    googleSignIn = () => {
        GoogleSignin.signIn()
            .then((user) => {
                console.log(user);
                this.setState({
                    user: user
                });
                this.props.successCallback(user);
            })
            .catch((err) => {
                console.log('WRONG SIGNIN', err);
            })
            .done();
    }

    render() {
        if (!this.state.user) {
            return (
                <View style={styles.container}>
                    <View>
                        <GoogleSigninButton
                            style={{ width: 48, height: 48 }}
                            size={GoogleSigninButton.Size.Icon}
                            color={GoogleSigninButton.Color.Dark}
                            onPress={this.googleSignIn} />
                    </View>
                </View>
            );
        }
        return (
            <Text>You are not supposed to see this 'coz you have logged in</Text>
        );
    }
}

SignIn.propTypes = {
    successCallback: PropTypes.func.isRequired
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
});
