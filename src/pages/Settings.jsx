import UpdateSettingsForm from "../features/settings/UpdateSettingsForm";
import Heading from "../ui/Heading";
import Row from "../ui/Row";
import DemoResetPanel from "../features/demo/DemoResetPanel";

function Settings() {
    return (
        <>
            <Row type="horizontal">
                <Heading as="h1">Update hotel settings</Heading>
            </Row>
            <UpdateSettingsForm />
            <DemoResetPanel />
        </>
    );
}

export default Settings;
