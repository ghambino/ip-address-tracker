import { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./App.css";
// import TrackerInfo from "./components/TrackerInfo";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

function App() {
  const [geoTrackingInfo, setGeoTrackingInfo] = useState(null);
  const inputRef = useRef();

  const apikey = import.meta.env.VITE_GEOINFO_API_KEY;
  const baseUrl = "https://geo.ipify.org/api/v2";
  // console.log(apikey);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const inputedIp = inputRef.current.value;
    if (!inputedIp) return;
    try {
      const res = await axios.get(
        `${baseUrl}/country,city?apiKey=${apikey}&ipAddress=${inputedIp}`
      );
      setGeoTrackingInfo(res.data);
      inputRef.current.value = "";
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const ipcaller = async () => {
      try {
        const { data } = await axios.get("https://api.ipify.org?format=json");
        console.log(data);
        if (data) {
          let ipAddress = data.ip;
          const geoInfo = await axios.get(
            `${baseUrl}/country,city?apiKey=${apikey}&ipAddress=${ipAddress}`
          );
          setGeoTrackingInfo(geoInfo.data);
        }
      } catch (error) {
        console.error(error);
      }
    };
    ipcaller();
  }, []);

  console.log(geoTrackingInfo);

  return (
    <div>
      <div className="upper-space">
        <h1 className="title">IP Address Tracker</h1>
        <div className="input-div">
          <input
            type="text"
            // value={inputVal}
            // onChange={({ target }) => setInputVal(target.value)}
            ref={inputRef}
            placeholder="Search for any IP address or domain"
            className="inp"
          />
          <button type="submit" className="submit" onClick={handleSubmit}>
            &gt;
          </button>
        </div>
      </div>
      {geoTrackingInfo === null ? (
        <div>
          <h2>loading</h2>
        </div>
      ) : (
        <div className="map-space">
          <div className="user-info">
            <div className="detail">
              <span>ip address</span>
              <h3>{geoTrackingInfo.ip}</h3>
            </div>
            <div className="detail">
              <span>location</span>
              <h3>
                {geoTrackingInfo.location.region},
                {geoTrackingInfo.location.country}
              </h3>
            </div>
            <div className="detail">
              <span>timezone</span>
              <h3>GMT {geoTrackingInfo.location.timezone}</h3>
            </div>
            <div className="detail">
              <span>isp</span>
              <h3>{geoTrackingInfo.as.name}</h3>
            </div>
          </div>
          <div className="map">
            <MapContainer
              center={[
                geoTrackingInfo.location.lat,
                geoTrackingInfo.location.lng,
              ]}
              zoom={13}
              scrollWheelZoom={true}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker
                position={[
                  geoTrackingInfo.location.lat,
                  geoTrackingInfo.location.lng,
                ]}
              >
                <Popup>
                  my present location. <br /> let get hooked up.
                </Popup>
              </Marker>
            </MapContainer>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
