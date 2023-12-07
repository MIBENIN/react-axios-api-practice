import { useState, useEffect } from "react";
import "./App.css";
import api from "./api/employeesDetails";

const App = () => {
  const [employees, setEmployees] = useState([]);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [newEmployee, setNewEmployee] = useState({
    employeeId: "",
    employeeName: "",
    employeeSalary: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/employees");
        setEmployees(response.data);
      } catch (err) {
        if (err.response) {
          console.log(err.response.data);
          console.log(err.response.status);
          console.log(err.response.headers);
        } else {
          console.log(err.message);
        }
      }
    };
    fetchData();
  }, []);

  const handleAddEmployee = async (emp) => {
    const id = employees.length ? employees[employees.length - 1].id + 1 : 1;
    const newEmployee = {
      id,
      employeeId: emp.employeeId,
      employeeName: emp.employeeName,
      employeeSalary: emp.employeeSalary,
    };
    const updatedEmployees = [...employees, newEmployee];
    try {
      const response = await api.post("/employees", newEmployee);
      console.log("Post response:", response);
      setEmployees(updatedEmployees);
    } catch (err) {
      console.log("Error:", err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await api.delete(`employees/${id}`);
      console.log("Delete response:", response);
      const employeelist = employees.filter((employee) => employee.id !== id);
      setEmployees(employeelist);
    } catch (err) {
      console.log("Error:", err.message);
    }
  };
  const handleEdit = async (emp) => {
    setEditingEmployee(emp);
    setNewEmployee({
      employeeId: emp.employeeId,
      employeeName: emp.employeeName,
      employeeSalary: emp.employeeSalary,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee((prevEmployees) => ({
      ...prevEmployees,
      [name]:
        name === "employeeId" || name === "employeeSalary"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newEmployee) return;

    if (editingEmployee) {
      const updatedEmployees = employees.map((emp) =>
        emp.id === editingEmployee.id ? { ...emp, ...newEmployee } : emp
      );

      try {
        await api.put(`/employees/${editingEmployee.id}`, newEmployee);
        setEmployees(updatedEmployees);
        setEditingEmployee(null);
      } catch (err) {
        console.log("Error:", err.message);
      }
    } else {
      handleAddEmployee(newEmployee);
    }
    setNewEmployee({
      employeeId: "",
      employeeName: "",
      employeeSalary: "",
    });
  };
  return (
    <div>
      <div>
        <h1>Employee Details</h1>
        <fieldset>
          <legend>Employee Details</legend>
          <form onSubmit={(e) => handleSubmit(e)}>
            <div>
              <label htmlFor="empID">Employee ID </label>
              <input
                type="number"
                id="empID"
                name="employeeId"
                placeholder="Eg:2345"
                required
                autoFocus
                value={newEmployee.employeeId}
                onChange={handleInputChange}
              />
            </div>
            <br />
            <div>
              <label htmlFor="empName">Employee Name </label>
              <input
                type="text"
                id="empName"
                name="employeeName"
                placeholder="Eg:John Doe"
                required
                value={newEmployee.employeeName}
                onChange={handleInputChange}
              />
            </div>
            <br />
            <div>
              <label htmlFor="empSalary">Employee Salary </label>
              <input
                type="number"
                id="empSalary"
                name="employeeSalary"
                placeholder="Eg:24000"
                required
                value={newEmployee.employeeSalary}
                onChange={handleInputChange}
              />
            </div>
            <br />
            <button type="submit">
              {editingEmployee ? "Update" : "Add"}
            </button>{" "}
            {editingEmployee && (
              <button type="button" onClick={() => setEditingEmployee(null)}>
                Cancel
              </button>
            )}
          </form>
        </fieldset>
      </div>
      <br />
      <br />
      <table>
        <thead>
          <tr>
            <th>EmpId</th>
            <th>EmpName</th>
            <th>EmpSalary</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp.id}>
              <td>{emp.employeeId}</td>
              <td>{emp.employeeName}</td>
              <td>{emp.employeeSalary}</td>
              <td>
                <button type="button" onClick={() => handleEdit(emp)}>
                  Edit
                </button>{" "}
                <button type="button" onClick={() => handleDelete(emp.id)}>
                  {" "}
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default App;
