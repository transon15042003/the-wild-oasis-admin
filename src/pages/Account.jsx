import { Navigate } from "react-router-dom";
import UpdatePasswordForm from "../features/authentication/UpdatePasswordForm";
import UpdateUserDataForm from "../features/authentication/UpdateUserDataForm";
import { useAbility } from "../features/casl/AbilityContext";
import Heading from "../ui/Heading";
import Row from "../ui/Row";

function Account() {
  const ability = useAbility();
  if (!ability.can("update", "Account")) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <>
      <Heading as="h1">Update your account</Heading>

      <Row>
        <Heading as="h3">Update user data</Heading>
        <UpdateUserDataForm />
      </Row>

      <Row>
        <Heading as="h3">Update password</Heading>
        <UpdatePasswordForm />
      </Row>
    </>
  );
}

export default Account;
