import Logo from "../components/Logo";
import ConnectionBinder from "../components/coupleConnection/ConnectionBinder";
import MyConnectionInfo from "../components/coupleConnection/MyConnectionInfo";
import PartnerConnectionForm from "../components/coupleConnection/PartnerConnectionForm";
import "../styles/CoupleConnection.css";

export default function CoupleConnectionPage() {
  return (
    <>
      <Logo variant="fixed" />
      <ConnectionBinder />
      <div className="main-layout">
        <div className="couple-container">
          <MyConnectionInfo />
        </div>
        <div className="couple-container">
          <PartnerConnectionForm />
        </div>
      </div>
    </>
  );
}
