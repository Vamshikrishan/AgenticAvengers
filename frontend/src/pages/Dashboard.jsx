import ConversationChat from "../components/ConversationChat";

export default function Dashboard() {
  return (
    <div className="dashboard">
      <h1 className="title">Autonomous Multi-Agent Personal Assistant</h1>
      <p className="subtitle">Talk. Plan. Improve.</p>

      <ConversationChat />
    </div>
  );
}
