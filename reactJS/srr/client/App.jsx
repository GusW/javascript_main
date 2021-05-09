import React from 'react';

class App extends React.Component {
  render() {
    return (
      <div>
        <h1>Q&A tool</h1>
        {this.props.questions.map(({ questionId, content }) => (
          <div className="mb-2" key={questionId}>
            <h3>{content}</h3>
            <div>
              {this.props.answers
                .filter((answer) => answer.questionId === questionId)
                .sort((a, b) => b.upvotes - a.upvotes)
                .map(({ content, upvotes, answerId }) => (
                  <div key={answerId}>
                    <div className="answerContent">
                      <span>
                        {content} - {upvotes}
                      </span>
                      <span className="ml-2">
                        <button
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() => this.props.handleVote(answerId, 1)}
                        >
                          +
                        </button>
                        <button
                          className="btn btn-sm btn-outline-secondary ml-1"
                          onClick={() => this.props.handleVote(answerId, -1)}
                        >
                          -
                        </button>
                      </span>
                    </div>
                    <div className="buttonContainer"></div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    );
  }
}

export default App;
