import React from 'react';
import getUserFromGithubAPI from '../API';


interface FormProps {
    onSubmit: Function;
    onUserNotFound: Function;
    onUserNotFoundMessage: Function;
}

interface FormState {
    githubUsername: string;
}


class Form extends React.Component<FormProps, FormState> {
    constructor(props: FormProps) {
        super(props);
        this.state = {
            githubUsername: ''
        };
    }
    handleSubmit = async (ev: React.SyntheticEvent) => {
        ev.preventDefault();
        const userProfile = await getUserFromGithubAPI(this.state.githubUsername);
        if (userProfile.name === null && userProfile.avatar_url === null && userProfile.company === null) {
            this.props.onUserNotFoundMessage(userProfile.error);
            this.props.onUserNotFound();
        } else {
            this.props.onSubmit(userProfile);
            this.setState({ githubUsername: '' })
        }
    };

    handleOnChange = (ev: React.FormEvent<HTMLInputElement>) => this.setState({ githubUsername: ev.currentTarget.value })

    render() {
        return (
            <form action="" onSubmit={this.handleSubmit}>
                <input
                    type="text"
                    placeholder="Github username"
                    value={this.state.githubUsername}
                    onChange={this.handleOnChange} />
                <button type="submit">Add card</button>
            </form>
        )
    }
}

export default Form
