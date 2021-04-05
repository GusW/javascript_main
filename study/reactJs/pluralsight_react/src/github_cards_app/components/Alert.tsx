import React from 'react';

interface AlertProps {
    message: string;
    onAlertClose: React.MouseEventHandler;
}

class Alert extends React.Component<AlertProps, {}>{
    render() {
        return (
            <div>
                <section className="modal-main">
                    {this.props.message}
                    <button type="button" onClick={this.props.onAlertClose}>
                        Close
                    </button>
                </section>
            </div>
        );
    }
}

export default Alert
