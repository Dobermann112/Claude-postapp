import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="navbar-logo">PostApp</Link>

        <div className="navbar-actions">
          {currentUser ? (
            <>
              <span className="navbar-user">{currentUser.name}</span>
              <Link to="/posts/new">
                <button className="btn-primary btn-sm">投稿する</button>
              </Link>
              <button className="btn-secondary btn-sm" onClick={handleLogout}>
                ログアウト
              </button>
            </>
          ) : (
            <>
              <Link to="/login">
                <button className="btn-secondary btn-sm">ログイン</button>
              </Link>
              <Link to="/signup">
                <button className="btn-primary btn-sm">登録</button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
