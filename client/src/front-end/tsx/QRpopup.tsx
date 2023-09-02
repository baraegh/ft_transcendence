import React, { useEffect, useRef, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import '../css/QRpopup.css';
import axios from 'axios';

let fetchQR: any;

interface BlankModalProps {
  show: boolean;
  onHide: () => void;
  QRisEnabled: boolean; // Add QRisEnabled prop
  setQRisEnabled: (enabled: boolean) => void; // Add setQRisEnabled prop
}

const BlankModal: React.FC<BlankModalProps> = ({ show, onHide, QRisEnabled, setQRisEnabled }) => {
  const [source, setSource] = useState("");
  const [QRvalue, setQRvalue] = useState("");
  const [error, setError] = useState("");
  const [effectExecuted, setEffectExecuted] = useState(false);

  const submitQR = (event: React.KeyboardEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (QRvalue.length !== 6) {
      setError("error akhay");
      return;
    }

    axios
      .post(`${import.meta.env.VITE_BACKEND_URL}/2fa/verified`, { secret: QRvalue }, { withCredentials: true })
      .then((res) => {
        console.log(res);
        setQRisEnabled(true); // Update the QRisEnabled value using the callback
        axios
          .post(`${import.meta.env.VITE_BACKEND_URL}/2fa/verified_first_time`, { secret: QRvalue }, { withCredentials: true })
          .then((res) => {
            console.log(res);
            setError("");
            onHide();
          })
          .catch((err) => {
            console.log(err);
            if (err.code === "ERR_BAD_REQUEST") {
              setError("Wrong Auth Code !");
            }
          });
      })
      .catch((err) => {
        console.log(err);
        if (err.code === "ERR_BAD_REQUEST") {
          setError("Wrong Auth Code !");
        }
      });
  };


  useEffect(() => {
    if(QRisEnabled == false)
    {
    console.log(QRisEnabled)
    axios.post(`${import.meta.env.VITE_BACKEND_URL}/2fa/enable`, null, { withCredentials: true })
    .then(res => {
          console.log("CLEAN");
          fetchQR = res;
          setSource(res.data);
        });
    }
  }, [QRisEnabled]);

  return (
    <Modal className="QRmodal" show={show} onHide={onHide} centered>
      <Modal.Body>
        <div className="QR">
          <img id='QRimg' src={source} alt="QR Code" />
        </div>
        {/* Add your custom content here */}
        <form onSubmit={submitQR}>

          <input onChange={(e) => setQRvalue(e.target.value)} value={QRvalue} id="QRinput" type="text" placeholder="Your Code" />
          <br />
          <center>
            <p id="ErrorMessage">{error}</p>
          </center>
        </form>
      </Modal.Body>
    </Modal>
  );
};

const QRpopup: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [QRisEnabled, setQRisEnabled] = useState(false);
  const [isenables, setIsEnables] = useState(false);

  useEffect(() => {
    // Fetch data when the component mounts
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/2fa/isenable`, { withCredentials: true })
      .then((res) => {
        console.log(res.data);
        setIsEnables(res.data); // Update the state here
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  // Calculate the value of toggleChecked based on showModal and isenables
  const toggleChecked = showModal || isenables;


  const handleToggleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setShowModal(event.target.checked);
  };


  return (
    <div>
      <label className="toggle-switch">
        <input type="checkbox" checked={toggleChecked} onChange={handleToggleChange} />
        <span className="slider"></span>
        <p>2FA</p>
      </label>
      { showModal && (
        <BlankModal
          show={showModal}
          onHide={() => setShowModal(false)}
          QRisEnabled={QRisEnabled}
          setQRisEnabled={setQRisEnabled}
        />
      )}
    </div>
  );
};

export default QRpopup;

