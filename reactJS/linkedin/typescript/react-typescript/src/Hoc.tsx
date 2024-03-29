import React, { Component } from 'react';

const initialState = {
    name: 'Manny',
    message: 'HOCs are cool!!'
}

type State = Readonly<typeof initialState>;

const messageHoc = (WrappedComponent: any) => {
    return class HOC extends Component<{}, State> {
        readonly state: State = initialState;

        render() {
            return (
                <WrappedComponent
                    name={this.state.name}
                    message={this.state.message}
                />
            )
        }
    }
}

export default messageHoc;
