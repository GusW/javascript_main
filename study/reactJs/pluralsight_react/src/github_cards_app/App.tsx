import React from 'react';
import CardList from './components/CardList'
import Form from './components/Form'
import '../App.css'

interface GithubCardsAppProps {
    title: string;
}

interface GithubCardsAppState {
    profileData: any[];
}

class GithubCardsApp extends React.Component<GithubCardsAppProps, GithubCardsAppState> {
    constructor(props: GithubCardsAppProps) {
        super(props);
        this.state = {
            profileData: []
        };
    };

    addNewProfile = (profile: object) => {
        this.setState(prevState => ({
            profileData: [...prevState.profileData, profile]
        }))
    };

    render() {
        return (
            <div className="App">
                <div className="header">{this.props.title}</div>
                <Form onSubmit={this.addNewProfile} />
                <CardList profileData={this.state.profileData} />
            </div>
        )
    }
}

export default GithubCardsApp;
