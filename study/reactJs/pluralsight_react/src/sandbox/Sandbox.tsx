import React, { useState } from 'react';
import '../App.css';

interface ButtonProps {
    onClickFunction: any;
    increment: number;
}

interface DisplayProps {
    message: any;
}

const Button = (props: ButtonProps) => {
    const handleClick = () => props.onClickFunction(props.increment)
    return (
        <button onClick={handleClick}>
            + {props.increment}
        </button >
    )
}

const Display = (props: DisplayProps) => (
    <span>{props.message}</span>
)

const Playground = () => {
    const [counter, setCounter] = useState(0);
    const incrementCounter = (increment: number) => setCounter(counter + increment);
    return (
        <div className="App">
            <header className="App-header">
                <Button onClickFunction={incrementCounter} increment={1} />
                <Button onClickFunction={incrementCounter} increment={5} />
                <Button onClickFunction={incrementCounter} increment={10} />
                <Button onClickFunction={incrementCounter} increment={100} />
                <Display message={counter} />
            </header>
        </div>
    )
}

export default Playground
