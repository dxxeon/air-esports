import { logout } from "../utils/auth";

function LogoutButton() {
  return (
    <button onClick={logout}>
      로그아웃
    </button>
  );
}

export default LogoutButton;