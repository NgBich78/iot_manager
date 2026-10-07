import {
  AirVent,
  Droplets,
  Lightbulb,
} from "lucide-react";

function DeviceToggle({
  device,
  onToggle,
}) {
  const icons = {
    LED1:
      <AirVent size={19} />,

    LED2:
      <Droplets size={19} />,

    LED3:
      <Lightbulb size={19} />,
  };

  return (
    <div className="device-card">

      <div className="device-info">

        <div className="device-icon">
          {icons[
            device.code
          ]}
        </div>

        <span>
          {device.name}
        </span>

      </div>

      <button
        className={
          device.state
            ? "switch active"
            : "switch"
        }
        onClick={() =>
          onToggle(device)
        }
      >

        <span>
          {device.state
            ? "ON"
            : "OFF"}
        </span>

        <i />

      </button>

    </div>
  );
}

export default DeviceToggle;