import React from 'react';

interface CardProps {
    name: string;
    avatar_url: string;
    company: string;
}


class Card extends React.Component<CardProps> {
    render() {
        return (
            <div className="github-profile">
                <img src={this.props.avatar_url} alt="placeholder for profile pricture" />
                <div className="info">
                    <div className="name">Name: {this.props.name}</div>
                    <div className="company">Company: {this.props.company}</div>
                </div>
            </div>
        )
    }
}

export default Card
