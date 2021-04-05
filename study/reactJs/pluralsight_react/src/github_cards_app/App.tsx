import React from 'react';
import Alert from './components/Alert'
import CardList from './components/CardList'
import Form from './components/Form'
import '../App.css'

interface GithubCardsAppProps {
    title: string;
}

interface GithubCardsAppState {
    profileData: any[];
    userNotFound: boolean;
    userNotFoundMessage: string;
}

class GithubCardsApp extends React.Component<GithubCardsAppProps, GithubCardsAppState> {
    constructor(props: GithubCardsAppProps) {
        super(props);
        this.state = {
            profileData: [],
            userNotFound: false,
            userNotFoundMessage: '',
        };
    };

    toggleUserNotFound = () => {
        this.setState(prevState => ({
            userNotFound: !prevState.userNotFound
        }))
    }

    captureUserNotFoundMessage = (message: string) => {
        this.setState({ userNotFoundMessage: message })
    }

    addNewProfile = (profile: object) => {
        this.setState(prevState => ({
            profileData: [...prevState.profileData, profile]
        }))
    };

    render() {
        return (
            <div className="App">
                <div className="header">{this.props.title}</div>
                {this.state.userNotFound === true &&
                    <Alert message={this.state.userNotFoundMessage} onAlertClose={this.toggleUserNotFound} />}
                {this.state.userNotFound === false &&
                    <Form
                        onSubmit={this.addNewProfile}
                        onUserNotFound={this.toggleUserNotFound}
                        onUserNotFoundMessage={this.captureUserNotFoundMessage} />}
                <CardList profileData={this.state.profileData} />
            </div>
        )
    }
}

export default GithubCardsApp;
