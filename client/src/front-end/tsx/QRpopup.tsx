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

  const submitQR = (event: KeyboardEvent) => {
    
    axios.post('http://localhost:3000/2fa/verified', { "secret": QRvalue }, { withCredentials: true })
    .then(res => {
      console.log(res);
      setQRisEnabled(true); // Update the QRisEnabled value using the callback
    })
    .catch((err) => {
      console.log(err);
      if (err.code === "ERR_BAD_REQUEST") {
        setError("Wrong Auth Code !");
      }
    });
    
    event.preventDefault();
    setError("");
    if (QRvalue.length !== 6) {
      setError("error akhay");
    }
    console.log(QRvalue);

      axios.post('http://localhost:3000/2fa/verified_first_time', { "secret": QRvalue }, { withCredentials: true })
      .then(res => {
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
  };
  const isMounted = useRef(false);

  useEffect(() => {
    if (isMounted.current) {
      console.log("CLEAN");
      axios.post('http://localhost:3000/2fa/enable', null, { withCredentials: true })
        .then(res => {
          fetchQR = res;
          setSource(res.data);
        });
    } else {
      isMounted.current = true;
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
  const [QRisEnabled, setQRisEnabled] = useState(() => {
    const storedValue = localStorage.getItem('QRisEnabled');
    return storedValue ? JSON.parse(storedValue) : false;
  });

  const handleToggleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setShowModal(event.target.checked);

    setQRisEnabled(false);
    console.log(QRisEnabled);
  };

  useEffect(() => {
    localStorage.setItem('QRisEnabled', JSON.stringify(QRisEnabled));
  }, [QRisEnabled]);

  return (
    <div>
      <label className="toggle-switch">
        <input type="checkbox" checked={showModal || QRisEnabled} onChange={handleToggleChange} />
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
