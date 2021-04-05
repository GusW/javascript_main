import React from 'react';
import consumeGithubAPI from '../API';


interface FormProps {
    onSubmit: Function;
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
        const profileData = await consumeGithubAPI(this.state.githubUsername);
        this.props.onSubmit(profileData);
        this.setState({ githubUsername: '' })
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
