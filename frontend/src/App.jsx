import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [source, setSource] = useState("Call");
  const [leads, setLeads] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchLeads = async () => {
    try {
      setLoading(true);

      const res = await axios.get("https://mini-crm-backend-3ut1.onrender.com/leads");

      setLeads(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const addLead = async () => {
    if (!name || !phone) {
      alert("Please fill all fields");
      return;
    }

    if (phone.length < 10) {
      alert("Phone number must be 10 digits");
      return;
    }

    try {
      await axios.post("https://mini-crm-backend-3ut1.onrender.com/leads", {
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

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`https://mini-crm-backend-3ut1.onrender.com/leads/${id}`, {
        status,
      });

      fetchLeads();
    } catch (err) {
      console.log(err);
    }
  };

  const deleteLead = async (id) => {
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this lead?"
      );

      if (!confirmDelete) return;

      await axios.delete(`https://mini-crm-backend-3ut1.onrender.com/leads/${id}`);

      fetchLeads();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="container">
      <div className="header">
        <h1>Mini CRM</h1>
        <p>Lead Management System</p>
      </div>

      <div className="dashboard">
        <div className="dashboard-card">
          <p>Total Leads</p>
          <h2>{leads.length}</h2>
        </div>

        <div className="dashboard-card">
          <p>Converted Leads</p>
          <h2>
            {
              leads.filter(
                (lead) => lead.status === "Converted"
              ).length
            }
          </h2>
        </div>
      </div>

      <div className="form">
        <input
          type="text"
          id="name"
          name="name"
          autoComplete="off"
          placeholder="Enter Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="number"
          id="phone"
          name="phone"
          autoComplete="off"
          placeholder="Enter Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <select
        id="source"
          name="source"
          value={source}
          onChange={(e) => setSource(e.target.value)}
        >
          <option>Call</option>
          <option>WhatsApp</option>
          <option>Field</option>
        </select>

        <button onClick={addLead}>Add Lead</button>
      </div>

      <div className="search">
        <input
          type="text"
          id="search"
          name="search"
          autoComplete="off"
          placeholder="Search by name..."
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <p className="loading">Loading leads...</p>
      ) : (
        <div className="leads">
          {leads.filter((lead) =>
            lead.name
              .toLowerCase()
              .includes(search.toLowerCase())
          ).length === 0 ? (
            <p>No matching leads found</p>
          ) : (
            leads
              .filter((lead) =>
                lead.name
                  .toLowerCase()
                  .includes(search.toLowerCase())
              )
              .map((lead) => (
                <div className="card" key={lead.id}>
                  <h3>{lead.name}</h3>

                  <p>{lead.phone}</p>

                  <p>Source: {lead.source}</p>

                  <select
                    value={lead.status}
                    onChange={(e) =>
                      updateStatus(
                        lead.id,
                        e.target.value
                      )
                    }
                  >
                    <option>Interested</option>
                    <option>Not Interested</option>
                    <option>Converted</option>
                  </select>

                  <button
                    onClick={() => deleteLead(lead.id)}
                  >
                    Delete
                  </button>
                </div>
              ))
          )}
        </div>
      )}

      <footer className="footer">
        Mini CRM • Full Stack Project
      </footer>
    </div>
  );
}

export default App;