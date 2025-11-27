import symbol from "../../assets/images/symbol.svg";

const FormTitle = () => {
  return (
    <div className="form-title">
      <img
        src={symbol}
        alt="symbol"
        style={{ width: "100px", height: "100px" }}
      />
      <h3>AI Contact</h3>
    </div>
  );
};

export default FormTitle;
