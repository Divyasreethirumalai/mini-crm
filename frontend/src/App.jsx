import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [source, setSource] = useState("Call");
  const [leads, setLeads] = useState([]);

  // Fetch leads
  const fetchLeads = async () => {
    try {
      const res = await axios.get("http://localhost:5000/leads");
      setLeads(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  // Add lead
  const addLead = async () => {
    if (!name || !phone) {
      alert("Please fill all fields");
      return;
    }

    try {
      await axios.post("http://localhost:5000/leads", {
        name,
        phone,
        source,
      });

      setName("");
      setPhone("");

      fetchLeads();
    } catch (err) {
      console.log(err);
    }
  };

  // Update status
  const updateStatus = async (id, status) => {
    try {
      await axios.put(`http://localhost:5000/leads/${id}`, {
        status,
      });

      fetchLeads();
    } catch (err) {
      console.log(err);
    }
  };

  // Delete lead
  const deleteLead = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/leads/${id}`);

      fetchLeads();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="container">
      <h1>Mini CRM</h1>

      <div className="form">
        <input
          type="text"
          placeholder="Enter Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="text"
          placeholder="Enter Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <select value={source} onChange={(e) => setSource(e.target.value)}>
          <option>Call</option>
          <option>WhatsApp</option>
          <option>Field</option>
        </select>

        <button onClick={addLead}>Add Lead</button>
      </div>

      <div className="leads">
        {leads.map((lead) => (
          <div className="card" key={lead.id}>
            <h3>{lead.name}</h3>

            <p>{lead.phone}</p>

            <p>Source: {lead.source}</p>

            <select
              value={lead.status}
              onChange={(e) =>
                updateStatus(lead.id, e.target.value)
              }
            >
              <option>Interested</option>
              <option>Not Interested</option>
              <option>Converted</option>
            </select>

            <button onClick={() => deleteLead(lead.id)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;