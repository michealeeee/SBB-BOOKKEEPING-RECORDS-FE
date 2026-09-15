import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error) {
    this.setState({ error });
  }

  render() {
    if (!this.state.error) {
      return this.props.children;
    }

    return (
      <div style={{ padding: 32, fontFamily: "Segoe UI, sans-serif", color: "#1b241c" }}>
        <h1 style={{ fontSize: 22 }}>Bookkeeply could not load</h1>
        <p>Reload the page. If this continues, sign out of the demo and try again.</p>
        <pre style={{ whiteSpace: "pre-wrap", color: "#b42318" }}>
          {String(this.state.error?.message || this.state.error)}
        </pre>
        <button type="button" onClick={() => window.location.assign("/")}>
          Go to home
        </button>
      </div>
    );
  }
}
