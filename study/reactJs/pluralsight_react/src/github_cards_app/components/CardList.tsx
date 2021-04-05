import React from 'react';
import Card from './Card';

interface CardListProps {
    profileData: any[];
}

class CardList extends React.Component<CardListProps> {
    render() {
        return this.props.profileData.map(profile => <Card key={profile.id} {...profile} />)
    }
}

export default CardList
