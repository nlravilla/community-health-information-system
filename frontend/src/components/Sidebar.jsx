import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="sidebar">      

      <nav>
        <NavLink to="/patients">Patients</NavLink>
        <NavLink to="/reports">Reports</NavLink>
      </nav>
    </aside>
  );
}

export default Sidebar;