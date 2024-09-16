import axios from "axios";                                  // Import Axios
import React, { useEffect, useState } from "react";
import './App.css';
import { EmployeeData } from './EmployeeData';


function App() {
  const [data, setData] = useState([]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState(0);
  const [id, setId] = useState(0);
  const [isUpdate, setIsUpdate] = useState(false);

  useEffect(() => {
    setData(EmployeeData);                // Set the initial data from EmployeeData
    fetchEmployees();                    // Fetch the updated data from the server
  }, []);

  const fetchEmployees = async () => {
    const response = await axios.get("http://localhost:5000/employees");
    setData(response.data);
  };

  const handleEdit = (id) => {
    const dt = data.find((item) => item.id === id);
    if (dt) {
      setIsUpdate(true);
      setId(id);
      setFirstName(dt.firstName);
      setLastName(dt.lastName);
      setAge(dt.age);
    }
  };

  const handleDelete = async (id) => {
    if (id > 0 && window.confirm("Are you sure you want to delete it?")) {
      await axios.delete(`http://localhost:5000/employees/${id}`);
      fetchEmployees();
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();                  // Prevent default form submission behavior
  
    let error = "";
    if (firstName === "") error += "First name is required, ";
    if (lastName === "") error += "Last name is required, ";
    if (age <= 0) error += "Age is required.";
  
    if (error !== "") {
      alert(error); // Display validation error
      return; // Prevent further execution if there are errors
    }
  
    // If no errors, proceed with saving
    try {
      await axios.post("http://localhost:5000/employees", {
        firstName,
        lastName,
        age,
      });
  
      fetchEmployees(); // Fetch updated list of employees from the server
      handleClear(); // Clear form inputs
    } catch (err) {
      console.error("Error saving employee:", err);
    }
  };

  const handleUpdate = async () => {
    await axios.put(`http://localhost:5000/employees/${id}`, {
      firstName,
      lastName,
      age,
    });
    fetchEmployees();
    handleClear();
  };

  const handleClear = () => {
    setId(0);
    setFirstName("");
    setLastName("");
    setAge(0);
    setIsUpdate(false);
  };

  return (
    <div className="App">
      <div style={{ display: "flex", justifyContent: "center", marginTop: "10px", marginBottom: "10px" }}>
        <div>
          <label>
            First Name:
            <input
              type="text"
              placeholder="Enter First Name"
              onChange={(e) => setFirstName(e.target.value)}
              value={firstName}
            />
          </label>
        </div>
        <div>
          <label>
            Last Name:
            <input
              type="text"
              placeholder="Enter Last Name"
              onChange={(e) => setLastName(e.target.value)}
              value={lastName}
            />
          </label>
        </div>
        <div>
          <label>
            Age:
            <input
              type="number"
              placeholder="Enter Age"
              onChange={(e) => setAge(Number(e.target.value))}
              value={age}
            />
          </label>
        </div>
        <div>
          {!isUpdate ? (
            <button className="btn btn-primary" onClick={handleSave}>
              Save
            </button>
          ) : (
            <button className="btn btn-primary" onClick={handleUpdate}>
              Update
            </button>
          )}
          <button className="btn btn-danger" onClick={handleClear}>
            Clear
          </button>
        </div>
      </div>

      <table className="table table-hover">
        <thead>
          <tr>
            <td>Sr. No</td>
            <td>Id</td>
            <td>First Name</td>
            <td>Last Name</td>
            <td>Age</td>
            <td>Actions</td>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{item.id}</td>
              <td>{item.firstName}</td>
              <td>{item.lastName}</td>
              <td>{item.age}</td>
              <td>
                <button className="btn btn-primary" onClick={() => handleEdit(item.id)}>
                  Edit
                </button>
                &nbsp;
                <button className="btn btn-danger" onClick={() => handleDelete(item.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;